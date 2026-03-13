import Settings from '../models/settings.model.js';
import User from '../models/user.js';
import { sendLevelUpEmail } from '../services/emailService.js';

// GET /api/settings/userId.
// Loads user settings.
// Creates settings with default values if not found.
export const getSettings = async (req, res) => {
// ... (keep lines 8-47 identical)
    try {
        const userId = req.params.userId;
        let settings = await Settings.findOne({ userId });
        
        // Always sync the latest from User model for specific fields
        const user = await User.findById(userId);
        
        if (!settings) {
            settings = await Settings.create({ 
                userId,
                nativeLanguage: user ? user.nativeLanguage : 'Sinhala',
                skillLevel: user ? user.skillLevel : 'beginner',
                dailyGoalMinutes: user ? user.dailyGoalMinutes : 15
            });
        } else if (user) {
            let needsSave = false;
            
            if (settings.nativeLanguage !== user.nativeLanguage) {
                settings.nativeLanguage = user.nativeLanguage;
                needsSave = true;
            }
            if (settings.skillLevel !== user.skillLevel) {
                settings.skillLevel = user.skillLevel;
                needsSave = true;
            }
            if (settings.dailyGoalMinutes !== user.dailyGoalMinutes) {
                settings.dailyGoalMinutes = user.dailyGoalMinutes;
                needsSave = true;
            }
            
            if (needsSave) {
                await settings.save();
            }
        }

        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;

        // Note: 'pushNotifications' checkbox acts as the 'Level upgrade notification'
        let sendUpgradeEmail = false;
        let currentUser = null;

        if (updates.skillLevel !== undefined) {
            currentUser = await User.findById(userId);
            if (currentUser && currentUser.skillLevel !== updates.skillLevel) {
                // A quick check to ensure they are actually ranking up and not down
                const levels = ['beginner', 'intermediate', 'advanced'];
                const oldLevelIdx = levels.indexOf(currentUser.skillLevel);
                const newLevelIdx = levels.indexOf(updates.skillLevel);
                
                if (newLevelIdx > oldLevelIdx) {
                    sendUpgradeEmail = true;
                }
            }
        }

        const settings = await Settings.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true, runValidators: true, upsert: true }
        );

        // Send email if ranked up AND notifications are enabled
        if (sendUpgradeEmail && settings.notifications?.pushNotifications && currentUser) {
            // Do not await, fire and forget
            sendLevelUpEmail(currentUser.email, currentUser.fullName, updates.skillLevel)
                .catch(err => console.error('Failed to send level up email:', err));
        }

        // Synchronize with User model if specific fields are updated
        const userUpdates = {};
        if (updates.nativeLanguage !== undefined) userUpdates.nativeLanguage = updates.nativeLanguage;
        if (updates.skillLevel !== undefined) userUpdates.skillLevel = updates.skillLevel;
        if (updates.dailyGoalMinutes !== undefined) userUpdates.dailyGoalMinutes = updates.dailyGoalMinutes;

        if (Object.keys(userUpdates).length > 0) {
            await User.findByIdAndUpdate(userId, { $set: userUpdates });
        }

        res.json({ success: true, settings });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/*
// DELETE /api/settings/userId.
// Deletes both the user account and settings.
*/
export const deleteAccount = async (req, res) => {
    try {
        await Settings.findOneAndDelete({ userId: req.params.userId });
        await User.findByIdAndDelete(req.params.userId);
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/*
// GET /api/settings/userId/download.
// Download user data and settings.
*/
export const downloadUserData = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const settings = await Settings.findOne({ userId: req.params.userId });

        const exportData = {
            exportedAt: new Date().toISOString(),
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                age: user.age,
                nativeLanguage: user.nativeLanguage,
                targetLanguage: user.targetLanguage,
                learningGoal: user.learningGoal,
                dailyGoalMinutes: user.dailyGoalMinutes,
                skillLevel: user.skillLevel,
                assessmentScore: user.assessmentScore,
                createdAt: user.createdAt,
            },
            settings: settings || 'No settings saved yet',
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=my_orato_data.json');
        res.send(JSON.stringify(exportData, null, 2));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
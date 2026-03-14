import cron from 'node-cron';
import User from '../models/user.js';
import Settings from '../models/settings.model.js';
import { sendDailyReminderEmail, sendWeeklyProgressEmail } from './emailService.js';
import moment from 'moment';

/**
 * Initialize all cron jobs for the Orato backend
 */
export const initCronJobs = () => {
    console.log('🕒 Initializing Cron Jobs...');

    // ============================================
    // 1. Daily Reminder Job (Runs every minute)
    // ============================================
    // Checks if the current time matches the user's preferred reminderTime
    cron.schedule('* * * * *', async () => {
        try {
            // Get current time in HH:mm format based on server time
            const now = moment().format('HH:mm');
            
            // Find all users who have dailyReminders ON
            const settingsWithReminders = await Settings.find({
                'notifications.dailyReminder': true,
                'notifications.reminderTime': now
            }).populate('userId', 'email fullName');

            if (settingsWithReminders.length > 0) {
                console.log(`⏰ [CRON] Triggering ${settingsWithReminders.length} Daily Reminders for ${now}...`);
                
                for (const setting of settingsWithReminders) {
                    if (setting.userId && setting.userId.email) {
                        try {
                            await sendDailyReminderEmail(
                                setting.userId.email, 
                                setting.userId.fullName
                            );
                        } catch (emailErr) {
                            console.error(`Failed to send daily reminder to ${setting.userId.email}:`, emailErr);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('❌ [CRON] Error in Daily Reminder Job:', error);
        }
    });

    // ============================================
    // 2. Weekly Progress Job (Runs every Sunday at 10:00 AM)
    // ============================================
    // Scheduled using standard cron expression format: minute hour dayOfMonth month dayOfWeek
    cron.schedule('0 10 * * 0', async () => {
        try {
            console.log('📊 [CRON] Triggering Weekly Progress Updates...');

            // Find all users who have progressUpdates ON
            const settingsWithWeeklyUpdates = await Settings.find({
                'notifications.progressUpdates': true
            }).populate('userId', 'email fullName');

            console.log(`Found ${settingsWithWeeklyUpdates.length} users with progress updates enabled.`);

            for (const setting of settingsWithWeeklyUpdates) {
                if (setting.userId && setting.userId.email) {
                    try {
                        await sendWeeklyProgressEmail(
                            setting.userId.email,
                            setting.userId.fullName
                        );
                    } catch (emailErr) {
                        console.error(`Failed to send weekly update to ${setting.userId.email}:`, emailErr);
                    }
                }
            }
        } catch (error) {
            console.error('❌ [CRON] Error in Weekly Progress Job:', error);
        }
    });

    console.log('✅ Cron Jobs initialized successfully.');
};

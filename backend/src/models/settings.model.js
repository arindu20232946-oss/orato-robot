import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        notifications: {
            pushNotifications: { type: Boolean, default: true },
            dailyReminder: { type: Boolean, default: true },
            progressUpdates: { type: Boolean, default: false },
            reminderTime: { type: String, default: '09:00' },
        },
        audioDisplay: {
            soundEffects: { type: Boolean, default: true },
            playbackSpeed: {
                type: String,
                enum: ['0.5x (Slow)', '0.75x', '1.0x (Normal)', '1.25x', '1.5x', '2.0x (Fast)'],
                default: '1.0x (Normal)',
            },
        },
        // Synchronized with User model
        nativeLanguage: { type: String, default: 'Sinhala' },
        skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
        dailyGoalMinutes: { type: Number, default: 15 },
    },
    { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
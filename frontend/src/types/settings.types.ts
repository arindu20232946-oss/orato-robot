// TypeScript Types and Interfaces - For Settings.

// Languages in the web page (Currently only English is available).
export type Language = 'English' | 'Sinhala' | 'Tamil';


// Audio playback speed options for spoken feedback.
export type PlaybackSpeed =
    | '0.5x (Slow)'
    | '0.75x'
    | '1.0x (Normal)'
    | '1.25x'
    | '1.5x'
    | '2.0x (Fast)';


// Interface for notifications settings.
export interface NotificationSettings {
    pushNotifications: boolean;
    dailyReminder: boolean;
    progressUpdates: boolean;
    reminderTime: string;
}


// Interface for audio and display settings.
export interface AudioDisplaySettings {
    volume: number;
    playbackSpeed: PlaybackSpeed;
}


// Full user settings interface(Language, Notifications, Audio & Display Settings).
export interface UserSettings {
    userId: string;
    language: Language; // Interface language
    notifications: NotificationSettings;
    audioDisplay: AudioDisplaySettings;
    nativeLanguage?: string;
    skillLevel?: string;
    dailyGoalMinutes?: number;
}


// Types of components props.

// Props for the LanguagePreferences component.
export interface LanguagePreferencesProps {
    currentLanguage?: Language;
    onLanguageChange?: (language: Language) => void;
}

// Props for the Notifications component.
export interface NotificationsProps {
    settings?: NotificationSettings;
    onChange?: (settings: Partial<NotificationSettings>) => void;
}

// Props for the AudioDisplay component.
export interface AudioDisplayProps {
    settings?: AudioDisplaySettings;
    onChange?: (settings: Partial<AudioDisplaySettings>) => void;
}

// Props for the PrivacyData component.
export interface PrivacyDataProps {
    userId?: string;
}

// Props for the AccountActions component.
export interface AccountActionsProps {
    userId?: string;
}

// Props for the generic ToggleSwitch component.
export interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    ariaLabel?: string;
}
import React, { useRef } from 'react';
import { Bell, Smartphone, Clock, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import ToggleSwitch from './ToggleSwitch';
import type { NotificationSettings } from '../types/settings.types';

interface NotificationsProps {
    settings: NotificationSettings;
    onChange: (newSettings: NotificationSettings) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ settings, onChange }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        gsap.to(cardRef.current, {
            rotateY: x * 6,
            rotateX: -y * 6,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        });
    };

    const handleToggle = (key: keyof NotificationSettings) => {
        onChange({ ...settings, [key]: !settings[key] });
    };

    const notificationItems = [
        {
            key: 'pushNotifications' as const,
            title: 'English Proficiency Level upgrade Notification',
            description: 'Receive alerts when you rank up',
            icon: Smartphone,
        },
        {
            key: 'dailyReminder' as const,
            title: 'Daily Reminder',
            description: 'A gentle nudge to practice every day',
            icon: Clock,
        },
        {
            key: 'progressUpdates' as const,
            title: 'Progress Updates',
            description: 'Weekly summary of your learning journey',
            icon: Mail,
            highlight: true
        },
    ];

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-white/80 p-10 transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
        >
            <div className="flex items-center mb-10">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 mr-5 shadow-lg shadow-emerald-200/50">
                    <Bell className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Notification Settings</h2>
                    <p className="text-emerald-700/60 font-medium mt-1">Control how Orato reaches you</p>
                </div>
            </div>

            <div className="space-y-5">
                {notificationItems.map((item) => (
                    <div
                        key={item.key}
                        className={`
                            flex items-center justify-between p-6 rounded-[2rem] transition-all duration-300
                            ${item.highlight ? 'bg-emerald-50 border border-emerald-100 shadow-sm shadow-emerald-100/30' : 'bg-white/40 border border-white/80 hover:border-emerald-200/50'}
                        `}
                    >
                        <div className="flex items-center space-x-5">
                            <div className={`p-3.5 rounded-2xl ${item.highlight ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-emerald-50 text-emerald-600'}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-emerald-950">{item.title}</h3>
                                <p className="text-emerald-700/60 font-medium text-sm mt-0.5">{item.description}</p>
                                
                                {item.key === 'dailyReminder' && settings.dailyReminder && (
                                    <div className="mt-4 flex items-center bg-white/50 rounded-xl p-2 w-fit border border-emerald-100/50">
                                        <span className="text-sm font-bold text-emerald-900 mr-3 ml-2">Time:</span>
                                        <input
                                            type="time"
                                            value={settings.reminderTime || '09:00'}
                                            onChange={(e) => onChange({ ...settings, reminderTime: e.target.value })}
                                            className="bg-transparent border-none text-emerald-800 font-semibold focus:ring-0 cursor-pointer outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={settings[item.key as keyof NotificationSettings] as boolean}
                            onChange={() => handleToggle(item.key as keyof NotificationSettings)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;

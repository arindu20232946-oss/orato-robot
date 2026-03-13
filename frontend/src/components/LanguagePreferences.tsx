import React, { useRef } from 'react';
import { Globe } from 'lucide-react';
import { gsap } from 'gsap';
import type { LanguagePreferencesProps } from '../types/settings.types';

export interface ExtendedLanguageProps extends LanguagePreferencesProps {
    nativeLanguage?: string;
    proficiency?: string;
    onNativeChange?: (val: string) => void;
    onProficiencyChange?: (val: string) => void;
}

const LanguagePreferences: React.FC<ExtendedLanguageProps> = ({
    nativeLanguage = 'Sinhala',
    proficiency = 'beginner',
    onNativeChange,
    onProficiencyChange
}) => {
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

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-white/80 p-10 transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
        >
            <div className="flex items-center mb-10">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 mr-5 shadow-lg shadow-emerald-200/50">
                    <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Language Preferences</h2>
                    <p className="text-emerald-700/60 font-medium mt-1">Personalize your learning experience</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* App Language (Read Only) */}
                <div className="p-6 rounded-[2rem] bg-emerald-50/20 border border-emerald-100/30 opacity-60">
                    <label className="block text-lg font-bold text-emerald-950 mb-1">
                        App Language
                    </label>
                    <p className="text-emerald-700/60 font-medium mb-4 text-sm">Orato is currently available in English only.</p>
                    <div className="relative">
                        <select
                            disabled
                            value="English"
                            className="w-full px-5 py-4 bg-white/40 border border-emerald-100/50 rounded-2xl text-emerald-900/50 font-bold cursor-not-allowed appearance-none"
                        >
                            <option value="English">English</option>
                        </select>
                    </div>
                </div>

                {/* Native Language */}
                <div className="p-6 rounded-[2rem] bg-white/40 border border-white/80 shadow-sm hover:border-emerald-200/50 transition-colors duration-300">
                    <label className="block text-xl font-bold text-emerald-950 mb-1">
                        My Native Language
                    </label>
                    <p className="text-emerald-700/60 font-medium mb-4 text-sm">Used to tailor explanations and translations</p>
                    <select
                        value={nativeLanguage}
                        onChange={(e) => onNativeChange?.(e.target.value)}
                        className="w-full px-5 py-4 bg-white/80 border border-emerald-100/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer text-emerald-900 font-bold"
                    >
                        <option value="Sinhala">Sinhala (සිංහල)</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिन्दी)</option>
                        <option value="Spanish">Spanish (Español)</option>
                        <option value="French">French (Français)</option>
                        <option value="German">German (Deutsch)</option>
                        <option value="Chinese">Chinese (中文)</option>
                        <option value="Japanese">Japanese (日本語)</option>
                        <option value="Korean">Korean (한국어)</option>
                        <option value="Arabic">Arabic (العربية)</option>
                        <option value="Portuguese">Portuguese (Português)</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Proficiency Level */}
                <div className="p-6 rounded-[2rem] bg-white/40 border border-white/80 shadow-sm hover:border-emerald-200/50 transition-colors duration-300">
                    <label className="block text-xl font-bold text-emerald-950 mb-1">
                        English Proficiency Level
                    </label>
                    <p className="text-emerald-700/60 font-medium mb-4 text-sm">Adjusts lesson complexity and vocabulary</p>
                    <select
                        value={proficiency}
                        onChange={(e) => onProficiencyChange?.(e.target.value)}
                        className="w-full px-5 py-4 bg-white/80 border border-emerald-100/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer text-emerald-900 font-bold"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default LanguagePreferences;
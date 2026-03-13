import React, { useRef, useState, useEffect } from 'react';
import { Volume2, PlayCircle } from 'lucide-react';
import { gsap } from 'gsap';
import type { AudioDisplaySettings, PlaybackSpeed } from '../types/settings.types';

interface AudioDisplayProps {
    settings?: AudioDisplaySettings;
    onChange: (newSettings: AudioDisplaySettings) => void;
}

const AudioDisplay: React.FC<AudioDisplayProps> = ({ settings, onChange }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    
    // Safely fallback
    const currentSettings = settings || { volume: 100, playbackSpeed: '1.0x (Normal)' as PlaybackSpeed };
    
    // Local state for volume to prevent bouncy API calls on every range input tick
    const [localVolume, setLocalVolume] = useState<number>(currentSettings.volume ?? 100);

    useEffect(() => {
        if (settings?.volume !== undefined) {
            setLocalVolume(settings.volume);
        }
    }, [settings?.volume]);

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

    const handleChange = <K extends keyof AudioDisplaySettings>(
        key: K,
        value: AudioDisplaySettings[K]
    ) => {
        onChange({ ...currentSettings, [key]: value });
    };

    const handleVolumeDrag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalVolume(parseInt(e.target.value));
    };

    const handleVolumeDragEnd = () => {
        handleChange('volume', localVolume);
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
                    <Volume2 className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Audio & Display</h2>
                    <p className="text-emerald-700/60 font-medium mt-1">Configure your sound experience</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Volume Control */}
                <div className="p-8 rounded-[2rem] bg-emerald-50/20 border border-emerald-100/30 transition-all hover:bg-emerald-50/30 shadow-sm">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-emerald-600 border border-emerald-50">
                                <Volume2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-emerald-950">Volume Level</h3>
                                <p className="text-emerald-700/60 font-medium text-sm">Adjust listening quiz volume</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 px-2 pt-2">
                            <span className="text-sm font-bold text-emerald-900 w-8">{Math.round(localVolume)}%</span>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={localVolume}
                                onChange={handleVolumeDrag}
                                onMouseUp={handleVolumeDragEnd}
                                onTouchEnd={handleVolumeDragEnd}
                                className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Playback Speed */}
                <div className="p-8 rounded-[2rem] bg-white/40 border border-white/80 shadow-sm hover:border-emerald-200/50 transition-colors duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-200 text-white">
                            <PlayCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-emerald-950">Playback Speed</h3>
                            <p className="text-emerald-700/60 font-medium text-sm">Adjust audio lesson pace</p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <select
                            value={currentSettings.playbackSpeed}
                            onChange={(e) => handleChange('playbackSpeed', e.target.value as PlaybackSpeed)}
                            className="w-full px-5 py-4 bg-white/80 border border-emerald-100/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer text-emerald-900 font-bold appearance-none"
                        >
                            <option value="0.5x (Slow)">0.5x (Slow)</option>
                            <option value="0.75x">0.75x</option>
                            <option value="1.0x (Normal)">1.0x (Normal)</option>
                            <option value="1.25x">1.25x</option>
                            <option value="1.5x">1.5x</option>
                            <option value="2.0x (Fast)">2.0x (Fast)</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioDisplay;
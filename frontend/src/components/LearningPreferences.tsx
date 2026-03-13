import React, { useRef } from 'react';
import { Target } from 'lucide-react';
import { gsap } from 'gsap';

interface LearningPreferencesProps {
    dailyGoal?: number;
    onChange?: (val: number) => void;
}

const LearningPreferences: React.FC<LearningPreferencesProps> = ({
    dailyGoal = 15,
    onChange
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const goals = [
        { label: 'Casual', duration: 5 },
        { label: 'Regular', duration: 15 },
        { label: 'Serious', duration: 30 },
        { label: 'Intense', duration: 60 },
    ];

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
                    <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Learning Preferences</h2>
                    <p className="text-emerald-700/60 font-medium mt-1">Define your daily study routine</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="p-8 rounded-[2rem] bg-emerald-50/20 border border-emerald-100/30">
                    <label className="block text-xl font-bold text-emerald-950 mb-1">
                        Daily Goal
                    </label>
                    <p className="text-emerald-700/60 font-medium mb-8 text-sm">
                        (Default duration for a single learning session)
                    </p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {goals.map((goal) => (
                            <button
                                key={goal.duration}
                                onClick={() => onChange?.(goal.duration)}
                                className={`
                                    flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group
                                    ${dailyGoal === goal.duration 
                                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-200/50 scale-[1.05]' 
                                        : 'bg-white/80 border-emerald-100/50 text-emerald-950 hover:border-emerald-300 hover:bg-white'
                                    }
                                `}
                            >
                                <span className={`text-sm font-bold tracking-wider uppercase mb-1 ${dailyGoal === goal.duration ? 'text-emerald-50' : 'text-emerald-500/70 group-hover:text-emerald-600'}`}>
                                    {goal.label}
                                </span>
                                <span className={`text-2xl font-black ${dailyGoal === goal.duration ? 'text-white' : 'text-emerald-950'}`}>
                                    {goal.duration}m
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPreferences;

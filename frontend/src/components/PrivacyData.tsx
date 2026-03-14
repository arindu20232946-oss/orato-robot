import React, { useState, useRef } from 'react';
import { Shield, Eye, FileText, ChevronRight, Lock } from 'lucide-react';
import { gsap } from 'gsap';

interface PrivacyDataProps {
    userId?: string;
}

const PrivacyData: React.FC<PrivacyDataProps> = () => {
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
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

    const actionItems = [
        {
            title: 'Privacy Policy',
            description: 'Read how we handle your data',
            icon: Eye,
            onClick: () => setShowPrivacyModal(true)
        },
        {
            title: 'Terms of Service',
            description: 'Application usage and rules',
            icon: FileText,
            onClick: () => setShowTermsModal(true)
        }
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
                    <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Privacy & Data</h2>
                    <p className="text-emerald-700/60 font-medium mt-1">Manage your information security</p>
                </div>
            </div>

            <div className="space-y-4">
                {actionItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={item.onClick}
                        className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/40 border border-white/80 hover:border-emerald-200/50 hover:bg-white/60 transition-all duration-300 group"
                    >
                        <div className="flex items-center space-x-5">
                            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-emerald-950">{item.title}</h3>
                                <p className="text-emerald-700/60 font-medium text-sm mt-0.5">{item.description}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-emerald-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>

            {/* Privacy Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-emerald-100 flex flex-col">
                        <div className="p-8 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/30">
                            <div className="flex items-center space-x-3">
                                <Lock className="w-6 h-6 text-emerald-600" />
                                <h2 className="text-2xl font-bold text-emerald-950">Privacy Policy</h2>
                            </div>
                            <button onClick={() => setShowPrivacyModal(false)} className="text-emerald-400 hover:text-emerald-600 font-bold p-2">Close</button>
                        </div>
                        <div className="p-8 overflow-y-auto text-emerald-800 space-y-4 leading-relaxed font-medium">
                            <p>Here you can read about how we collect, use, and protect your personal information.</p>
                            <h4 className="font-bold text-lg text-emerald-950">1. Data Collection</h4>
                            <p>We only collect data necessary for enhancing your language learning journey, such as your proficiency level and daily goals.</p>
                            <h4 className="font-bold text-lg text-emerald-950">2. Data Security</h4>
                            <p>Your data is encrypted and stored securely within our private infrastructure.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Terms Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-emerald-100 flex flex-col">
                        <div className="p-8 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/30">
                            <div className="flex items-center space-x-3">
                                <FileText className="w-6 h-6 text-emerald-600" />
                                <h2 className="text-2xl font-bold text-emerald-950">Terms of Service</h2>
                            </div>
                            <button onClick={() => setShowTermsModal(false)} className="text-emerald-400 hover:text-emerald-600 font-bold p-2">Close</button>
                        </div>
                        <div className="p-8 overflow-y-auto text-emerald-800 space-y-4 leading-relaxed font-medium">
                            <p>By using Orato, you agree to follow our guidelines and respect our intellectual property.</p>
                            <h4 className="font-bold text-lg text-emerald-950">Usage Rules</h4>
                            <p>Please use this platform for educational purposes only. Any misuse will lead to account suspension.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacyData;
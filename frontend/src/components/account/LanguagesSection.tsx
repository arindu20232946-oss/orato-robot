import React from "react";
import { Plus, Languages, Globe } from "lucide-react";

interface LanguagesSectionProps {
    user: any;
    onOpenLanguageModal: () => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ user, onOpenLanguageModal }) => {
    const levelColors: Record<string, string> = {
        Beginner: "bg-sky-50 text-sky-600 border-sky-100",
        Intermediate: "bg-amber-50 text-amber-600 border-amber-100",
        Advanced: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    const level = user.skillLevel || "Beginner";
    const pillClass = levelColors[level] ?? "bg-gray-50 text-gray-600 border-gray-100";

    return (
        <section className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-1.5">Learning Journey</p>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Languages</h2>
                </div>

                <button
                    onClick={onOpenLanguageModal}
                    className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold
                    text-emerald-700 bg-emerald-50 border border-emerald-100
                    hover:bg-emerald-600 hover:text-white hover:border-emerald-600
                    shadow-sm hover:shadow-emerald-500/20 transition-all duration-300 active:scale-95 group"
                >
                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                    Add Language
                </button>
            </div>

            {/* Language card */}
            <div
                onDoubleClick={onOpenLanguageModal}
                className="group flex items-center justify-between bg-gradient-to-br from-gray-50/50 to-white rounded-[1.5rem] p-6 border border-gray-100/80 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Globe className="w-4 h-4 text-emerald-300 animate-pulse" />
                </div>

                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                        <Languages className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-lg leading-tight uppercase tracking-tight">English</p>
                        <p className="text-sm font-medium text-gray-400 mt-1">Native speaker path</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${pillClass} shadow-sm`}>
                        {level}
                    </span>
                    <p className="text-[10px] font-bold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                        Double-click to edit
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LanguagesSection;
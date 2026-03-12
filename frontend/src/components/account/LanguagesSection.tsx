import React from "react";

interface LanguagesSectionProps {
    user: any;
    onOpenLanguageModal: () => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ user, onOpenLanguageModal }) => {
    const levelColors: Record<string, string> = {
        Beginner: "bg-sky-100 text-sky-700",
        Intermediate: "bg-amber-100 text-amber-700",
        Advanced: "bg-emerald-100 text-emerald-700",
    };

    const level = user.skillLevel || "Beginner";
    const pillClass = levelColors[level] ?? "bg-gray-100 text-gray-600";

    return (
        <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 mb-1">Learning</p>
                    <h2 className="text-xl font-bold text-gray-900">Languages</h2>
                </div>

                <button
                    onClick={onOpenLanguageModal}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold
                    text-emerald-600 border border-emerald-200
                    hover:bg-emerald-500 hover:text-white hover:border-emerald-500
                    shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                >
                    <span className="text-base leading-none">+</span> Add Language
                </button>
            </div>

            {/* Language card */}
            <div
                onDoubleClick={onOpenLanguageModal}
                className="group flex items-center justify-between bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 transition-all duration-200 cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl select-none">
                        🇬🇧
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">English</p>
                        <p className="text-sm text-gray-500 mt-0.5">Native Speaker → English</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pillClass}`}>
                        {level}
                    </span>
                    <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
                        Double-click to edit
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LanguagesSection;
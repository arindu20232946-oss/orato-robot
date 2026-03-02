import React from "react";

interface LanguagesSectionProps {
    user: any;
    onOpenLanguageModal: () => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
    user,
    onOpenLanguageModal,
}) => {
    return (
        <section className="bg-white rounded-2xl shadow-md p-8 
           transition-all duration-300 ease-out
           hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Languages
                </h2>

                <button
                    onClick={() => onOpenLanguageModal()}
                    className="
rounded-xl px-5 py-2
font-medium
text-emerald-600
border border-emerald-300/50
transition-all duration-300 ease-out
hover:bg-emerald-500 hover:text-white
hover:-translate-y-0.5
hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]
active:scale-95
group-hover:translate-x-1
"              >
                    + Add Language
                </button>
            </div>

            <div
                key={user?.skillLevel}
                onDoubleClick={() => onOpenLanguageModal()}
                className="group bg-gray-50 rounded-xl p-6 border cursor-pointer animate-fadeIn"
            >

                <p className="text-gray-800 font-semibold">
                    Native Speaker → English
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    {user.skillLevel || "Beginner"}
                </p>

                {/* Hover hint */}
                <p className="text-xs text-gray-400 mt-3 opacity-0 
                group-hover:opacity-100 transition-opacity duration-200">
                    Double click to add language
                </p>
            </div>
        </section>
    );
};

export default LanguagesSection;
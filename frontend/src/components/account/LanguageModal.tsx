import React from "react";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { flag: "🇬🇧", name: "English", sub: "Currently selected", available: true },
  { flag: "🇱🇰", name: "Sinhala", sub: "සිංහල", available: false },
  { flag: "🇱🇰", name: "Tamil", sub: "தமிழ்", available: false },
];

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Languages</h3>
            <p className="text-sm text-gray-400 mt-0.5">Choose a language to learn</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Language list */}
        <div className="px-7 py-5 space-y-3">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.name}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                lang.available
                  ? "border-emerald-200 bg-emerald-50/60 cursor-default"
                  : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{lang.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{lang.sub}</p>
              </div>
              {lang.available ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Active
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  Soon
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-7 pb-7">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
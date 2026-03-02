import React from "react";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[400px] p-6 space-y-4 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold">Add Language</h3>

        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-400">
          <p className="font-semibold text-gray-800">English</p>
          <p className="text-xs text-gray-500">Already selected</p>
        </div>

        <div className="border rounded-lg p-4 opacity-60 cursor-not-allowed relative">
          <p className="font-semibold text-gray-800">Sinhala</p>
          <span className="absolute top-2 right-2 text-xs bg-gray-200 px-2 py-1 rounded">
            Coming soon
          </span>
        </div>

        <div className="border rounded-lg p-4 opacity-60 cursor-not-allowed relative">
          <p className="font-semibold text-gray-800">Tamil</p>
          <span className="absolute top-2 right-2 text-xs bg-gray-200 px-2 py-1 rounded">
            Coming soon
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-100 rounded-lg py-2 mt-4 hover:bg-gray-200 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LanguageModal;
import React, { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  onAdd: (goal: { type: string; title: string; deadline: string }) => void;
  existingTypes: string[];
}

const PRESET_GOALS = [
  {
    type: "grammar",
    title: "Master Grammar",
    icon: "✏️",
    desc: "Reach 80% in grammar skill",
    color: "from-purple-400 to-violet-600",
    border: "border-purple-200",
    ring: "ring-purple-400",
    bg: "bg-purple-50",
  },
  {
    type: "vocabulary",
    title: "Expand Vocabulary",
    icon: "📖",
    desc: "Reach 80% in vocabulary skill",
    color: "from-emerald-400 to-teal-600",
    border: "border-emerald-200",
    ring: "ring-emerald-400",
    bg: "bg-emerald-50",
  },
  {
    type: "listening",
    title: "Improve Listening",
    icon: "🎧",
    desc: "Reach 80% in listening skill",
    color: "from-orange-400 to-amber-500",
    border: "border-orange-200",
    ring: "ring-orange-400",
    bg: "bg-orange-50",
  },
  {
    type: "reading",
    title: "Complete Reading Tasks",
    icon: "📚",
    desc: "Reach 80% in reading skill",
    color: "from-sky-400 to-blue-600",
    border: "border-sky-200",
    ring: "ring-sky-400",
    bg: "bg-sky-50",
  },
  {
    type: "streak",
    title: "Build Daily Streak",
    icon: "🔥",
    desc: "Maintain a 7-day learning streak",
    color: "from-rose-400 to-pink-600",
    border: "border-rose-200",
    ring: "ring-rose-400",
    bg: "bg-rose-50",
  },
];

const AddGoalModal: React.FC<Props> = ({ onClose, onAdd, existingTypes }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [deadline, setDeadline] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 200);
  };

  const handleSave = () => {
    if (!selectedType || !deadline) return;
    const preset = PRESET_GOALS.find((g) => g.type === selectedType)!;
    onAdd({ type: selectedType, title: preset.title, deadline });
    handleClose();
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-200 ${
        show ? "bg-black/40 backdrop-blur-sm opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-auto flex flex-col transition-all duration-200 ${
          show
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header - Fixed */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Choose a Learning Goal
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Select one goal to track your progress
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {/* Goal Cards */}
          {PRESET_GOALS.map((g) => {
            const taken = existingTypes.includes(g.type);
            const selected = selectedType === g.type;
            return (
              <button
                key={g.type}
                type="button"
                disabled={taken}
                onClick={() => !taken && setSelectedType(g.type)}
                className={`relative flex items-center gap-4 w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-150 ${
                  taken
                    ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                    : selected
                    ? `${g.bg} ${g.border} ring-2 ${g.ring} shadow-md`
                    : `bg-white border-gray-200 hover:shadow-sm`
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-xl shadow-sm shrink-0`}
                >
                  {g.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{g.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {g.desc}
                  </p>
                </div>
                {taken && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full shrink-0">
                    ✓ Added
                  </span>
                )}
                {selected && !taken && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-emerald-500 px-2 py-1 rounded-full shrink-0">
                    ✓ Selected
                  </span>
                )}
              </button>
            );
          })}

          {/* Deadline */}
          <div className="pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={minDateStr}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedType || !deadline}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGoalModal;
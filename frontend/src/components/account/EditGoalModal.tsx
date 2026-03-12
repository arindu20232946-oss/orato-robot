import React from "react";
import toast from "react-hot-toast";

interface EditGoalModalProps {
    goal: any | null;
    onClose: () => void;
    setGoals: React.Dispatch<React.SetStateAction<any[]>>;
    setEditingGoal: React.Dispatch<React.SetStateAction<any>>;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ goal, onClose, setGoals, setEditingGoal }) => {
    if (!goal) return null;

    const inputClass = "w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200";

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Edit Goal</h3>
                        <p className="text-sm text-gray-400 mt-0.5">Update your learning objective</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="px-7 py-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Goal Title</label>
                        <input
                            type="text"
                            value={goal.title}
                            onChange={(e) => setEditingGoal({ ...goal, title: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Target</label>
                        <input
                            type="number"
                            value={goal.target}
                            onChange={(e) => setEditingGoal({ ...goal, target: Number(e.target.value) })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Deadline</label>
                        <input
                            type="date"
                            value={goal.deadline}
                            onChange={(e) => setEditingGoal({ ...goal, deadline: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-7 pb-7 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
                            onClose();
                            toast.success("Goal updated!");
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold text-white shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditGoalModal;
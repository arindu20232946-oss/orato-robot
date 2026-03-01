import React from "react";
import toast from "react-hot-toast";

interface EditGoalModalProps {
    goal: any | null;
    onClose: () => void;
    setGoals: React.Dispatch<React.SetStateAction<any[]>>;
    setEditingGoal: React.Dispatch<React.SetStateAction<any>>;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({
    goal,
    onClose,
    setGoals,
    setEditingGoal,
}) => {
    if (!goal) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold">Edit Goal</h3>

                <div>
                    <label className="text-sm text-gray-600">Title</label>
                    <input
                        type="text"
                        value={goal.title}
                        onChange={(e) =>
                            setEditingGoal({
                                ...goal,
                                title: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Target</label>
                    <input
                        type="number"
                        value={goal.target}
                        onChange={(e) =>
                            setEditingGoal({
                                ...goal,
                                target: Number(e.target.value),
                            })
                        }
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Deadline</label>
                    <input
                        type="date"
                        value={goal.deadline}
                        onChange={(e) =>
                            setEditingGoal({
                                ...goal,
                                deadline: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            setGoals((prev) =>
                                prev.map((g) => (g.id === goal.id ? goal : g))
                            );
                            onClose();
                            toast.success("Goal updated successfully!");
                        }}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditGoalModal;
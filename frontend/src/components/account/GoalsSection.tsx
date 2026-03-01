import React from "react";

interface GoalsSectionProps {
    goals: any[];
    onOpenAddGoal: () => void;
    onEditGoal: (goal: any) => void;
    setGoals: React.Dispatch<React.SetStateAction<any[]>>;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({
    goals,
    onOpenAddGoal,
    onEditGoal,
    setGoals,
}) => {
    return (
        <section className="bg-white rounded-2xl shadow-md p-8 
           transition-all duration-300 ease-out
           hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Learning Goals
                </h2>

                {goals.length < 3 && (
                    <button
                        onClick={() => onOpenAddGoal()}
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
"
                    >
                        + Add Goal
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {goals.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No goals added yet.
                    </div>
                )}

                {goals.map((goal) => {

                    const progress = Math.min(
                        (goal.current / goal.target) * 100,
                        100
                    );

                    const today = new Date();
                    const deadlineDate = new Date(goal.deadline);

                    const isExpired = today > deadlineDate;
                    const isCompleted = goal.current >= goal.target;

                    return (
                        <div
                            className="bg-gray-50 rounded-xl p-6 border relative animate-fadeIn"
                        >
                            <button
                                onClick={() => onOpenAddGoal()}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                            >
                                ✏️
                            </button>

                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">
                                    {goal.title}
                                </h3>

                                {isCompleted && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded animate-fadeIn">
                                        ✔ Completed
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 mt-2">
                                Current: {goal.current}
                            </p>

                            <div className="mt-4 h-2 bg-gray-200 rounded-full">
                                <div
                                    className={`h-2 rounded-full transition-all duration-1000 ease-out ${isCompleted ? "bg-green-500" : isExpired ? "bg-red-500" : "bg-emerald-500"
                                        }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="text-xs text-gray-400 mt-2">


                                {/* Expanding slider */}
                                <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-20">

                                    <div className="mt-3 flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="1"
                                            max={goal.id === 1 ? 100 : 60}
                                            value={goal.target}
                                            onChange={(e) => {
                                                const newTarget = Number(e.target.value);
                                                setGoals(prev =>
                                                    prev.map(g =>
                                                        g.id === goal.id ? { ...g, target: newTarget } : g
                                                    )
                                                );
                                            }}
                                            className="w-full accent-emerald-500"
                                        />

                                        <span className="w-8 text-right text-gray-700 text-sm">
                                            {goal.target}
                                        </span>
                                    </div>

                                </div>

                            </div>


                            <p className="text-xs text-gray-400 mt-1">
                                Deadline: {deadlineDate.toLocaleDateString()}
                            </p>

                            {isExpired && !isCompleted && (
                                <p className="text-xs text-red-500 mt-1">
                                    Goal expired
                                </p>
                            )}

                        </div>
                    );
                })}


                {/* Goal 3 — Vocabulary Coming Soon */}
                <div className="bg-gray-50 rounded-xl p-6 border opacity-60 relative">
                    <h3 className="font-semibold text-gray-800">
                        Learn 500 Vocabulary Words
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        Vocabulary tracking coming soon
                    </p>

                    <span className="absolute top-4 right-4 text-xs bg-gray-200 px-2 py-1 rounded">
                        Coming Soon
                    </span>
                </div>

            </div>
        </section>
    );
};

export default GoalsSection;
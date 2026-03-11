import React from "react";

interface GoalsSectionProps {
    goals: any[];
    onOpenAddGoal: () => void;
    onEditGoal: (goal: any) => void;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({
    goals,
    onOpenAddGoal,
    onEditGoal,
}) => {
    return (
        <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">

            {/* Header */}
            <div className="flex justify-between items-center mb-7">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 mb-1">Progress</p>
                    <h2 className="text-xl font-bold text-gray-900">Learning Goals</h2>
                </div>

                {goals.length < 3 && (
                    <button
                        onClick={onOpenAddGoal}
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold
                        text-emerald-600 border border-emerald-200
                        hover:bg-emerald-500 hover:text-white hover:border-emerald-500
                        shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                    >
                        <span className="text-base leading-none">+</span> Add Goal
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Empty state */}
                {goals.length === 0 && (
                    <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-5xl mb-4">🎯</div>
                        <p className="font-semibold text-gray-700 mb-1">No goals yet</p>
                        <p className="text-sm text-gray-400 mb-5">Set your first learning goal to start tracking your progress</p>
                        <button
                            onClick={onOpenAddGoal}
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                        >
                            + Add Your First Goal
                        </button>
                    </div>
                )}

                {/* Goal cards */}
                {goals.map((goal) => {
                    const progress = Math.min((goal.current / goal.target) * 100, 100);
                    const isCompleted = goal.current >= goal.target;
                    const isExpired = !isCompleted && new Date() > new Date(goal.deadline);

                    const borderColor = isCompleted
                        ? "border-l-emerald-400"
                        : isExpired
                            ? "border-l-red-400"
                            : "border-l-sky-400";

                    const barColor = isCompleted
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                        : isExpired
                            ? "bg-gradient-to-r from-red-400 to-rose-500"
                            : "bg-gradient-to-r from-sky-400 to-blue-500";

                    return (
                        <div
                            key={goal._id || goal.id}
                            className={`relative bg-white rounded-2xl border-l-4 ${borderColor} border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 p-6 transition-all duration-200`}
                        >
                            {/* Edit button */}
                            <button
                                onClick={() => onEditGoal(goal)}
                                title="Edit goal"
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303Z" />
                                </svg>
                            </button>

                            {/* Title + status chip */}
                            <div className="flex items-start justify-between gap-2 pr-8">
                                <h3 className="font-bold text-gray-900 leading-snug">{goal.title}</h3>
                                {isCompleted && (
                                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                        ✓ Done
                                    </span>
                                )}
                                {isExpired && (
                                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                        ⚠ Expired
                                    </span>
                                )}
                            </div>

                            {/* Progress */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                    <span>{goal.current} / {goal.target}</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Deadline */}
                            <p className="mt-3 text-xs text-gray-400">
                                📅 Deadline: {new Date(goal.deadline).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" })}
                            </p>
                        </div>
                    );
                })}

                {/* Coming Soon card */}
                <div className="relative bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 flex flex-col justify-center opacity-60">
                    <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider bg-gray-200 text-gray-500 px-2.5 py-1 rounded-full">
                        Coming Soon
                    </span>
                    <p className="font-bold text-gray-700 mb-1">Vocabulary Challenge</p>
                    <p className="text-sm text-gray-400">Learn 500 vocabulary words — tracking coming soon</p>
                </div>

            </div>
        </section>
    );
};

export default GoalsSection;
import React from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

interface GoalsSectionProps {
  goals: any[];
  onOpenAddGoal: () => void;
  setGoals: React.Dispatch<React.SetStateAction<any[]>>;
}

const GOAL_META: Record<string, { icon: string; color: string; barColor: string }> = {
  grammar: { icon: "✏️", color: "border-l-purple-400", barColor: "bg-gradient-to-r from-purple-400 to-violet-500" },
  vocabulary: { icon: "📖", color: "border-l-emerald-400", barColor: "bg-gradient-to-r from-emerald-400 to-teal-500" },
  listening: { icon: "🎧", color: "border-l-orange-400", barColor: "bg-gradient-to-r from-orange-400 to-amber-500" },
  reading: { icon: "📚", color: "border-l-sky-400", barColor: "bg-gradient-to-r from-sky-400 to-blue-500" },
  streak: { icon: "🔥", color: "border-l-rose-400", barColor: "bg-gradient-to-r from-rose-400 to-pink-600" },
};

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals, onOpenAddGoal, setGoals }) => {

  const handleDelete = async (goalId: string) => {
    try {
      await API.delete(`/users/goals/${goalId}`);
      setGoals((prev) => prev.filter((g) => g._id !== goalId));
      toast.success("Goal removed.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove goal.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">

      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 mb-1">Progress</p>
          <h2 className="text-xl font-bold text-gray-900">Learning Goals</h2>
        </div>

        {goals.length < 5 && (
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
          const meta = GOAL_META[goal.type] || GOAL_META.grammar;

          const borderColor = isCompleted ? "border-l-emerald-400" : isExpired ? "border-l-red-400" : meta.color;
          const barColor = isCompleted
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : isExpired
            ? "bg-gradient-to-r from-red-400 to-rose-500"
            : meta.barColor;

          return (
            <div
              key={goal._id}
              className={`relative bg-white rounded-2xl border-l-4 ${borderColor} border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 p-6 transition-all duration-200`}
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(goal._id)}
                title="Remove goal"
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title + icon + status chip */}
              <div className="flex items-start gap-3 pr-10 mb-4">
                <span className="text-2xl shrink-0">{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 leading-snug">{goal.title}</h3>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ✓ Done
                      </span>
                    )}
                    {isExpired && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        ⚠ Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-1">
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

      </div>
    </section>
  );
};

export default GoalsSection;
import React from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { 
  PenLine, 
  BookOpen, 
  Headphones, 
  Book, 
  Flame, 
  Target, 
  X, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Plus 
} from "lucide-react";

interface GoalsSectionProps {
  goals: any[];
  onOpenAddGoal: () => void;
  setGoals: React.Dispatch<React.SetStateAction<any[]>>;
}

const GOAL_META: Record<string, { icon: any; color: string; barColor: string; bgLight: string; textDark: string }> = {
  grammar: { 
    icon: PenLine, 
    color: "border-l-purple-400", 
    barColor: "bg-gradient-to-r from-purple-400 to-violet-500",
    bgLight: "bg-purple-50",
    textDark: "text-purple-700"
  },
  vocabulary: { 
    icon: BookOpen, 
    color: "border-l-emerald-400", 
    barColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
    bgLight: "bg-emerald-50",
    textDark: "text-emerald-700"
  },
  listening: { 
    icon: Headphones, 
    color: "border-l-orange-400", 
    barColor: "bg-gradient-to-r from-orange-400 to-amber-500",
    bgLight: "bg-orange-50",
    textDark: "text-orange-700"
  },
  reading: { 
    icon: Book, 
    color: "border-l-sky-400", 
    barColor: "bg-gradient-to-r from-sky-400 to-blue-500",
    bgLight: "bg-sky-50",
    textDark: "text-sky-700"
  },
  streak: { 
    icon: Flame, 
    color: "border-l-rose-400", 
    barColor: "bg-gradient-to-r from-rose-400 to-pink-600",
    bgLight: "bg-rose-50",
    textDark: "text-rose-700"
  },
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
    <section className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/50 p-8 transition-all duration-500 hover:shadow-2xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-1.5">Efficiency</p>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Learning Goals</h2>
        </div>

        {goals.length < 5 && (
          <button
            onClick={onOpenAddGoal}
            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold
            text-emerald-700 bg-emerald-50 border border-emerald-100
            hover:bg-emerald-600 hover:text-white hover:border-emerald-600
            shadow-sm hover:shadow-emerald-500/20 transition-all duration-300 active:scale-95 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            Add Goal
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Empty state */}
        {goals.length === 0 && (
          <div className="md:col-span-2 flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6 group hover:scale-110 transition-transform duration-500">
              <Target className="w-10 h-10 text-emerald-500 transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <p className="font-black text-gray-900 text-lg mb-2">No active goals</p>
            <p className="text-sm font-medium text-gray-400 mb-8 max-w-xs px-4">Focus your learning journey by setting your first milestone today.</p>
            <button
              onClick={onOpenAddGoal}
              className="rounded-2xl px-8 py-3 text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-500/30 transition-all duration-300 active:scale-95 hover:-translate-y-1"
            >
              Set My First Goal
            </button>
          </div>
        )}

        {/* Goal cards */}
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const isCompleted = goal.current >= goal.target;
          const isExpired = !isCompleted && new Date() > new Date(goal.deadline);
          const meta = GOAL_META[goal.type] || GOAL_META.grammar;
          const Icon = meta.icon;

          const borderColor = isCompleted ? "border-l-emerald-400" : isExpired ? "border-l-red-400" : meta.color;
          const barColor = isCompleted
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : isExpired
            ? "bg-gradient-to-r from-red-400 to-rose-500"
            : meta.barColor;

          return (
            <div
              key={goal._id}
              className={`relative bg-gradient-to-br from-white to-gray-50/30 rounded-[2rem] border-l-4 ${borderColor} border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 p-7 transition-all duration-400 group`}
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(goal._id)}
                title="Remove goal"
                className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title + icon + status chip */}
              <div className="flex items-start gap-4 pr-10 mb-6">
                <div className={`w-12 h-12 rounded-2xl ${meta.bgLight} ${meta.textDark} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap min-h-[2rem]">
                    <h3 className="font-black text-gray-900 leading-tight uppercase tracking-tight truncate">{goal.title}</h3>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                    {isExpired && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full shadow-sm">
                        <AlertCircle className="w-3 h-3" />
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between items-end mb-2.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-gray-900">{goal.current}</span>
                    <span className="text-xs font-bold text-gray-400">/ {goal.target}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${barColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="mt-6 flex items-center gap-2 text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Target: {new Date(goal.deadline).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default GoalsSection;
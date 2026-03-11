import React from "react";

interface Props {
  user: any;
  goals: any[];
}

const BADGE_DATA = [
  {
    key: "profileComplete",
    icon: "🏅",
    label: "Profile Complete",
    desc: "Fill in all profile fields",
    gradient: "from-amber-400 to-orange-500",
    glow: "rgba(251,146,60,0.4)",
  },
  {
    key: "firstGoal",
    icon: "⭐",
    label: "First Goal",
    desc: "Add your first learning goal",
    gradient: "from-yellow-400 to-amber-500",
    glow: "rgba(250,204,21,0.4)",
  },
  {
    key: "threeGoals",
    icon: "🎯",
    label: "Goal Setter",
    desc: "Create 3 learning goals",
    gradient: "from-emerald-400 to-teal-500",
    glow: "rgba(52,211,153,0.4)",
  },
  {
    key: "goalCompleted",
    icon: "🔥",
    label: "Goal Crusher",
    desc: "Complete a learning goal",
    gradient: "from-rose-400 to-pink-600",
    glow: "rgba(251,113,133,0.4)",
  },
];

const AchievementSection: React.FC<Props> = ({ user, goals }) => {
  const profileComplete = !!(user?.fullName && user?.email && user?.bio && user?.profilePicture);
  const firstGoal = goals.length >= 1;
  const threeGoals = goals.length >= 3;
  const goalCompleted = goals.some((g) => g.current >= g.target);

  const unlockMap: Record<string, boolean> = {
    profileComplete,
    firstGoal,
    threeGoals,
    goalCompleted,
  };

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">

      {/* Header */}
      <div className="mb-7">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 mb-1">Milestones</p>
        <h2 className="text-xl font-bold text-gray-900">Achievement Badges</h2>
        <p className="text-sm text-gray-400 mt-1">Keep going — each badge unlocks as you progress</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BADGE_DATA.map((badge) => {
          const unlocked = unlockMap[badge.key];
          return (
            <div
              key={badge.key}
              className={`relative rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 ${
                unlocked
                  ? "bg-white border border-gray-100 shadow-md hover:-translate-y-1 hover:shadow-lg"
                  : "bg-gray-50 border border-dashed border-gray-200 opacity-60"
              }`}
              style={
                unlocked
                  ? { boxShadow: `0 4px 24px 0 ${badge.glow}` }
                  : undefined
              }
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 ${
                  unlocked
                    ? `bg-gradient-to-br ${badge.gradient} shadow-md`
                    : "bg-gray-200 grayscale"
                }`}
              >
                {badge.icon}
              </div>

              {/* Label */}
              <p className={`font-bold text-sm ${unlocked ? "text-gray-900" : "text-gray-400"}`}>
                {badge.label}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 leading-tight">{badge.desc}</p>

              {/* Unlocked chip */}
              {unlocked && (
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  ✓ Unlocked
                </span>
              )}

              {/* Lock icon for locked */}
              {!unlocked && (
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  🔒 Locked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AchievementSection;
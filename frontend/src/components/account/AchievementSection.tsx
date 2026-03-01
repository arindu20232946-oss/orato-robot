import React from "react";

interface Props {
  user: any;
  goals: any[];
}

const AchievementSection: React.FC<Props> = ({ user, goals }) => {

  const profileComplete =
    user?.fullName &&
    user?.email &&
    user?.bio &&
    user?.profilePicture;

  const firstGoal = goals.length >= 1;

  const threeGoals = goals.length >= 3;

  const goalCompleted = goals.some(
    (goal) => goal.current >= goal.target
  );

  const Badge = ({
    unlocked,
    icon,
    label
  }: {
    unlocked: boolean;
    icon: string;
    label: string;
  }) => (
    <div
      className={`rounded-xl p-4 text-center border transition-all duration-300 ${
        unlocked
          ? "bg-emerald-50 border-emerald-300"
          : "bg-gray-100 border-gray-200 opacity-40 grayscale"
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
      {unlocked && (
        <p className="text-xs text-emerald-600 mt-1">
          Unlocked!
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Achievement Badges
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Badge unlocked={profileComplete} icon="🏅" label="Profile Completed" />

        <Badge unlocked={firstGoal} icon="⭐" label="First Goal Added" />

        <Badge unlocked={threeGoals} icon="🎯" label="3 Goals Created" />

        <Badge unlocked={goalCompleted} icon="🔥" label="Goal Completed" />

      </div>
    </div>
  );
};

export default AchievementSection;
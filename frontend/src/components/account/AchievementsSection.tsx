import React from "react";

interface Props {
    user: any;
}

const AchievementSection: React.FC<Props> = ({ user }) => {

    const isProfileComplete =
        user?.fullName &&
        user?.email &&
        user?.bio &&
        user?.profilePicture;

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6">
                Achievement Badges
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* PROFILE COMPLETED BADGE */}
                <div
                    className={`rounded-xl p-4 text-center border transition-all duration-300 ${isProfileComplete
                            ? "bg-emerald-50 border-emerald-300"
                            : "bg-gray-100 border-gray-200 opacity-40 grayscale"
                        }`}
                >
                    <div className="text-3xl mb-2">🏅</div>
                    <p className="text-sm font-medium">
                        Profile Completed
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AchievementSection;
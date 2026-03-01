import React from "react";

interface ProfileSectionProps {
    user: any;
    uploading: boolean;
    initials: string;
    onImageUpload: (file: File) => void;
    onEditClick: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
    user,
    uploading,
    initials,
    onImageUpload,
    onEditClick,
}) => {
    return (
        <section className="
          max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow-xl p-10
          transition-all duration-300 ease-out
           hover:shadow-xl hover:-translate-y-1">

            {/* TOP ROW */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                {/* LEFT SIDE */}
                <div className="flex items-start gap-6">

                    {/* AVATAR WITH LOADING STATE */}
                    <label className="group relative cursor-pointer">
                        {uploading ? (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center animate-pulse shadow-md">
                                <span className="text-sm text-gray-500">Uploading...</span>
                            </div>
                        ) : user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover shadow-md 
transition-all duration-300 
group-hover:scale-105 group-hover:ring-4 group-hover:ring-emerald-400/40"                    />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center 
text-white text-4xl font-semibold shadow-md 
transition-all duration-300 
group-hover:scale-105 group-hover:ring-4 group-hover:ring-emerald-400/40">
                                {initials}
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    onImageUpload(e.target.files[0]);
                                }
                            }}
                        />

                        {!uploading && (
                            <div className="absolute bottom-0 right-0 bg-white border rounded-full w-8 h-8 flex items-center justify-center text-sm shadow hover:bg-gray-100 transition">
                                📷
                            </div>
                        )}

                    </label>

                    {/* Name + Email + Joined */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold text-gray-900">
                            {user.fullName}
                        </h2>

                        <p className="text-gray-500 text-sm">
                            {user.email}
                        </p>

                        <p className="text-sm text-gray-400">
                            Joined: {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("en-LK", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "N/A"}
                        </p>
                    </div>
                </div>

                {/* EDIT BUTTON */}
                <button
                    onClick={() => onEditClick()}
                    className="
relative overflow-hidden
rounded-xl px-6 py-2.5
font-semibold tracking-wide
bg-emerald-500/10 text-emerald-600
border border-emerald-400/30
backdrop-blur-md
transition-all duration-300 ease-out
hover:bg-emerald-500 hover:text-white
hover:-translate-y-0.5
hover:shadow-[0_10px_30px_rgba(16,185,129,0.25)]
active:scale-95
"
                >
                    Edit Profile
                </button>
            </div>

            {/* Personal Overview */}
            <div
                onDoubleClick={() => onEditClick()}
                className="group mt-10 bg-gray-50 rounded-xl p-6 border border-gray-100 hover:bg-gray-100 transition flex flex-col min-h-[20px]"            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Personal Overview
                    </h3>
                    <p className="text-xs text-gray-400 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Double click to edit
                    </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                        {user.bio || "Double click here to add a bio."}
                    </p>
                </div>
            </div>

            {/* STATS */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* <div className="bg-gray-50 rounded-xl p-4 border"> */}
                <div className="bg-gray-50 rounded-xl p-4 border 
transition-all duration-300 
hover:-translate-y-1 hover:shadow-lg 
hover:border-emerald-400 cursor-pointer">
                    <p className="text-lg">🎯</p>
                    <p className="text-sm text-gray-500">Current Level</p>
                    <p className="font-bold text-xl mt-1 text-gray-800">
                        {user.skillLevel || "Beginner"}
                    </p>
                </div>

                {/* <div className="bg-gray-50 rounded-xl p-4 border"> */}
                <div className="bg-gray-50 rounded-xl p-4 border 
transition-all duration-300 
hover:-translate-y-1 hover:shadow-lg 
hover:border-emerald-400 cursor-pointer">
                    <p className="text-lg">🌍</p>
                    <p className="text-sm text-gray-500">Target Language</p>
                    <p className="font-bold text-xl mt-1 text-gray-800">
                        {user.targetLanguage || "English"}
                    </p>
                </div>

                {/* <div className="bg-gray-50 rounded-xl p-4 border"> */}
                <div className="bg-gray-50 rounded-xl p-4 border 
transition-all duration-300 
hover:-translate-y-1 hover:shadow-lg 
hover:border-emerald-400 cursor-pointer">
                    <p className="text-lg">📘</p>
                    <p className="text-sm text-gray-500">Daily Goal</p>
                    <p className="font-bold text-xl mt-1 text-gray-800">
                        {user.dailyGoalMinutes || 15} min/day
                    </p>
                </div>

                {/* <div className="bg-gray-50 rounded-xl p-4 border"> */}
                <div className="bg-gray-50 rounded-xl p-4 border 
transition-all duration-300 
hover:-translate-y-1 hover:shadow-lg 
hover:border-emerald-400 cursor-pointer">
                    <p className="text-lg">🏆</p>
                    <p className="text-sm text-gray-500">Assessment Score</p>
                    <p className="font-bold text-xl mt-1 text-gray-800">
                        {user.assessmentScore || 0}
                    </p>
                </div>

            </div>

        </section>
    );
};

export default ProfileSection;
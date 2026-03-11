import React, { useState, useRef, useEffect } from "react";

interface ProfileSectionProps {
    user: any;
    uploading: boolean;
    initials: string;
    onImageUpload: (file: File) => void;
    onRemoveImage: () => void;
    onEditClick: () => void;
}

const StatPill = ({
    icon,
    label,
    value,
}: {
    icon: string;
    label: string;
    value: string | number;
}) => (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
        <span className="text-xl">{icon}</span>
        <div className="min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">{label}</p>
            <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
        </div>
    </div>
);

const ProfileSection: React.FC<ProfileSectionProps> = ({
    user,
    uploading,
    initials,
    onImageUpload,
    onRemoveImage,
    onEditClick,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    const hasPhoto = user.profilePicture && user.profilePicture.trim() !== "";

    return (
        <section className="max-w-5xl mx-auto mt-8 bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">

            {/* ── HERO BANNER ─────────────────────────────────── */}
            <div className="relative h-28 bg-gradient-to-r from-emerald-500/20 via-teal-400/10 to-transparent">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(16,185,129,0.18),transparent)]" />
                {/* Edit Profile button — top-right of banner */}
                <button
                    onClick={onEditClick}
                    className="absolute top-4 right-5 flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold
                    bg-white/80 backdrop-blur-sm text-emerald-700 border border-emerald-200
                    hover:bg-emerald-500 hover:text-white hover:border-emerald-500
                    shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303Z" />
                    </svg>
                    Edit Profile
                </button>
            </div>

            {/* ── AVATAR + INFO ────────────────────────────────── */}
            <div className="px-8 pb-8">
                {/* Avatar overlapping the banner */}
                <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-14">

                    {/* Avatar */}
                    <div className="relative shrink-0" ref={menuRef}>
                        {/* Ring */}
                        <div className="p-[3px] rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg w-fit">
                            {uploading ? (
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center animate-pulse">
                                    <svg className="w-6 h-6 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4Z" />
                                    </svg>
                                </div>
                            ) : hasPhoto ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold select-none">
                                    {initials}
                                </div>
                            )}
                        </div>

                        {/* Camera button */}
                        {!uploading && (
                            <button
                                type="button"
                                onClick={() => setShowMenu(prev => !prev)}
                                title="Change profile picture"
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-base shadow-md hover:scale-110 hover:bg-gray-50 transition-all duration-150"
                            >
                                📷
                            </button>
                        )}

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    onImageUpload(e.target.files[0]);
                                    setShowMenu(false);
                                }
                                e.target.value = "";
                            }}
                        />

                        {/* Dropdown */}
                        {showMenu && (
                            <div className="absolute top-28 left-0 bg-white shadow-2xl rounded-2xl text-sm w-44 border border-gray-100 z-20 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => { fileInputRef.current?.click(); setShowMenu(false); }}
                                    className="flex items-center gap-2.5 w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                                >
                                    <span className="text-base">🖼️</span>
                                    <span>Upload new</span>
                                </button>
                                {hasPhoto && (
                                    <>
                                        <div className="border-t border-gray-100 mx-2" />
                                        <button
                                            type="button"
                                            onClick={() => { onRemoveImage(); setShowMenu(false); }}
                                            className="flex items-center gap-2.5 w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <span className="text-base">🗑️</span>
                                            <span>Remove photo</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Name / email / joined */}
                    <div className="mb-1 space-y-1">
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{user.fullName}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                            Joined{" "}
                            {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("en-LK", {
                                    year: "numeric", month: "long", day: "numeric",
                                })
                                : "—"}
                        </p>
                    </div>
                </div>

                {/* ── BIO ─────────────────────────────────────── */}
                <div
                    onDoubleClick={onEditClick}
                    className="group mt-7 flex gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200 cursor-pointer"
                >
                    <div className="w-1 shrink-0 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 opacity-70" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Personal Overview</p>
                            <p className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Double-click to edit
                            </p>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {user.bio || "Add a short bio to tell others about yourself…"}
                        </p>
                    </div>
                </div>

                {/* ── STAT PILLS ──────────────────────────────── */}
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatPill icon="🎯" label="Current Level" value={user.skillLevel || "Beginner"} />
                    <StatPill icon="🌍" label="Target Language" value={user.targetLanguage || "English"} />
                    <StatPill icon="📘" label="Daily Goal" value={`${user.dailyGoalMinutes || 15} min/day`} />
                    <StatPill icon="🏆" label="Assessment Score" value={user.assessmentScore ?? 0} />
                </div>
            </div>
        </section>
    );
};

export default ProfileSection;
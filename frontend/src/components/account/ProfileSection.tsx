import React, { useState, useRef, useEffect } from "react";
import { 
    Camera, 
    Image as ImageIcon, 
    Trash2, 
    Edit3, 
    Target, 
    Globe, 
    Clock, 
    Award,
    Mail,
    Calendar,
    User as UserIcon
} from "lucide-react";

interface ProfileSectionProps {
    user: any;
    uploading: boolean;
    initials: string;
    onImageUpload: (file: File) => void;
    onRemoveImage: () => void;
    onEditClick: () => void;
}

const StatPill = ({
    icon: Icon,
    label,
    value,
    colorClass,
}: {
    icon: any;
    label: string;
    value: string | number;
    colorClass: string;
}) => (
    <div className="group flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
        <div className={`p-2 rounded-xl ${colorClass} bg-opacity-10 transition-colors duration-300 group-hover:bg-opacity-20`}>
            <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{label}</p>
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
        <section className="max-w-5xl mx-auto mt-8 bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 transition-all duration-500 hover:shadow-emerald-500/10 hover:shadow-3xl">

            {/* ── HERO BANNER ─────────────────────────────────── */}
            <div className="relative h-32 bg-gradient-to-br from-emerald-500/20 via-teal-400/15 to-blue-500/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(20,184,166,0.1),transparent_50%)]" />
                
                {/* Floating glassy shapes for premium feel */}
                <div className="absolute top-4 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-2 right-20 w-32 h-32 bg-emerald-300/10 rounded-full blur-3xl" />

                <button
                    onClick={onEditClick}
                    className="absolute top-6 right-8 flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold
                    bg-white/90 backdrop-blur-md text-emerald-700 border border-emerald-100/50
                    hover:bg-emerald-600 hover:text-white hover:border-emerald-600
                    shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95 group"
                >
                    <Edit3 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    Edit Profile
                </button>
            </div>

            {/* ── AVATAR + INFO ────────────────────────────────── */}
            <div className="px-10 pb-10">
                {/* Avatar overlapping the banner */}
                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">

                    {/* Avatar Container */}
                    <div className="relative shrink-0" ref={menuRef}>
                        {/* Outer Glow Ring */}
                        <div className="p-1 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 shadow-2xl shadow-emerald-500/20 group">
                            {/* Inner Border Ring */}
                            <div className="p-1 rounded-full bg-white ring-4 ring-white/30 overflow-hidden">
                                {uploading ? (
                                    <div className="w-28 h-28 rounded-full bg-gray-50 flex items-center justify-center animate-pulse">
                                        <div className="relative">
                                            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                        </div>
                                    </div>
                                ) : hasPhoto ? (
                                    <img
                                        src={user.profilePicture}
                                        alt="Profile"
                                        className="w-28 h-28 rounded-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-4xl font-black tracking-tighter select-none">
                                        {initials}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Camera Action Button */}
                        {!uploading && (
                            <button
                                type="button"
                                onClick={() => setShowMenu(prev => !prev)}
                                title="Change profile picture"
                                className="absolute bottom-1 right-1 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-100 flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-emerald-500 hover:text-white transition-all duration-300 group z-10"
                            >
                                <Camera className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
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

                        {/* Premium Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute top-full mt-3 left-0 bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[1.5rem] w-52 border border-white/50 z-30 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="p-2 space-y-1">
                                    <button
                                        type="button"
                                        onClick={() => { fileInputRef.current?.click(); setShowMenu(false); }}
                                        className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-500 hover:text-white text-gray-700 transition-all duration-200 group/item"
                                    >
                                        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                                            <ImageIcon className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-sm">Upload new</span>
                                    </button>
                                    
                                    {hasPhoto && (
                                        <button
                                            type="button"
                                            onClick={() => { onRemoveImage(); setShowMenu(false); }}
                                            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 group/item"
                                        >
                                            <div className="p-1.5 rounded-lg bg-red-100 text-red-600 group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-sm">Remove photo</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Name / email / joined */}
                    <div className="mb-2 space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight truncate">
                                {user.fullName}
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="text-sm font-medium">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">
                                    Joined {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("en-LK", {
                                            year: "numeric", month: "long", day: "numeric",
                                        })
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BIO ─────────────────────────────────────── */}
                <div
                    onDoubleClick={onEditClick}
                    className="group mt-8 flex gap-5 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100/80 hover:border-emerald-200 hover:bg-emerald-50/30 shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                    </div>
                    
                    <div className="w-1.5 shrink-0 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <UserIcon className="w-3.5 h-3.5 text-emerald-500" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Personal Mission</p>
                            </div>
                            <p className="text-[10px] font-bold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Double-click to edit
                            </p>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed font-medium">
                            {user.bio || "Add a short bio to tell others about yourself…"}
                        </p>
                    </div>
                </div>

                {/* ── STAT PILLS ──────────────────────────────── */}
                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatPill 
                        icon={Target} 
                        label="Skill Level" 
                        value={user.skillLevel || "Beginner"} 
                        colorClass="bg-blue-500"
                    />
                    <StatPill 
                        icon={Globe} 
                        label="Target" 
                        value={user.targetLanguage || "English"} 
                        colorClass="bg-emerald-500"
                    />
                    <StatPill 
                        icon={Clock} 
                        label="Daily Goal" 
                        value={`${user.dailyGoalMinutes || 15}m`} 
                        colorClass="bg-amber-500"
                    />
                    <StatPill 
                        icon={Award} 
                        label="Score" 
                        value={user.assessmentScore ?? 0} 
                        colorClass="bg-purple-500"
                    />
                </div>
            </div>
        </section>
    );
};


export default ProfileSection;
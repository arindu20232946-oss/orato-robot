import React, { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

interface Props {
    onClose: () => void;
    onProfileUpdate: (user: any) => void;
}

const EditProfileModal: React.FC<Props> = ({ onClose, onProfileUpdate }) => {
    const [show, setShow] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("English");

    useEffect(() => {
        setShow(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setFullName(user.fullName || "");
            setBio(user.bio || "");
            setTargetLanguage(user.targetLanguage || "English");
        }
        const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 200);
    };

    const handleSave = async () => {
        if (!fullName.trim()) { toast.error("Full name cannot be empty"); return; }
        try {
            setSaving(true);
            const response = await API.put("/users/profile", { fullName, bio, targetLanguage });
            const updatedUser = response.data.user;
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("storage"));
            onProfileUpdate(updatedUser);
            toast.success("Profile updated!");
            handleClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Update failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200";

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-200 ${show ? "bg-black/40 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0"}`}
            onClick={handleClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transition-all duration-200 ${show ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"}`}
            >
                {/* Modal header */}
                <div className="px-8 pt-7 pb-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Update your personal information</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="px-8 py-6 space-y-5">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your full name"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</label>
                        <input
                            type="email"
                            value={currentUser?.email || ""}
                            disabled
                            className={`${inputClass} opacity-60 cursor-not-allowed`}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Learning Language</label>
                        <select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            className={inputClass}
                        >
                            <option value="English">English</option>
                            <option disabled>සිංහල (Coming Soon)</option>
                            <option disabled>தமிழ் (Coming Soon)</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Current Level</label>
                        <div className={`${inputClass} text-gray-500`}>
                            {currentUser?.skillLevel || "Beginner"}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5">Auto-calculated by the system</p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Bio</label>
                        <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell others about yourself…"
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 pb-7 flex gap-3">
                    <button
                        onClick={handleClose}
                        disabled={saving}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-md ${saving ? "bg-gray-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg active:scale-95"}`}
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
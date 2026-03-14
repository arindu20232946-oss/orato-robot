import React, { useState, useRef } from 'react';
import { LogOut, Trash2, User } from 'lucide-react';
import type { AccountActionsProps } from '../types/settings.types';
import axios from 'axios';
import { gsap } from 'gsap';

const AccountActions: React.FC<AccountActionsProps> = ({ userId }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        gsap.to(cardRef.current, {
            rotateY: x * 4,
            rotateX: -y * 4,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        });
    };

    const handleLogout = (): void => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setShowLogoutConfirm(false);
        window.location.href = '/signin';
    };

    const cancelLogout = (): void => {
        setShowLogoutConfirm(false);
    };

    const handleDeleteAccount = (): void => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async (): Promise<void> => {
        if (!userId) {
            alert('Unable to identify user session. Please try logging in again.');
            setShowDeleteConfirm(false);
            return;
        }

        try {
            await axios.delete(`${window.config.backendUrl}/settings/${userId}`);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setShowDeleteConfirm(false);
            window.location.href = '/signin';
        } catch (err) {
            alert('Failed to delete account. Please try again.');
            setShowDeleteConfirm(false);
        }
    };

    const cancelDelete = (): void => {
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-white/80 p-10 transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
            >
                <div className="flex items-center mb-10">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 mr-5 shadow-lg shadow-emerald-200/50">
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Account Actions</h2>
                        <p className="text-emerald-700/60 font-medium mt-1">Manage your session and account data</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Log Out Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full relative group overflow-hidden bg-white/40 border border-white/80 p-6 rounded-[2rem] hover:border-emerald-200/50 hover:bg-white/80 transition-all duration-300 shadow-sm"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 group-hover:shadow-sm transition-all duration-300">
                                    <LogOut className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-emerald-950">Log Out</h3>
                                    <p className="text-emerald-700/60 font-medium text-sm mt-1">Securely end your current session</p>
                                </div>
                            </div>
                            <div className="text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                            </div>
                        </div>
                    </button>

                    {/* Delete Account Button */}
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full relative group overflow-hidden bg-white/40 border border-red-100/50 p-6 rounded-[2rem] hover:border-red-200 hover:bg-red-50/50 transition-all duration-300 shadow-sm mt-4"
                    >
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-red-50 rounded-2xl text-red-500 group-hover:bg-red-100 group-hover:text-red-600 group-hover:shadow-sm transition-all duration-300">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-red-900">Delete Account</h3>
                                    <p className="text-red-700/60 font-medium text-sm mt-1">Permanently remove your account and all data</p>
                                </div>
                            </div>
                            <div className="text-red-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_30px_60px_rgba(16,185,129,0.15)] rounded-[2.5rem] max-w-md w-full p-10 transform transition-transform animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-emerald-50 text-emerald-500 border border-emerald-100/50 rounded-3xl mb-8 shadow-inner">
                            <LogOut className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-emerald-950 text-center mb-4 tracking-tight">
                            Log Out
                        </h3>
                        <p className="text-emerald-700/80 font-medium text-center mb-10 px-2 leading-relaxed">
                            Are you sure you want to log out? You will need to sign in again to access your personalized learning journey.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 px-6 py-4 bg-white border-2 border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50/50 text-emerald-900 font-bold rounded-[1.25rem] transition-all duration-200 hover:shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-6 py-4 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-200/50 text-white font-bold rounded-[1.25rem] transition-all duration-200"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-red-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_30px_60px_rgba(239,68,68,0.15)] rounded-[2.5rem] max-w-md w-full p-10 transform transition-transform animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-red-50 text-red-500 border border-red-100/50 rounded-3xl mb-8 shadow-inner">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-red-950 text-center mb-4 tracking-tight">
                            Delete Account
                        </h3>
                        <p className="text-red-700/80 font-medium text-center mb-10 px-2 leading-relaxed">
                            This action <strong className="text-red-900">cannot be undone</strong>. All your progress, preferences, and data will be permanently removed.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-6 py-4 bg-white border-2 border-red-100 hover:border-red-200 hover:bg-red-50/50 text-red-900 font-bold rounded-[1.25rem] transition-all duration-200 hover:shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-200/50 text-white font-bold rounded-[1.25rem] transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountActions;
import React from "react";

const PageBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">

            {/* Top glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(16,185,129,0.13),transparent)]" />

            {/* Bottom-right accent */}
            <div className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.06),transparent_60%)]" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default PageBackground;
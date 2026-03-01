const PageBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f3f7f5] via-[#edf4f0] to-[#e8f0eb]">

            {/* soft glow top area */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_55%)]"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {children}
            </div>
        </div>
    );
};

export default PageBackground;
// src/features/auth/components/AuthCard.jsx
const AuthCard = ({ children, title, subtitle, showMobileLogo = true }) => {
    return (
        <div className="w-[545px] max-[900px]:w-[95%] p-[60px] max-[900px]:py-[40px] max-[900px]:px-[25px] rounded-2xl bg-auth-gradient shadow-card text-center text-white hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300">
            {showMobileLogo && (
                <h1 className="hidden max-[900px]:block font-jersey text-[40px] text-white tracking-[2px] mb-5">
                    Crisonix
                </h1>
            )}
            {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
            {subtitle && <p className="text-sm opacity-90 mb-6">{subtitle}</p>}
            {children}
        </div>
    );
};

export default AuthCard;

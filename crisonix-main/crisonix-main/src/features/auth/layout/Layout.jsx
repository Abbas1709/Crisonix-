// src/features/auth/layout/Layout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import bgImage from '../../../assets/background.png';

const Layout = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen w-full relative overflow-y-auto bg-black font-outfit">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${bgImage})` }}
            />

            {/* LEFT SIDE (Branding) - Hidden on mobile (<900px) */}
            <div className="hidden min-[900px]:flex flex-1 flex-col items-center justify-start pt-24 gap-36 z-10 text-white px-10">
                <h1
                    className="font-jersey text-[80px] leading-tight cursor-pointer hover:scale-105 hover:text-brand-accent hover:text-shadow-glow transition-all duration-300"
                    onClick={() => navigate('/')}
                >
                    Crisonix
                </h1>
                <h2 className="text-[67px] font-light leading-[1.2] w-full pl-5">
                    AI-Powered <br />
                    <span className="text-brand-accent font-medium">Disaster crisis</span> <br />
                    <span className="text-brand-accent font-medium">Response</span>
                </h2>
            </div>

            {/* RIGHT SIDE (Dynamic Content) */}
            <div className="flex flex-1 items-center justify-center z-10 w-full min-[900px]:w-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;

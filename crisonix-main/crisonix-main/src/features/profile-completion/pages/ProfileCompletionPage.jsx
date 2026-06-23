import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Shield, ArrowRight } from 'lucide-react';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import Text from '../../../components/common/Text';
import Button from '../../../components/common/Button';
import ProfileOnboarding from '../components/ProfileOnboarding';
import VolunteerRegistration from '../components/VolunteerRegistration';
import NGORegistration from '../components/NGORegistration';
import useAuthStore from '../../../store/authStore';
import mapMesh from '../../../assets/background.png';

/**
 * Post-login onboarding: emergency profile. Skips entirely if `profileCompleted` is already true.
 * Mount after Google auth; pass a real `onSave` from parent or wrap this page in a data layer.
 */
const ProfileCompletionPage = ({ onSave } = {}) => {
    const navigate = useNavigate();
    const profileCompleted = useAuthStore((s) => s.profileCompleted);
    const setProfileCompleted = useAuthStore((s) => s.setProfileCompleted);
    const setUserData = useAuthStore((s) => s.setUserData);
    const userData = useAuthStore((s) => s.userData);
    const role = useAuthStore((s) => s.role);

    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);

    // Animate success screen entrance
    useEffect(() => {
        if (!showSuccessScreen) return undefined;
        const t1 = setTimeout(() => setSuccessVisible(true), 50);
        const t2 = setTimeout(() => navigate('/dashboard', { replace: true }), 4000);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [showSuccessScreen, navigate]);

    if (profileCompleted && !showSuccessScreen) {
        return <Navigate to="/dashboard" replace />;
    }

    const initialName = (userData?.firstName || '').trim();
    const rawLogin = (userData?.emailOrPhone || '').trim();
    const initialEmail = rawLogin.includes('@') ? rawLogin : '';

    const handleSuccess = (payload) => {
        const firstName = payload?.profile?.fullName?.trim() || payload?.fullName?.trim() || userData?.firstName || '';
        if (firstName) {
            setUserData({
                firstName,
                ...(userData?.username ? {} : { username: firstName }),
            });
        }
        setProfileCompleted(true);
        setShowSuccessScreen(true);
    };

    return (
        <div className="min-h-screen relative text-white selection:bg-brand-accent/30 font-outfit">
            <Navbar />

            {/* Background with overlay */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${mapMesh})` }}
            />

            {/* Subtle radial accent glow */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none z-0" />

            <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 pb-24 md:py-12">
                {!showSuccessScreen ? (
                    <>
                        {/* Page header */}
                        <div className="mb-8 text-center md:text-left">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand-accent backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                                Profile setup
                            </div>
                            <Text variant="h2" className="text-white mt-3 text-2xl md:text-3xl font-bold">
                                {role === 'Volunteer' ? 'Volunteer Registration' : role === 'NGO / Organisation' ? 'Organization Registration' : 'Complete your emergency profile'}
                            </Text>
                            <p className="mt-3 max-w-xl text-sm text-white/60 md:text-base leading-relaxed">
                                {role === 'Volunteer' 
                                    ? 'Join our network of responders. Fill out the details below to help during crisis situations.'
                                    : role === 'NGO / Organisation'
                                    ? 'Register your organization to coordinate resources and manage crisis response operations.'
                                    : 'A few quick steps so we can support you faster during a crisis. All data is encrypted and only shared with responders when you request help.'}
                            </p>
                        </div>

                        {/* Main form card */}
                        <div className={`rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl md:p-8 ${role === 'Volunteer' || role === 'NGO / Organisation' ? 'max-w-4xl mx-auto' : ''}`}>
                            {role === 'Volunteer' ? (
                                <VolunteerRegistration
                                    initialFullName={initialName}
                                    initialEmail={initialEmail}
                                    onSuccess={handleSuccess}
                                />
                            ) : role === 'NGO / Organisation' ? (
                                <NGORegistration
                                    initialEmail={initialEmail}
                                    onSuccess={handleSuccess}
                                />
                            ) : (
                                <ProfileOnboarding
                                    initialFullName={initialName}
                                    initialEmail={initialEmail}
                                    onSave={onSave}
                                    onSuccess={handleSuccess}
                                />
                            )}
                        </div>

                        {/* Trust badges */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/35">
                            <div className="flex items-center gap-1.5">
                                <Shield className="h-3.5 w-3.5" />
                                <span>256-bit encrypted</span>
                            </div>
                            <span className="text-white/15">•</span>
                            <div className="flex items-center gap-1.5">
                                <Shield className="h-3.5 w-3.5" />
                                <span>Privacy first</span>
                            </div>
                        </div>
                    </>
                ) : (
                    /* ─── Success Screen ─── */
                    <div
                        className={`mx-auto max-w-lg rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12 transition-all duration-700 ${
                            successVisible
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-4 scale-95'
                        }`}
                    >
                        {/* Animated ring + check */}
                        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                            {/* Outer pulse */}
                            <span className="absolute inset-0 rounded-full border-2 border-brand-accent/30 animate-ping" />
                            {/* Inner ring */}
                            <span className="absolute inset-1 rounded-full border border-brand-accent/40 bg-brand-accent/10" />
                            {/* Check icon */}
                            <CheckCircle2
                                className={`relative z-10 h-10 w-10 text-brand-accent transition-all duration-700 delay-300 ${
                                    successVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                }`}
                                aria-hidden
                            />
                        </div>

                        <Text variant="h3" className="text-white text-xl md:text-2xl font-bold mb-3">
                            {role === 'Volunteer' ? "You are now registered as a volunteer" : role === 'NGO / Organisation' ? "Organization verified & registered" : "You're all set!"}
                        </Text>
                        
                        {role === 'Volunteer' ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 mt-2 mb-4 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                Available for tasks
                            </div>
                        ) : role === 'NGO / Organisation' ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 mt-2 mb-4 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-sm font-medium">
                                <Shield className="w-4 h-4" />
                                Verified Partner
                            </div>
                        ) : (
                            <>
                                <p className="text-base text-white/85 leading-relaxed">
                                    Your profile has been successfully completed.
                                </p>
                                <p className="mt-2 text-sm text-white/55">
                                    You&apos;re now ready to receive emergency support.
                                </p>
                            </>
                        )}

                        {/* Redirect timer */}
                        <div className="mt-6">
                            <Button
                                variant="ghost"
                                size="md"
                                onClick={() => navigate('/dashboard', { replace: true })}
                                className="gap-2 text-brand-accent mx-auto"
                            >
                                Go to dashboard
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <p className="mt-3 text-xs text-white/40 animate-pulse">Redirecting automatically…</p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProfileCompletionPage;

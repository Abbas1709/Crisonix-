// src/components/common/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Search, User, Menu, X, Settings, LogOut, UserCircle, MessageCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Button from './Button';
import Text from './Text';
import { useCommunityStore } from '../../features/community-chat/store/useCommunityStore';

const Navbar = ({ scrollToSection, refs }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, userData, logout } = useAuthStore();
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    const isHomePage = location.pathname === '/';

    // Premium Interaction Rules: Scroll Lock & ESC Key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };

        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on route change for seamless UX
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Click outside handler for desktop dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsExploreOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoClick = () => {
        setIsMobileMenuOpen(false);
        if (isHomePage && refs?.homeRef) {
            scrollToSection(refs.homeRef);
        } else {
            navigate('/');
        }
    };

    const handleHomeClick = () => {
        setIsMobileMenuOpen(false);
        if (isHomePage && refs?.homeRef) {
            scrollToSection(refs.homeRef);
        } else {
            navigate('/');
        }
    };

    const handleExploreClick = (sectionRef) => {
        setIsExploreOpen(false);
        setIsMobileMenuOpen(false);
        if (isHomePage && sectionRef) {
            scrollToSection(sectionRef);
        } else {
            navigate('/');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleAboutClick = () => {
        setIsMobileMenuOpen(false);
        navigate('/about');
    };

    const handleDashboardClick = () => {
        setIsMobileMenuOpen(false);
        navigate('/dashboard');
    };

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-lg border-b border-white/5 px-6 md:px-12 max-w-7xl mx-auto py-4 flex items-center justify-between font-outfit">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <Text variant="logo">
                        Crisonix
                    </Text>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-12">
                    <Button variant="ghost" size="none" onClick={handleHomeClick} className="text-[11px] uppercase tracking-widest">Home</Button>
                    <Button
                        variant="ghost"
                        size="none"
                        onClick={() => isHomePage && refs?.howItWorksRef ? scrollToSection(refs.howItWorksRef) : navigate('/')}
                        className="text-[11px] uppercase tracking-widest"
                    >
                        how it works
                    </Button>
                    <div className="relative" ref={dropdownRef}>
                        <Button
                            variant="ghost"
                            size="none"
                            onClick={() => setIsExploreOpen(!isExploreOpen)}
                            className={`flex items-center gap-1 text-[11px] uppercase tracking-widest transition-colors ${isExploreOpen ? 'text-brand-accent' : ''}`}
                        >
                            Explore <ChevronDown className={`w-3 h-3 transition-transform ${isExploreOpen ? 'rotate-180' : ''}`} />
                        </Button>

                        {isExploreOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-[#0d171d] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                                <div className="p-2 flex flex-col">
                                    <Button variant="ghost" size="none" onClick={() => handleExploreClick(refs?.peopleInNeedRef)} className="text-left px-4 py-3 text-[11px] uppercase tracking-widest hover:bg-white/5 rounded-lg">for users</Button>
                                    <Button variant="ghost" size="none" onClick={() => handleExploreClick(refs?.volunteersRef)} className="text-left px-4 py-3 text-[11px] uppercase tracking-widest hover:bg-white/5 rounded-lg">for volunteer</Button>
                                    <Button variant="ghost" size="none" onClick={() => handleExploreClick(refs?.ngoRef)} className="text-left px-4 py-3 text-[11px] uppercase tracking-widest hover:bg-white/5 rounded-lg">for NGO</Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" size="none" onClick={handleAboutClick} className="text-[11px] uppercase tracking-widest">about us</Button>
                    {isAuthenticated && (
                        <Button variant="ghost" size="none" onClick={handleDashboardClick} className="text-[11px] uppercase tracking-widest underline decoration-brand-accent decoration-2 underline-offset-8">Dashboard</Button>
                    )}
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    {/* Desktop Auth Section */}
                    {isAuthenticated ? (
                        <div className="hidden lg:flex items-center gap-6">
                            <MessageCircle 
                                className="w-4 h-4 text-white/70 cursor-pointer hover:text-brand-accent transition-colors" 
                                onClick={() => useCommunityStore.getState().setIsOpen(true)}
                            />
                            <Search className="w-4 h-4 text-white/70 cursor-pointer hover:text-brand-accent transition-colors" />
                            <div className="relative" ref={userDropdownRef}>
                                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-brand-accent/50 transition-all">
                                        <User className="w-4 h-4 text-white/70 group-hover:text-brand-accent" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/70 group-hover:text-brand-accent transition-colors">
                                        <Text as="span" variant="caption" className="font-bold text-inherit">{userData.firstName || 'User'}</Text> <ChevronDown className={`inline w-3 h-3 ml-1 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                                    </span>
                                </div>

                                {isUserDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-4 w-48 bg-[#0d171d] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button className="w-full text-left px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:bg-white/5 transition-colors">Profile</button>
                                        <button className="w-full text-left px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:bg-white/5 transition-colors">Settings</button>
                                        <div className="h-[1px] bg-white/10 my-1 mx-4"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/5 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="teal"
                            size="md"
                            onClick={() => navigate('/login')}
                            className="hidden lg:block px-6 py-2"
                        >
                            Login
                        </Button>
                    )}

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="none"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-2"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </nav>

            {/* Mobile Drawer Backdrop */}
            <div
                onClick={() => setIsMobileMenuOpen(false)}
                className={`fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Mobile Drawer Panel */}
            <div
                className={`fixed top-0 right-0 z-[999] h-screen w-[min(400px,80vw)] bg-[#0a1218] border-l border-white/10 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Text variant="logo" className="text-[24px]">Crisonix</Text>
                    </div>
                    <Button
                        variant="ghost"
                        size="none"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2"
                    >
                        <X className="w-5 h-5 text-white/50" />
                    </Button>
                </div>

                {/* Drawer Menu Items */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        size="none"
                        onClick={handleHomeClick}
                        className="w-full text-left px-4 py-3.5 rounded-xl text-[11px] uppercase tracking-widest"
                    >
                        Home
                    </Button>

                    <Button
                        variant="ghost"
                        size="none"
                        onClick={() => { isHomePage && refs?.howItWorksRef ? scrollToSection(refs.howItWorksRef) : navigate('/'); setIsMobileMenuOpen(false); }}
                        className="w-full text-left px-4 py-3.5 rounded-xl text-[11px] uppercase tracking-widest"
                    >
                        How It Works
                    </Button>

                    {/* Explore Sub-section */}
                    <div className="mt-1">
                        <Text variant="caption" className="px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Explore</Text>
                        <Button
                            variant="ghost"
                            size="none"
                            onClick={() => handleExploreClick(refs?.peopleInNeedRef)}
                            className="w-full text-left px-4 py-3 rounded-xl text-[11px] uppercase tracking-widest pl-6"
                        >
                            For Users
                        </Button>
                        <Button
                            variant="ghost"
                            size="none"
                            onClick={() => handleExploreClick(refs?.volunteersRef)}
                            className="w-full text-left px-4 py-3 rounded-xl text-[11px] uppercase tracking-widest pl-6"
                        >
                            For Volunteers
                        </Button>
                        <Button
                            variant="ghost"
                            size="none"
                            onClick={() => handleExploreClick(refs?.ngoRef)}
                            className="w-full text-left px-4 py-3 rounded-xl text-[11px] uppercase tracking-widest pl-6"
                        >
                            For NGO
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="none"
                        onClick={handleAboutClick}
                        className="w-full text-left px-4 py-3.5 rounded-xl text-[11px] uppercase tracking-widest"
                    >
                        About Us
                    </Button>

                    {isAuthenticated && (
                        <>
                            <Button
                                variant="ghost"
                                size="none"
                                onClick={handleDashboardClick}
                                className="w-full text-left px-4 py-3.5 rounded-xl text-[11px] uppercase tracking-widest text-[#008a99] hover:text-white hover:bg-[#008a99]/10"
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="ghost"
                                size="none"
                                onClick={() => { setIsMobileMenuOpen(false); useCommunityStore.getState().setIsOpen(true); }}
                                className="w-full text-left px-4 py-3.5 rounded-xl text-[11px] uppercase tracking-widest text-[#008a99] hover:text-white hover:bg-[#008a99]/10"
                            >
                                Community Chat
                            </Button>
                        </>
                    )}
                </nav>

                {/* Drawer Footer – Auth */}
                <div className="px-4 py-6 border-t border-white/10">
                    {isAuthenticated ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
                                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                                    <UserCircle className="w-5 h-5 text-white/70" />
                                </div>
                                <div>
                                    <Text variant="caption" className="font-bold uppercase tracking-widest text-white">{userData.firstName || 'User'}</Text>
                                    <Text variant="caption" className="text-[10px] text-white/40 mt-0.5">Signed in</Text>
                                </div>
                            </div>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all">
                                <Settings className="w-4 h-4" /> Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        <Button
                            variant="teal"
                            size="md"
                            fullWidth
                            onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                        >
                            Login
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;

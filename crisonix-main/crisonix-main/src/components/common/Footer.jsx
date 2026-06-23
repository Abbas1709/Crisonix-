// src/components/common/Footer.jsx
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Button from './Button';
import Text from './Text';

const Footer = ({ scrollToSection, homeRef }) => {
    const navigate = useNavigate();
    const { isAuthenticated, setRole } = useAuthStore();

    const handleRoleNavigation = (path, roleName) => {
        setRole(roleName);
        navigate(path);
    };

    return (
        <footer className="py-20 bg-[#02080a] border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16">
                <div>
                    <Text variant="logo" className="mb-6">Crisonix</Text>
                    <Text variant="caption">
                        Dedicated AI-powered disaster response platform connecting relief forces, volunteers, and those in need for a safer future.
                    </Text>
                </div>

                <div>
                    <Text variant="h4" className="mb-6">Quick links</Text>
                    <ul className="space-y-4 text-sm text-white/50">
                        <li><Button variant="ghost" size="none" onClick={() => { if (scrollToSection && homeRef) scrollToSection(homeRef); else navigate('/'); }}>Home</Button></li>
                        <li><Button variant="ghost" size="none" onClick={() => navigate('/about')}>About</Button></li>
                        {!isAuthenticated && (
                            <>
                                <li><Button variant="ghost" size="none" onClick={() => handleRoleNavigation('/login', 'Volunteer')}>Volunteer</Button></li>
                                <li><Button variant="ghost" size="none" onClick={() => handleRoleNavigation('/login', 'NGO / Organisation')}>NGO</Button></li>
                            </>
                        )}
                    </ul>
                </div>

                <div>
                    <Text variant="h4" className="mb-6">Support</Text>
                    <ul className="space-y-4 text-sm text-white/50">
                        <li><a href="#" className="hover:text-brand-accent transition-colors">Emergency Help</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/troubleshoot'); }} className="hover:text-brand-accent transition-colors">Trouble Shoot</a></li>
                        <li><a href="#" className="hover:text-brand-accent transition-colors">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <Text variant="h4" className="mb-6">Contact</Text>
                    <Text variant="caption">
                        Support: help@crisonix.com<br />
                        Emergency: +1 (555) 911-0000<br />
                        HQ: 123 Resilience Way, TX
                    </Text>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-xs">
                <Text variant="caption" className="text-white/20">&copy; 2026 Crisonix. All rights reserved.</Text>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

// src/features/about/pages/About.jsx
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import {
    Users, Shield, Target, Award, Github, Linkedin, Twitter,
    User, Map, Zap, Cpu, Activity, Lock, Globe, Database
} from 'lucide-react';
import bgImage from '../../../assets/background.png';
import { teamMembers } from '../../../data/aboutData';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-brand-accent/30 font-outfit pb-12">
            <Navbar />

            <main className="relative">
                {/* Hero Section */}
                <div
                    className="relative h-[450px] flex items-center justify-center overflow-hidden"
                    style={{
                        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bgImage}) center/cover no-repeat`
                    }}
                >
                    <div className="relative z-10 text-center px-6">
                        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest">
                            <Zap className="w-3 h-3" /> AI-Powered Crisis Response
                        </div>
                        <h2 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">Our Mission</h2>
                        <div className="h-1 w-24 bg-brand-accent mx-auto rounded-full mb-6"></div>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
                            Transforming disaster management through real-time data, predictive analytics, and intelligent coordination.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-24">
                    {/* Abstract / Platform Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                        <div>
                            <h2 className="text-[#008a99] text-sm font-bold uppercase tracking-[4px] mb-4">The Framework</h2>
                            <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">Advanced Global <br />Crisis Response System</h3>
                            <p className="text-white/60 text-lg leading-relaxed mb-8">
                                Crisonix is an integrated digital platform designed to enhance disaster preparedness, emergency response, and humanitarian coordination on a global scale.
                                Our system bridges critical gaps that often slow down emergency response efforts.
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand-accent/50 transition-colors">
                                        <Map className="w-6 h-6 text-brand-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Geospatial Mapping</h4>
                                        <p className="text-white/40 text-sm">Real-time interactive crisis mapping for immediate situational awareness.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand-accent/50 transition-colors">
                                        <Cpu className="w-6 h-6 text-brand-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Predictive AI</h4>
                                        <p className="text-white/40 text-sm">Machine learning models for risk prediction and intelligent resource routing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 p-8 flex flex-col justify-end hover:bg-brand-accent/5 transition-colors group">
                                    <Database className="w-8 h-8 text-brand-accent mb-4 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-lg">Scalable Architecture</span>
                                </div>
                                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 p-8 flex flex-col justify-end hover:bg-brand-accent/5 transition-colors group">
                                    <Lock className="w-8 h-8 text-brand-accent mb-4 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-lg">Secure & Private</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 p-8 flex flex-col justify-end hover:bg-brand-accent/5 transition-colors group">
                                    <Users className="w-8 h-8 text-brand-accent mb-4 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-lg">Connect Experts</span>
                                </div>
                                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 p-8 flex flex-col justify-end hover:bg-brand-accent/5 transition-colors group">
                                    <Globe className="w-8 h-8 text-brand-accent mb-4 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-lg">Global Reach</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Detail */}
                    <div className="bg-auth-gradient rounded-[40px] p-12 md:p-20 border border-white/5 mb-32">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">Bridging Critical Gaps</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-brand-accent">
                                        <Activity className="w-5 h-5" />
                                        <span className="font-bold tracking-widest text-xs uppercase">Intelligent Coordination</span>
                                    </div>
                                    <p className="text-white/60 leading-relaxed">
                                        Connecting donors, volunteers, NGOs, and rescue teams with affected individuals in real-time. Our automated algorithms ensure that help reaches affected regions faster and more efficiently.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-brand-accent">
                                        <Users className="w-5 h-5" />
                                        <span className="font-bold tracking-widest text-xs uppercase">Gamification & Community</span>
                                    </div>
                                    <p className="text-white/60 leading-relaxed">
                                        Incorporating gamification modules to encourage sustained community involvement and long-term participation, strengthening global resilience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="text-center mb-16 px-6">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Meet the Team</h2>
                        <p className="text-white/50 text-lg">Foundations of the Crisonix ecosystem</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-3xl bg-[#0d171d]/50 border border-white/5 hover:border-brand-accent/30 transition-all duration-300 text-center"
                            >
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/30 transition-all">
                                    <User className="w-6 h-6 text-white/40 group-hover:text-brand-accent" />
                                </div>
                                <h4 className="text-xl font-bold mb-1 group-hover:text-brand-accent transition-colors">{member.name}</h4>
                                <p className="text-brand-accent text-[10px] font-bold mb-4 uppercase tracking-[2px]">{member.role}</p>
                                <p className="text-white/40 text-xs leading-relaxed max-w-[200px] mx-auto mb-6">
                                    {member.bio}
                                </p>
                                <div className="flex justify-center gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                    <Linkedin className="w-4 h-4 hover:text-brand-accent cursor-pointer" />
                                    <Github className="w-4 h-4 hover:text-brand-accent cursor-pointer" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;

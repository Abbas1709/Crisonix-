import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, Target, Trophy, Clock, TargetIcon, User, Map as MapIcon, Share2, Award, Zap, Camera, Shield, FileText } from 'lucide-react';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import CrisonixChatbot from '../../chatbot/components/CrisonixChatbot';
import CommunityChatOverlay from '../../community-chat/components/CommunityChatOverlay';
import Button from '../../../components/common/Button';
import Text from '../../../components/common/Text';
import useAuthStore from '../../../store/authStore';
import mapMesh from '../../../assets/background.png';
import LiveLocalMap from '../components/LiveLocalMap';

const Dashboard = () => {
    const navigate = useNavigate();
    const role = useAuthStore((s) => s.role);

    return (
        <div className="min-h-screen relative text-white selection:bg-brand-accent/30 font-outfit">
            <Navbar />

            {/* Background with overlay */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${mapMesh})` }}
            />

            <main className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 py-10 space-y-8 pb-32">
                {role === 'Volunteer' ? (
                    <>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Volunteer Profile Overview */}
                            <div className="w-full md:w-1/3 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                                <Text variant="h3" className="font-bold mb-4 flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-brand-accent" />
                                    Volunteer Profile
                                </Text>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                                        <span className="text-white/70 font-medium">Availability</span>
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Available
                                        </span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/10 bg-black/40">
                                        <span className="text-white/70 block mb-3 font-medium">My Skills</span>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1.5 rounded-lg bg-brand-accent/20 text-brand-accent text-xs font-semibold border border-brand-accent/30 tracking-wide">FIRST AID</span>
                                            <span className="px-3 py-1.5 rounded-lg bg-brand-accent/20 text-brand-accent text-xs font-semibold border border-brand-accent/30 tracking-wide">RESCUE OPS</span>
                                            <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs font-semibold border border-white/10 tracking-wide">LOGISTICS</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                                        <span className="text-white/70 font-medium">Experience Points</span>
                                        <div className="text-2xl font-bold flex items-center gap-2 text-brand-accent">
                                            <Zap className="w-5 h-5 text-yellow-400" />
                                            1,240 <span className="text-xs text-white/50 font-normal">XP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Assigned Tasks & Crisis Map */}
                            <div className="w-full md:w-2/3 space-y-6">
                                {/* Assigned Tasks */}
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                                    <Text variant="h3" className="font-bold mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-6 h-6 text-orange-400" />
                                        Active Missions
                                    </Text>
                                    <div className="space-y-4">
                                        <div className="p-5 rounded-xl border border-l-4 border-l-brand-accent border-white/10 bg-black/40 cursor-pointer hover:bg-black/60 hover:border-r-brand-accent/20 transition-all group">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-white text-lg group-hover:text-brand-accent transition-colors">Medical Assistance needed at Sector 4</h4>
                                                    <p className="text-sm text-white/60 mt-2 flex items-center gap-3">
                                                        <span className="flex items-center gap-1"><MapIcon className="w-3.5 h-3.5"/> 2.4 km away</span>
                                                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">Urgent</span>
                                                    </p>
                                                </div>
                                                <Button size="sm" variant="primary" className="shrink-0 px-6">Accept</Button>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-xl border border-l-4 border-l-orange-500 border-white/10 bg-black/40 cursor-pointer hover:bg-black/60 transition-all group">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-white text-lg group-hover:text-orange-400 transition-colors">Logistics Support - Supply run</h4>
                                                    <p className="text-sm text-white/60 mt-2 flex items-center gap-3">
                                                        <span className="flex items-center gap-1"><MapIcon className="w-3.5 h-3.5"/> 5.1 km away</span>
                                                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">Normal</span>
                                                    </p>
                                                </div>
                                                <Button size="sm" className="bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white shrink-0 px-6 border border-orange-500/30">Accept</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Crisis Map */}
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl relative">
                                    <Text variant="h3" className="font-bold mb-4 flex items-center gap-2">
                                        <MapIcon className="w-6 h-6 text-brand-accent" />
                                        Regional Crisis Map
                                    </Text>
                                    <div className="h-[200px] md:h-[280px] rounded-xl border border-white/10 bg-black/60 relative overflow-hidden flex items-center justify-center group cursor-pointer hover:border-brand-accent/30 transition-all" onClick={() => navigate('/map')}>
                                        {/* Mock map UI */}
                                        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: 'url(https://upload.wikimedia.org/wikipedia/commons/4/4b/World_map_blank_gmt.png) center/cover no-repeat', filter: 'invert(1)' }} />
                                        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
                                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-brand-accent rounded-full animate-ping opacity-75"></div>
                                        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                                        <div className="relative z-10 px-8 py-3 rounded-full bg-black/80 border border-white/10 text-white/80 font-medium backdrop-blur-md group-hover:bg-brand-accent group-hover:text-black group-hover:border-brand-accent transition-all flex items-center gap-2" onClick={() => navigate('/map')}>
                                            <MapIcon className="w-4 h-4" /> Expand Interactive Map
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Status Updates Header */}
                        <div className="flex items-center justify-between p-6 rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">Welcome back, User</h1>
                                <p className="text-white/60">Your neighborhood status is currently <span className="text-green-400 font-semibold">Safe</span>.</p>
                            </div>
                            <Button variant="primary" onClick={() => navigate('/troubleshoot')} className="gap-2 shrink-0">
                                <AlertCircle className="w-5 h-5"/> Request Emergency Help
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                            {/* Left Column */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Profile Summary */}
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <Text variant="h3" className="font-bold flex items-center gap-2">
                                            <User className="w-6 h-6 text-brand-accent" /> Profile Status
                                        </Text>
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-brand-accent bg-brand-accent/10 px-2 py-1 rounded">100% COMPLETE</span>
                                    </div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-brand-accent/20 border-2 border-brand-accent flex items-center justify-center relative shadow-[0_0_15px_rgba(0,230,255,0.3)]">
                                            <User className="w-8 h-8 text-brand-accent" />
                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Verified User</h4>
                                            <p className="text-sm text-white/60">ID Verified ✓</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-center gap-2 border-white/20 hover:bg-white/5">
                                            <FileText className="w-4 h-4" /> View Profile Details
                                        </Button>
                                    </div>
                                </div>

                                {/* Emergency Contacts */}
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                                    <Text variant="h3" className="font-bold mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-6 h-6 text-brand-accent" /> Quick Contacts
                                    </Text>
                                    <div className="space-y-3">
                                        {['Emergency Services (911)', 'Local Clinic', 'Family Member 1'].map((contact, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-brand-accent/30 transition-colors cursor-pointer">
                                                <span className="font-medium text-sm text-white/90">{contact}</span>
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent/20 hover:text-brand-accent transition-colors">
                                                    <PhoneIcon className="w-4 h-4" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Evacuation info */}
                                <div className="rounded-2xl border-2 border-brand-accent/30 bg-brand-accent/5 p-6 shadow-[0_0_20px_rgba(0,230,255,0.1)] backdrop-blur-xl">
                                    <Text variant="h3" className="font-bold mb-3 flex items-center gap-2 text-brand-accent">
                                        <TargetIcon className="w-6 h-6" /> Evacuation Route
                                    </Text>
                                    <p className="text-sm text-white/80 mb-4 leading-relaxed">
                                        Your designated safe zone is Shelter 4-B. Ensure your evacuation kit is ready.
                                    </p>
                                    <Button variant="primary" className="w-full text-sm">Download Route Offline</Button>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Local Updates Tracker */}
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl min-h-[200px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <Text variant="h3" className="font-bold flex items-center gap-2">
                                            <Share2 className="w-6 h-6 text-brand-accent" /> Community Updates
                                        </Text>
                                        <span className="text-sm text-brand-accent hover:underline cursor-pointer">View All</span>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { time: '10 mins ago', title: 'Power Restored', desc: 'Sector 7 power grid has been fully restored.', type: 'success' },
                                            { time: '2 hours ago', title: 'Road Blockage', desc: 'Highway 101 north bound is blocked due to debris.', type: 'warning' },
                                            { time: '5 hours ago', title: 'Supply Drop', desc: 'Fresh water supplies available at Central Park distribution center.', type: 'info' }
                                        ].map((update, idx) => (
                                            <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 transition-colors">
                                                <div className={`w-1.5 rounded-full shrink-0 ${update.type === 'success' ? 'bg-green-500' : update.type === 'warning' ? 'bg-orange-500' : 'bg-brand-accent'}`}></div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-white max-w-[80%]">{update.title}</h4>
                                                        <span className="text-xs text-white/50 whitespace-nowrap"><Clock className="w-3 h-3 inline mr-1"/>{update.time}</span>
                                                    </div>
                                                    <p className="text-sm text-white/70">{update.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Local Map */}
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl relative">
                                    <div className="flex items-center justify-between mb-6">
                                        <Text variant="h3" className="font-bold flex items-center gap-2">
                                            <MapIcon className="w-6 h-6 text-brand-accent" /> Live Local Map
                                        </Text>
                                    </div>
                                    <LiveLocalMap height={350} preview={true} onExpandClick={() => navigate('/map')} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
            <CrisonixChatbot />
            <CommunityChatOverlay />
        </div>
    );
};

function PhoneIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    )
}

export default Dashboard;

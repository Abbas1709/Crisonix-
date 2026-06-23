import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Send, User, Mail, MessageSquare } from 'lucide-react'
import Button from '../../../components/common/Button'
import Text from '../../../components/common/Text'
import bgImage from '../../../assets/background.png'

const Troubleshoot = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        // simulate API call
        await new Promise(r => setTimeout(r, 1000))
        setSubmitting(false)
        console.log('Form submitted:', formData)
        navigate('/troubleshoot-notification')
    }

    const fieldClass = 'w-full min-h-[52px] px-12 py-3 mt-1 rounded-xl border border-white/15 bg-black/40 text-white text-base outline-none placeholder:text-white/50 focus:border-brand-accent/50 focus:shadow-glow focus:bg-black/60 transition-all duration-300';
    const labelClass = 'flex items-center gap-2 text-sm font-medium text-white/80 pt-2';

    return (
        <div className="min-h-screen font-outfit relative">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${bgImage})`
                }}
            />
            
            <div className="min-h-screen flex flex-col md:flex-row relative z-10 w-full animate-in fade-in duration-500">
                {/* LEFT SIDE - Hidden on mobile, visible on desktop */}
                <div className="hidden md:flex flex-1 text-white p-15 flex-col items-center justify-start pt-24 gap-36 px-10">
                    <Text
                        variant="logo"
                        className="text-[80px] text-center cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:text-[#00e6ff] hover:shadow-text-glow leading-tight"
                        onClick={() => navigate('/')}
                    >
                        Crisonix
                    </Text>
                    <Text variant="h1" className="text-[67px] font-light leading-[1.2] pl-5 w-full text-center">
                        AI-Powered <br />
                        <span className="text-[#00e6ff] font-medium">Disaster crisis</span> <br />
                        <span className="text-[#00e6ff] font-medium">Response</span>
                    </Text>
                </div>

                {/* RIGHT SIDE / MAIN CONTENT */}
                <div className="flex-1 flex justify-center items-center p-4">
                    <div className="w-full max-w-[500px] p-8 md:p-10 rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl text-left text-white transition-all duration-300 group">
                        {/* Mobile Logo */}
                        <div className="md:hidden text-center text-white mb-8 cursor-pointer" onClick={() => navigate('/')}>
                            <h1 className="font-jersey text-[50px] leading-tight text-brand-accent">Crisonix</h1>
                        </div>

                        {/* Title - Visible on all screens */}
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                               <AlertTriangle className="w-5 h-5 text-orange-400" />
                           </div>
                           <Text variant="h3" className="font-bold text-2xl">Help Support</Text>
                        </div>
                        <Text variant="caption" className="opacity-80 mb-8 font-medium block text-sm">Report your issue, send feedback, or request assistance. We are here to help.</Text>

                        {/* Troubleshoot Form */}
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="relative">
                                <label className={labelClass}>Your Name <span className="text-red-400">*</span></label>
                                <div className="absolute top-[38px] left-4 opacity-50"><User className="w-5 h-5" /></div>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    className={fieldClass}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Email Address <span className="text-red-400">*</span></label>
                                <div className="absolute top-[38px] left-4 opacity-50"><Mail className="w-5 h-5" /></div>
                                <input
                                    type="email"
                                    placeholder="johndoe@example.com"
                                    required
                                    className={fieldClass}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <label className={labelClass}>How can we help? <span className="text-red-400">*</span></label>
                                <div className="absolute top-[38px] left-4 opacity-50"><MessageSquare className="w-5 h-5" /></div>
                                <textarea
                                    placeholder="Describe your issue or request in detail..."
                                    rows="5"
                                    required
                                    className={`${fieldClass} resize-y min-h-[120px] pt-4 leading-relaxed`}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                className="mt-4 shadow-[0_0_20px_rgba(0,230,255,0.2)] hover:shadow-[0_0_30px_rgba(0,230,255,0.4)] tracking-wider justify-center gap-2"
                                disabled={submitting}
                            >
                                {submitting ? <span className="animate-pulse">SENDING...</span> : <>SUBMIT REQUEST <Send className="w-4 h-4 ml-1" /></>}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Troubleshoot

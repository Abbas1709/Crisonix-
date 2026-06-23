import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Upload, User,
    Calendar, Target, Truck, ShieldAlert, BadgeCheck, Loader2, MapPinned, Stethoscope, Phone, Mail
} from 'lucide-react';
import Button from '../../../components/common/Button';
import bgImage from '../../../assets/background.png';

const SKILLS = [
    { id: 'first_aid', label: 'First Aid', icon: <Target className="w-4 h-4" /> },
    { id: 'rescue', label: 'Rescue Operations', icon: <Target className="w-4 h-4" /> },
    { id: 'medical', label: 'Medical Assistance', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'logistics', label: 'Logistics', icon: <Truck className="w-4 h-4" /> },
    { id: 'driving', label: 'Driving', icon: <Truck className="w-4 h-4" /> }
];

const fieldClass = 'w-full min-h-[52px] px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-base outline-none placeholder:text-white/50 focus:border-brand-accent/50 focus:shadow-glow focus:bg-black/60 transition-all duration-300';
const labelClass = 'mb-2 flex items-center gap-2 text-sm font-medium text-white/80';
const sectionClass = "bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl backdrop-blur-xl mb-6 hover:bg-white/10 hover:border-white/20 transition-all";
const sectionTitle = "text-xl font-bold mb-4 text-white flex items-center gap-2 border-b border-white/10 pb-3";

const VolunteerRegistration = ({ initialFullName = '', initialEmail = '', onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: initialFullName || '',
        phone: '',
        email: initialEmail || '',
        address: '',
        lat: '',
        lng: '',
        availableNow: false,
        timeSlots: [],
        skills: [],
        otherSkill: '',
        experienceMode: '',
        hasVehicle: false,
        equipment: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
    });

    const [errors, setErrors] = useState({});
    const [geoLoading, setGeoLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleSkill = (skillId) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skillId)
                ? prev.skills.filter(s => s !== skillId)
                : [...prev.skills, skillId]
        }));
    };

    const toggleTimeSlot = (slot) => {
        setFormData(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.includes(slot)
                ? prev.timeSlots.filter(s => s !== slot)
                : [...prev.timeSlots, slot]
        }));
    };

    const handleAutoDetectLocation = () => {
        if (!navigator.geolocation) {
            setErrors(p => ({...p, address: 'Geolocation is not supported on this device.'}));
            return;
        }
        setGeoLoading(true);
        
        // First attempt with high accuracy
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({
                    ...prev,
                    lat: pos.coords.latitude.toFixed(6),
                    lng: pos.coords.longitude.toFixed(6),
                    address: "Auto-detected Location"
                }));
                if (errors.address) setErrors(p => ({ ...p, address: '' }));
                setGeoLoading(false);
            },
            (err) => {
                // If high accuracy fails, try with lower accuracy
                if (err.code === err.TIMEOUT) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            setFormData(prev => ({
                                ...prev,
                                lat: pos.coords.latitude.toFixed(6),
                                lng: pos.coords.longitude.toFixed(6),
                                address: "Auto-detected Location"
                            }));
                            if (errors.address) setErrors(p => ({ ...p, address: '' }));
                            setGeoLoading(false);
                        },
                        (fallbackErr) => {
                            setGeoLoading(false);
                            let errorMsg = 'Failed to access location.';
                            if (fallbackErr.code === fallbackErr.PERMISSION_DENIED) {
                                errorMsg = 'Location permission denied. Please enable location access in your browser settings.';
                            } else if (fallbackErr.code === fallbackErr.POSITION_UNAVAILABLE) {
                                errorMsg = 'Location information unavailable. Please try entering your address manually.';
                            } else if (fallbackErr.code === fallbackErr.TIMEOUT) {
                                errorMsg = 'Location request timed out. Please check your internet connection.';
                            }
                            setErrors(p => ({...p, address: errorMsg}));
                        },
                        { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
                    );
                } else {
                    setGeoLoading(false);
                    let errorMsg = 'Failed to access location.';
                    if (err.code === err.PERMISSION_DENIED) {
                        errorMsg = 'Location permission denied. Please enable location access in your browser settings.';
                    } else if (err.code === err.POSITION_UNAVAILABLE) {
                        errorMsg = 'Location information unavailable. Please try entering your address manually.';
                    }
                    setErrors(p => ({...p, address: errorMsg}));
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency Contact Name is required';
        if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency Contact Phone is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return; // Scroll to top visually?
        }
        
        setSubmitting(true);
        // Simulate API
        await new Promise(r => setTimeout(r, 1500));
        setSubmitting(false);

        if (onSuccess) {
            onSuccess(formData);
        } else {
            navigate('/dashboard', { replace: true });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full text-left font-outfit animate-in fade-in duration-500 max-w-[900px] mx-auto">
            {/* Basic Information */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><User className="w-5 h-5 text-brand-accent" /> Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}><User className="w-4 h-4 text-brand-accent" /> Full Name <span className="text-red-400">*</span></label>
                        <input name="fullName" type="text" placeholder="Your Full Name" value={formData.fullName} onChange={handleChange} className={`${fieldClass} ${errors.fullName ? 'border-red-500/60' : ''}`} />
                        {errors.fullName && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className={labelClass}><Mail className="w-4 h-4 text-brand-accent" /> Email Address</label>
                        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={`${fieldClass} opacity-80 cursor-not-allowed`} readOnly />
                        <p className="mt-1.5 text-xs text-white/50">Used for registration login.</p>
                    </div>
                    <div className="md:col-span-2 text-white/50 h-[1px] bg-white/5 mt-2"></div>
                    <div>
                        <label className={labelClass}><Phone className="w-4 h-4 text-brand-accent" /> Phone Number <span className="text-red-400">*</span></label>
                        <input name="phone" type="tel" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} className={`${fieldClass} ${errors.phone ? 'border-red-500/60' : ''}`} />
                        {errors.phone && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.phone}</p>}
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><MapPin className="w-5 h-5 text-brand-accent" /> Location details</h3>
                <div className="flex flex-col gap-6">
                    <div>
                        <label className={labelClass}><MapPinned className="w-4 h-4 text-brand-accent" /> Primary Address <span className="text-red-400">*</span></label>
                        <div className="flex flex-col md:flex-row gap-4 items-stretch w-full mb-1">
                            <textarea name="address" rows="2" placeholder="Street, area, city, postal code" value={formData.address} onChange={handleChange} className={`${fieldClass} flex-1 resize-y min-h-[60px] ${errors.address ? 'border-red-500/60' : ''}`} />
                            <Button type="button" onClick={handleAutoDetectLocation} disabled={geoLoading} variant="outline" className="w-full md:w-[220px] shrink-0 border-brand-accent/30 hover:bg-brand-accent/10 h-auto">
                                {geoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5 mr-2 inline" />} Auto-detect
                            </Button>
                        </div>
                        {errors.address && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.address}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/50">Latitude (Auto-filled)</label>
                            <input name="lat" placeholder="-" value={formData.lat} readOnly className={`${fieldClass} bg-black/25  font-mono text-sm border-none cursor-default`} />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/50">Longitude (Auto-filled)</label>
                            <input name="lng" placeholder="-" value={formData.lng} readOnly className={`${fieldClass} bg-black/25 font-mono text-sm border-none cursor-default`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><Calendar className="w-5 h-5 text-brand-accent" /> Availability</h3>
                
                <label className="flex items-center gap-4 cursor-pointer p-5 rounded-xl border border-brand-accent/30 bg-brand-accent/5 hover:bg-brand-accent/10 transition group">
                    <input type="checkbox" name="availableNow" checked={formData.availableNow} onChange={handleChange} className="w-6 h-6 accent-brand-accent" />
                    <div>
                        <span className="font-semibold text-white/90 text-lg group-hover:text-brand-accent transition">I am Available Now for immediate deployment</span>
                        <p className="text-sm text-white/60 mt-1">Check this if you are actively looking to be deployed immediately for tasks.</p>
                    </div>
                    {formData.availableNow && <span className="ml-auto inline-flex items-center gap-2 text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> READY</span>}
                </label>

                <div className="mt-6">
                    <label className={labelClass}>Preferred Time Slots (If not immediate)</label>
                    <div className="flex flex-wrap gap-4 mt-3">
                        {['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Night (6PM-12AM)', 'Overnight (12AM-6AM)'].map(slot => {
                            const active = formData.timeSlots.includes(slot);
                            return (
                                <div key={slot} onClick={() => toggleTimeSlot(slot)} className={`cursor-pointer px-6 py-3 rounded-xl border-2 transition-all font-medium ${active ? 'border-brand-accent bg-brand-accent/20 text-brand-accent shadow-[0_0_12px_rgba(0,230,255,0.2)]' : 'border-white/10 bg-black/40 text-white/70 hover:bg-black/60 hover:border-white/30'}`}>
                                    {slot.split(' (')[0]} <span className="text-xs opacity-60 ml-2 font-normal whitespace-nowrap">({slot.split('(')[1]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Skills & Experience */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><BadgeCheck className="w-5 h-5 text-brand-accent" /> Skills & Experience</h3>
                
                <label className={labelClass}>Select your relevant skills (Multi-select)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-3">
                    {SKILLS.map(skill => {
                        const active = formData.skills.includes(skill.id);
                        return (
                            <div key={skill.id} onClick={() => toggleSkill(skill.id)} className={`cursor-pointer flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${active ? 'border-brand-accent bg-brand-accent/20 text-brand-accent shadow-[0_0_12px_rgba(0,230,255,0.2)]' : 'border-white/10 bg-black/40 text-white/70 hover:bg-black/60 hover:border-white/30'}`}>
                                {skill.icon} <span className="font-semibold">{skill.label}</span>
                            </div>
                        );
                    })}
                </div>
                
                <label className={labelClass}>Other Skills (Optional)</label>
                <input name="otherSkill" placeholder="E.g. Certified EMT, Sign Language, etc." value={formData.otherSkill} onChange={handleChange} className={fieldClass} />

                <div className="mt-8">
                    <label className={labelClass}>Crisis Volunteering Experience Level</label>
                    <div className="flex flex-wrap gap-4 mt-3">
                        {['Beginner', 'Intermediate', 'Experienced'].map(lvl => {
                            const active = formData.experienceMode === lvl;
                            return (
                                <div key={lvl} onClick={() => setFormData(p => ({...p, experienceMode: lvl}))} className={`cursor-pointer px-8 py-3 rounded-xl border-2 transition-all font-medium ${active ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.2)]' : 'border-white/10 bg-black/40 text-white/70 hover:bg-black/60 hover:border-white/30'}`}>
                                    {lvl}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Resources */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><Truck className="w-5 h-5 text-brand-accent" /> Resources & Logistics</h3>
                
                <label className="flex items-center gap-4 cursor-pointer p-5 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 hover:border-white/20 transition mb-6 group">
                    <input type="checkbox" name="hasVehicle" checked={formData.hasVehicle} onChange={handleChange} className="w-6 h-6 accent-brand-accent" />
                    <div>
                        <span className="font-semibold text-white/90 group-hover:text-brand-accent transition">I have a vehicle available for use</span>
                        <p className="text-sm text-white/60 mt-1">Useful for logistics, supply dropping or rescuing.</p>
                    </div>
                </label>

                <label className={labelClass}>Emergency Equipment (Optional)</label>
                <textarea rows="2" name="equipment" placeholder="List any emergency equipment you own (e.g., Heavy Duty Flashlights, Generator, Ham Radio)" value={formData.equipment} onChange={handleChange} className={`${fieldClass} min-h-[80px] resize-y`} />
            </div>

            {/* ID Verification */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><Upload className="w-5 h-5 text-brand-accent" /> ID Verification (Optional but Recommended)</h3>
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-white/50 bg-black/40 hover:bg-black/60 hover:border-brand-accent/50 cursor-pointer transition-all group shadow-inner">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-all">
                        <Upload className="w-8 h-8 text-white/40 group-hover:text-brand-accent" />
                    </div>
                    <p className="font-semibold text-white/80 group-hover:text-brand-accent/90">Click to upload or drag and drop</p>
                    <p className="text-sm mt-2 text-white/40">Official Government ID, Passport, or Certifications (SVG, PNG, JPG, PDF max 5MB)</p>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><ShieldAlert className="w-5 h-5 text-orange-400" /> Emergency Contact</h3>
                <p className="text-sm text-white/60 mb-5 border-l-2 border-orange-500/50 pl-3 py-1">In case you are deployed, provide us with a reliable contact we can reach out to in case of untoward incidents.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Contact Name <span className="text-red-400">*</span></label>
                        <input name="emergencyContactName" placeholder="Full Name" value={formData.emergencyContactName} onChange={handleChange} className={`${fieldClass} ${errors.emergencyContactName ? 'border-red-500/60' : ''}`} />
                        {errors.emergencyContactName && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.emergencyContactName}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Contact Phone Number <span className="text-red-400">*</span></label>
                        <input name="emergencyContactPhone" type="tel" placeholder="Phone Number" value={formData.emergencyContactPhone} onChange={handleChange} className={`${fieldClass} ${errors.emergencyContactPhone ? 'border-red-500/60' : ''}`} />
                        {errors.emergencyContactPhone && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.emergencyContactPhone}</p>}
                    </div>
                </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-6 flex flex-col md:flex-row justify-end items-center gap-4">
                {Object.keys(errors).length > 0 && <p className="text-red-400 text-sm font-semibold mr-auto flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Please fix the highlighted errors above.</p>}
                
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="w-full md:w-auto px-8">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting} size="lg" className="w-full md:w-[250px] shadow-[0_0_20px_rgba(0,230,255,0.4)] hover:shadow-[0_0_30px_rgba(0,230,255,0.6)]">
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin mr-2 inline" /> Processing...</> : 'Complete Registration'}
                </Button>
            </div>
        </form>
    );
};

export default VolunteerRegistration;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Upload, Building2, Phone, Users, ShieldCheck, MapIcon, Loader2, Globe, Heart, CheckCircle, Tag, AlignLeft, ShieldAlert
} from 'lucide-react';
import Button from '../../../components/common/Button';

const RESOURCES = [
    { id: 'food_supply', label: 'Food Supply', icon: <Heart className="w-4 h-4" /> },
    { id: 'medical_aid', label: 'Medical Aid', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'shelter', label: 'Shelter', icon: <Building2 className="w-4 h-4" /> },
    { id: 'rescue_teams', label: 'Rescue Teams', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'transport', label: 'Transport', icon: <MapPin className="w-4 h-4" /> },
    { id: 'other', label: 'Other', icon: <Tag className="w-4 h-4" /> }
];

const ORG_TYPES = ['Non-Governmental Organization (NGO)', 'Government Agency', 'Private Corporation', 'Community Initiative', 'Other'];

const fieldClass = 'w-full min-h-[52px] px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-base outline-none placeholder:text-white/50 focus:border-brand-accent/50 focus:shadow-glow focus:bg-black/60 transition-all duration-300';
const labelClass = 'mb-2 flex items-center gap-2 text-sm font-medium text-white/80';
const sectionClass = "bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl backdrop-blur-xl mb-6 hover:bg-white/10 hover:border-white/20 transition-all";
const sectionTitle = "text-xl font-bold mb-4 text-white flex items-center gap-2 border-b border-white/10 pb-3";

const NGORegistration = ({ initialEmail = '', onSuccess }) => {
    const [formData, setFormData] = useState({
        orgName: '',
        orgType: '',
        registrationId: '',
        email: initialEmail || '',
        phone: '',
        website: '',
        address: '',
        cityState: '',
        lat: '',
        lng: '',
        resources: [],
        volunteerCount: '',
        maxCapacity: '',
        serviceAreas: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [geoLoading, setGeoLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const toggleResource = (resId) => {
        setFormData(prev => ({
            ...prev,
            resources: prev.resources.includes(resId)
                ? prev.resources.filter(s => s !== resId)
                : [...prev.resources, resId]
        }));
    };

    const handleAutoDetectLocation = () => {
        if (!navigator.geolocation) {
            setErrors(p => ({...p, locationError: 'Geolocation is not supported on this device.'}));
            return;
        }
        setGeoLoading(true);
        
        // First attempt with high accuracy
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({
                    ...prev,
                    lat: pos.coords.latitude.toFixed(6),
                    lng: pos.coords.longitude.toFixed(6)
                }));
                if (errors.locationError) setErrors(p => ({ ...p, locationError: '' }));
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
                                lng: pos.coords.longitude.toFixed(6)
                            }));
                            if (errors.locationError) setErrors(p => ({ ...p, locationError: '' }));
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
                            setErrors(p => ({...p, locationError: errorMsg}));
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
                    setErrors(p => ({...p, locationError: errorMsg}));
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.orgName.trim()) newErrors.orgName = 'Organization Name is required';
        if (!formData.orgType.trim()) newErrors.orgType = 'Organization Type is required';
        if (!formData.email.trim()) newErrors.email = 'Official Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setSubmitting(true);
        // Simulate API delay
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
            
            {/* Top Verify Banner */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-brand-accent/40 bg-brand-accent/10 mb-8 shadow-[0_0_15px_rgba(0,230,255,0.15)]">
                <ShieldCheck className="w-6 h-6 text-brand-accent shrink-0" />
                <div>
                    <h4 className="font-bold text-white tracking-wide">Verified Organization Registration</h4>
                    <p className="text-sm text-white/70">Your data is secured with 256-bit encryption. Registering your organization gives you access to full deployment tools.</p>
                </div>
            </div>

            {/* 1. Organization Details */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><Building2 className="w-5 h-5 text-brand-accent" /> Organization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Organization Name <span className="text-red-400">*</span></label>
                        <input name="orgName" placeholder="E.g., Red Cross, Direct Relief" value={formData.orgName} onChange={handleChange} className={`${fieldClass} ${errors.orgName ? 'border-red-500/60' : ''}`} />
                        {errors.orgName && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.orgName}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Organization Type <span className="text-red-400">*</span></label>
                        <div className="relative">
                            <select name="orgType" value={formData.orgType} onChange={handleChange} className={`${fieldClass} appearance-none pr-10 cursor-pointer ${errors.orgType ? 'border-red-500/60' : ''}`}>
                                <option value="" disabled className="bg-[#0a1218]">Select Type...</option>
                                {ORG_TYPES.map(type => <option key={type} value={type} className="bg-[#0a1218]">{type}</option>)}
                            </select>
                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs">▼</span>
                        </div>
                        {errors.orgType && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.orgType}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Registration ID / Charity Number (Optional)</label>
                        <input name="registrationId" placeholder="Official business or charity registration code" value={formData.registrationId} onChange={handleChange} className={fieldClass} />
                    </div>
                </div>
            </div>

            {/* 2. Contact Information */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><Phone className="w-5 h-5 text-brand-accent" /> Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Official Email <span className="text-red-400">*</span></label>
                        <input name="email" type="email" placeholder="contact@organization.org" value={formData.email} onChange={handleChange} className={`${fieldClass} ${errors.email ? 'border-red-500/60' : ''}`} />
                        {errors.email && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.email}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Phone Number <span className="text-red-400">*</span></label>
                        <input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} className={`${fieldClass} ${errors.phone ? 'border-red-500/60' : ''}`} />
                        {errors.phone && <p className="mt-1.5 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}><Globe className="w-4 h-4 text-brand-accent/50" /> Website (Optional)</label>
                        <input name="website" type="url" placeholder="https://www.yourorganization.org" value={formData.website} onChange={handleChange} className={fieldClass} />
                    </div>
                </div>
            </div>

            {/* 3. Location */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><MapPin className="w-5 h-5 text-brand-accent" /> Headquarters / Base Location</h3>
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Full Address</label>
                            <input name="address" placeholder="HQ Street Address" value={formData.address} onChange={handleChange} className={fieldClass} />
                        </div>
                        <div>
                            <label className={labelClass}>City / State</label>
                            <input name="cityState" placeholder="E.g., New York, NY" value={formData.cityState} onChange={handleChange} className={fieldClass} />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <label className={labelClass}>Map Coordinates</label>
                            <Button type="button" onClick={handleAutoDetectLocation} disabled={geoLoading} variant="outline" className="w-full border-brand-accent/30 hover:bg-brand-accent/10 h-[52px]">
                                {geoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5 mr-2" />} {formData.lat ? 'Update Auto-detect' : 'Auto-detect Location'}
                            </Button>
                            {errors.locationError && <p className="mt-1 text-xs text-red-500 bg-red-500/10 inline-block px-2 py-0.5 rounded w-fit">{errors.locationError}</p>}
                        </div>
                    </div>
                    {/* Dummy Map Visualizer */}
                    <div className="w-full h-[150px] rounded-xl border border-white/10 bg-black/60 relative overflow-hidden flex items-center justify-center opacity-80 group cursor-pointer hover:border-brand-accent/40 hover:opacity-100 transition-all mt-2">
                        <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ background: 'url(https://upload.wikimedia.org/wikipedia/commons/4/4b/World_map_blank_gmt.png) center/cover no-repeat', filter: 'invert(1)' }} />
                        <div className="relative z-10 px-4 py-2 rounded-full bg-black/80 border border-white/10 text-brand-accent font-medium backdrop-blur-md flex items-center gap-2 group-hover:scale-105 transition-transform">
                            <MapIcon className="w-4 h-4" /> {formData.lat && formData.lng ? `Lat: ${formData.lat}, Lng: ${formData.lng}` : 'Open Interactive Map'}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Resources Available */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><Tag className="w-5 h-5 text-brand-accent" /> Resources & Capabilities</h3>
                <label className={labelClass}>Select the resources your organization can deploy (Multi-select)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                    {RESOURCES.map(res => {
                        const active = formData.resources.includes(res.id);
                        return (
                            <div key={res.id} onClick={() => toggleResource(res.id)} className={`cursor-pointer flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${active ? 'border-brand-accent bg-brand-accent/20 text-brand-accent shadow-[0_0_12px_rgba(0,230,255,0.2)]' : 'border-white/10 bg-black/40 text-white/70 hover:bg-black/60 hover:border-white/30'}`}>
                                {res.icon} <span className="font-semibold">{res.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 5. Capacity Details */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><Users className="w-5 h-5 text-brand-accent" /> Capacity Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Deployable Volunteers / Staff</label>
                        <input name="volunteerCount" type="number" placeholder="Approx. number of personnel" value={formData.volunteerCount} onChange={handleChange} className={fieldClass} min="0" />
                    </div>
                    <div>
                        <label className={labelClass}>Maximum People Supported</label>
                        <input name="maxCapacity" type="number" placeholder="Daily capacity (e.g., 500)" value={formData.maxCapacity} onChange={handleChange} className={fieldClass} min="0" />
                    </div>
                </div>
            </div>

            {/* 6. Service Areas & 7. Description */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><AlignLeft className="w-5 h-5 text-brand-accent" /> Service & Overview</h3>
                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Designated Service Areas</label>
                        <input name="serviceAreas" placeholder="E.g., North District, Coastal Region, National" value={formData.serviceAreas} onChange={handleChange} className={fieldClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Organization Description</label>
                        <textarea name="description" rows="4" placeholder="Briefly describe your organization's mission and regular crisis operations..." value={formData.description} onChange={handleChange} className={`${fieldClass} resize-y min-h-[100px]`} />
                    </div>
                </div>
            </div>

            {/* 8. Document Upload */}
            <div className={sectionClass}>
                <h3 className={sectionTitle}><Upload className="w-5 h-5 text-brand-accent" /> Official Documentation</h3>
                <label className={labelClass}>Provide verification proof (Operating License, Certifications)</label>
                <div className="mt-3 border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-white/50 bg-black/40 hover:bg-black/60 hover:border-brand-accent/50 cursor-pointer transition-all group shadow-inner">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-all">
                        <Upload className="w-8 h-8 text-white/40 group-hover:text-brand-accent" />
                    </div>
                    <p className="font-semibold text-white/80 group-hover:text-brand-accent/90">Click to upload or drag and drop</p>
                    <p className="text-sm mt-2 text-white/40">Only official PDF / JPG / PNG files (max 10MB)</p>
                </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-6 flex flex-col md:flex-row justify-end items-center gap-4">
                {Object.keys(errors).length > 0 && <p className="text-red-400 text-sm font-semibold mr-auto flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Please fix the highlighted errors above.</p>}
                
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="w-full md:w-auto px-8">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting} size="lg" className="w-full md:w-[280px] shadow-[0_0_20px_rgba(0,230,255,0.4)] hover:shadow-[0_0_30px_rgba(0,230,255,0.6)]">
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin mr-2 inline" /> Registering...</> : 'Submit Organization Profile'}
                </Button>
            </div>
        </form>
    );
};

export default NGORegistration;

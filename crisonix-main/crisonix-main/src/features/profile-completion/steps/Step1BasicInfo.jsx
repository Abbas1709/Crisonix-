import { Mail, Phone, User, Shield } from 'lucide-react';
import { COUNTRY_DIAL_CODES } from '../constants/countryDialCodes';

const field =
    'w-full min-h-[52px] px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-base outline-none placeholder:text-white/50 focus:border-brand-accent/50 focus:shadow-glow focus:bg-black/60 transition-all duration-300';

const Step1BasicInfo = ({ formData, setFormData, errors, nextStep, prevStep }) => {
    const form = formData;
    const setForm = setFormData;
    return (
        <div className="space-y-6">
            {/* Step header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20">
                    <User className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">Basic Information</h3>
                    <p className="text-xs text-white/50">Let us know how to reach you</p>
                </div>
            </div>

            {/* Full Name */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <User className="h-4 w-4 text-brand-accent" aria-hidden />
                    Full name
                </label>
                <input
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    className={`${field} ${errors.fullName ? 'border-red-500/60' : ''}`}
                    placeholder="Your full name"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
            </div>

            {/* Email (read-only) */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <Mail className="h-4 w-4 text-brand-accent" aria-hidden />
                    Email
                </label>
                <div className="relative">
                    <input
                        type="email"
                        readOnly
                        value={form.email}
                        className={`${field} cursor-not-allowed opacity-80 border-white/10 bg-black/30 pr-10`}
                        aria-readonly="true"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Shield className="h-4 w-4 text-emerald-400/70" />
                    </div>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/50">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
                    Signed in with Google — email cannot be changed here.
                </p>
            </div>

            {/* Phone Number */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <Phone className="h-4 w-4 text-brand-accent" aria-hidden />
                    Phone number <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    <div className="relative sm:w-[min(100%,220px)] shrink-0">
                        <select
                            value={form.countryDial}
                            onChange={(e) => setForm((p) => ({ ...p, countryDial: e.target.value }))}
                            className={`${field} appearance-none pr-10 cursor-pointer`}
                            aria-label="Country calling code"
                        >
                            {COUNTRY_DIAL_CODES.map((c) => (
                                <option key={`${c.iso}-${c.dial}`} value={c.dial} className="bg-[#0a1218]">
                                    {c.flag} {c.dial} — {c.label}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">
                            ▼
                        </span>
                    </div>
                    <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={form.phoneLocal}
                        onChange={(e) => setForm((p) => ({ ...p, phoneLocal: e.target.value }))}
                        className={`${field} flex-1 ${errors.phone ? 'border-red-500/60' : ''}`}
                        placeholder="Mobile number"
                    />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
            </div>
        </div>
    );
};

export default Step1BasicInfo;

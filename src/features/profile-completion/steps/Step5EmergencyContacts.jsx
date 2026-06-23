import { PhoneCall, ShieldCheck, UserPlus } from 'lucide-react';

const field =
    'w-full min-h-[52px] px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-base outline-none placeholder:text-white/50 focus:border-brand-accent/50 focus:shadow-glow focus:bg-black/60 transition-all duration-300';

const Step5EmergencyContacts = ({ formData, setFormData, errors, nextStep, prevStep }) => {
    const form = formData;
    const setForm = setFormData;
    return (
        <div className="space-y-6">
            {/* Step header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20">
                    <PhoneCall className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">Emergency Contacts</h3>
                    <p className="text-xs text-white/50">Someone we can reach if we cannot reach you</p>
                </div>
            </div>

            {/* Info note */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400/70" />
                <span>
                    Include country code if your contacts are in a different region. These numbers are only used during emergencies.
                </span>
            </div>

            {/* Primary contact */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <PhoneCall className="h-4 w-4 text-brand-accent" aria-hidden />
                    Primary emergency contact <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    autoComplete="name"
                    value={form.primaryEmergencyName || ''}
                    onChange={(e) => setForm((p) => ({ ...p, primaryEmergencyName: e.target.value }))}
                    className={`${field} mb-3`}
                    placeholder="Contact name (optional)"
                />
                <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.primaryEmergencyPhone}
                    onChange={(e) => setForm((p) => ({ ...p, primaryEmergencyPhone: e.target.value }))}
                    className={`${field} ${errors.primaryEmergency ? 'border-red-500/60' : ''}`}
                    placeholder="+1 … or full international number"
                />
                {errors.primaryEmergency && (
                    <p className="mt-1 text-xs text-red-400">{errors.primaryEmergency}</p>
                )}
            </div>

            {/* Secondary contact */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <UserPlus className="h-4 w-4 text-white/40" aria-hidden />
                    Secondary contact <span className="text-white/40">(optional)</span>
                </label>
                <input
                    type="text"
                    autoComplete="name"
                    value={form.secondaryEmergencyName || ''}
                    onChange={(e) => setForm((p) => ({ ...p, secondaryEmergencyName: e.target.value }))}
                    className={`${field} mb-3`}
                    placeholder="Contact name (optional)"
                />
                <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.secondaryEmergencyPhone}
                    onChange={(e) => setForm((p) => ({ ...p, secondaryEmergencyPhone: e.target.value }))}
                    className={field}
                    placeholder="Alternate number"
                />
            </div>
        </div>
    );
};

export default Step5EmergencyContacts;

import { Accessibility, HeartPulse, ShieldAlert, Stethoscope } from 'lucide-react';

const field =
    'w-full min-h-[52px] px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-base outline-none placeholder:text-white/50 focus:border-brand-accent/50 focus:shadow-glow focus:bg-black/60 transition-all duration-300';

const chip = (active) =>
    `flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 sm:text-base ${
        active
            ? 'border-brand-accent/60 bg-brand-accent/15 text-brand-accent shadow-[0_0_12px_rgba(0,230,255,0.15)]'
            : 'border-white/15 bg-black/30 text-white/80 hover:border-white/25 hover:bg-black/40'
    }`;

const Step4HealthNeeds = ({ formData, setFormData, nextStep, prevStep }) => {
    const form = formData;
    const setForm = setFormData;
    const toggle = (key) => setForm((p) => ({ ...p, [key]: !p[key] }));

    return (
        <div className="space-y-6">
            {/* Step header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20">
                    <HeartPulse className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">Health & Special Needs</h3>
                    <p className="text-xs text-white/50">Optional — helps teams prepare the right support</p>
                </div>
            </div>

            {/* Privacy note */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-brand-accent/60" />
                <span>
                    This information is only shared with emergency responders when you request help. You can skip anything you prefer not to disclose.
                </span>
            </div>

            {/* Medical conditions */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <Stethoscope className="h-4 w-4 text-brand-accent" aria-hidden />
                    Medical conditions
                </label>
                <textarea
                    rows={3}
                    value={form.medicalConditions}
                    onChange={(e) => setForm((p) => ({ ...p, medicalConditions: e.target.value }))}
                    className={`${field} min-h-[100px] resize-y`}
                    placeholder="e.g. diabetes, asthma, allergies…"
                />
            </div>

            {/* Disability */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <Accessibility className="h-4 w-4 text-brand-accent" aria-hidden />
                    Disability or access needs
                </label>
                <textarea
                    rows={3}
                    value={form.disabilityStatus}
                    onChange={(e) => setForm((p) => ({ ...p, disabilityStatus: e.target.value }))}
                    className={`${field} min-h-[100px] resize-y`}
                    placeholder="Optional"
                />
            </div>

            {/* Assistance type chips */}
            <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
                    <HeartPulse className="h-4 w-4 text-brand-accent" aria-hidden />
                    Special assistance that may be required
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => toggle('assistanceMedical')} className={chip(form.assistanceMedical)}>
                        <Stethoscope className="h-4 w-4 shrink-0" />
                        Medical
                    </button>
                    <button type="button" onClick={() => toggle('assistanceMobility')} className={chip(form.assistanceMobility)}>
                        <Accessibility className="h-4 w-4 shrink-0" />
                        Mobility
                    </button>
                    <button type="button" onClick={() => toggle('assistanceOther')} className={chip(form.assistanceOther)}>
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        Other
                    </button>
                </div>
            </div>

            {/* Other details toggle */}
            {form.assistanceOther && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="mb-2 block text-sm font-medium text-white/80">Other assistance — details</label>
                    <textarea
                        rows={2}
                        value={form.assistanceOtherDetails}
                        onChange={(e) => setForm((p) => ({ ...p, assistanceOtherDetails: e.target.value }))}
                        className={`${field} min-h-[80px] resize-y`}
                        placeholder="Briefly describe what would help"
                    />
                </div>
            )}
        </div>
    );
};

export default Step4HealthNeeds;

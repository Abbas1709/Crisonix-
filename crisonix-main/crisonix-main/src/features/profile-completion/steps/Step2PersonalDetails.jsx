import { Calendar, Users, UserCheck, Baby } from 'lucide-react';

const field =
    'w-full min-h-[52px] px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-base outline-none placeholder:text-white/50 focus:border-brand-accent/50 focus:shadow-glow focus:bg-black/60 transition-all duration-300';

const Step2PersonalDetails = ({ formData, setFormData, nextStep, prevStep }) => {
    const form = formData;
    const setForm = setFormData;
    return (
        <div className="space-y-6">
            {/* Step header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20">
                    <Users className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">Personal Details</h3>
                    <p className="text-xs text-white/50">Helps us understand your household</p>
                </div>
            </div>

            {/* Age & Gender — side by side on larger screens */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                        <Calendar className="h-4 w-4 text-brand-accent" aria-hidden />
                        Age
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={120}
                        inputMode="numeric"
                        value={form.age}
                        onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                        className={field}
                        placeholder="Years"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                        <UserCheck className="h-4 w-4 text-brand-accent" aria-hidden />
                        Gender
                    </label>
                    <div className="relative">
                        <select
                            value={form.gender}
                            onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                            className={`${field} cursor-pointer appearance-none pr-10`}
                        >
                            <option value="" className="bg-[#0a1218]">Select…</option>
                            <option value="female" className="bg-[#0a1218]">Female</option>
                            <option value="male" className="bg-[#0a1218]">Male</option>
                            <option value="non_binary" className="bg-[#0a1218]">Non-binary</option>
                            <option value="prefer_not" className="bg-[#0a1218]">Prefer not to say</option>
                            <option value="self_describe" className="bg-[#0a1218]">Prefer to self-describe</option>
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">
                            ▼
                        </span>
                    </div>
                </div>
            </div>

            {/* Family members */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <Users className="h-4 w-4 text-brand-accent shrink-0" aria-hidden />
                    Number of people in your household
                </label>
                <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={form.familyMembers}
                    onChange={(e) => setForm((p) => ({ ...p, familyMembers: e.target.value }))}
                    className={field}
                    placeholder="Including you"
                />
            </div>

            {/* Dependents */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <Baby className="h-4 w-4 text-brand-accent shrink-0" aria-hidden />
                    Dependents (children, elderly, etc.)
                </label>
                <textarea
                    rows={3}
                    value={form.dependents}
                    onChange={(e) => setForm((p) => ({ ...p, dependents: e.target.value }))}
                    className={`${field} min-h-[100px] resize-y`}
                    placeholder="Optional — who may need extra help during an emergency?"
                />
            </div>
        </div>
    );
};

export default Step2PersonalDetails;

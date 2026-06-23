import { CheckCircle2, Pencil, ClipboardCheck, User, Users, MapPin, HeartPulse, PhoneCall } from 'lucide-react';
import Button from '../../../components/common/Button';

const GENDER_LABELS = {
    female: 'Female',
    male: 'Male',
    non_binary: 'Non-binary',
    prefer_not: 'Prefer not to say',
    self_describe: 'Prefer to self-describe',
};

const SECTION_ICONS = {
    basic: User,
    personal: Users,
    location: MapPin,
    health: HeartPulse,
    contacts: PhoneCall,
};

const Row = ({ label, value, empty = '—' }) => (
    <div className="flex flex-col gap-1 border-b border-white/8 py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/45">{label}</span>
        <span className="max-w-full whitespace-pre-wrap text-right text-sm text-white/90 sm:max-w-[65%]">
            {value && String(value).trim() ? value : <span className="text-white/30">{empty}</span>}
        </span>
    </div>
);

const Section = ({ title, sectionKey, onEdit, children }) => {
    const Icon = SECTION_ICONS[sectionKey] || User;

    return (
        <div className="rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur-sm hover:border-white/20 transition-colors duration-300">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-brand-accent/70" />
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="gap-1.5 text-brand-accent hover:bg-brand-accent/10"
                >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    Edit
                </Button>
            </div>
            <div className="divide-y divide-white/5">{children}</div>
        </div>
    );
};

const Step6Review = ({ formData, setFormData, goToStep }) => {
    const form = formData;
    const assistance = [];
    if (form.assistanceMedical) assistance.push('Medical');
    if (form.assistanceMobility) assistance.push('Mobility support');
    if (form.assistanceOther) assistance.push('Other');

    const genderLabel = form.gender ? GENDER_LABELS[form.gender] || form.gender : '';
    const fullPhone = `${form.countryDial} ${form.phoneLocal}`.trim();

    return (
        <div className="space-y-5">
            {/* Step header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20">
                    <ClipboardCheck className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">Review Your Profile</h3>
                    <p className="text-xs text-white/50">Confirm everything looks good</p>
                </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 rounded-xl border border-brand-accent/25 bg-brand-accent/5 p-4 text-sm text-white/85">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" aria-hidden />
                <p>
                    Review everything below. You can jump back to any step to make changes before completing your
                    profile.
                </p>
            </div>

            <Section title="Basic info" sectionKey="basic" onEdit={() => goToStep(0)}>
                <Row label="Full name" value={form.fullName} />
                <Row label="Email" value={form.email} />
                <Row label="Phone" value={fullPhone} />
            </Section>

            <Section title="Personal details" sectionKey="personal" onEdit={() => goToStep(1)}>
                <Row label="Age" value={form.age} />
                <Row label="Gender" value={genderLabel} />
                <Row label="Household size" value={form.familyMembers} />
                <Row label="Dependents" value={form.dependents} />
            </Section>

            <Section title="Location" sectionKey="location" onEdit={() => goToStep(2)}>
                <Row label="Address" value={form.address} />
                <Row label="Latitude" value={form.latitude} />
                <Row label="Longitude" value={form.longitude} />
            </Section>

            <Section title="Health & special needs" sectionKey="health" onEdit={() => goToStep(3)}>
                <Row label="Medical conditions" value={form.medicalConditions} empty="Not provided" />
                <Row label="Disability / access" value={form.disabilityStatus} empty="Not provided" />
                <Row label="Assistance" value={assistance.length ? assistance.join(', ') : 'None selected'} />
                {form.assistanceOther ? (
                    <Row label="Other — details" value={form.assistanceOtherDetails} empty="—" />
                ) : null}
            </Section>

            <Section title="Emergency contacts" sectionKey="contacts" onEdit={() => goToStep(4)}>
                <Row label="Primary" value={form.primaryEmergencyPhone} />
                {form.primaryEmergencyName && <Row label="Primary name" value={form.primaryEmergencyName} />}
                <Row label="Secondary" value={form.secondaryEmergencyPhone} empty="Not provided" />
                {form.secondaryEmergencyName && <Row label="Secondary name" value={form.secondaryEmergencyName} />}
            </Section>
        </div>
    );
};

export default Step6Review;

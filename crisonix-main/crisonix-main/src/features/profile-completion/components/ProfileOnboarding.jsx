import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import StepIndicator from './StepIndicator';
import { createEmptyProfileForm } from '../constants/formDefaults';
import Step1BasicInfo from '../steps/Step1BasicInfo';
import Step2PersonalDetails from '../steps/Step2PersonalDetails';
import Step3LocationDetails from '../steps/Step3LocationDetails';
import Step4HealthNeeds from '../steps/Step4HealthNeeds';
import Step5EmergencyContacts from '../steps/Step5EmergencyContacts';
import Step6Review from '../steps/Step6Review';
import { buildPayload } from './ProfileCompletionForm'; // we can replicate it here

const STEPS = [
    { key: 'basic', title: 'Basic info', description: 'How we reach you' },
    { key: 'personal', title: 'Personal', description: 'Household context' },
    { key: 'location', title: 'Location', description: 'Where you are' },
    { key: 'health', title: 'Health & needs', description: 'Optional support info' },
    { key: 'contacts', title: 'Contacts', description: 'Backup numbers' },
    { key: 'review', title: 'Review', description: 'Confirm & save' },
];

const digitsOnly = (s) => String(s || '').replace(/\D/g, '');

const validateStep = (index, form) => {
    const err = {};
    if (index === 1) {
        if (!form.fullName.trim()) err.fullName = 'Full name is required.';
        const d = digitsOnly(form.phoneLocal);
        if (d.length < 7) err.phone = 'Enter a valid phone number (at least 7 digits).';
    }
    if (index === 3) {
        const hasAddr = !!(form.address && form.address.trim());
        const hasLL =
            form.latitude &&
            form.longitude &&
            Number.isFinite(parseFloat(form.latitude)) &&
            Number.isFinite(parseFloat(form.longitude));
        if (!hasAddr && !hasLL) {
            err.location = 'Add an address or pick a location on the map / use current location.';
        }
    }
    if (index === 5) {
        const p = String(form.primaryEmergencyPhone || '').trim();
        if (p.length < 6) err.primaryEmergency = 'Primary emergency contact number is required.';
    }
    return err;
};

const _buildPayload = (form) => {
    const assistanceTypes = [];
    if (form.assistanceMedical) assistanceTypes.push('medical');
    if (form.assistanceMobility) assistanceTypes.push('mobility');
    if (form.assistanceOther) assistanceTypes.push('other');

    return {
        profile: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: {
                countryDial: form.countryDial,
                nationalNumber: digitsOnly(form.phoneLocal),
                e164Approx: `${form.countryDial}${digitsOnly(form.phoneLocal)}`,
            },
            personal: {
                age: form.age === '' ? null : Number(form.age),
                gender: form.gender || null,
                familyMembers: form.familyMembers === '' ? null : Number(form.familyMembers),
                dependentsNotes: form.dependents.trim() || null,
            },
            location: {
                address: form.address.trim(),
                latitude: form.latitude === '' ? null : parseFloat(form.latitude),
                longitude: form.longitude === '' ? null : parseFloat(form.longitude),
            },
            health: {
                medicalConditions: form.medicalConditions.trim() || null,
                disabilityStatus: form.disabilityStatus.trim() || null,
                assistanceTypes,
                assistanceOtherDetails: form.assistanceOther ? form.assistanceOtherDetails.trim() || null : null,
            },
            emergencyContacts: {
                primaryPhone: form.primaryEmergencyPhone.trim(),
                secondaryPhone: form.secondaryEmergencyPhone.trim() || null,
            },
        },
    };
};

const ProfileOnboarding = ({ initialFullName = '', initialEmail = '', onSave, onSuccess, className = '' }) => {
    const [step, setStep] = useState(1);
    
    // Maintain FULL FORM STATE in parent
    const [formData, setFormData] = useState(() => ({
        ...createEmptyProfileForm(),
        fullName: initialFullName,
        email: initialEmail,
    }));
    
    const [errors, setErrors] = useState({});
    const [geoLoading, setGeoLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const formContainerRef = useRef(null);

    useEffect(() => {
        setFormData((f) => ({
            ...f,
            fullName: initialFullName?.trim() ? initialFullName : f.fullName,
            email: initialEmail?.trim() ? initialEmail : f.email,
        }));
    }, [initialFullName, initialEmail]);

    const saveHandler = useMemo(() => {
        if (typeof onSave === 'function') return onSave;
        return async () => new Promise((r) => setTimeout(r, 900));
    }, [onSave]);

    useEffect(() => {
        formContainerRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
        window.scrollTo?.({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleNext = () => {
        const e = validateStep(step, formData);
        setErrors(e);
        if (Object.keys(e).length > 0) return;
        setSubmitError('');
        setStep((s) => Math.min(6, s + 1));
    };

    const handleBack = () => {
        setErrors({});
        setSubmitError('');
        setStep((s) => Math.max(1, s - 1));
    };

    const goToStep = useCallback((i) => {
        // step indicator passes 0-indexed, but our state is 1-indexed
        const target = Math.max(1, Math.min(6, i + 1));
        setStep(target);
        setErrors({});
        setSubmitError('');
    }, []);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setErrors((prev) => ({ ...prev, location: 'Geolocation is not supported on this device.' }));
            return;
        }
        setGeoLoading(true);
        setErrors((prev) => { const next = { ...prev }; delete next.location; return next; });
        
        // First attempt with high accuracy
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData((p) => ({ ...p, latitude: String(pos.coords.latitude), longitude: String(pos.coords.longitude) }));
                setGeoLoading(false);
            },
            (err) => {
                // If high accuracy fails, try with lower accuracy
                if (err.code === err.TIMEOUT) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            setFormData((p) => ({ ...p, latitude: String(pos.coords.latitude), longitude: String(pos.coords.longitude) }));
                            setGeoLoading(false);
                        },
                        (fallbackErr) => {
                            setGeoLoading(false);
                            let errorMsg = 'Could not read location.';
                            if (fallbackErr.code === fallbackErr.PERMISSION_DENIED) {
                                errorMsg = 'Location permission denied. Please enable location access in your browser settings.';
                            } else if (fallbackErr.code === fallbackErr.POSITION_UNAVAILABLE) {
                                errorMsg = 'Location information unavailable. Please try entering your address manually.';
                            } else if (fallbackErr.code === fallbackErr.TIMEOUT) {
                                errorMsg = 'Location request timed out. Please check your internet connection.';
                            }
                            setErrors((prev) => ({ ...prev, location: errorMsg }));
                        },
                        { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
                    );
                } else {
                    setGeoLoading(false);
                    let errorMsg = 'Could not read location.';
                    if (err.code === err.PERMISSION_DENIED) {
                        errorMsg = 'Location permission denied. Please enable location access in your browser settings.';
                    } else if (err.code === err.POSITION_UNAVAILABLE) {
                        errorMsg = 'Location information unavailable. Please try entering your address manually.';
                    }
                    setErrors((prev) => ({ ...prev, location: errorMsg }));
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleComplete = async () => {
        const e1 = validateStep(1, formData);
        const e3 = validateStep(3, formData);
        const e5 = validateStep(5, formData);
        const merged = { ...e1, ...e3, ...e5 };
        
        if (Object.keys(merged).length) {
            setErrors(merged);
            setSubmitError('Some required fields are missing.');
            if (e1.phone || e1.fullName) setStep(1);
            else if (e3.location) setStep(3);
            else if (e5.primaryEmergency) setStep(5);
            return;
        }
        
        setSubmitting(true);
        setSubmitError('');
        try {
            const payload = _buildPayload(formData);
            await saveHandler(payload);
            onSuccess?.(payload);
        } catch (err) {
            setSubmitError(err?.message || 'Could not save profile.');
        } finally {
            setSubmitting(false);
        }
    };

    console.log("Current Step:", step);
    console.log("Form Data:", formData);

    const progressPct = (step / 6) * 100;

    return (
        <div className={`mx-auto w-full max-w-2xl ${className}`}>
            <div className="mb-8">
                <StepIndicator
                    currentStep={step - 1} // 0-indexed for the indicator mapping
                    totalSteps={6}
                    stepTitles={STEPS.map((s) => s.title)}
                    onStepClick={goToStep}
                />
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between gap-2 text-xs text-white/50 mb-2">
                    <span className="font-medium">{STEPS[step - 1].description}</span>
                    <span className="tabular-nums text-white/40">{Math.round(progressPct)}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-black/40 border border-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-teal-start via-brand-accent/80 to-brand-accent transition-[width] duration-500 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            <div ref={formContainerRef} className="transition-all duration-300">
                {step === 1 && <Step1BasicInfo formData={formData} setFormData={setFormData} errors={errors} nextStep={() => setStep(2)} prevStep={() => {}} />}
                {step === 2 && <Step2PersonalDetails formData={formData} setFormData={setFormData} nextStep={() => setStep(3)} prevStep={() => setStep(1)} />}
                {step === 3 && (
                    <Step3LocationDetails 
                        formData={formData} 
                        setFormData={setFormData} 
                        errors={errors} 
                        geoLoading={geoLoading} 
                        onUseCurrentLocation={handleUseCurrentLocation} 
                        nextStep={() => setStep(4)} 
                        prevStep={() => setStep(2)} 
                    />
                )}
                {step === 4 && <Step4HealthNeeds formData={formData} setFormData={setFormData} nextStep={() => setStep(5)} prevStep={() => setStep(3)} />}
                {step === 5 && <Step5EmergencyContacts formData={formData} setFormData={setFormData} errors={errors} nextStep={() => setStep(6)} prevStep={() => setStep(4)} />}
                {step === 6 && <Step6Review formData={formData} setFormData={setFormData} goToStep={(i) => goToStep(i)} />}
            </div>

            {submitError && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    <span className="text-red-400">⚠ </span>
                    {submitError}
                </div>
            )}

            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={handleBack}
                    disabled={step === 1 || submitting}
                    className="gap-2 text-white/80"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>

                {step < 6 ? (
                    <Button type="button" variant="primary" size="lg" onClick={handleNext} className="gap-2 sm:min-w-[160px]">
                        Continue
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handleComplete}
                        disabled={submitting}
                        className="gap-2 sm:min-w-[200px]"
                    >
                        {submitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</> : 'Complete profile'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProfileOnboarding;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import { createEmptyProfileForm } from '../constants/formDefaults';
import StepIndicator from './StepIndicator';
import StepTransition from './StepTransition';
import Step1BasicInfo from '../steps/Step1BasicInfo';
import Step2PersonalDetails from '../steps/Step2PersonalDetails';
import Step3LocationDetails from '../steps/Step3LocationDetails';
import Step4HealthNeeds from '../steps/Step4HealthNeeds';
import Step5EmergencyContacts from '../steps/Step5EmergencyContacts';
import Step6Review from '../steps/Step6Review';

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
    if (index === 0) {
        if (!form.fullName.trim()) err.fullName = 'Full name is required.';
        const d = digitsOnly(form.phoneLocal);
        if (d.length < 7) err.phone = 'Enter a valid phone number (at least 7 digits).';
    }
    if (index === 2) {
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
    if (index === 4) {
        const p = String(form.primaryEmergencyPhone || '').trim();
        if (p.length < 6) err.primaryEmergency = 'Primary emergency contact number is required.';
    }
    return err;
};

const buildPayload = (form) => {
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

/**
 * Multi-step emergency profile wizard. Wire `onSave` to your API; defaults to a resolved Promise.
 */
const ProfileCompletionForm = ({
    initialFullName = '',
    initialEmail = '',
    onSave,
    onSuccess,
    className = '',
}) => {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState('forward');
    const [form, setForm] = useState(() => ({
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
        setForm((f) => ({
            ...f,
            fullName: initialFullName?.trim() ? initialFullName : f.fullName,
            email: initialEmail?.trim() ? initialEmail : f.email,
        }));
    }, [initialFullName, initialEmail]);

    const saveHandler = useMemo(() => {
        if (typeof onSave === 'function') return onSave;
        return async () => {
            await new Promise((r) => setTimeout(r, 900));
        };
    }, [onSave]);

    // Scroll the form container to top on step change
    useEffect(() => {
        formContainerRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
        window.scrollTo?.({ top: 0, behavior: 'smooth' });
    }, [step]);

    const goToStep = useCallback((i) => {
        const target = Math.max(0, Math.min(STEPS.length - 1, i));
        setDirection(target > step ? 'forward' : 'backward');
        setStep(target);
        setErrors({});
        setSubmitError('');
    }, [step]);

    const handleNext = () => {
        const e = validateStep(step, form);
        setErrors(e);
        if (Object.keys(e).length) return;
        setDirection('forward');
        setStep((s) => Math.min(STEPS.length - 1, s + 1));
        setSubmitError('');
    };

    const handleBack = () => {
        setDirection('backward');
        setStep((s) => Math.max(0, s - 1));
        setErrors({});
        setSubmitError('');
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setErrors((prev) => ({ ...prev, location: 'Geolocation is not supported on this device.' }));
            return;
        }
        setGeoLoading(true);
        setErrors((prev) => {
            const next = { ...prev };
            delete next.location;
            return next;
        });
        
        // First attempt with high accuracy
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const la = pos.coords.latitude;
                const ln = pos.coords.longitude;
                setForm((p) => ({
                    ...p,
                    latitude: String(la),
                    longitude: String(ln),
                }));
                setGeoLoading(false);
            },
            (err) => {
                // If high accuracy fails, try with lower accuracy
                if (err.code === err.TIMEOUT) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const la = pos.coords.latitude;
                            const ln = pos.coords.longitude;
                            setForm((p) => ({
                                ...p,
                                latitude: String(la),
                                longitude: String(ln),
                            }));
                            setGeoLoading(false);
                        },
                        (fallbackErr) => {
                            setGeoLoading(false);
                            let errorMsg = 'Could not read your location. Check permissions or pick a point on the map.';
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
                    let errorMsg = 'Could not read your location. Check permissions or pick a point on the map.';
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
        const e = validateStep(2, form);
        const e0 = validateStep(0, form);
        const e4 = validateStep(4, form);
        const merged = { ...e0, ...e, ...e4 };
        if (Object.keys(merged).length) {
            setErrors(merged);
            setSubmitError('Some required fields are missing. Review the highlighted steps.');
            if (e0.phone || e0.fullName) { setDirection('backward'); setStep(0); }
            else if (e.location) { setDirection('backward'); setStep(2); }
            else if (e4.primaryEmergency) { setDirection('backward'); setStep(4); }
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        try {
            const payload = buildPayload(form);
            await saveHandler(payload);
            onSuccess?.(payload);
        } catch (err) {
            setSubmitError(err?.message || 'Could not save your profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Keyboard: Enter to proceed (except on textareas)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
            if (step < STEPS.length - 1) handleNext();
            else handleComplete();
        }
    };

    const progressPct = ((step + 1) / STEPS.length) * 100;

    const renderStep = () => {
        switch (step) {
            case 0: return <Step1BasicInfo form={form} setForm={setForm} errors={errors} />;
            case 1: return <Step2PersonalDetails form={form} setForm={setForm} />;
            case 2: return (
                <Step3LocationDetails
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    geoLoading={geoLoading}
                    onUseCurrentLocation={handleUseCurrentLocation}
                />
            );
            case 3: return <Step4HealthNeeds form={form} setForm={setForm} />;
            case 4: return <Step5EmergencyContacts form={form} setForm={setForm} errors={errors} />;
            case 5: return <Step6Review form={form} goToStep={goToStep} />;
            default: return null;
        }
    };

    return (
        <div className={`mx-auto w-full max-w-2xl ${className}`} onKeyDown={handleKeyDown}>
            {/* Step Indicator */}
            <div className="mb-8">
                <StepIndicator
                    currentStep={step}
                    totalSteps={STEPS.length}
                    stepTitles={STEPS.map((s) => s.title)}
                    onStepClick={goToStep}
                />
            </div>

            {/* Progress bar (thin) */}
            <div className="mb-6">
                <div className="flex items-center justify-between gap-2 text-xs text-white/50 mb-2">
                    <span className="font-medium">{STEPS[step].description}</span>
                    <span className="tabular-nums text-white/40">{Math.round(progressPct)}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-black/40 border border-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-teal-start via-brand-accent/80 to-brand-accent transition-[width] duration-500 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Step content with transitions */}
            <div ref={formContainerRef}>
                <StepTransition stepKey={STEPS[step].key} direction={direction}>
                    <div role="tabpanel" aria-labelledby={`step-${STEPS[step].key}`}>
                        {renderStep()}
                    </div>
                </StepTransition>
            </div>

            {/* Submit error */}
            {submitError && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-sm flex items-start gap-3">
                    <span className="shrink-0 text-red-400 mt-0.5">⚠</span>
                    <p>{submitError}</p>
                </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={handleBack}
                    disabled={step === 0 || submitting}
                    className="gap-2 text-white/80"
                >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    Back
                </Button>

                {step < STEPS.length - 1 ? (
                    <Button type="button" variant="primary" size="lg" onClick={handleNext} className="gap-2 sm:min-w-[160px] group">
                        Continue
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
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
                        {submitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                                Saving…
                            </>
                        ) : (
                            'Complete profile'
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProfileCompletionForm;
export { STEPS, buildPayload };

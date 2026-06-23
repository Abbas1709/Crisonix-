import { Check, User, Users, MapPin, HeartPulse, PhoneCall, ClipboardCheck } from 'lucide-react';

const STEP_ICONS = [User, Users, MapPin, HeartPulse, PhoneCall, ClipboardCheck];

const StepIndicator = ({ currentStep, totalSteps, stepTitles, onStepClick }) => {
    return (
        <div className="w-full">
            {/* Desktop stepper */}
            <div className="hidden sm:flex items-center justify-between gap-0">
                {Array.from({ length: totalSteps }).map((_, i) => {
                    const Icon = STEP_ICONS[i] || User;
                    const isCompleted = i < currentStep;
                    const isActive = i === currentStep;
                    const isClickable = i <= currentStep;

                    return (
                        <div key={i} className="flex items-center flex-1 last:flex-initial">
                            {/* Step circle */}
                            <button
                                type="button"
                                onClick={() => isClickable && onStepClick?.(i)}
                                disabled={!isClickable}
                                className={`
                                    group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2
                                    transition-all duration-500 ease-out
                                    ${isCompleted
                                        ? 'border-brand-accent bg-brand-accent/20 text-brand-accent shadow-[0_0_16px_rgba(0,230,255,0.25)]'
                                        : isActive
                                            ? 'border-brand-accent bg-brand-accent/10 text-brand-accent shadow-[0_0_20px_rgba(0,230,255,0.3)] scale-110'
                                            : 'border-white/15 bg-black/40 text-white/35'
                                    }
                                    ${isClickable ? 'cursor-pointer hover:border-brand-accent/60' : 'cursor-default'}
                                `}
                                aria-label={`Step ${i + 1}: ${stepTitles[i]}`}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5 animate-in fade-in zoom-in duration-300" />
                                ) : (
                                    <Icon className="h-4.5 w-4.5" />
                                )}

                                {/* Active pulse ring */}
                                {isActive && (
                                    <span className="absolute inset-0 rounded-full border-2 border-brand-accent/40 animate-ping opacity-30" />
                                )}
                            </button>

                            {/* Connector line */}
                            {i < totalSteps - 1 && (
                                <div className="relative mx-1.5 h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-accent to-brand-accent/60 transition-all duration-700 ease-out"
                                        style={{ width: isCompleted ? '100%' : '0%' }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Desktop step titles */}
            <div className="hidden sm:flex items-start justify-between mt-3 gap-0">
                {Array.from({ length: totalSteps }).map((_, i) => {
                    const isCompleted = i < currentStep;
                    const isActive = i === currentStep;

                    return (
                        <div key={i} className="flex flex-col items-center flex-1 last:flex-initial" style={{ minWidth: '44px' }}>
                            <span
                                className={`text-[10px] font-semibold uppercase tracking-wider text-center leading-tight transition-colors duration-300 ${
                                    isActive
                                        ? 'text-brand-accent'
                                        : isCompleted
                                            ? 'text-white/60'
                                            : 'text-white/30'
                                }`}
                            >
                                {stepTitles[i]}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Mobile stepper — compact dots + current label */}
            <div className="flex sm:hidden flex-col items-center gap-3">
                <div className="flex items-center gap-2.5">
                    {Array.from({ length: totalSteps }).map((_, i) => {
                        const isCompleted = i < currentStep;
                        const isActive = i === currentStep;

                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => i <= currentStep && onStepClick?.(i)}
                                disabled={i > currentStep}
                                className={`
                                    rounded-full transition-all duration-400
                                    ${isActive
                                        ? 'h-3 w-8 bg-brand-accent shadow-[0_0_12px_rgba(0,230,255,0.4)]'
                                        : isCompleted
                                            ? 'h-3 w-3 bg-brand-accent/60'
                                            : 'h-3 w-3 bg-white/20'
                                    }
                                `}
                                aria-label={`Go to step ${i + 1}`}
                            />
                        );
                    })}
                </div>
                <p className="text-xs font-semibold text-brand-accent tracking-wide">
                    Step {currentStep + 1} of {totalSteps} — {stepTitles[currentStep]}
                </p>
            </div>
        </div>
    );
};

export default StepIndicator;

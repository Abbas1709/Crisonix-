import { useEffect, useRef, useState } from 'react';

/**
 * Wraps a step's content and provides slide + fade transitions when the step key changes.
 * Uses CSS transitions (no external animation library).
 */
const StepTransition = ({ stepKey, direction = 'forward', children }) => {
    const [displayedChild, setDisplayedChild] = useState(children);
    const [displayedKey, setDisplayedKey] = useState(stepKey);
    const [phase, setPhase] = useState('visible'); // 'exiting' | 'entering' | 'visible'
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (stepKey === displayedKey) return;

        // Phase 1: slide out current content
        setPhase('exiting');

        timeoutRef.current = setTimeout(() => {
            // Phase 2: swap to new content and slide in
            setDisplayedChild(children);
            setDisplayedKey(stepKey);
            setPhase('entering');

            timeoutRef.current = setTimeout(() => {
                setPhase('visible');
            }, 30); // tiny delay so browser picks up the entering state before transitioning to visible
        }, 250); // matches the CSS transition duration for exit

        return () => clearTimeout(timeoutRef.current);
    }, [stepKey, children, displayedKey]);

    // If the key hasn't changed but children updated (e.g. form re-render), just pass through
    useEffect(() => {
        if (stepKey === displayedKey && phase === 'visible') {
            setDisplayedChild(children);
        }
    }, [children, stepKey, displayedKey, phase]);

    const baseClasses = 'transition-all duration-300 ease-out';

    const phaseStyles = {
        visible: 'opacity-100 translate-x-0 scale-100',
        exiting:
            direction === 'forward'
                ? 'opacity-0 -translate-x-6 scale-[0.98]'
                : 'opacity-0 translate-x-6 scale-[0.98]',
        entering:
            direction === 'forward'
                ? 'opacity-0 translate-x-6 scale-[0.98]'
                : 'opacity-0 -translate-x-6 scale-[0.98]',
    };

    return (
        <div className={`${baseClasses} ${phaseStyles[phase]}`} aria-live="polite">
            {displayedChild}
        </div>
    );
};

export default StepTransition;

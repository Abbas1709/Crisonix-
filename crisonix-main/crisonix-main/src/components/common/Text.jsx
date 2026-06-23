// src/components/common/Text.jsx
import React from 'react';

const Text = ({
    variant = 'p',
    as,
    className = '',
    children,
    ...props
}) => {
    // Map variants to their default HTML tags
    const variantTagMap = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        p: 'p',
        span: 'span',
        body: 'p',
        caption: 'p',
        logo: 'h1'
    };

    const Component = as || variantTagMap[variant] || 'p';

    const variants = {
        h1: 'text-4xl md:text-6xl font-bold leading-[1.1]',
        h2: 'text-3xl md:text-5xl font-bold tracking-tight',
        h3: 'text-lg md:text-xl font-medium',
        h4: 'text-base font-bold',
        p: 'text-sm md:text-base leading-relaxed',
        body: 'text-sm md:text-base leading-relaxed',
        caption: 'text-xs md:text-sm text-white/70 leading-relaxed',
        logo: 'font-jersey text-4xl text-white'
    };

    const variantStyles = variants[variant] || '';

    return (
        <Component
            className={`${variantStyles} ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Text;

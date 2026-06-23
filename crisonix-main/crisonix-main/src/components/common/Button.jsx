// src/components/common/Button.jsx
import React from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none rounded-xl tracking-wider';

    const variants = {
        primary: 'bg-brand-accent text-[#020b12] hover:opacity-90',
        teal: 'bg-[#008a99] text-white hover:brightness-110',
        'light-teal': 'bg-[#00a3b8] text-white hover:brightness-110',
        outline: 'bg-transparent border border-white/20 hover:border-brand-accent text-white hover:bg-white/5',
        social: 'bg-white text-black hover:bg-gray-100',
        apple: 'bg-black text-white border border-white/10 hover:bg-white/5',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
        ghost: 'bg-transparent text-white/70 hover:text-brand-accent'
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-8 py-3 text-sm',
        lg: 'px-10 py-4 text-base',
        xl: 'px-12 py-5 text-lg',
        none: 'p-0'
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

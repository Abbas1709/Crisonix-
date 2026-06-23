// src/features/auth/components/Input.jsx
const Input = ({ type = 'text', placeholder, value, onChange, className = '', error, ...props }) => {
    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full p-[14px] rounded-lg border border-white/10 bg-black/50 text-white outline-none cursor-pointer placeholder:text-white/60 focus:bg-black/70 focus:border-brand-accent/50 focus:shadow-glow focus:scale-[1.02] transition-all duration-300 ${error ? 'border-red-500/50 mb-1' : 'mb-[15px]'
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-[10px] text-left mb-[10px] ml-1">{error}</p>}
        </div>
    );
};

export default Input;

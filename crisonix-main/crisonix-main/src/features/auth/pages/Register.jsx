import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../../../components/common/Button';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../constants/roles';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function Register() {
    const navigate = useNavigate();
    const { login, setRole, role } = useAuthStore();
    
    const [showForm, setShowForm] = useState(!!role);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleRoleSelect = (roleName) => {
        setRole(roleName);
        setShowForm(true);
    };

    const getDisplayRole = (roleName) => {
        const roleObj = ROLES.find((r) => r.title === roleName);
        return roleObj ? roleObj.displayTitle : roleName;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const result = registerSchema.safeParse(formData);
        
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        
        // Mock API call and login
        login({
            firstName: formData.firstName,
            emailOrPhone: formData.email,
        });
        
        navigate('/dashboard');
    };

    if (!showForm) {
        return (
            <AuthCard title="Choose Your Role" subtitle="Select one option below to register">
                <div className="flex flex-col gap-5 text-left">
                    {ROLES.map((roleOpt) => (
                        <div
                            key={roleOpt.id}
                            onClick={() => handleRoleSelect(roleOpt.title)}
                            className="bg-black/45 p-5 rounded-xl border border-white/10 cursor-pointer hover:bg-black/60 hover:border-brand-accent/50 hover:shadow-glow hover:scale-[1.02] transition-all duration-300 group"
                        >
                            <h3 className="text-white font-bold mb-2 group-hover:text-brand-accent transition-colors">
                                {roleOpt.title}
                            </h3>
                            <p className="text-[13px] opacity-85 text-white leading-relaxed">
                                {roleOpt.description}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <p className="text-sm">
                        Already have an account?{' '}
                        <span
                            className="text-brand-accent font-semibold cursor-pointer hover:underline hover:text-shadow-input transition-all"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard title={`${getDisplayRole(role)} Registration`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                />
                
                <Input
                    type="email"
                    name="email"
                    placeholder="Email / Phone Number"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                />

                <Input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                />

                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                />

                <p
                    className="text-[12px] text-right w-full mb-5 opacity-80 cursor-pointer hover:text-brand-accent transition-colors"
                    onClick={() => setShowForm(false)}
                >
                    Change Role?
                </p>

                <Button type="submit" className="w-full mt-2 text-sm">
                    REGISTER
                </Button>
                
                <div className="mt-6 text-center">
                    <p className="text-sm">
                        Already have an account?{' '}
                        <span
                            className="text-brand-accent font-semibold cursor-pointer hover:underline hover:text-shadow-input transition-all"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </form>
        </AuthCard>
    );
}

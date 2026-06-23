// src/features/auth/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { z } from 'zod';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../../../components/common/Button';
import useAuthStore from '../../../store/authStore';
import googleIcon from '../../../assets/googleicon.svg';
import appleIcon from '../../../assets/appleicon.svg';
import { ROLES } from '../../../constants/roles';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
    const navigate = useNavigate();
    const { login, setRole, role, isAuthenticated, profileCompleted } = useAuthStore();

    // Redirect authenticated users
    if (isAuthenticated) {
        if (!profileCompleted) {
            return <Navigate to="/complete-profile" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    const [showForm, setShowForm] = useState(!!role);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleRoleSelect = (roleName) => {
        setRole(roleName);
        setShowForm(true);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        
        let result;
        if (role === 'NGO / Organisation') {
            const ngoSchema = z.object({
                userId: z.string().min(1, 'User ID is required'),
                passkey: z.string().min(1, 'Passkey is required'),
            });
            result = ngoSchema.safeParse(formData);
        } else {
            result = loginSchema.safeParse(formData);
        }

        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        console.log('Login successful:', formData);

        login({
            firstName: role === 'NGO / Organisation' ? 'ORG ADMIN' : '',
            emailOrPhone: role === 'NGO / Organisation' ? formData.userId : formData.email,
        });

        const isProfileComplete = useAuthStore.getState().profileCompleted;
        if (!isProfileComplete) {
            navigate('/complete-profile');
        } else {
            navigate('/dashboard');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    if (!showForm) {
        return (
            <AuthCard title="Choose Your Role" subtitle="Select one option below">
                <div className="flex flex-col gap-5 text-left">
                    {ROLES.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => handleRoleSelect(role.title)}
                            className="bg-black/45 p-5 rounded-xl border border-white/10 cursor-pointer hover:bg-black/60 hover:border-brand-accent/50 hover:shadow-glow hover:scale-[1.02] transition-all duration-300 group"
                        >
                            <h3 className="text-white font-bold mb-2 group-hover:text-brand-accent transition-colors">
                                {role.title}
                            </h3>
                            <p className="text-[13px] opacity-85 text-white leading-relaxed">
                                {role.description}
                            </p>
                        </div>
                    ))}
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard title={`${role} Login`} subtitle="Welcome back! Please login to your account.">
            <div className="flex flex-col gap-1">
                {role === 'NGO / Organisation' ? (
                    <>
                        <Input
                            type="text"
                            name="userId"
                            placeholder="User ID"
                            value={formData.userId || ''}
                            onChange={handleInputChange}
                            error={errors.userId}
                        />
                        <Input
                            type="password"
                            name="passkey"
                            placeholder="Passkey"
                            value={formData.passkey || ''}
                            onChange={handleInputChange}
                            error={errors.passkey}
                        />
                    </>
                ) : (
                    <>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            error={errors.email}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            error={errors.password}
                        />
                    </>
                )}

                <p
                    className="text-[12px] text-right mb-5 opacity-80 cursor-pointer hover:text-brand-accent transition-colors"
                    onClick={() => setShowForm(false)}
                >
                    Change Role?
                </p>

                <Button onClick={handleLogin}>LOGIN</Button>

                <div className="my-5 flex items-center justify-center gap-4 text-[13px] opacity-70">
                    <div className="h-[1px] flex-1 bg-white/20"></div>
                    <span>or sign in with</span>
                    <div className="h-[1px] flex-1 bg-white/20"></div>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                    <Button variant="social" className="flex-1">
                        <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
                        Google
                    </Button>
                    <Button variant="apple" className="flex-1">
                        <img src={appleIcon} alt="Apple" className="w-5 h-5 mr-2" />
                        Apple ID
                    </Button>
                </div>

                <p className="text-sm">
                    Don't have an account?{' '}
                    <span
                        className="text-brand-accent font-semibold cursor-pointer hover:underline hover:text-shadow-input transition-all"
                        onClick={() => navigate('/signup')}
                    >
                        Create one
                    </span>
                </p>
            </div>
        </AuthCard>
    );
};

export default Login;

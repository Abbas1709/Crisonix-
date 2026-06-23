// src/features/auth/pages/CreateAccount.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../../../components/common/Button';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../constants/roles';

const CreateAccount = () => {
    const navigate = useNavigate();
    const { role, setRole, isAuthenticated, hasCompletedRegistration } = useAuthStore();
    
    // Redirect authenticated users
    if (isAuthenticated) {
        if (!hasCompletedRegistration) {
            return <Navigate to="/register" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    const [showForm, setShowForm] = useState(!!role);

    useEffect(() => {
        if (role) {
            setShowForm(true);
        }
    }, [role]);

    const handleRoleSelect = (roleName) => {
        setRole(roleName);
        setShowForm(true);
    };

    const getDisplayRole = (roleName) => {
        const roleObj = ROLES.find((r) => r.title === roleName);
        return roleObj ? roleObj.displayTitle : roleName;
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
        <AuthCard title={`${getDisplayRole(role)} Sign Up`}>
            <div className="flex flex-col gap-1 items-center">
                <Input placeholder="First Name" />
                <Input placeholder="Email / Phone Number" />
                <Input type="password" placeholder="Enter Password" />
                <Input type="password" placeholder="Re-enter Password" />

                <p
                    className="text-[12px] text-right w-full mb-5 opacity-80 cursor-pointer hover:text-brand-accent transition-colors"
                    onClick={() => setShowForm(false)}
                >
                    Change Role?
                </p>

                <Button
                    className="w-auto px-10 mt-2 text-sm"
                    onClick={() => navigate('/verify')}
                >
                    Next
                </Button>
            </div>
        </AuthCard>
    );
};

export default CreateAccount;

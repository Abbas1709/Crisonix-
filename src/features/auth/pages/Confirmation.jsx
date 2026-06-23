// src/features/auth/pages/Confirmation.jsx
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import Button from '../../../components/common/Button';
import useAuthStore from '../../../store/authStore';

const Confirmation = () => {
    const navigate = useNavigate();
    const { login, userData } = useAuthStore();

    return (
        <AuthCard>
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="text-[#00e6ff] w-12 h-12" />
                </div>

                <p className="text-white text-lg font-medium max-w-[200px] leading-relaxed">
                    Your account has been created successfully
                </p>

                <Button
                    className="w-auto px-10 mt-6 text-sm"
                    onClick={() => {
                        login({ firstName: userData.firstName || '' });
                        useAuthStore.getState().setHasCompletedRegistration(false);
                        navigate('/register');
                    }}
                >
                    Complete Setup
                </Button>
            </div>
        </AuthCard>
    );
};

export default Confirmation;

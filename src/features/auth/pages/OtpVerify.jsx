// src/features/auth/pages/OtpVerify.jsx
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../../../components/common/Button';

const OtpVerify = () => {
    const navigate = useNavigate();

    return (
        <AuthCard title="Enter OTP">
            <div className="flex flex-col gap-1 items-center">
                <Input placeholder="Enter OTP" className="text-center tracking-[4px]" />

                <Button
                    className="w-auto px-10 mt-4 text-sm"
                    onClick={() => navigate('/confirm')}
                >
                    Next
                </Button>
            </div>
        </AuthCard>
    );
};

export default OtpVerify;

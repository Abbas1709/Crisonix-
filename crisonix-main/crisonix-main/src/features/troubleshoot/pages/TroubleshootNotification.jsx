// src/features/troubleshoot/pages/TroubleshootNotification.jsx
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import bgImage from '../../../assets/background.png';
import AuthCard from '../../auth/components/AuthCard';
import Button from '../../../components/common/Button';
import Text from '../../../components/common/Text';

const TroubleshootNotification = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-black font-outfit flex items-center justify-center p-6">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${bgImage})` }}
            />

            <div className="z-10 w-full flex justify-center">
                <AuthCard>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle className="text-[#00e6ff] w-12 h-12" />
                        </div>

                        <Text variant="h3" className="max-w-[200px] leading-relaxed mx-auto">
                            Troubleshoot request submitted successfully
                        </Text>

                        <Button
                            className="w-auto px-10 mt-6 text-sm"
                            onClick={() => navigate('/')}
                        >
                            Back
                        </Button>
                    </div>
                </AuthCard>
            </div>
        </div>
    );
};

export default TroubleshootNotification;

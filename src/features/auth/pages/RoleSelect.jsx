// src/features/auth/pages/RoleSelect.jsx
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../constants/roles';

const RoleSelect = () => {
    const navigate = useNavigate();
    const setRole = useAuthStore((state) => state.setRole);

    const handleRoleSelect = (roleName) => {
        setRole(roleName);
        navigate('/login');
    };

    return (
        <AuthCard title="Choose Your Role" subtitle="Select one option below">
            <div className="flex flex-col gap-5 text-left">
                {ROLES.map((role) => (
                    <div
                        key={role.id}
                        onClick={() => handleRoleSelect(role.title)}
                        className="bg-black/25 p-5 rounded-xl cursor-pointer hover:bg-black/40 hover:shadow-glow hover:scale-[1.02] transition-all duration-300 group"
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
};

export default RoleSelect;

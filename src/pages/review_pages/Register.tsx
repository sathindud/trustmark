import { registerUser } from "../../api/auth.ts";
import AuthForm from "./components/AuthForm.tsx";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async (formData: {
        fullName: string;
        email: string;
        password: string;
    }) => {
        try {
            await registerUser(formData);
            navigate('/login');
        } catch {
            alert('Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary-2">
            <div>
                <AuthForm isRegister onSubmit={handleRegister} />
                <p className="text-sm text-center mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-primary-2 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
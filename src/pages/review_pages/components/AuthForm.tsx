import React, { useState } from 'react';

interface AuthFormProps {
    isRegister?: boolean;
    onSubmit: (formData: { fullName: string; email: string; password: string }) => void;
}

const AuthForm = ({ isRegister = false, onSubmit }: AuthFormProps) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center">
                {isRegister ? 'Create a TrustMark Account' : 'Login to TrustMark'}
            </h2>

            {isRegister && (
                <>
                    <label className="block text-sm mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        className="w-full px-4 py-2 mb-4 border border-black rounded-lg"
                        required
                        onChange={handleChange}
                    />
                </>
            )}

            <label className="block text-sm mb-1">Email</label>
            <input
                type="email"
                name="email"
                className="w-full px-4 py-2 mb-4 border border-black rounded-lg"
                required
                onChange={handleChange}
            />

            <label className="block text-sm mb-1">Password</label>
            <input
                type="password"
                name="password"
                className="w-full px-4 py-2 mb-6 border border-black rounded-lg"
                required
                onChange={handleChange}
            />

            <button
                type="submit"
                className={`w-full ${
                    isRegister ? 'bg-primary-2 hover:bg-primary-2-hover' : 'bg-primary-1 hover:bg-primary-1-hover'
                } cursor-pointer text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out`}
            >
                {isRegister ? 'Register' : 'Login'}
            </button>
        </form>
    );
};

export default AuthForm;
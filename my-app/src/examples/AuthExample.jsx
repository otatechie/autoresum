import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Example component demonstrating how to use the authentication system
 * This is for reference only - not meant to be used in production
 */
export function AuthExample() {
    const {
        user,
        isAuthenticated,
        isLoading,
        signUp,
        signIn,
        signOut,
        forgotPassword,
        resetPassword
    } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });

    const [resetData, setResetData] = useState({
        token: '',
        newPassword: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetInputChange = (e) => {
        const { name, value } = e.target;
        setResetData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await signUp(formData);
            // Success handled by hook
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signIn({
                email: formData.email,
                password: formData.password,
                rememberMe: true
            });
            // Success handled by hook
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(formData.email);
            // Success handled by hook
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(
                resetData.token,
                resetData.newPassword,
                resetData.confirmPassword
            );
            // Success handled by hook
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
            // Success handled by hook
        } catch (error) {
            // Error handled by hook
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
                <div className="mb-4">
                    <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>ID:</strong> {user?.id}</p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8 space-y-8">
            {/* Sign Up Form */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
            </div>

            {/* Sign In Form */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                <form onSubmit={handleSignIn} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>

            {/* Forgot Password Form */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                    </button>
                </form>
            </div>

            {/* Reset Password Form */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <input
                        type="text"
                        name="token"
                        placeholder="Reset Token"
                        value={resetData.token}
                        onChange={handleResetInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={resetData.newPassword}
                        onChange={handleResetInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={resetData.confirmPassword}
                        onChange={handleResetInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

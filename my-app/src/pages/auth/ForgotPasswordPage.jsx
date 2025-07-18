import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { toast } from '../../utils/notifications';
import { validateEmail } from '../../utils/validation';

export function ForgotPasswordPage() {
    const authService = new AuthService();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (emailError) {
            setEmailError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error);
            return;
        }

        setIsLoading(true);
        setEmailError('');

        try {
            const result = await authService.forgotPassword(email);

            // Show success message
            toast.success(result.message || 'Password reset instructions sent to your email!');
            setIsSuccess(true);

        } catch (error) {
            // Handle validation errors
            if (error.validationErrors?.email) {
                setEmailError(error.validationErrors.email);
            }

            // Show error toast
            toast.error(error.message || 'Failed to send reset instructions. Please try again.');

        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Check your email</h1>
                <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                    We've sent password reset instructions to <strong>{email}</strong>.
                </p>
                <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                    Didn't receive the email? Check your spam folder or try again.
                </p>
                <div className="mt-6 space-y-4">
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="btn-outline w-full"
                    >
                        Try different email
                    </button>
                    <Link
                        to="/login"
                        className="block text-center text-sm link-primary dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Return to login
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset your password</h1>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                Fear not. We'll email you instructions to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
                <div className="mt-4">
                    <label htmlFor="email" className="block">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        autoComplete="email"
                        className={`form-control ${emailError ? 'border-red-500' : ''}`}
                        required
                    />
                    {emailError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                    )}
                </div>
                <div className="flex items-center justify-between mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 w-full ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending instructions...
                            </div>
                        ) : (
                            'Reset password'
                        )}
                    </button>
                </div>
                <div className="text-center mt-4">
                    <Link to="/login" className="text-sm link-primary dark:text-blue-400 dark:hover:text-blue-300">
                        Return to login
                    </Link>
                </div>
            </form>
        </>
    );
}
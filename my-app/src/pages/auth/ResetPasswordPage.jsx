import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { toast } from '../../utils/notifications';
import { validatePassword, validatePasswordConfirmation } from '../../utils/validation';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const authService = new AuthService();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        // Get token from URL parameters
        const resetToken = searchParams.get('token');
        if (!resetToken) {
            toast.error('Invalid or missing reset token. Please request a new password reset.');
            navigate('/forgot-password');
            return;
        }
        setToken(resetToken);
    }, [searchParams, navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        // Password validation
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors[0];
        }

        // Password confirmation validation
        const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
        if (!confirmPasswordValidation.isValid) {
            errors.confirmPassword = confirmPasswordValidation.error;
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid reset token. Please request a new password reset.');
            navigate('/forgot-password');
            return;
        }

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);
        setFormErrors({});

        try {
            const result = await authService.resetPassword(token, formData.password, formData.confirmPassword);

            // Show success message
            toast.success(result.message || 'Password reset successfully!');

            // Redirect to login
            navigate('/login');

        } catch (error) {
            // Handle validation errors
            if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
                setFormErrors(error.validationErrors);
            }

            // Show error toast
            toast.error(error.message || 'Failed to reset password. Please try again.');

            // If token is invalid, redirect to forgot password
            if (error.status === 400 || error.status === 401) {
                setTimeout(() => {
                    navigate('/forgot-password');
                }, 2000);
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset your password</h1>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
            Almost done. Enter your new password, and you're good to go.
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
                <div className="mt-4">
                    <div className="relative flex items-center justify-between">
                        <label htmlFor="password" className="block">New password</label>
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-medium text-sm">{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control ${formErrors.password ? 'border-red-500' : ''}`}
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        required
                        minLength="8"
                    />
                    {formErrors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                    )}
                </div>
                <div className="mt-4">
                    <div className="relative flex items-center justify-between">
                        <label htmlFor="confirmPassword" className="block">Confirm new password</label>
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-medium text-sm">{showConfirmPassword ? 'Hide' : 'Show'}</span>
                        </button>
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className={`form-control ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        required
                        minLength="8"
                    />
                    {formErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.confirmPassword}</p>
                    )}
                </div>
                <div className="mt-6">
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
                                Resetting password...
                            </div>
                        ) : (
                            'Reset password'
                        )}
                    </button>
                </div>
            </form>
        </>
    );
}
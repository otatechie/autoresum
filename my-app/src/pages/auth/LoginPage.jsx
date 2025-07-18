import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../utils/notifications';
import { SEO } from '../../components/SEO';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

        // Username validation
        if (!formData.username) {
            errors.username = 'Username is required';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };

    useEffect(() => {
        if (isAuthenticated) {
            const redirectPath = location.state?.from?.pathname || '/dashboard';
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);
        setFormErrors({});

        try {
            await signIn(formData);
            // No need to navigate here; useEffect will handle it
        } catch (error) {
            if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
                setFormErrors(error.validationErrors);
            }
            toast.error(error.message || 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEO 
                title="Login"
                description="Sign in to your AutoResum account to create and manage your resumes and cover letters."
                keywords={['login', 'sign in', 'account access', 'user authentication']}
                noindex={true} // Login pages should typically not be indexed
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Login</h1>
            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                Need an Autoresum account?
                <Link to="/signup" className="link-primary dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                    Create an account
                </Link>
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
                <div className="mt-4">
                    <label htmlFor="username" className="block">Email</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        autoComplete="username"
                        className={`form-control ${formErrors.username ? 'border-red-500' : ''}`}
                        required
                    />
                    {formErrors.username && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.username}</p>
                    )}
                </div>
                <div className="mt-4">
                    <div className="relative flex items-center justify-between">
                        <label htmlFor="password" className="block">Password</label>
                        <button
                            type="button"
                            id="toggle-password"
                            onClick={togglePassword}
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
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`form-control ${formErrors.password ? 'border-red-500' : ''}`}
                        autoComplete="current-password"
                        required
                        minLength="8"
                    />
                    {formErrors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                    )}
                </div>
                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 cursor-pointer"
                    />
                    <label
                        htmlFor="rememberMe"
                        className="ml-2 mt-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none"
                    >
                        Keep me logged in
                    </label>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </div>
                        ) : (
                            'Login'
                        )}
                    </button>
                    <Link
                        to="/forgot-password"
                        className="text-sm link-primary dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-6" role="separator"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Or, if you created your account with Google:
                </p>
                <div className="mt-4">
                    <button
                        type="button"
                        disabled={isLoading}
                        className={`btn-google w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex justify-center items-center h-6 -ml-4">
                            <svg width="26" height="26" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3-2.332z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                            </svg>
                        </div>
                        <span className="flex-grow text-center">Continue with Google</span>
                    </button>
                </div>
            </form>
        </>
    );
}

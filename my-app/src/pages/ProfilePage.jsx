import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';
import { useTheme } from '../contexts/ThemeContext';
import { SEO } from '../components/SEO';

// Get singleton instance
const authService = new AuthService();

export const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { theme, setTheme } = useTheme();
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60',
        location: '',
        website: '',
        stats: {
            resumes: 0,
            templates: 0,
            downloads: 0,
            views: 0
        },
        notifications: {
            email: true,
            push: true,
            updates: true
        },
        privacy: {
            profileVisibility: 'public',
            resumeVisibility: 'public',
            showEmail: false
        }
    });

    // Use singleton instance
    const loadUserData = useCallback(async () => {
        try {
            setIsLoading(true);
            const user = await authService.getCurrentUser();

            if (user) {
                setUserData(prevData => ({
                    ...prevData,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    email: user.email || '',
                }));
            }
        } catch (error) {
            toast.error('Failed to load user data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            // Send data in snake_case format as expected by the backend
            const updateData = {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
            };

            // Call the API to update the profile
            const updatedUser = await authService.updateProfile(updateData);

            // Update local state with the response data
            if (updatedUser) {
                setUserData(prevData => ({
                    ...prevData,
                    ...updatedUser
                }));
            }

            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };



    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Profile Settings"
                description="Manage your AutoResum profile settings, preferences, and account information."
                keywords={['profile settings', 'account management', 'user preferences', 'account settings']}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Hello, {userData.first_name || 'there'}! 👋
                            </h1>
                            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                                Manage your account settings and preferences
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                        {/* Profile Info Section */}
                        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                            <div className="max-w-2xl">
                                <div className="space-y-6">
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                            Profile Information
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Update your personal details below
                                        </p>
                                    </div>
                                    <div className="border-b border-gray-200 dark:border-gray-700"></div>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2">
                                                <span>First Name</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={userData.first_name}
                                                onChange={handleNameChange}
                                                placeholder="Enter your first name"
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2">
                                                <span>Last Name</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={userData.last_name}
                                                onChange={handleNameChange}
                                                placeholder="Enter your last name"
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <span>Email Address</span>
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleNameChange}
                                            placeholder="Enter your email address"
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className={`btn-primary ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Theme Preferences */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Theme Preferences</h2>
                                    <div className="space-y-3">
                                        {['light', 'dark', 'system'].map((themeOption) => (
                                            <div key={themeOption} className="relative">
                                                <input
                                                    type="radio"
                                                    id={themeOption}
                                                    name="theme"
                                                    checked={theme === themeOption}
                                                    onChange={() => handleThemeChange(themeOption)}
                                                    className="sr-only"
                                                    aria-label={`Select ${themeOption} theme`}
                                                />
                                                <label
                                                    htmlFor={themeOption}
                                                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${theme === themeOption
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                        }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${theme === themeOption
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                        }`}>
                                                        {theme === themeOption && (
                                                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center flex-1">
                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 ${themeOption === 'light' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                                            themeOption === 'dark' ? 'bg-gray-800 dark:bg-gray-700' :
                                                                'bg-gradient-to-r from-yellow-100 to-gray-800 dark:from-yellow-900 dark:to-gray-700'
                                                            }`}>
                                                            {themeOption === 'light' && (
                                                                <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                            {themeOption === 'dark' && (
                                                                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                                                </svg>
                                                            )}
                                                            {themeOption === 'system' && (
                                                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                                {themeOption} theme
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {themeOption === 'light' && 'Clean and bright interface'}
                                                                {themeOption === 'dark' && 'Easy on the eyes in low light'}
                                                                {themeOption === 'system' && 'Follows your system preference'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Account Actions */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Actions</h2>
                                    <div className="space-y-4">
                                        <Link
                                            to="/change-password"
                                            className="w-full inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out"
                                            aria-label="Change password"
                                        >
                                            Change password
                                        </Link>
                                        <button className="w-full inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-full border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200 ease-in-out"
                                            aria-label="Delete account"
                                        >
                                            Delete account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
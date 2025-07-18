import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';
import { useTheme } from '../contexts/ThemeContext';
import { SEO } from '../components/SEO';

// Get singleton instance
const authService = new AuthService();

export const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
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

            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Add this function to get initials
    const getInitials = (firstName, lastName) => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return (first + last).toUpperCase();
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
                        <div className="flex items-center gap-2">
                            <button
                                onClick={isEditing ? handleSave : () => setIsEditing(true)}
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
                                ) : isEditing ? (
                                    'Save changes'
                                ) : (
                                    'Edit profile'
                                )}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                    className="inline-flex items-center px-5 py-3 text-base font-medium rounded-full text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        {/* Profile Info Section */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-lg bg-blue-600 flex items-center justify-center text-white text-4xl font-semibold">
                                        {getInitials(userData.first_name, userData.last_name)}
                                    </div>
                                    {isEditing && (
                                        <button className="absolute bottom-2 right-2 btn-primary p-2 rounded-full">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={userData.first_name}
                                                    onChange={handleNameChange}
                                                    placeholder="First name"
                                                    className="px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ease-in-out"
                                                />
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={userData.last_name}
                                                    onChange={handleNameChange}
                                                    placeholder="Last name"
                                                    className="px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ease-in-out"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {userData.first_name} {userData.last_name}
                                            </h2>
                                        </div>
                                    )}
                                    <div className="mt-4 flex flex-wrap gap-4">
                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                            <svg className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {userData.email}
                                        </div>
                                        {userData.location && (
                                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                <svg className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {userData.location}
                                            </div>
                                        )}
                                        {userData.website && (
                                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                <svg className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                {userData.website}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Statistics</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {Object.entries(userData.stats).map(([key, value]) => (
                                    <div key={key} className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
                                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
                                        <div className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                                            {key}
                                        </div>
                                    </div>
                                ))}
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
                                                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                        theme === themeOption 
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                                        theme === themeOption 
                                                            ? 'border-blue-500 bg-blue-500' 
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    }`}>
                                                        {theme === themeOption && (
                                                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center flex-1">
                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 ${
                                                            themeOption === 'light' ? 'bg-yellow-100 dark:bg-yellow-900' :
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
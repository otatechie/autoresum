import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';
import { SEO } from '../components/SEO';
import { getApiUrl } from '../config/environment';
import { generateResumePDF } from '../utils/pdfGenerator';

export function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const authService = new AuthService();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch resumes from the backend
        const fetchResumes = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const token = authService.getToken();
                if (!token) {
                    throw new Error('Not authenticated. Please log in.');
                }

                const response = await fetch(getApiUrl('resume/list'), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch resumes: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setResumes(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Failed to fetch resumes. Please try again later.');
                toast.error(err.message || 'Failed to fetch resumes. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if user is authenticated
        if (!authLoading && user) {
            fetchResumes();
        } else if (!authLoading && !user) {
            setIsLoading(false);
        }
    }, [user, authLoading]);



    const handleDownload = (resume) => {
        generateResumePDF(
            resume,
            () => {
                toast.success('Resume downloaded successfully!');
            },
            () => {
                toast.error('Failed to generate PDF. Please try again.');
            }
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO 
                title="Dashboard"
                description="Manage your resumes and cover letters, track applications, and get insights into your job search progress."
                keywords={['dashboard', 'resume management', 'job applications', 'career tracking']}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                            <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
                                Create, manage and track your resumes
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                        {/* Stats Section */}
                        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="relative p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-xl bg-blue-500 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Resumes</p>
                                            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{resumes.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-xl bg-green-500 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
                                            <p className="text-3xl font-bold text-green-900 dark:text-green-100">{resumes.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-xl bg-purple-500 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">This Month</p>
                                            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                                {resumes.filter(r => {
                                                    const created = new Date(r.created_at);
                                                    const now = new Date();
                                                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                                                }).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-xl bg-orange-500 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Downloads</p>
                                            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
                                <Link to="/resumes" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {resumes.slice(0, 5).map((resume) => (
                                    <div key={resume.id} className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {resume.first_name} {resume.last_name}
                                                    </p>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                                        {new Date(resume.modified_at || resume.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {resume.email}
                                                </p>
                                                <div className="mt-2 flex items-center space-x-2">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        Resume Created
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                                                <Link
                                                    to={`/resume/${resume.id}`}
                                                    className="btn-secondary btn-sm btn-icon"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Link
                                    to="/create-resume"
                                    className="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-200">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Create New Resume</p>
                                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Start building your professional resume</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    to="/cover-letter"
                                    className="group relative p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-200">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-semibold text-green-900 dark:text-green-100">Create Cover Letter</p>
                                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Write a compelling cover letter</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    to="/templates"
                                    className="group relative p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-200">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Browse Templates</p>
                                            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Choose from professional templates</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Resumes Grid */}
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Resumes</h2>
                            </div>
                            
                            {error ? (
                                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-6 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">Error loading resumes</h3>
                                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : resumes.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {resumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {resume.first_name} {resume.last_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {resume.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    Active
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Created {new Date(resume.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Last updated {new Date(resume.modified_at || resume.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3">
                                                <Link
                                                    to={`/resume/${resume.id}`}
                                                    className="btn-secondary flex-1"
                                                >
                                                 
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDownload(resume)}
                                                    className="btn-primary flex-1"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                        Get started by creating your first professional resume. Our AI-powered builder will help you create a compelling resume in minutes.
                                    </p>
                                    <Link
                                        to="/create-resume"
                                        className="btn-primary btn-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Your First Resume
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
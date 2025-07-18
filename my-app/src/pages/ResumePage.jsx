import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';
import { SEO } from '../components/SEO';
import { getApiUrl } from '../config/environment';

export function ResumePage() {
    const { user, loading: authLoading } = useAuth();
    const authService = new AuthService();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [activeTab, setActiveTab] = useState('list');

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

                console.log('Fetching resumes from:', getApiUrl('resume/list'));
                console.log('Token:', token ? 'Present' : 'Missing');

                const response = await fetch(getApiUrl('resume/list'), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Response error:', errorText);
                    throw new Error(`Failed to fetch resumes: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Resumes data:', data);
                setResumes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching resumes:', err);
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

    const handleResumeSelect = (resume) => {
        setSelectedResume(resume);
        setActiveTab('preview');
    };

    const formatResumeContent = (resume) => {
        const sections = [];
        
        // Personal Information
        if (resume.first_name || resume.last_name || resume.email || resume.phone) {
            sections.push({
                id: 1,
                title: 'Personal Information',
                content: `${resume.first_name || ''} ${resume.last_name || ''}\n${resume.email || ''}\n${resume.phone || ''}`,
                isExpanded: true
            });
        }

        // Professional Summary
        if (resume.resume_summary) {
            sections.push({
                id: 2,
                title: 'Professional Summary',
                content: resume.resume_summary,
                isExpanded: true
            });
        }

        // Work Experience
        if (resume.work_experience) {
            sections.push({
                id: 3,
                title: 'Work Experience',
                content: resume.work_experience,
                isExpanded: true
            });
        }

        // Education
        if (resume.education) {
            sections.push({
                id: 4,
                title: 'Education',
                content: resume.education,
                isExpanded: true
            });
        }

        // Skills
        if (resume.skills) {
            sections.push({
                id: 5,
                title: 'Skills',
                content: resume.skills,
                isExpanded: true
            });
        }

        // Languages
        if (resume.languages) {
            sections.push({
                id: 6,
                title: 'Languages',
                content: resume.languages,
                isExpanded: true
            });
        }

        return sections;
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
                title="Resumes"
                description="View and manage all your resumes. Create, edit, and download professional resumes."
                keywords={['resumes', 'resume management', 'view resumes', 'download resumes']}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resumes</h1>
                            <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
                                {selectedResume ? `Viewing: ${selectedResume.first_name} ${selectedResume.last_name}` : 'Manage and customize your resumes'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                        {/* Tabs */}
                        <div className="px-8 border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('list')}
                                    className={`${
                                        activeTab === 'list'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        All Resumes
                                    </div>
                                </button>
                                {selectedResume && (
                                    <>
                                        <button
                                            onClick={() => setActiveTab('preview')}
                                            className={`${
                                                activeTab === 'preview'
                                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                            } whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm transition-colors`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Preview
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('edit')}
                                            className={`${
                                                activeTab === 'edit'
                                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                            } whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm transition-colors`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </div>
                                        </button>
                                    </>
                                )}
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="p-8">
                            {activeTab === 'list' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Your Resumes
                                        </h2>
                                        <Link
                                            to="/create-resume"
                                            className="btn-primary inline-flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create New Resume
                                        </Link>
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
                                                    className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                                    onClick={() => handleResumeSelect(resume)}
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
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleResumeSelect(resume);
                                                            }}
                                                            className="btn-secondary flex-1"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // TODO: Implement download functionality
                                                                toast.info('Download functionality coming soon!');
                                                            }}
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
                            )}

                            {activeTab === 'preview' && selectedResume && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Resume Preview - {selectedResume.first_name} {selectedResume.last_name}
                                        </h2>
                                        <div className="flex gap-3">
                                            <button
                                                className="btn-secondary inline-flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                </svg>
                                                Print
                                            </button>
                                            <button
                                                className="btn-primary inline-flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none">
                                        {formatResumeContent(selectedResume).map(section => (
                                            <div key={section.id} className="mb-8">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                    {section.title}
                                                </h3>
                                                <div className="whitespace-pre-line text-gray-600 dark:text-gray-400">
                                                    {section.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'edit' && selectedResume && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Edit Resume - {selectedResume.first_name} {selectedResume.last_name}
                                        </h2>
                                        <button
                                            className="btn-primary inline-flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {formatResumeContent(selectedResume).map(section => (
                                            <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200">
                                                <div className="flex justify-between items-center p-4">
                                                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                                        {section.title}
                                                    </h3>
                                                </div>
                                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                                    <textarea
                                                        className="w-full h-32 px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={section.content}
                                                        readOnly
                                                        placeholder="Content will be editable in future updates..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 
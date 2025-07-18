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
    const [openActionsMenu, setOpenActionsMenu] = useState(null);

    // Close actions menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openActionsMenu && !event.target.closest('.actions-menu')) {
                setOpenActionsMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openActionsMenu]);

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
                    const errorText = await response.text();
                    console.error('Response error:', errorText);
                    throw new Error(`Failed to fetch resumes: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
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



    const handlePrint = (resume) => {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');

        // Create the HTML content for printing
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${resume.first_name} ${resume.last_name} - Resume</title>
                <style>
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .name {
                        font-size: 28px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .contact-info {
                        font-size: 14px;
                        color: #666;
                    }
                    .section {
                        margin-bottom: 25px;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: bold;
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 5px;
                        margin-bottom: 15px;
                        color: #333;
                    }
                    .content {
                        font-size: 14px;
                        line-height: 1.5;
                    }
                    
                    /* Button Styles */
                    .btn {
                        cursor: pointer;
                        padding: 0.6rem 1rem;
                        font-size: 0.9rem;
                        font-weight: 500;
                        border-radius: 0.5rem;
                        transition: all 150ms ease;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        text-decoration: none;
                        border: 1px solid;
                    }
                    
                    .btn-primary {
                        background-color: rgb(59 130 246);
                        color: white;
                        border-color: rgb(37 99 235);
                    }
                    
                    .btn-primary:hover {
                        background-color: rgb(37 99 235);
                    }
                    
                    .btn-secondary {
                        background-color: rgb(249 250 251);
                        color: rgb(55 65 81);
                        border-color: rgb(209 213 219);
                    }
                    
                    .btn-secondary:hover {
                        background-color: rgb(243 244 246);
                        border-color: rgb(156 163 175);
                    }
                    
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="name">${resume.first_name || ''} ${resume.last_name || ''}</div>
                    <div class="contact-info">
                        ${resume.email || ''}<br>
                        ${resume.phone || ''}
                    </div>
                </div>
                
                ${formatResumeContent(resume).map(section => `
                    <div class="section">
                        <div class="section-title">${section.title}</div>
                        <div class="content">${section.content.replace(/\n/g, '<br>')}</div>
                    </div>
                `).join('')}
                
                <div class="no-print" style="position: fixed; top: 10px; right: 10px;">
                    <button onclick="window.print()" class="btn-primary" style="margin-right: 10px;">
                        Print Resume
                    </button>
                    <button onclick="window.close()" class="btn-secondary">
                        Close
                    </button>
                </div>
            </body>
            </html>
        `;

        // Write the content to the new window
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for content to load, then trigger print
        printWindow.onload = () => {
            printWindow.focus();
            // Small delay to ensure content is fully rendered
            setTimeout(() => {
                printWindow.print();
            }, 500);
        };
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
            let workContent = '';
            if (typeof resume.work_experience === 'string') {
                workContent = resume.work_experience;
            } else if (Array.isArray(resume.work_experience)) {
                workContent = resume.work_experience.map(job => {
                    if (typeof job === 'string') return job;
                    return Object.entries(job).map(([key, value]) => `${key}: ${value}`).join('\n');
                }).join('\n\n');
            } else if (typeof resume.work_experience === 'object') {
                workContent = Object.entries(resume.work_experience).map(([key, value]) => `${key}: ${value}`).join('\n');
            }

            if (workContent) {
                sections.push({
                    id: 3,
                    title: 'Work Experience',
                    content: workContent,
                    isExpanded: true
                });
            }
        }

        // Education
        if (resume.education) {
            let educationContent = '';
            if (typeof resume.education === 'string') {
                educationContent = resume.education;
            } else if (Array.isArray(resume.education)) {
                educationContent = resume.education.map(edu => {
                    if (typeof edu === 'string') return edu;
                    return Object.entries(edu).map(([key, value]) => `${key}: ${value}`).join('\n');
                }).join('\n\n');
            } else if (typeof resume.education === 'object') {
                educationContent = Object.entries(resume.education).map(([key, value]) => `${key}: ${value}`).join('\n');
            }

            if (educationContent) {
                sections.push({
                    id: 4,
                    title: 'Education',
                    content: educationContent,
                    isExpanded: true
                });
            }
        }

        // Skills
        if (resume.skills) {
            let skillsContent = '';
            if (typeof resume.skills === 'string') {
                skillsContent = resume.skills;
            } else if (Array.isArray(resume.skills)) {
                skillsContent = resume.skills.join(', ');
            } else if (typeof resume.skills === 'object') {
                skillsContent = Object.entries(resume.skills).map(([key, value]) => `${key}: ${value}`).join('\n');
            }

            if (skillsContent) {
                sections.push({
                    id: 5,
                    title: 'Skills',
                    content: skillsContent,
                    isExpanded: true
                });
            }
        }

        // Languages
        if (resume.languages) {
            let languagesContent = '';
            if (typeof resume.languages === 'string') {
                languagesContent = resume.languages;
            } else if (Array.isArray(resume.languages)) {
                languagesContent = resume.languages.join(', ');
            } else if (typeof resume.languages === 'object') {
                languagesContent = Object.entries(resume.languages).map(([key, value]) => `${key}: ${value}`).join('\n');
            }

            if (languagesContent) {
                sections.push({
                    id: 6,
                    title: 'Languages',
                    content: languagesContent,
                    isExpanded: true
                });
            }
        }

        return sections;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 shadow-md">
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
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resumes</h1>
                                {resumes.length > 0 && (
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                        {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
                                {selectedResume ? `Viewing: ${selectedResume.first_name} ${selectedResume.last_name}` : 'Manage and customize your resumes'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                        {/* Tabs */}
                        <div className="px-8 border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('list')}
                                    className={`${activeTab === 'list'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                        } whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer`}
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
                                            className={`${activeTab === 'preview'
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                                } whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer`}
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
                                            className={`${activeTab === 'edit'
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                                } whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer`}
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
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                            Your Resumes
                                        </h2>
                                        <div className="flex items-center space-x-3">
                                            <form className="relative w-80" onSubmit={(e) => e.preventDefault()}>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Search resumes..."
                                                        className="form-control pl-10"
                                                    />
                                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                            </form>
                                            <select className="form-control w-40">
                                                <option value="">All Status</option>
                                                <option value="complete">Complete</option>
                                                <option value="incomplete">In Progress</option>
                                            </select>
                                        </div>
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
                                        <div className="space-y-4">
                                            {resumes.map((resume) => (
                                                <div
                                                    key={resume.id}
                                                    className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg w-12 h-12 flex items-center justify-center">
                                                                <span className="text-white font-bold text-lg">
                                                                    {resumes.indexOf(resume) + 1}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {resume.first_name} {resume.last_name}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {resume.email}
                                                                </p>
                                                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                                    <span className="flex items-center">
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                        Created {new Date(resume.created_at).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </span>
                                                                    <span className="flex items-center">
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Updated {new Date(resume.modified_at || resume.created_at).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </span>
                                                                    <span className="flex items-center">
                                                                        <div className={`w-2 h-2 rounded-full mr-1 ${resume.resume_summary && resume.work_experience ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                                                        {resume.resume_summary && resume.work_experience ? 'Complete' : 'In Progress'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedResume(resume);
                                                                    setActiveTab('edit');
                                                                }}
                                                                className="btn-secondary btn-sm inline-flex items-center gap-2"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <div className="relative actions-menu">
                                                                <button
                                                                    onClick={() => setOpenActionsMenu(openActionsMenu === resume.id ? null : resume.id)}
                                                                    className="btn-secondary btn-sm inline-flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                    </svg>
                                                                    Actions
                                                                </button>

                                                                {openActionsMenu === resume.id && (
                                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedResume(resume);
                                                                                    setActiveTab('preview');
                                                                                    setOpenActionsMenu(null);
                                                                                }}
                                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                </svg>
                                                                                Preview
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedResume(resume);
                                                                                    setActiveTab('edit');
                                                                                    setOpenActionsMenu(null);
                                                                                }}
                                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                </svg>
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    handlePrint(resume);
                                                                                    setOpenActionsMenu(null);
                                                                                }}
                                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                                                </svg>
                                                                                Print
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    toast.info('Download functionality coming soon!');
                                                                                    setOpenActionsMenu(null);
                                                                                }}
                                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                </svg>
                                                                                Download PDF
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    toast.info('Share functionality coming soon!');
                                                                                    setOpenActionsMenu(null);
                                                                                }}
                                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                                                </svg>
                                                                                Share
                                                                            </button>
                                                                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                                                            <button
                                                                                onClick={() => {
                                                                                    toast.error('Delete functionality coming soon!');
                                                                                    setOpenActionsMenu(null);
                                                                                }}
                                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 cursor-pointer"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center mb-8">
                                                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No resumes yet</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto text-lg">
                                                Get started by creating your first professional resume. Our AI-powered builder will help you create a compelling resume in minutes.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Link
                                                    to="/create-resume"
                                                    className="btn-primary btn-lg inline-flex items-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Create Your First Resume
                                                </Link>
                                                <button className="btn-secondary btn-lg inline-flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Learn More
                                                </button>
                                            </div>
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
                                                onClick={() => handlePrint(selectedResume)}
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
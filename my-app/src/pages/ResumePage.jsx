import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';
import { SEO } from '../components/SEO';
import { getApiUrl } from '../config/environment';
import { generateResumePDF, formatResumeContent } from '../utils/pdfGenerator';

export function ResumePage() {
    const { user, loading: authLoading } = useAuth();
    const authService = new AuthService();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [openActionsMenu, setOpenActionsMenu] = useState(null);
    const [editedContent, setEditedContent] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [aiUpdateProgress, setAiUpdateProgress] = useState(0);
    const [editFormData, setEditFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        resume_summary: '',
        work_experience: {},
        education: {},
        languages: {},
        skills: {},
        certifications: {}
    });

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

    // Initialize edit form data when a resume is selected for editing
    useEffect(() => {
        if (selectedResume && activeTab === 'edit') {
            // Helper function to extract first work experience item
            const getFirstWorkExperience = (workExp) => {
                if (Array.isArray(workExp) && workExp.length > 0) {
                    return workExp[0] || {};
                }
                return workExp || {};
            };
            
            // Helper function to extract first education item
            const getFirstEducation = (edu) => {
                if (Array.isArray(edu) && edu.length > 0) {
                    return edu[0] || {};
                }
                return edu || {};
            };
            
            // Initialize form data from selected resume
            setEditFormData({
                first_name: selectedResume.first_name || '',
                last_name: selectedResume.last_name || '',
                email: selectedResume.email || '',
                phone_number: selectedResume.phone_number || '',
                resume_summary: selectedResume.resume_summary || '',
                // Handle work experience - extract first item from array or use as is
                work_experience: getFirstWorkExperience(selectedResume.work_experience),
                // Handle education - extract first item from array or use as is
                education: getFirstEducation(selectedResume.education),
                // Handle skills - convert array to comma-separated string
                skills: Array.isArray(selectedResume.skills) 
                    ? { list: selectedResume.skills.join(', ') }
                    : selectedResume.skills || { list: '' },
                // Handle languages - convert array to comma-separated string
                languages: Array.isArray(selectedResume.languages)
                    ? { list: selectedResume.languages.join(', ') }
                    : selectedResume.languages || { list: '' },
                // Handle certifications - convert array to comma-separated string
                certifications: Array.isArray(selectedResume.certifications)
                    ? { list: selectedResume.certifications.join(', ') }
                    : selectedResume.certifications || { list: '' }
            });
            
            // Also keep the old format for backward compatibility
            const sections = formatResumeContent(selectedResume);
            const initialContent = {};
            sections.forEach(section => {
                initialContent[section.id] = section.content;
            });
            setEditedContent(initialContent);
        }
    }, [selectedResume, activeTab]);

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

    // Form handlers for edit mode
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditWorkExperienceChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            work_experience: {
                ...prev.work_experience,
                [field]: value
            }
        }));
    };

    const handleEditEducationChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [field]: value
            }
        }));
    };

    const handleEditSkillsChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [field]: value
            }
        }));
    };

    const handleEditLanguagesChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            languages: {
                ...prev.languages,
                [field]: value
            }
        }));
    };

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

    const handleSaveChanges = async () => {
        if (!selectedResume) return;

        try {
            setIsSaving(true);
            const token = authService.getToken();
            if (!token) {
                throw new Error('Not authenticated. Please log in.');
            }

            // Prepare data for API using the form structure like CreateResumePage
            const apiData = {
                first_name: editFormData.first_name || selectedResume.first_name || '',
                last_name: editFormData.last_name || selectedResume.last_name || '',
                email: editFormData.email || selectedResume.email || '',
                phone_number: editFormData.phone_number || selectedResume.phone_number || '',
                resume_summary: editFormData.resume_summary || selectedResume.resume_summary || ''
            };

            // Only add work_experience if it has content
            if (editFormData.work_experience.company || editFormData.work_experience.position || editFormData.work_experience.description) {
                apiData.work_experience = editFormData.work_experience;
            } else if (selectedResume.work_experience) {
                apiData.work_experience = selectedResume.work_experience;
            }

            // Only add education if it has content
            if (editFormData.education.institution || editFormData.education.degree) {
                apiData.education = editFormData.education;
            } else if (selectedResume.education) {
                apiData.education = selectedResume.education;
            }

            // Only add languages if it has content
            if (editFormData.languages.list && editFormData.languages.list.trim()) {
                apiData.languages = editFormData.languages;
            } else if (selectedResume.languages) {
                apiData.languages = selectedResume.languages;
            }

            // Only add skills if it has content
            if (editFormData.skills.list && editFormData.skills.list.trim()) {
                apiData.skills = editFormData.skills;
            } else if (selectedResume.skills) {
                apiData.skills = selectedResume.skills;
            }

            // Only add certifications if it has content
            if (editFormData.certifications.list && editFormData.certifications.list.trim()) {
                apiData.certifications = editFormData.certifications;
            } else if (selectedResume.certifications) {
                apiData.certifications = selectedResume.certifications;
            }

            // Check if any fields were edited
            const hasEdits = editFormData.resume_summary || 
                           editFormData.skills.list || 
                           editFormData.languages.list ||
                           editFormData.work_experience.company || 
                           editFormData.work_experience.position || 
                           editFormData.work_experience.description ||
                           editFormData.education.institution || 
                           editFormData.education.degree;

            if (hasEdits) {
                // Use manual update for all fields
                await handleManualUpdate(apiData);
            } else {
                toast.info('No changes to save.');
                setIsSaving(false);
                return;
            }
        } catch (err) {
            toast.error(err.message || 'Failed to update resume. Please try again.');
            setIsSaving(false);
                }
    };

    const handleManualUpdate = async (apiData) => {
        const token = authService.getToken();

            const response = await fetch(getApiUrl(`resume/update/${selectedResume.id}`), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            body: JSON.stringify(apiData)
            });

            if (!response.ok) {
                throw new Error(`Failed to update resume: ${response.status} ${response.statusText}`);
            }

            const updatedResumeData = await response.json();
            
            // Update the resumes list with the new data
            setResumes(prevResumes => 
                prevResumes.map(resume => 
                    resume.id === selectedResume.id ? updatedResumeData : resume
                )
            );
            
            // Update the selected resume
            setSelectedResume(updatedResumeData);
            
            toast.success('Resume updated successfully!');
            setIsSaving(false);
    };

    const handleAIUpdate = async (apiData) => {
        const token = authService.getToken();
        
        console.log('Starting AI update with data:', apiData);
        
        // Step 1: Start AI generation
        const generateResponse = await fetch(getApiUrl(`resume/generate/update/${selectedResume.id}`), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(apiData)
        });

        if (!generateResponse.ok) {
            const errorText = await generateResponse.text();
            console.log('AI generation error:', errorText);
            throw new Error(`Failed to start AI update: ${generateResponse.status} ${generateResponse.statusText}`);
        }

        const generateData = await generateResponse.json();
        const resumeContentId = generateData.resume_content_id;
        
        console.log('AI generation started, content ID:', resumeContentId);
        toast.info('AI is updating your resume... This may take a moment.');

        // Step 2: Poll for completion
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            setAiUpdateProgress(Math.round((attempts / maxAttempts) * 100));
            
            const statusResponse = await fetch(getApiUrl(`resume/generated/update/${resumeContentId}`), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!statusResponse.ok) {
                throw new Error(`Failed to check AI update status: ${statusResponse.status}`);
            }

            const statusData = await statusResponse.json();
            console.log('AI update status:', statusData);

            if (statusData.status === 'Success') {
                // AI update completed successfully
                const updatedResumeData = statusData.resume;
                
                // Update the resumes list with the new data
                setResumes(prevResumes => 
                    prevResumes.map(resume => 
                        resume.id === selectedResume.id ? updatedResumeData : resume
                    )
                );
                
                // Update the selected resume
                setSelectedResume(updatedResumeData);
                
                toast.success('AI has updated your resume successfully!');
                setIsSaving(false);
                setAiUpdateProgress(0);
                return;
            } else if (statusData.status === 'Failed') {
                throw new Error(statusData.message || 'AI update failed');
            }
            
            attempts++;
        }
        
        setAiUpdateProgress(0);
        throw new Error('AI update timed out. Please try again.');
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
                                                                                    handleDownload(resume);
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
                                                onClick={() => handleDownload(selectedResume)}
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
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Edit Resume - {selectedResume.first_name} {selectedResume.last_name}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Simple fields update instantly. Complex fields use AI for better formatting.
                                        </p>
                                    </div>
                                    
                                    <form className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        {/* Personal Information */}
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="first_name"
                                                        value={editFormData.first_name}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="last_name"
                                                        value={editFormData.last_name}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editFormData.email}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone_number"
                                                        value={editFormData.phone_number}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional Summary */}
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Professional Summary</h2>
                                                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                                                    Instant Update
                                                </span>
                                            </div>
                                            <textarea
                                                name="resume_summary"
                                                value={editFormData.resume_summary}
                                                onChange={handleEditInputChange}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                placeholder="Enter your professional summary..."
                                            />
                                        </div>

                                        {/* Work Experience */}
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience</h2>
                                                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                                                    Instant Update
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Company
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.work_experience.company || ''}
                                                        onChange={(e) => handleEditWorkExperienceChange('company', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Position
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.work_experience.position || ''}
                                                        onChange={(e) => handleEditWorkExperienceChange('position', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={editFormData.work_experience.description || ''}
                                                        onChange={(e) => handleEditWorkExperienceChange('description', e.target.value)}
                                                        rows={4}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                        placeholder="Describe your role and achievements..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Education */}
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                                                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                    </svg>
                                                </div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
                                                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                                                    Instant Update
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Institution
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.education.institution || ''}
                                                        onChange={(e) => handleEditEducationChange('institution', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Degree
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.education.degree || ''}
                                                        onChange={(e) => handleEditEducationChange('degree', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                                                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                </div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
                                                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                                                    Instant Update
                                                </span>
                                            </div>
                                            <textarea
                                                value={editFormData.skills.list || ''}
                                                onChange={(e) => handleEditSkillsChange('list', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                placeholder="Enter your skills (comma-separated)..."
                                            />
                                        </div>

                                        {/* Languages */}
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                                                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                    </svg>
                                                </div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Languages</h2>
                                                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                                                    Instant Update
                                                </span>
                                            </div>
                                            <textarea
                                                value={editFormData.languages.list || ''}
                                                onChange={(e) => handleEditLanguagesChange('list', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                placeholder="Enter your languages (comma-separated)..."
                                            />
                                        </div>

                                        {/* Form Actions */}
                                        <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-b-xl">
                                            <div className="flex justify-end">
                                        <button
                                            onClick={handleSaveChanges}
                                            disabled={isSaving}
                                                    className={`btn-primary btn-lg inline-flex items-center gap-x-3 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'}`}
                                        >
                                            {isSaving ? (
                                                <>
                                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                            {aiUpdateProgress > 0 ? `AI Processing... ${aiUpdateProgress}%` : 'Saving...'}
                                                </>
                                            ) : (
                                                <>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                                </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 
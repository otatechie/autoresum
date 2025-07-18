import React, { useState, useEffect } from 'react';
import { TextInput, TextAreaInput } from '../components/FormComponents';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../utils/notifications';
import { SEO } from '../components/SEO';

// --- MOCK DATA FOR COVER LETTERS ---
const mockCoverLetters = [
    {
        id: '1',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        phone_number: '+1234567890',
        company_name: 'Acme Corp',
        job_title: 'Product Manager',
        job_description: 'Lead product development...',
        hiring_manager: 'John Smith',
        reason_for_applying: 'I am passionate about product management.',
        cover_letter_content: 'Dear John Smith,\nI am excited to apply...',
        generated_content: 'Dear John Smith,\nI am excited to apply...',
        created_at: '2024-05-01T10:00:00Z',
        modified_at: '2024-05-02T12:00:00Z',
    },
    {
        id: '2',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        phone_number: '+1234567890',
        company_name: 'Globex',
        job_title: 'UX Designer',
        job_description: 'Design user experiences...',
        hiring_manager: 'Mary Lee',
        reason_for_applying: 'I love design.',
        cover_letter_content: 'Dear Mary Lee,\nI am excited to apply...',
        generated_content: 'Dear Mary Lee,\nI am excited to apply...',
        created_at: '2024-04-15T09:00:00Z',
        modified_at: '2024-04-16T11:00:00Z',
    },
];

export const CoverLetterPage = () => {
    const { user, loading: authLoading } = useAuth();

    // --- State ---
    const [coverLetters, setCoverLetters] = useState([]); // List of cover letters
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'preview' | 'edit'
    const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openActionsMenu, setOpenActionsMenu] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        company_name: '',
        job_title: '',
        hiring_manager: '',
        job_description: '',
        reason_for_applying: '',
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

    // --- Simulate fetching cover letters ---
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setCoverLetters(mockCoverLetters);
            setIsLoading(false);
        }, 800);
    }, []);

    // --- Form autofill from user ---
    useEffect(() => {
        if (user && !authLoading) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
            }));
        }
    }, [user, authLoading]);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectCoverLetter = (coverLetter) => {
        setSelectedCoverLetter(coverLetter);
        setActiveTab('preview');
    };

    const handleEditCoverLetter = (coverLetter) => {
        setSelectedCoverLetter(coverLetter);
        setFormData({ ...coverLetter });
        setActiveTab('edit');
    };

    const handleCreateNew = () => {
        setSelectedCoverLetter(null);
        setFormData({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone_number: '',
            company_name: '',
            job_title: '',
            hiring_manager: '',
            job_description: '',
            reason_for_applying: '',
        });
        setActiveTab('edit');
    };

    const handlePrint = (coverLetter) => {
        const printWindow = window.open('', '_blank');
        const printContent = `
      <html><head><title>Cover Letter</title></head><body>
      <pre style="font-family:serif;white-space:pre-wrap;">${coverLetter.cover_letter_content || coverLetter.generated_content}</pre>
      <button onclick="window.print()">Print</button>
      <button onclick="window.close()">Close</button>
      </body></html>
    `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 500);
        };
    };

    const handleDownload = (coverLetter) => {
        // For mock: download as .txt
        const blob = new Blob([
            coverLetter.cover_letter_content || coverLetter.generated_content
        ], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${coverLetter.first_name}_${coverLetter.last_name}_CoverLetter.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Cover letter downloaded!');
    };

    // --- Form submit (mock, just adds to list) ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const newLetter = {
                ...formData,
                id: (coverLetters.length + 1).toString(),
                cover_letter_content: `Dear ${formData.hiring_manager || 'Hiring Manager'},\nThis is a mock generated cover letter for ${formData.job_title} at ${formData.company_name}.`,
                generated_content: `Dear ${formData.hiring_manager || 'Hiring Manager'},\nThis is a mock generated cover letter for ${formData.job_title} at ${formData.company_name}.`,
                created_at: new Date().toISOString(),
                modified_at: new Date().toISOString(),
            };
            if (selectedCoverLetter) {
                setCoverLetters(prev => prev.map(cl => cl.id === selectedCoverLetter.id ? newLetter : cl));
                setSelectedCoverLetter(newLetter);
            } else {
                setCoverLetters(prev => [newLetter, ...prev]);
                setSelectedCoverLetter(newLetter);
            }
            setActiveTab('preview');
            setIsSubmitting(false);
            toast.success('Cover letter saved!');
        }, 1000);
    };

    // --- Loading state ---
    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <SEO 
                title="Cover Letters"
                description="View and manage all your cover letters. Create, edit, and download professional cover letters."
                keywords={['cover letters', 'cover letter management', 'view cover letters', 'download cover letters']}
            />
            <div className="bg-white dark:bg-gray-800 p-8 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cover Letters</h1>
                        {coverLetters.length > 0 && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                {coverLetters.length} {coverLetters.length === 1 ? 'cover letter' : 'cover letters'}
                            </span>
                        )}
                    </div>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
                        {selectedCoverLetter ? `Viewing: ${selectedCoverLetter.first_name} ${selectedCoverLetter.last_name}` : 'Manage and customize your cover letters'}
                    </p>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                    {/* Tabs */}
                    <div className="px-8 border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8" role="tablist" aria-label="Cover letter management tabs">
                            <button
                                onClick={() => setActiveTab('list')}
                                aria-label="View all cover letters"
                                aria-selected={activeTab === 'list'}
                                role="tab"
                                className={`${activeTab === 'list'
                                    ? 'border-green-500 text-green-600 dark:text-green-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    All Cover Letters
                                </div>
                            </button>
                            {selectedCoverLetter && (
                                <>
                                                                <button
                                onClick={() => setActiveTab('preview')}
                                aria-label="Preview selected cover letter"
                                aria-selected={activeTab === 'preview'}
                                role="tab"
                                className={`${activeTab === 'preview'
                                    ? 'border-green-500 text-green-600 dark:text-green-400'
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
                                aria-label="Edit selected cover letter"
                                aria-selected={activeTab === 'edit'}
                                role="tab"
                                className={`${activeTab === 'edit'
                                    ? 'border-green-500 text-green-600 dark:text-green-400'
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
                                        Your Cover Letters
                                    </h2>
                                    <div className="flex items-center space-x-3">
                                        <form className="relative w-80" onSubmit={(e) => e.preventDefault()}>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search cover letters..."
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
                                                <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">Error loading cover letters</h3>
                                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : coverLetters.length > 0 ? (
                                    <div className="space-y-4">
                                        {coverLetters.map((cl) => (
                                            <div
                                                key={cl.id}
                                                className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg w-12 h-12 flex items-center justify-center">
                                                            <span className="text-white font-bold text-lg">
                                                                {coverLetters.indexOf(cl) + 1}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {cl.first_name} {cl.last_name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {cl.email}
                                                            </p>
                                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                                <span className="flex items-center">
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    Created {new Date(cl.created_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Updated {new Date(cl.modified_at || cl.created_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleEditCoverLetter(cl)}
                                                            className="btn-secondary btn-sm inline-flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <div className="relative actions-menu">
                                                            <button
                                                                onClick={() => setOpenActionsMenu(openActionsMenu === cl.id ? null : cl.id)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        setOpenActionsMenu(openActionsMenu === cl.id ? null : cl.id);
                                                                    }
                                                                }}
                                                                className="btn-secondary btn-sm inline-flex items-center gap-2"
                                                                aria-label="More actions"
                                                                aria-expanded={openActionsMenu === cl.id}
                                                                aria-haspopup="true"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                </svg>
                                                                Actions
                                                            </button>

                                                            {openActionsMenu === cl.id && (
                                                                <div 
                                                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                                                                    role="menu"
                                                                    aria-label="Cover letter actions"
                                                                >
                                                                    <div className="py-1">
                                                                        <button
                                                                            onClick={() => {
                                                                                handleSelectCoverLetter(cl);
                                                                                setOpenActionsMenu(null);
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Escape') {
                                                                                    setOpenActionsMenu(null);
                                                                                }
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                                            role="menuitem"
                                                                            tabIndex={0}
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                            Preview
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleEditCoverLetter(cl);
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
                                                                                handlePrint(cl);
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
                                                                                handleDownload(cl);
                                                                                setOpenActionsMenu(null);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            Download
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
                                        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-full flex items-center justify-center mb-8">
                                            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No cover letters yet</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto text-lg">
                                            Get started by creating your first professional cover letter. Our AI-powered builder will help you create a compelling cover letter in minutes.
                                        </p>
                                        <button
                                            onClick={handleCreateNew}
                                            className="btn-primary btn-lg inline-flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Your First Cover Letter
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'preview' && selectedCoverLetter && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Cover Letter Preview - {selectedCoverLetter.first_name} {selectedCoverLetter.last_name}
                                    </h2>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handlePrint(selectedCoverLetter)}
                                            className="btn-secondary inline-flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                            </svg>
                                            Print
                                        </button>
                                        <button
                                            onClick={() => handleDownload(selectedCoverLetter)}
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
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold">
                                            {selectedCoverLetter.first_name} {selectedCoverLetter.last_name}
                                        </h3>
                                        <p>{selectedCoverLetter.email}</p>
                                        {selectedCoverLetter.phone_number && (
                                            <p>{selectedCoverLetter.phone_number}</p>
                                        )}
                                    </div>
                                    <div className="whitespace-pre-wrap font-serif">
                                        {selectedCoverLetter.cover_letter_content || selectedCoverLetter.generated_content}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'edit' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {selectedCoverLetter ? `Edit Cover Letter - ${selectedCoverLetter.first_name} ${selectedCoverLetter.last_name}` : 'Create New Cover Letter'}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Fill in the form and click "Save" to generate or update your cover letter.
                                    </p>
                                </div>
                                <form className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
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
                                    <TextInput
                                        label="First Name"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required={true}
                                    />
                                    <TextInput
                                        label="Last Name"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required={true}
                                    />
                                    <TextInput
                                        label="Email Address"
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required={true}
                                    />
                                    <TextInput
                                                label="Phone Number"
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        placeholder="+1234567890"
                                    />
                                </div>
                            </div>
                            {/* Job Information */}
                            <div className="p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Job Information</h2>
                                        </div>
                                        <div className="space-y-4">
                                    <TextInput
                                        label="Company Name"
                                        id="company_name"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleInputChange}
                                                placeholder="e.g., Google, Microsoft"
                                        required={true}
                                    />
                                    <TextInput
                                        label="Job Title"
                                        id="job_title"
                                        name="job_title"
                                        value={formData.job_title}
                                        onChange={handleInputChange}
                                                placeholder="e.g., Software Engineer, Marketing Manager"
                                        required={true}
                                    />
                                    <TextInput
                                        label="Hiring Manager (Optional)"
                                        id="hiring_manager"
                                        name="hiring_manager"
                                        value={formData.hiring_manager}
                                        onChange={handleInputChange}
                                                placeholder="e.g., John Smith"
                                    />
                                    <TextAreaInput
                                        label="Job Description"
                                        id="job_description"
                                        name="job_description"
                                        value={formData.job_description}
                                        onChange={handleInputChange}
                                        required={true}
                                        rows={6}
                                        placeholder="Paste the job description here..."
                                    />
                                </div>
                            </div>
                            {/* Additional Information */}
                            <div className="p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Information</h2>
                                        </div>
                                        <div className="space-y-4">
                                    <TextAreaInput
                                        label="Why are you interested in this position? (Optional)"
                                                id="reason_for_applying"
                                                name="reason_for_applying"
                                                value={formData.reason_for_applying}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Explain why you're interested in this position and how your experience makes you a good fit..."
                                    />
                        </div>
                    </div>
                            {/* Form Actions */}
                                    <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-b-xl">
                                <div className="flex justify-end">
                                                <button
                                        type="submit"
                                                className={`btn-primary btn-lg inline-flex items-center gap-x-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                        Saving...
                                            </>
                                                ) : (
                                                    <>Save</>
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
    );
}; 
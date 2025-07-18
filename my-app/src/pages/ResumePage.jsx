import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function ResumePage() {
    const [activeTab, setActiveTab] = useState('preview');
    const [resumeData, setResumeData] = useState({
        title: 'Software Engineer Resume',
        lastUpdated: '2024-03-15',
        status: 'published',
        views: 128,
        downloads: 45,
        sections: [
            {
                id: 1,
                title: 'Personal Information',
                content: 'John Doe\nSoftware Engineer\njohn.doe@example.com\n(123) 456-7890',
                isExpanded: true
            },
            {
                id: 2,
                title: 'Professional Summary',
                content: 'Experienced software engineer with 5+ years of experience in web development...',
                isExpanded: true
            },
            {
                id: 3,
                title: 'Work Experience',
                content: 'Senior Software Engineer\nABC Company\n2020-Present\n...',
                isExpanded: true
            },
            {
                id: 4,
                title: 'Education',
                content: 'Bachelor of Science in Computer Science\nXYZ University\n2015-2019',
                isExpanded: true
            }
        ]
    });

    const toggleSection = (sectionId) => {
        setResumeData({
            ...resumeData,
            sections: resumeData.sections.map(section => 
                section.id === sectionId 
                    ? { ...section, isExpanded: !section.isExpanded }
                    : section
            )
        });
    };

    const addNewSection = () => {
        const newSection = {
            id: resumeData.sections.length + 1,
            title: 'New Section',
            content: '',
            isExpanded: true
        };
        setResumeData({
            ...resumeData,
            sections: [...resumeData.sections, newSection]
        });
    };

    return (
        <>
            <SEO 
                title="Create Your Resume"
                description="Build a professional resume with our AI-powered resume builder. Choose from expert templates and get personalized suggestions to stand out."
                keywords={['resume builder', 'create resume', 'professional resume', 'AI resume', 'resume templates']}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Resume</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage and customize your resume
                            </p>
                        </div>
                        <div>
                            <Link
                                to="/create-resume"
                                className="btn-primary"
                            >
                                Create New
                            </Link>
                            <button
                                className="btn btn-outline ml-2"
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        {/* Stats Section */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</p>
                                            <p className="text-md font-semibold text-gray-900 dark:text-white">{resumeData.title}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                                            <p className="text-md font-semibold text-gray-900 dark:text-white">{resumeData.lastUpdated}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Views</p>
                                            <p className="text-md font-semibold text-gray-900 dark:text-white">{resumeData.views}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                                            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Downloads</p>
                                            <p className="text-md font-semibold text-gray-900 dark:text-white">{resumeData.downloads}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`${
                                        activeTab === 'preview'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className={`${
                                        activeTab === 'edit'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Edit
                                </button>
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="p-6">
                            {activeTab === 'preview' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Resume Preview
                                        </h2>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-outline"
                                            >
                                                Print
                                            </button>
                                            <button
                                                className="btn-primary"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none">
                                        {resumeData.sections.map(section => (
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

                            {activeTab === 'edit' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Edit Resume
                                        </h2>
                                        <button
                                            onClick={addNewSection}
                                            className="btn-primary"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Section
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {resumeData.sections.map(section => (
                                            <div key={section.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div 
                                                    className="flex justify-between items-center p-4 cursor-pointer"
                                                    onClick={() => toggleSection(section.id)}
                                                >
                                                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                                        {section.title}
                                                    </h3>
                                                    <svg 
                                                        className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${
                                                            section.isExpanded ? 'rotate-180' : ''
                                                        }`}
                                                        fill="none" 
                                                        viewBox="0 0 24 24" 
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                                {section.isExpanded && (
                                                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                                        <input
                                                            type="text"
                                                            className="w-full mb-4 px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={section.title}
                                                            onChange={(e) => {
                                                                const newSections = resumeData.sections.map(s => 
                                                                    s.id === section.id ? { ...s, title: e.target.value } : s
                                                                );
                                                                setResumeData({ ...resumeData, sections: newSections });
                                                            }}
                                                        />
                                                        <textarea
                                                            className="w-full h-32 px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={section.content}
                                                            onChange={(e) => {
                                                                const newSections = resumeData.sections.map(s => 
                                                                    s.id === section.id ? { ...s, content: e.target.value } : s
                                                                );
                                                                setResumeData({ ...resumeData, sections: newSections });
                                                            }}
                                                        />
                                                    </div>
                                                )}
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
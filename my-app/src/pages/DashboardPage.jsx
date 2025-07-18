import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import apiService from '../services/api';
import mockApiService from '../services/mockApiService';
import { toast } from '../utils/notifications';
import { SEO } from '../components/SEO';

// Use mock service for now while waiting for friend's backend
const apiService = mockApiService;

export function DashboardPage() {
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch resumes from the backend
        const fetchResumes = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/resumes');
                const data = await response.json();
                setResumes(data);
            } catch (err) {
                toast.error('Failed to fetch resumes. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResumes();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'published':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'archived':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
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
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Create, manage and track your resumes
                            </p>
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
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Resumes</p>
                                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{resumes.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="ml-3 sm:ml-4">
                                            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Published</p>
                                            <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                                                {resumes.filter(r => r.status === 'published').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="p-2 sm:p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3 sm:ml-4">
                                            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</p>
                                            <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                                                {resumes.filter(r => r.status === 'draft').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="p-2 sm:p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3 sm:ml-4">
                                            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Archived</p>
                                            <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                                                {resumes.filter(r => r.status === 'archived').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {resumes.slice(0, 5).map((resume) => (
                                    <div key={resume.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {resume.status === 'published' ? (
                                                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                                                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                ) : resume.status === 'draft' ? (
                                                    <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                                                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {resume.title}
                                                    </p>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(resume.updated_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    {resume.status === 'published' ? 'Published' : 
                                                     resume.status === 'draft' ? 'Updated draft' : 
                                                     'Modified'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resumes Grid */}
                        <div className="p-6">
                            {error ? (
                                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            ) : resumes.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {resumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {resume.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(resume.status)}`}>
                                                    {resume.status}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/edit-resume/${resume.id}`}
                                                    className="flex-1 inline-flex justify-center items-center px-3 py-1.5 text-sm font-medium rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    to={`/preview-resume/${resume.id}`}
                                                    className="flex-1 btn-primary"
                                                >
                                                    Preview
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No resumes yet</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Get started by creating your first resume
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            to="/create-resume"
                                            className="inline-flex items-center gap-2 btn-primary"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create New Resume
                                        </Link>
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextInput,
    TextAreaInput,
} from '../components/FormComponents';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';
import { getApiUrl } from '../config/environment';
import { SEO } from '../components/SEO';

export function CreateCoverLetterPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const authService = new AuthService();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [generatedCoverLetter, setGeneratedCoverLetter] = useState(null);
    const [generationStatus, setGenerationStatus] = useState('idle'); // 'idle' | 'generating' | 'success' | 'error'
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: '',
        company_name: '',
        job_title: '',
        job_description: '',
        hiring_manager: '',
        reason_for_applying: ''
    });

    // Update form data when user data becomes available
    useEffect(() => {
        if (user && !authLoading) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || ''
            }));
        }
    }, [user, authLoading]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setGenerationStatus('generating');
        setGeneratedCoverLetter(null);

        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Not authenticated. Please log in.');
            }

            // Validate required fields
            const requiredFields = ['first_name', 'last_name', 'email', 'company_name', 'job_title', 'job_description'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            }

            // Prepare API data with proper structure matching the API requirements
            const apiData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone_number: formData.phone_number || '',
                company_name: formData.company_name,
                job_title: formData.job_title,
                job_description: formData.job_description,
                hiring_manager: formData.hiring_manager || '',
                reason_for_applying: formData.reason_for_applying || ''
            };

            // First API call to generate content
            const generateResponse = await fetch(getApiUrl('cover-letter/generate'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiData)
            });

            // Check if response is valid
            const contentType = generateResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {

                throw new Error('Server returned a non-JSON response. Please check if the server is running correctly.');
            }

            // Parse JSON response
            const responseData = await generateResponse.json();

            if (!generateResponse.ok) {

                
                // Handle quota exceeded error specifically
                if (responseData.error_type === 'quota_exceeded') {
                    throw new Error('OpenAI API quota exceeded. Please try again later or contact support.');
                }
                
                throw new Error(responseData.message || 'Failed to generate cover letter');
            }

            const cover_letter_task_id = responseData.cover_letter_task_id;
            if (!cover_letter_task_id) {
                throw new Error('No cover letter task ID received from server');
            }

            toast.info('Cover letter generation started...');

            // Poll for the generated content with timeout
            let pollCount = 0;
            const maxPolls = 30; // 60 seconds max (30 * 2 seconds)
            
            const pollInterval = setInterval(async () => {
                pollCount++;
                if (pollCount > maxPolls) {
                    clearInterval(pollInterval);
                    setGenerationStatus('error');
                    throw new Error('Cover letter generation timed out. Please try again.');
                }
                try {

                    const pollResponse = await fetch(getApiUrl(`cover-letter/generated/${cover_letter_task_id}`), {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Check if poll response is valid JSON
                    const pollContentType = pollResponse.headers.get('content-type');
                    if (!pollContentType || !pollContentType.includes('application/json')) {

                        throw new Error('Server returned a non-JSON response for poll request');
                    }

                    const pollData = await pollResponse.json();


                    if (!pollResponse.ok) {
                        clearInterval(pollInterval);
                        throw new Error('Failed to check cover letter status');
                    }

                    if (pollData.status === 'Success') {
                        clearInterval(pollInterval);

                        setGeneratedCoverLetter(pollData.cover_letter);
                        setGenerationStatus('success');
                        toast.success('Cover letter generated successfully!');
                    } else if (pollData.status === 'Failed') {
                        clearInterval(pollInterval);
                        setGenerationStatus('error');
                        throw new Error(pollData.message || 'Cover letter generation failed');
                                          } else if (pollData.status === 'Pending') {
                          // Task still pending, continue polling
                      }
                } catch (pollError) {
                    clearInterval(pollInterval);
                    setGenerationStatus('error');
                    throw pollError;
                }
            }, 2000);

        } catch (error) {

            toast.error(error.message || 'Failed to generate cover letter. Please try again.');
            setError(error.message || 'Failed to generate cover letter. Please try again.');
            setGenerationStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state while auth is loading
    if (authLoading) {
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
                title="Create Cover Letter"
                description="Generate a professional cover letter with our AI-powered tool. Customize your cover letter and stand out to employers."
                keywords={['cover letter generator', 'create cover letter', 'AI cover letter', 'professional cover letter', 'job application']}
            />
            
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-8 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Cover Letter</h1>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
                        Fill in your details to generate a professional cover letter with AI
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="divide-y divide-gray-200 dark:divide-gray-700" onSubmit={handleSubmit}>
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
                                        placeholder="e.g., John Smith, HR Director"
                                    />
                                    <TextAreaInput
                                        label="Job Description"
                                        id="job_description"
                                        name="job_description"
                                        value={formData.job_description}
                                        onChange={handleInputChange}
                                        placeholder="Paste the job description or key requirements here..."
                                        rows={6}
                                        required={true}
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
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Information (Optional)</h2>
                                </div>
                                <TextAreaInput
                                    label="Reason for Applying"
                                    id="reason_for_applying"
                                    name="reason_for_applying"
                                    value={formData.reason_for_applying}
                                    onChange={handleInputChange}
                                    placeholder="Why are you interested in this position? What makes you a great fit?"
                                    rows={4}
                                />
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
                                                Generating Cover Letter...
                                            </>
                                        ) : 'Generate Cover Letter'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Cover Letter</h2>
                        </div>

                        {generationStatus === 'idle' && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Create</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                    Fill in the form on the left and click "Generate Cover Letter" to create your professional cover letter with AI.
                                </p>
                            </div>
                        )}

                        {generationStatus === 'generating' && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                                    <svg className="animate-spin h-10 w-10 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generating Cover Letter</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Our AI is creating your professional cover letter. This may take a few moments...
                                </p>
                            </div>
                        )}

                        {generationStatus === 'error' && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-6">
                                    <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generation Failed</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    Failed to generate cover letter. Please try again.
                                </p>
                                <button
                                    onClick={() => setGenerationStatus('idle')}
                                    className="btn-secondary"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {generationStatus === 'success' && generatedCoverLetter && (
                            <div className="space-y-6">
                                {/* Debug info - remove this later */}
                                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Debug: Cover letter object keys: {Object.keys(generatedCoverLetter).join(', ')}
                                    </p>
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Has cover_letter_content: {generatedCoverLetter.cover_letter_content ? 'Yes' : 'No'}
                                    </p>
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Has generated_content: {generatedCoverLetter.generated_content ? 'Yes' : 'No'}
                                    </p>
                                </div>
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-2">
                                            {generatedCoverLetter.name}
                                    </h3>
                                        <p>{generatedCoverLetter.email}</p>
                                        {generatedCoverLetter.phone_number && (
                                            <p>{generatedCoverLetter.phone_number}</p>
                                        )}
                                    </div>

                                    {generatedCoverLetter.cover_letter_content && (
                                        <div className="mb-6">
                                            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                                {generatedCoverLetter.cover_letter_content}
                                        </div>
                                        </div>
                                    )}

                                    {!generatedCoverLetter.cover_letter_content && generatedCoverLetter.generated_content && (
                                        <div className="mb-6">
                                            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                                {generatedCoverLetter.generated_content}
                                        </div>
                                        </div>
                                    )}

                                    {!generatedCoverLetter.cover_letter_content && !generatedCoverLetter.generated_content && (
                                        <div className="mb-6">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Cover letter content not available. Please try generating again.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => navigate(`/cover-letter/${generatedCoverLetter.id}`)}
                                        className="btn-secondary inline-flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Full Cover Letter
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="btn-primary inline-flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Print Cover Letter
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, TextAreaInput } from '../components/FormComponents';
import { useAuth } from '../hooks/useAuth';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';
import { getApiUrl } from '../config/environment';
import { SEO } from '../components/SEO';

export const CoverLetterPage = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const authService = new AuthService();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [generatedCoverLetter, setGeneratedCoverLetter] = useState(null);
    const [generationStatus, setGenerationStatus] = useState('idle'); // 'idle' | 'generating' | 'success' | 'error'
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        company_name: '',
        job_title: '',
        hiring_manager: '',
        job_description: '',
        experience: '', // This will be used as reason_for_applying
        skills: '' // This will be used in the job description
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

            // Prepare API data with proper structure
            const apiData = {
                full_name: `${formData.first_name} ${formData.last_name}`.trim(),
                email: formData.email,
                phone_number: formData.phone_number || '',  // Ensure empty string if not provided
                company_name: formData.company_name,
                job_title: formData.job_title,
                job_description: formData.job_description,
                hiring_manager: formData.hiring_manager || '',  // Optional field
                experience: formData.experience || ''  // Optional field
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
                console.error('Non-JSON response received:', await generateResponse.text());
                throw new Error('Server returned a non-JSON response. Please check if the server is running correctly.');
            }

            // Parse JSON response
            const responseData = await generateResponse.json();

            if (!generateResponse.ok) {
                console.error('API Error Response:', responseData);
                
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

            // Poll for the generated content
            const pollInterval = setInterval(async () => {
                try {
                    const pollResponse = await fetch(getApiUrl(`cover-letter/generated/${cover_letter_task_id}`), {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Check if poll response is valid JSON
                    const pollContentType = pollResponse.headers.get('content-type');
                    if (!pollContentType || !pollContentType.includes('application/json')) {
                        console.error('Non-JSON poll response received:', await pollResponse.text());
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
                    }
                } catch (pollError) {
                    clearInterval(pollInterval);
                    setGenerationStatus('error');
                    throw pollError;
                }
            }, 2000);

        } catch (error) {
            console.error('Error generating cover letter:', error);
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
                description="Generate a compelling cover letter with our AI-powered tool. Customize your letter for any job and get noticed by employers."
                keywords={['cover letter generator', 'create cover letter', 'AI cover letter', 'job application letter', 'professional cover letter']}
            />
            
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Cover Letter</h1>
                        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
                        Fill in your details to generate a professional cover letter
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
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Personal Information</h2>
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
                                        label="Phone Number (Optional)"
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        placeholder="+1234567890"
                                        pattern="^\\+?[0-9\\s\\-\\(\\)]{7,20}$"
                                        title="Phone number must be between 7-20 characters and can include numbers, spaces, hyphens, parentheses, and optionally start with +"
                                    />
                                </div>
                            </div>

                            {/* Job Information */}
                            <div className="p-8">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Job Information</h2>
                                <div className="space-y-6">
                                    <TextInput
                                        label="Company Name"
                                        id="company_name"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleInputChange}
                                        required={true}
                                    />
                                    
                                    <TextInput
                                        label="Job Title"
                                        id="job_title"
                                        name="job_title"
                                        value={formData.job_title}
                                        onChange={handleInputChange}
                                        required={true}
                                    />

                                    <TextInput
                                        label="Hiring Manager (Optional)"
                                        id="hiring_manager"
                                        name="hiring_manager"
                                        value={formData.hiring_manager}
                                        onChange={handleInputChange}
                                        placeholder="e.g. John Smith"
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

                                    <TextAreaInput
                                        label="Experience (Optional)"
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Describe your relevant experience for this role..."
                                    />
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="p-8">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Additional Information</h2>
                                <div className="space-y-6">
                                    <TextAreaInput
                                        label="Relevant Skills (Optional)"
                                        id="skills"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="List your relevant skills for this position..."
                                    />

                                    <TextAreaInput
                                        label="Why are you interested in this position? (Optional)"
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Explain why you're interested in this position and how your experience makes you a good fit..."
                                    />
                        </div>
                    </div>

                            {/* Form Actions */}
                            <div className="p-8">
                                <div className="flex justify-end">
                                                <button
                                        type="submit"
                                        className={`btn-primary inline-flex items-center gap-x-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Generated Cover Letter</h2>

                        {generationStatus === 'idle' && (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <p>Fill in the form and click "Generate Cover Letter" to create your cover letter.</p>
                </div>
                        )}

                        {generationStatus === 'generating' && (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <svg className="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p>Generating your cover letter...</p>
            </div>
                        )}

                        {generationStatus === 'error' && (
                            <div className="text-center text-red-500">
                                <svg className="h-8 w-8 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p>Failed to generate cover letter. Please try again.</p>
                        </div>
                        )}

                        {generationStatus === 'success' && generatedCoverLetter && (
                            <div className="space-y-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold">
                                            {generatedCoverLetter.name}
                                        </h3>
                                        <p>{generatedCoverLetter.email}</p>
                                        {generatedCoverLetter.phone_number && (
                                            <p>{generatedCoverLetter.phone_number}</p>
                                        )}
                                    </div>
                                    
                                    <div className="whitespace-pre-wrap font-serif">
                                        {generatedCoverLetter.cover_letter_content}
                                </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                <button
                                        onClick={() => navigate(`/cover-letter/${generatedCoverLetter.id}`)}
                                        className="btn-secondary"
                                >
                                        View Full Letter
                                </button>
                                <button
                                        onClick={() => window.print()}
                                    className="btn-primary"
                                >
                                        Print Letter
                                </button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 
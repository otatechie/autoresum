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

export function CreateResumePage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const authService = new AuthService();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [generatedResume, setGeneratedResume] = useState(null);
    const [generationStatus, setGenerationStatus] = useState('idle'); // 'idle' | 'generating' | 'success' | 'error'
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: '',
        work_experience: {},
        education: {},
        languages: {},
        skills: {},
        certifications: {}
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

    const handleWorkExperienceChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            work_experience: {
                ...prev.work_experience,
                [field]: value
            }
        }));
    };

    const handleEducationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [field]: value
            }
        }));
    };

    const handleSkillsChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [field]: value
            }
        }));
    };

    const handleLanguagesChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            languages: {
                ...prev.languages,
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setGenerationStatus('generating');
        setGeneratedResume(null);

        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Not authenticated. Please log in.');
            }



            // Filter out empty fields and prepare data for API
            const apiData = {
                first_name: formData.first_name || user?.first_name || '',
                last_name: formData.last_name || user?.last_name || '',
                email: formData.email || user?.email || '',
                phone_number: formData.phone_number || ''
            };

            // Only add work_experience if it has content
            if (formData.work_experience.company || formData.work_experience.position || formData.work_experience.description) {
                apiData.work_experience = formData.work_experience;
            }

            // Only add education if it has content
            if (formData.education.institution || formData.education.degree) {
                apiData.education = formData.education;
            }

            // Only add languages if it has content
            if (formData.languages.list && formData.languages.list.trim()) {
                apiData.languages = formData.languages;
            }

            // Only add skills if it has content
            if (formData.skills.list && formData.skills.list.trim()) {
                apiData.skills = formData.skills;
            }

            // Only add certifications if it has content
            if (formData.certifications.list && formData.certifications.list.trim()) {
                apiData.certifications = formData.certifications;
            }



            // Validate required fields
            if (!apiData.first_name || !apiData.last_name || !apiData.email) {
                toast.error('Please fill in all required fields (First Name, Last Name, Email)');
                return;
            }

            // First API call to generate content
            const generateResponse = await fetch(getApiUrl('resume/generate'), {
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
                
                throw new Error(responseData.message || 'Failed to generate resume');
            }

            const resume_content_id = responseData.resume_content_id;
            if (!resume_content_id) {
                throw new Error('No resume content ID received from server');
            }

            toast.info('Resume generation started...');

            // Poll for the generated content
            const pollInterval = setInterval(async () => {
                try {
                    const pollResponse = await fetch(getApiUrl(`resume/generated/${resume_content_id}`), {
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
                        throw new Error('Failed to check resume status');
                    }

                    if (pollData.status === 'Success') {
                        clearInterval(pollInterval);
                        setGeneratedResume(pollData.resume);
                        setGenerationStatus('success');
                        toast.success('Resume generated successfully!');
                    } else if (pollData.status === 'Failed') {
                        clearInterval(pollInterval);
                        setGenerationStatus('error');
                        throw new Error(pollData.message || 'Resume generation failed');
                    }
                } catch (pollError) {
                    clearInterval(pollInterval);
                    setGenerationStatus('error');
                    throw pollError;
                }
            }, 2000);

        } catch (error) {
            console.error('Error generating resume:', error);
            toast.error(error.message || 'Failed to generate resume. Please try again.');
            setError(error.message || 'Failed to generate resume. Please try again.');
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
                title="Create Resume"
                description="Generate a professional resume with our AI-powered tool. Customize your resume and stand out to employers."
                keywords={['resume generator', 'create resume', 'AI resume', 'professional resume', 'CV generator']}
            />
            
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Resume</h1>
                            <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
                                Fill in your details to generate a professional resume with AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
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
                                        required={true}
                                    />
                                </div>
                            </div>

                            {/* Work Experience */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience (Optional)</h2>
                                </div>
                                <div className="space-y-4">
                                    <TextInput
                                        label="Company"
                                        id="company"
                                        name="company"
                                        value={formData.work_experience.company || ''}
                                        onChange={(e) => handleWorkExperienceChange('company', e.target.value)}
                                    />
                                    <TextInput
                                        label="Position"
                                        id="position"
                                        name="position"
                                        value={formData.work_experience.position || ''}
                                        onChange={(e) => handleWorkExperienceChange('position', e.target.value)}
                                    />
                                    <TextAreaInput
                                        label="Description"
                                        id="description"
                                        name="description"
                                        value={formData.work_experience.description || ''}
                                        onChange={(e) => handleWorkExperienceChange('description', e.target.value)}
                                        rows={4}
                                    />
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
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education (Optional)</h2>
                                </div>
                                <div className="space-y-4">
                                    <TextInput
                                        label="Institution"
                                        id="institution"
                                        name="institution"
                                        value={formData.education.institution || ''}
                                        onChange={(e) => handleEducationChange('institution', e.target.value)}
                                    />
                                    <TextInput
                                        label="Degree"
                                        id="degree"
                                        name="degree"
                                        value={formData.education.degree || ''}
                                        onChange={(e) => handleEducationChange('degree', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                                        <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Languages (Optional)</h2>
                                </div>
                                <TextAreaInput
                                    label="Languages (comma-separated)"
                                    id="languages"
                                    name="languages"
                                    value={formData.languages.list || ''}
                                    onChange={(e) => handleLanguagesChange('list', e.target.value)}
                                    placeholder="English, Spanish, French"
                                />
                            </div>

                            {/* Skills */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills (Optional)</h2>
                                </div>
                                <TextAreaInput
                                    label="Professional Skills (comma-separated)"
                                    id="skills"
                                    name="skills"
                                    value={formData.skills.list || ''}
                                    onChange={(e) => handleSkillsChange('list', e.target.value)}
                                    placeholder="Project Management, Leadership, Communication"
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
                                                Generating Resume...
                                            </>
                                        ) : 'Generate Resume'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Resume</h2>
                        </div>

                        {generationStatus === 'idle' && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Create</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                    Fill in the form on the left and click "Generate Resume" to create your professional resume with AI.
                                </p>
                            </div>
                        )}

                        {generationStatus === 'generating' && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                                    <svg className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generating Resume</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Our AI is creating your professional resume. This may take a few moments...
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
                                    Failed to generate resume. Please try again.
                                </p>
                                <button
                                    onClick={() => setGenerationStatus('idle')}
                                    className="btn-secondary"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {generationStatus === 'success' && generatedResume && (
                            <div className="space-y-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <h3 className="text-xl font-semibold mb-4">
                                        {generatedResume.first_name} {generatedResume.last_name}
                                    </h3>

                                    <div className="mb-4">
                                        <p>{generatedResume.email}</p>
                                        {generatedResume.phone_number && (
                                            <p>{generatedResume.phone_number}</p>
                                        )}
                                    </div>

                                    {generatedResume.resume_summary && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-medium mb-2">Professional Summary</h4>
                                            <p>{generatedResume.resume_summary}</p>
                                        </div>
                                    )}

                                    {generatedResume.work_experience && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-medium mb-2">Work Experience</h4>
                                            <div dangerouslySetInnerHTML={{ __html: generatedResume.work_experience }} />
                                        </div>
                                    )}

                                    {generatedResume.education && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-medium mb-2">Education</h4>
                                            <div dangerouslySetInnerHTML={{ __html: generatedResume.education }} />
                                        </div>
                                    )}

                                    {generatedResume.skills && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-medium mb-2">Skills</h4>
                                            <div dangerouslySetInnerHTML={{ __html: generatedResume.skills }} />
                                        </div>
                                    )}

                                    {generatedResume.languages && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-medium mb-2">Languages</h4>
                                            <div dangerouslySetInnerHTML={{ __html: generatedResume.languages }} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => navigate(`/resume/${generatedResume.id}`)}
                                        className="btn-secondary inline-flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Full Resume
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="btn-primary inline-flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Print Resume
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
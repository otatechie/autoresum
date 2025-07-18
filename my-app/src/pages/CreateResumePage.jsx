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

            // Debug: Log the current form data
            console.log('Current form data:', formData);
            console.log('Current user:', user);

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

            // Debug: Log the API data being sent
            console.log('API data being sent:', apiData);

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
            console.log('API Response:', responseData);

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
                    console.log('Poll Response:', pollData);

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
            <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create Resume</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Fill in your details to generate a professional resume
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
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
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Work Experience (Optional)</h2>
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
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Education (Optional)</h2>
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
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Languages (Optional)</h2>
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
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Skills (Optional)</h2>
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
                                                Generating Resume...
                                            </>
                                        ) : 'Generate Resume'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Generated Resume</h2>

                        {generationStatus === 'idle' && (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <p>Fill in the form and click "Generate Resume" to create your resume.</p>
                            </div>
                        )}

                        {generationStatus === 'generating' && (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <svg className="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p>Generating your resume...</p>
                            </div>
                        )}

                        {generationStatus === 'error' && (
                            <div className="text-center text-red-500">
                                <svg className="h-8 w-8 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p>Failed to generate resume. Please try again.</p>
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
                                        className="btn-secondary"
                                    >
                                        View Full Resume
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="btn-primary"
                                    >
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
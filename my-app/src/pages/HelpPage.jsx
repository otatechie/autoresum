import React, { useState } from 'react';
import { SEO } from '../components/SEO';

function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                className="flex justify-between w-full py-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-gray-900 dark:text-white font-medium">{question}</span>
                <span className="ml-6 flex-shrink-0">
                    {isOpen ? (
                        <span className="text-gray-500">−</span>
                    ) : (
                        <span className="text-gray-500">+</span>
                    )}
                </span>
            </button>
            {isOpen && (
                <div className="pb-4">
                    <p className="text-gray-600 dark:text-gray-400">{answer}</p>
                </div>
            )}
        </div>
    );
}

export function HelpPage() {
    const faqs = [
        {
            question: "How do I create my first resume?",
            answer: "To create your first resume, click the 'Create Resume' button in the sidebar. Choose a template, fill in your information, and our AI-powered system will help you create a professional resume in minutes."
        },
        {
            question: "Can I download my resume in different formats?",
            answer: "Yes! You can download your resume in PDF, DOCX, and TXT formats. Each format is optimized for different purposes - PDF for sending to employers, DOCX for editing, and TXT for ATS systems."
        },
        {
            question: "How do I customize my resume template?",
            answer: "After selecting a template, you can customize colors, fonts, spacing, and layout. Use the style editor to make changes, and preview them in real-time before saving."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your consent."
        },
        {
            question: "What makes a good resume?",
            answer: "A good resume is clear, concise, and tailored to the job you're applying for. Include relevant experience, quantifiable achievements, and keywords from the job description. Our AI system helps optimize these elements."
        }
    ];

    const resources = [
        {
            title: "Resume Writing Guide",
            description: "Learn the fundamentals of resume writing with our comprehensive guide.",
            icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        },
        {
            title: "Video Tutorials",
            description: "Watch step-by-step tutorials on using all features of our platform.",
            icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        },
        {
            title: "Template Gallery",
            description: "Browse our collection of professional resume templates.",
            icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        }
    ];

    return (
        <>
            <SEO 
                title="Help & Support"
                description="Get help with using AutoResum. Find tutorials, FAQs, and guides on creating resumes and cover letters effectively."
                keywords={['help center', 'support', 'tutorials', 'FAQs', 'resume guide', 'user guide', 'how to']}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Help Center</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Find answers to common questions and learn how to make the most of Autoresum
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        {/* Search */}
                        <div className="max-w-2xl mx-auto mb-12">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for help..."
                                    className="w-full px-4 py-3 pl-12 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <svg
                                    className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* FAQ Section */}
                            <div className="lg:col-span-2">
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Frequently Asked Questions
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="px-6">
                                                <FaqItem question={faq.question} answer={faq.answer} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Resources and Contact Section */}
                            <div className="space-y-8">
                                {/* Resources */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Helpful Resources
                                        </h2>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {resources.map((resource, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                                        <svg
                                                            className="h-6 w-6 text-blue-600 dark:text-blue-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={resource.icon} />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {resource.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        {resource.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact Support */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Need More Help?
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            Can't find what you're looking for? Our support team is here to help.
                                        </p>
                                        <button className="w-full btn-primary">
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 
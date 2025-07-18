import React from 'react';
import { SEO } from '../components/SEO';

export function AboutPage() {
    return (
        <>
            <SEO 
                title="About Us"
                description="Learn about AutoResum's mission to help job seekers create professional resumes and cover letters using AI technology."
                keywords={['about autoresum', 'our mission', 'AI resume company', 'career tools platform', 'professional resume service']}
            />
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    About Autoresum
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    This is the about page content. We help you build amazing resumes!
                </p>
            </div>
        </>
    );
}
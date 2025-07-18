import React from 'react';

export function HeroSection() {
    return (
        <section className="w-full mx-auto text-center px-4" aria-labelledby="hero-heading">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 id="hero-heading"
                    className="mt-24 text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-fade-in">
                    Resumes That Get Results:<br></br>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        AI-Crafted
                    </span> for Career Success
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-delay">
                    Craft your resume with AI-powered suggestions. Customize the design and improve
                    your content with smart tips. Download and share your resume in seconds.
                </p>
                <div className="flex gap-6 justify-center animate-fade-in-delay-2 mb-12">
                    <button className="btn btn-gradient btn-lg">
                        Upload your resume
                    </button>
                </div>
            </div>
        </section>
    );
}; 
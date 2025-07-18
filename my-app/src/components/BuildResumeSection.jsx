import React from 'react';

export function BuildResumeSection() {
    return (
        <section className="py-12 bg-white dark:bg-gray-900">
            <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-6 md:pr-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                        Build Your Perfect Resume with AI – No Guesswork Needed!
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Create your resume easily with AI-powered suggestions. Customize the design and improve your
                        content with smart tips. Download and share your resume in seconds.
                    </p>
                    <div className="pt-4">
                        <button className="btn btn-outline btn-lg">
                            View resume guides
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <img src="/images/jumbotron-cover.jpg"
                        alt="Screenshot of the resume builder application interface" className="w-full object-cover"
                        loading="lazy" width="600" height="400" />
                </div>
            </div>
        </section>
    );
}; 
import React from 'react';

export function TrustSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900">
                <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-grid-pattern"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-gray-100 leading-tight mb-6">
                    Thousands of job seekers trust us to build their resumes.
                    <span className="block mt-2 text-white/90 dark:text-gray-200">You can too.</span>
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="btn btn-white">
                        Get started for free
                    </button>
                    <button className="btn btn-outline-white">
                        View success stories
                    </button>
                </div>
            </div>
        </section>
    );
}; 
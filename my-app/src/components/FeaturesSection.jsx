import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
    <article className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm border border-gray-100/50 dark:border-gray-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
        <div className="flex flex-col h-full relative text-left">
            <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-2.5 flex items-center justify-center ring-1 ring-black/[0.03] dark:ring-white/[0.03]">
                    <img src={icon} alt={title} className="w-8 h-8 object-contain" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {description}
            </p>
            <div className="mt-auto pt-3 border-t border-gray-100/70 dark:border-gray-700/70">
                <a href="#" className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                    Get started
                    <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    </article>
);

export function FeaturesSection() {
    const features = [
        {
            title: "AI-Powered Job Search",
            description: "Find the perfect job matches using our advanced AI algorithms",
            icon: "/images/job-search.png",
        },
        {
            title: "Smart Resume Builder",
            description: "Create professional resumes with AI-powered suggestions",
            icon: "/images/cv.png",
        },
        {
            title: "Career Guidance",
            description: "Get personalized career advice and job market insights",
            icon: "/images/job-guide.png",
        },
        {
            title: "Application Tracking",
            description: "Keep track of all your job applications in one place",
            icon: "/images/job-seeker.png",
        }
    ];

    return (
        <section className="w-full mx-auto py-16 bg-gray-50/50 dark:bg-gray-800/50" aria-labelledby="features-heading">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white relative">
                        Why Choose Autoresum?
                    </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}; 
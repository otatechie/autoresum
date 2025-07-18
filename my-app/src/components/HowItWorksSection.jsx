import React from 'react';

const Step = ({ number, title, description }) => (
    <div className="group">
        <div className="relative flex items-center justify-center w-20 h-20 mx-auto bg-gray-900 border-2 border-blue-500/30 rounded-full shadow-lg shadow-blue-500/10 transition-transform duration-300 group-hover:scale-110 group-hover:border-blue-400 dark:bg-gray-800"
            style={{ zIndex: 3 }}>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                {number}
            </span>
        </div>
        <h3 className="mt-6 text-xl text-white font-semibold leading-tight md:mt-10">{title}</h3>
        <p className="mt-4 text-base text-gray-400 md:text-lg">{description}</p>
    </div>
);

export function HowItWorksSection() {
    const steps = [
        {
            number: 1,
            title: "Upload Your Details",
            description: "Import your existing resume or start fresh with our AI-powered form"
        },
        {
            number: 2,
            title: "AI Enhancement",
            description: "Let our AI optimize your content for maximum impact"
        },
        {
            number: 3,
            title: "Download & Apply",
            description: "Export in multiple formats and start applying with confidence"
        }
    ];

    return (
        <>
            <section id="works" className="relative bg-gray-900 py-10 sm:py-16 lg:py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-600/10 text-blue-400 mb-4">
                            Simple Process
                        </span>
                        <h2 className="text-4xl text-white font-bold mx-auto md:text-6xl lg:text-5xl bg-clip-text">
                            How does it work?
                        </h2>
                        <p className="max-w-2xl mx-auto mt-4 text-base text-gray-400 leading-relaxed md:text-xl">
                            Create your professional resume in minutes with AI assistance
                        </p>
                    </div>

                    <div className="relative mt-12 lg:mt-20">
                        <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28" style={{ zIndex: 0 }}>
                            <img alt="" loading="lazy" width="1000" height="500" decoding="async"
                                className="w-full opacity-30 dark:opacity-40" style={{ color: "transparent" }}
                                src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg" />
                        </div>

                        <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12" style={{ zIndex: 2 }}>
                            {steps.map((step) => (
                                <Step key={step.number} {...step} />
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <button className="btn btn-gradient btn-lg group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <span className="flex items-center justify-center text-lg">
                                Start building now
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.05) 100%)"
                    }}>
                </div>
            </section>

            <section className="w-full mx-auto text-center px-4 bg-[#F5F7FF] dark:bg-gray-800/50 py-24 relative overflow-hidden" aria-labelledby="stress-free-heading">
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.015] dark:opacity-[0.03]"></div>
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10"></div>
                </div>

                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <h2 id="stress-free-heading" className="text-5xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight animate-fade-in">
                        Say bye to
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block ml-2">
                            resume stress.
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-delay font-light leading-relaxed">
                        Create a professional resume in minutes with AI-powered suggestions and expert templates.
                        Stand out to employers and land your dream job.
                    </p>

                    <div className="flex gap-6 justify-center animate-fade-in-delay-2 pt-4">
                        <button className="btn btn-gradient btn-lg group relative overflow-hidden px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                            <span className="flex items-center justify-center text-lg font-medium">
                                Get started
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="absolute inset-0 m-auto max-w-md h-[400px] blur-[140px] opacity-50" style={{ background: "radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 0%, rgba(59, 130, 246, 0.1) 25%, rgba(147, 197, 253, 0.05) 50%, transparent 100%)" }}>
                </div>
            </section>
        </>
    );
}
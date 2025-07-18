import { useState } from 'react';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm"
            role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center group">
                            <img className="h-12 w-auto transition transform group-hover:scale-105 dark:brightness-110"
                                src="/images/logo.png" alt="Autoresum" />
                        </a>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <a href="/about"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap">TEMPLATES</a>
                        <a href="/contact"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap">PRICING</a>
                        <a href="/contact"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap">RESUME</a>
                        <a href="/help"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap">EXAMPLES</a>
                        <a href="/contact"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap">ABOUT US</a>
                    </div>

                    <div className="hidden md:flex items-center space-x-3">
                        <a href="/login"
                            className="btn btn-outline text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            Login
                        </a>
                        <a href="/signup"
                            className="btn btn-gradient text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600">
                            Get started
                        </a>
                    </div>

                    <div className="md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path className="origin-center transition-all" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div id="mobile-menu" className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
                    <div className="flex flex-col space-y-2 pt-2 pb-3">
                        <a href="/about"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all">TEMPLATES</a>
                        <a href="/contact"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all">PRICING</a>
                        <a href="/contact"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all">RESUME</a>
                        <a href="/help"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all">EXAMPLES</a>
                        <a href="/help"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 visited:text-slate-600 dark:text-slate-300 dark:visited:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-slate-900 dark:hover:text-white transition-all">ABOUT US</a>
                        <div className="pt-4 space-y-2">
                            <a href="login.html"
                                className="w-full btn btn-outline text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                                Login
                            </a>
                            <a href="/signup"
                                className="w-full btn btn-gradient text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600">
                                Get started
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

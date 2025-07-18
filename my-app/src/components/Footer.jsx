import React from 'react';

export function Footer() {
    return (
        <footer
            className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
            <div className="w-full max-w-6xl mx-auto px-6 py-16">
                <div className="mb-8 md:mb-8">
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <a href="/" className="flex items-center group">
                            <img className="h-12 w-auto transition transform group-hover:scale-105" src="/images/logo.png"
                                alt="Autoresum" />
                        </a>
                        <p className="text-center md:text-left text-gray-600 dark:text-gray-400 max-w-md">
                            Create professional resumes with AI-powered suggestions. Customize templates and improve your
                            job application success rate.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-12 md:mb-16">
                    <div>
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                            Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">About Us</a></li>
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Careers</a></li>
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                            Support</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Help Center</a></li>
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Contact Us</a></li>
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4 uppercase tracking-wider">Legal
                        </h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Privacy Policy</a></li>
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Terms of Service</a></li>
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Cookie Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                            Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Templates</a></li>
                            <li><a href="#" className="footer-link inline-block dark:text-gray-400">Guides</a></li>
                            <li><a href="/dashboard" className="footer-link inline-block dark:text-gray-400" target='_blank'>Dashboard</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mb-12 md:mb-16 py-8 border-y border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-2">Stay up to date</h3>
                            <p className="text-gray-600 dark:text-gray-400">Get the latest updates and tips straight to your
                                inbox.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input type="email" placeholder="Enter your email"
                                className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <button className="btn btn-gradient">
                                    Subscribe
                                </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center justify-center space-x-6">
                        <a href="https://facebook.com/autoresum" target="_blank" rel="noopener noreferrer"
                            className="social-icon-link group">
                            <span className="sr-only">Follow us on Facebook</span>
                            <div
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </div>
                        </a>

                        <a href="https://x.com/autoresum" target="_blank" rel="noopener noreferrer"
                            className="social-icon-link group">
                            <span className="sr-only">Follow us on X</span>
                            <div
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path
                                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                        </a>

                        <a href="https://youtube.com/@autoresum" target="_blank" rel="noopener noreferrer"
                            className="social-icon-link group">
                            <span className="sr-only">Follow us on YouTube</span>
                            <div
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path
                                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </div>
                        </a>

                        <a href="https://linkedin.com/company/autoresum" target="_blank" rel="noopener noreferrer"
                            className="social-icon-link group">
                            <span className="sr-only">Follow us on LinkedIn</span>
                            <div
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path
                                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </div>
                        </a>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            ©2025 Autoresum. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Autoresum® is a registered trademark of The CV Group.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};


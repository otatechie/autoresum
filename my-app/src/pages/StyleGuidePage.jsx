import React from 'react';
import { Link } from 'react-router-dom';

export function StyleGuidePage() {
    return (
        <div className="bg-slate-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Style Guide</h1>
                </div>

                {/* Font Family Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Font Family</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Libre Franklin</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The primary font used throughout the application is <span className="font-medium">Libre Franklin</span>,
                            a clean and modern sans-serif typeface.
                        </p>

                        <div>
                            <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-3 tracking-wider">Font Weights</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-thin text-xl text-gray-900 dark:text-white">Libre Franklin Thin (100)</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">font-thin</p>
                                </div>
                                <div>
                                    <p className="font-light text-xl text-gray-900 dark:text-white">Libre Franklin Light (300)</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">font-light</p>
                                </div>
                                <div>
                                    <p className="font-normal text-xl text-gray-900 dark:text-white">Libre Franklin Regular (400)</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">font-normal</p>
                                </div>
                                <div>
                                    <p className="font-medium text-xl text-gray-900 dark:text-white">Libre Franklin Medium (500)</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">font-medium</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-xl text-gray-900 dark:text-white">Libre Franklin Semibold (600)</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">font-semibold</p>
                                </div>
                                <div>
                                    <p className="font-bold text-xl text-gray-900 dark:text-white">Libre Franklin Bold (700)</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">font-bold</p>
                                </div>
                                <div>
                                    <p className="font-extrabold text-xl text-gray-900 dark:text-white">Libre Franklin ExtraBold (800)</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">font-extrabold</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Implementation Note:</strong> To use Libre Franklin, add this to your HTML head:
                            </p>
                            <pre className="mt-2 p-3 bg-gray-800 text-gray-200 rounded text-xs overflow-x-auto">
                                {`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">`}
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Typography Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Typography</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Headings</h3>
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Heading 1</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-3xl font-bold</p>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Heading 2</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-2xl font-semibold</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Heading 3</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-xl font-medium</p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Heading 4</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-lg font-medium</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Text</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-base text-gray-900 dark:text-white">Base paragraph text</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-base</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Small text</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-sm</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Extra small text</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-xs</p>
                                </div>
                                <div>
                                    <p className="text-lg text-gray-900 dark:text-white">Large text</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-lg</p>
                                </div>
                                <div>
                                    <p className="text-xl text-gray-900 dark:text-white">Extra large text</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">text-xl</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Colors Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Colors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <div className="h-24 bg-blue-600 rounded-t-lg"></div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-b-lg shadow-sm">
                                <p className="text-sm font-medium">Blue 600</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Primary</p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="h-24 bg-indigo-600 rounded-t-lg"></div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-b-lg shadow-sm">
                                <p className="text-sm font-medium">Indigo 600</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Secondary</p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="h-24 bg-gray-900 rounded-t-lg"></div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-b-lg shadow-sm">
                                <p className="text-sm font-medium">Gray 900</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Dark</p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="h-24 bg-white rounded-t-lg border border-gray-200 border-b-0"></div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-b-lg shadow-sm">
                                <p className="text-sm font-medium">White</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Light</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Buttons Section - Updated from main.css */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Buttons</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Primary Buttons</h3>
                                <div className="space-y-6">
                                    <div>
                                        <button className="btn-primary">
                                            Primary Button
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">btn-primary</p>
                                    </div>
                                    <div>
                                        <button className="btn btn-gradient">
                                            Gradient Button
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">btn btn-gradient</p>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline">
                                            Outline Button
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">btn btn-outline</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Special Buttons</h3>
                                <div className="space-y-6">
                                    <div>
                                        <button className="btn-google">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                                            </svg>
                                            Sign in with Google
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">btn-google</p>
                                    </div>
                                    <div>
                                        <button className="btn btn-white">
                                            White Button
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">btn btn-white</p>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline-white bg-gray-900">
                                            Outline White Button
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">btn btn-outline-white</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Button Sizes</h3>
                                <div className="space-y-6">
                                    <div>
                                        <button className="btn-primary">
                                            Default Size
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">default</p>
                                    </div>
                                    <div>
                                        <button className="btn-primary btn-lg">
                                            Large Button
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">btn-lg</p>
                                    </div>
                                    <div>
                                        <button className="btn-primary" disabled>
                                            Disabled Button
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">disabled</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Form Elements - Updated from main.css */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Form Elements</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Input Controls</h3>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="text-input">Text Input</label>
                                    <input type="text" id="text-input" className="form-control" placeholder="Enter text" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">form-control</p>
                                </div>
                                <div>
                                    <label htmlFor="email-input">Email Input</label>
                                    <input type="email" id="email-input" className="form-control" placeholder="Enter email" />
                                </div>
                                <div>
                                    <label htmlFor="password-input">Password Input</label>
                                    <input type="password" id="password-input" className="form-control" placeholder="Enter password" />
                                </div>
                                <div>
                                    <label htmlFor="textarea">Textarea</label>
                                    <textarea id="textarea" className="form-control" rows="3" placeholder="Enter text"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Link Styles */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Links</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Link Styles</h3>
                        <div className="flex flex-wrap gap-6 mb-4">
                            <a href="#" className="link-primary">Primary Link</a>
                            <a href="#" className="footer-link">Footer Link</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

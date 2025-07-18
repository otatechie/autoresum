import React from 'react';

export function AuthLayout({ children }) {
    return (
        <div className="bg-slate-50 dark:bg-gray-900">
            <main className="min-h-screen flex items-center justify-center p-4">
                <div className="absolute top-0 left-4 w-auto h-auto">
                    <a href="/"> <img src="/images/logo.png" alt="Autoresum" className="h-14 w-auto dark:brightness-0 dark:invert" /></a>
                </div>
                <div className="auth-card w-full max-w-sm my-16 bg-white dark:bg-gray-800 p-6 rounded-lg">
                    {children}
                </div>
            </main>
            <footer>
                <div className="text-gray-600 dark:text-gray-400 p-6">
                    <p className="text-xs">©2025 Autoresum . All rights reserved. Autoresum® is a registered trademark of The CV
                        Group, Cookie Preferences, Privacy, and Terms .</p>
                </div>
            </footer>
        </div>
    );
} 
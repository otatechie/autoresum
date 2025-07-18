import React from 'react';
import { Footer } from '../components/Footer';

export function BaseLayout({ children }) {
    return (
        <div className="min-h-screen">
            <main id="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
} 
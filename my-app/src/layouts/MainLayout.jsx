import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function MainLayout({ children }) {
    return (
        <div className="app flex flex-col min-h-screen">
            <Navbar />
            <main id="main-content" className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
} 
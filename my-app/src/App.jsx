import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { BaseLayout } from './layouts/BaseLayout'
import { RequireAuth } from './components/RequireAuth'
import { ThemeProvider } from './contexts/ThemeContext'

import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { BuildResumeSection } from './components/BuildResumeSection'
import { TrustSection } from './components/TrustSection'
import { AboutPage } from './pages/AboutPage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { CreateResumePage } from './pages/CreateResumePage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage'
import { TemplateGalleryPage } from './pages/TemplateGalleryPage'
import { StyleGuidePage } from './pages/StyleGuidePage'
import { ProfilePage } from './pages/ProfilePage'
import { ChangePasswordPage } from './pages/ChangePasswordPage'
import { ResumePage } from './pages/ResumePage'
import { HelpPage } from './pages/HelpPage'
import { CoverLetterPage } from './pages/CoverLetterPage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import './App.css'

export function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <BuildResumeSection />
            <TrustSection />
        </>
    );
}

export function App() {
    return (
        <HelmetProvider>
            <ErrorBoundary>
                <ThemeProvider>
                    <Routes>
                        <Route element={<MainLayout><Outlet /></MainLayout>}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/about" element={<AboutPage />} />
                        </Route>
                        <Route element={<AuthLayout><Outlet /></AuthLayout>}>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path="/verify-email" element={<VerifyEmailPage />} />
                        </Route>
                        <Route element={<RequireAuth><DashboardLayout><Outlet /></DashboardLayout></RequireAuth>}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/create-resume" element={<CreateResumePage />} />
                            <Route path="/template-gallery" element={<TemplateGalleryPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/change-password" element={<ChangePasswordPage />} />
                            <Route path="/resume" element={<ResumePage />} />
                            <Route path="/help" element={<HelpPage />} />
                            <Route path="/cover-letters" element={<CoverLetterPage />} />
                            <Route path="/subscription" element={<SubscriptionPage />} />
                        </Route>
                        <Route element={<BaseLayout><Outlet /></BaseLayout>}>
                            <Route path="/style-guide" element={<StyleGuidePage />} />
                        </Route>
                    </Routes>
                </ThemeProvider>
            </ErrorBoundary>
        </HelmetProvider>
    )
}

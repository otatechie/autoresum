import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Navigation item component
function NavItem({ to, isActive, icon, children, onClick }) {
    const baseClasses = "flex items-center gap-x-3 text-sm font-medium transition-all duration-300 py-2 px-2 rounded-full relative group cursor-pointer";
    const activeClasses = "text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50 dark:from-blue-900/20 dark:via-blue-800/20 dark:to-blue-900/20 shadow-sm border border-blue-100 dark:border-blue-700 transform scale-105";
    const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:shadow-sm";

    return (
        <Link
            to={to}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            onClick={onClick}
        >
            <div className="relative flex items-center gap-x-3">
                <div className={`p-1 rounded-lg transition-all duration-300 ${isActive ? 'bg-blue-100 dark:bg-blue-800/50 shadow-sm' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}>
                    <svg className={`h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon} />
                    </svg>
                </div>
                <span className={`font-medium text-sm ${isActive ? 'text-blue-800 dark:text-blue-200' : ''}`}>{children}</span>
            </div>
        </Link>
    );
}

// Menu item for user dropdown
function UserMenuItem({ to, children, onClick, isRed = false }) {
    const colorClasses = isRed
        ? "text-red-500 dark:text-red-400"
        : "text-gray-600 dark:text-gray-100";

    return (
        <Link
            to={to}
            className={`block px-3 py-1 text-sm ${colorClasses} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer`}
            role="menuitem"
            onClick={onClick}
        >
            {children}
        </Link>
    );
}

// Social media link component
function SocialLink({ href, icon, label }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
            <span className="sr-only">{label}</span>
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d={icon} />
                </svg>
            </div>
        </a>
    );
}

// Dashboard layout component
export function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
    const userMenuRef = useRef(null);
    const userBtnRef = useRef(null);
    const createDropdownRef = useRef(null);
    const createBtnRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut, user } = useAuth();

    // Add function to get initials
    const getInitials = (firstName, lastName) => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return (first + last).toUpperCase();
    };

    // Navigation items configuration
    const navItems = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            divider: true,
        },
        {
            to: "/template-gallery",
            label: "Templates",
            icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
            divider: true,
        },
        {
            to: "/resume",
            label: "Resume",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            divider: true,
        },
        {
            to: "/cover-letters",
            label: "Cover Letters",
            icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
            // No divider after the last item
        },
    ];

    // Handler for sign out
    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    // User menu items configuration
    const userMenuItems = [
        { to: "/profile", label: "Your profile" },
        { to: "/change-password", label: "Change password", divider: true },
        { to: "/profile", label: "Settings" },
        { to: "/subscription", label: "Subscription", divider: true },
        { label: "Sign out", isRed: true, onClick: handleSignOut },
    ];

    // Simple event handlers
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleCreateDropdown = () => setIsCreateDropdownOpen(!isCreateDropdownOpen);
    const closeSidebar = (e) => e.target.getAttribute('role') === 'dialog' && setIsSidebarOpen(false);
    const closeUserMenu = () => setIsUserMenuOpen(false);
    const closeCreateDropdown = () => setIsCreateDropdownOpen(false);
    const goToCreateResume = () => {
        setIsSidebarOpen(false);
        setIsCreateDropdownOpen(false);
        navigate('/create-resume');
    };
    const goToCreateCoverLetter = () => {
        setIsSidebarOpen(false);
        setIsCreateDropdownOpen(false);
        navigate('/create-cover-letter');
    };

    // Check if clicked outside user menu and create dropdown
    React.useEffect(() => {
        function handleClickOutside(event) {
            // Close user menu if clicked outside
            if (isUserMenuOpen &&
                userMenuRef.current &&
                userBtnRef.current &&
                !userMenuRef.current.contains(event.target) &&
                !userBtnRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            
            // Close create dropdown if clicked outside
            if (isCreateDropdownOpen &&
                createDropdownRef.current &&
                createBtnRef.current &&
                !createDropdownRef.current.contains(event.target) &&
                !createBtnRef.current.contains(event.target)) {
                setIsCreateDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen, isCreateDropdownOpen]);

    // Sidebar content component
    function SidebarContent() {
        return (
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                    <a href="/dashboard"> <img className="h-14 w-auto dark:invert" src="/images/logo.png" alt="Autoresum" /></a>
                </div>

                <div className="shrink-0 relative">
                    <button
                        ref={createBtnRef}
                        onClick={toggleCreateDropdown}
                        className="w-full btn-primary inline-flex items-center justify-center gap-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create
                        <svg className="w-4 h-4 ml-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isCreateDropdownOpen && (
                        <div
                            ref={createDropdownRef}
                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                        >
                            <button
                                onClick={goToCreateResume}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Create Resume
                            </button>
                            <button
                                onClick={goToCreateCoverLetter}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                Create Cover Letter
                            </button>
                        </div>
                    )}
                </div>

                <nav className="flex-1">
                    {navItems.map((item, idx) => (
                        <React.Fragment key={item.to}>
                            <NavItem
                                to={item.to}
                                isActive={location.pathname === item.to}
                                icon={item.icon}
                            >
                                {item.label}
                            </NavItem>
                            {idx < navItems.length - 1 && (
                                <div className="my-2 mx-4 border-t border-gray-200 dark:border-gray-700" />
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            </div>
        );
    }

    return (
        <div className="h-full bg-white dark:bg-gray-900">
            {/* Mobile sidebar */}
            {isSidebarOpen && (
                <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true" onClick={closeSidebar}>
                    <div className="fixed inset-0 bg-gray-900/80" aria-hidden="true"></div>
                    <div className="fixed inset-0 flex">
                        <div className="relative mr-16 flex w-full max-w-xs flex-1">
                            <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                                <button type="button" className="-m-2.5 p-2.5 cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
                                    <span className="sr-only">Close sidebar</span>
                                    <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <SidebarContent />
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
                    <div className="flex h-16 shrink-0 items-center">
                        <a href="/dashboard"> <img className="h-14 w-auto dark:invert" src="/images/logo.png" alt="Autoresum" /></a>
                    </div>

                    <div className="shrink-0 relative">
                        <button
                            ref={createBtnRef}
                            onClick={toggleCreateDropdown}
                            className="w-full btn-primary inline-flex items-center justify-center gap-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create
                            <svg className="w-4 h-4 ml-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isCreateDropdownOpen && (
                            <div
                                ref={createDropdownRef}
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                            >
                                <button
                                    onClick={goToCreateResume}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Create Resume
                                </button>
                                <button
                                    onClick={goToCreateCoverLetter}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    Create Cover Letter
                                </button>
                            </div>
                        )}
                    </div>


                    <nav className="flex-1">
                        {navItems.map((item, idx) => (
                            <React.Fragment key={item.to}>
                                <NavItem
                                    to={item.to}
                                    isActive={location.pathname === item.to}
                                    icon={item.icon}
                                >
                                    {item.label}
                                </NavItem>
                                {idx < navItems.length - 1 && (
                                    <div className="my-2 mx-4 border-t border-gray-200 dark:border-gray-700" />
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-60">
                {/* Top navigation */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm">
                    <button
                        type="button"
                        className="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={toggleSidebar}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-1 max-w-lg">
                            <div className="relative flex flex-1">
                                <label htmlFor="search-input" className="sr-only">Search Autoresum</label>
                                <div className="relative w-full">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        id="search-input"
                                        type="search"
                                        name="search"
                                        placeholder="Search resumes, templates..."
                                        className="h-10 w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-12 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ml-4 flex items-center gap-x-4 sm:gap-x-6">
                            <Link to="/help" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Help
                            </Link>

                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center size-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                                aria-label="View notifications"
                            >
                                <span className="sr-only">View notifications</span>
                                <svg className="size-5" viewBox="0 0 32 32">
                                    <path
                                        fill="currentColor"
                                        d="m30,8c0-3.31-2.69-6-6-6-2.3,0-4.29,1.3-5.3,3.2-1.15-.61-2.4-1-3.7-1.13v-1.07c0-.55-.45-1-1-1s-1,.45-1,1v1.05c-5.05.5-9,4.77-9,9.95v6.18c-1.16.41-2,1.51-2,2.82,0,1.65,1.35,3,3,3h4.1c.46,2.28,2.48,4,4.9,4s4.43-1.72,4.9-4h4.1c1.65,0,3-1.35,3-3,0-1.3-.84-2.4-2-2.82v-6.18c3.31,0,6-2.69,6-6Zm-6-4c2.21,0,4,1.79,4,4s-1.79,4-4,4-4-1.79-4-4,1.79-4,4-4Zm-10,24c-1.3,0-2.4-.84-2.82-2h5.63c-.41,1.16-1.51,2-2.82,2Zm9-4H5c-.55,0-1-.45-1-1s.45-1,1-1h18c.55,0,1,.45,1,1s-.45,1-1,1Zm-1-10v6H6v-6c0-4.41,3.59-8,8-8,1.44,0,2.84.39,4.07,1.12-.04.29-.07.58-.07.88,0,2.6,1.67,4.82,3.99,5.65,0,.12,0,.24,0,.35Z"
                                    />
                                </svg>
                                {/* Notification badge */}
                                <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                            </button>

                            <div className="relative">
                                <button
                                    ref={userBtnRef}
                                    type="button"
                                    className="flex items-center gap-x-3 rounded-full focus:outline-none cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                                    onClick={toggleUserMenu}
                                    aria-expanded={isUserMenuOpen}
                                    aria-haspopup="true"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                                        {getInitials(user?.first_name, user?.last_name)}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user?.first_name} 
                                        </p>
                                    </div>
                                    <svg className="h-4 w-4 text-gray-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isUserMenuOpen && (
                                    <div
                                        ref={userMenuRef}
                                        className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5 border border-gray-200 dark:border-gray-700"
                                        role="menu"
                                    >
                                        {/* User info header */}
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user?.first_name} {user?.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        
                                        {userMenuItems.map((item, index) => (
                                            <React.Fragment key={item.label}>
                                                <UserMenuItem
                                                    to={item.to}
                                                    onClick={item.onClick ? item.onClick : closeUserMenu}
                                                    isRed={item.isRed}
                                                >
                                                    {item.label}
                                                </UserMenuItem>
                                                {index < userMenuItems.length - 1 && (
                                                    <div className="border-t border-gray-200 dark:border-gray-700 mx-2 my-1" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <main className="bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>

            <footer className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
                <div className="w-full max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="text-center">
                            <p className="text-xs text-gray-400 dark:text-gray-400">
                                ©2025 Autoresum. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
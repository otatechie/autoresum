import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Navigation item component
function NavItem({ to, isActive, icon, children, onClick }) {
    const baseClasses = "flex items-center gap-x-3 text-sm font-medium transition-all py-2 relative";
    const activeClasses = "text-blue-600 dark:text-blue-500 bg-gray-50 dark:bg-gray-800/50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-600 dark:before:bg-blue-600";
    const inactiveClasses = "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";

    return (
        <Link
            to={to}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            onClick={onClick}
        >
            <div className="relative flex items-center gap-x-3 px-6">
                <svg className={`h-6 w-6 ${isActive ? 'text-blue-600 dark:text-blue-600' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon} />
                </svg>
                {children}
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
            className={`block px-3 py-1 text-sm ${colorClasses} hover:bg-gray-50 dark:hover:bg-gray-700`}
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
        <a href={href} target="_blank" rel="noopener noreferrer" className="group">
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
    const userMenuRef = useRef(null);
    const userBtnRef = useRef(null);
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
    const closeSidebar = (e) => e.target.getAttribute('role') === 'dialog' && setIsSidebarOpen(false);
    const closeUserMenu = () => setIsUserMenuOpen(false);
    const goToCreateResume = () => {
        setIsSidebarOpen(false);
        navigate('/create-resume');
    };

    // Check if clicked outside user menu
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (isUserMenuOpen &&
                userMenuRef.current &&
                userBtnRef.current &&
                !userMenuRef.current.contains(event.target) &&
                !userBtnRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen]);

    // Sidebar content component
    function SidebarContent() {
        return (
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                    <a href="/dashboard"> <img className="h-14 w-auto dark:invert" src="/images/logo.png" alt="Autoresum" /></a>
                </div>

                <div className="shrink-0">
                    <button
                        onClick={goToCreateResume}
                        className="w-full btn-primary inline-flex items-center justify-center gap-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create resume
                    </button>
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
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
                    <div className="flex h-16 shrink-0 items-center">
                        <a href="/dashboard"> <img className="h-14 w-auto dark:invert" src="/images/logo.png" alt="Autoresum" /></a>
                    </div>

                    <div className="shrink-0">
                        <button
                            onClick={goToCreateResume}
                            className="w-full btn-primary inline-flex items-center justify-center gap-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create resume
                        </button>
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
            <div className="lg:pl-64">
                {/* Top navigation */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <button
                        type="button"
                        className="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-1 max-w-md">
                            <form className="flex w-full md:ml-0" action="#" method="GET" role="search">
                                <div className="relative flex flex-1">
                                    <label htmlFor="search-input" className="sr-only">Search Autoresum</label>
                                    <div className="relative w-full">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            id="search-input"
                                            type="search"
                                            name="search"
                                            placeholder="Search Autoresum"
                                            className="h-10 w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="ml-4 flex items-center gap-x-4 sm:gap-x-6">
                            <Link to="/help" className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                Help
                            </Link>

                            <button
                                type="button"
                                className="inline-flex items-center justify-center size-8 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                aria-label="View notifications"
                            >
                                <span className="sr-only">View notifications</span>
                                <svg className="size-4" viewBox="0 0 32 32">
                                    <path
                                        fill="currentColor"
                                        d="m30,8c0-3.31-2.69-6-6-6-2.3,0-4.29,1.3-5.3,3.2-1.15-.61-2.4-1-3.7-1.13v-1.07c0-.55-.45-1-1-1s-1,.45-1,1v1.05c-5.05.5-9,4.77-9,9.95v6.18c-1.16.41-2,1.51-2,2.82,0,1.65,1.35,3,3,3h4.1c.46,2.28,2.48,4,4.9,4s4.43-1.72,4.9-4h4.1c1.65,0,3-1.35,3-3,0-1.3-.84-2.4-2-2.82v-6.18c3.31,0,6-2.69,6-6Zm-6-4c2.21,0,4,1.79,4,4s-1.79,4-4,4-4-1.79-4-4,1.79-4,4-4Zm-10,24c-1.3,0-2.4-.84-2.82-2h5.63c-.41,1.16-1.51,2-2.82,2Zm9-4H5c-.55,0-1-.45-1-1s.45-1,1-1h18c.55,0,1,.45,1,1s-.45,1-1,1Zm-1-10v6H6v-6c0-4.41,3.59-8,8-8,1.44,0,2.84.39,4.07,1.12-.04.29-.07.58-.07.88,0,2.6,1.67,4.82,3.99,5.65,0,.12,0,.24,0,.35Z"
                                    />
                                </svg>
                            </button>

                            <div className="relative">
                                <button
                                    ref={userBtnRef}
                                    type="button"
                                    className="flex items-center gap-x-4 rounded-full focus:outline-none cursor-pointer"
                                    onClick={toggleUserMenu}
                                    aria-expanded={isUserMenuOpen}
                                    aria-haspopup="true"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="flex items-center justify-center size-8 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium">
                                        {getInitials(user?.first_name, user?.last_name)}
                                    </div>
                                </button>

                                {isUserMenuOpen && (
                                    <div
                                        ref={userMenuRef}
                                        className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/5"
                                        role="menu"
                                    >
                                        {userMenuItems.map((item, index) => (
                                            <React.Fragment key={item.label}>
                                                <UserMenuItem
                                                    to={item.to}
                                                    onClick={item.onClick ? item.onClick : closeUserMenu}
                                                    isRed={item.isRed}
                                                >
                                                    {item.label}
                                                </UserMenuItem>
                                                {item.divider && index < userMenuItems.length - 1 && (
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
                <div className="w-full max-w-6xl mx-auto px-6 py-16">
                    <div className="flex flex-col items-center space-y-6">
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
        </div>
    );
} 
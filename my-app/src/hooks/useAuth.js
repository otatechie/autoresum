import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { toast } from '../utils/notifications';

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

// Get singleton instance
const authService = new AuthService();

/**
 * Custom hook for managing authentication state
 * Provides authentication methods and state management
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    // Session timeout handling
    const [lastActivity, setLastActivity] = useState(Date.now());

    const resetActivityTimer = useCallback(() => {
        setLastActivity(Date.now());
    }, []);

    // Check for session timeout
    useEffect(() => {
        if (!user) return;

        const checkSessionTimeout = () => {
            const now = Date.now();
            if (now - lastActivity >= SESSION_TIMEOUT) {
                handleLogout();
                toast.warning('Session expired. Please log in again.');
                navigate('/login');
            }
        };

        const intervalId = setInterval(checkSessionTimeout, 300000); // Check every 5 minutes

        // Add activity listeners
        ACTIVITY_EVENTS.forEach(event => {
            window.addEventListener(event, resetActivityTimer);
        });

        return () => {
            clearInterval(intervalId);
            ACTIVITY_EVENTS.forEach(event => {
                window.removeEventListener(event, resetActivityTimer);
            });
        };
    }, [user, lastActivity, navigate, resetActivityTimer]);

    const handleLogout = useCallback(() => {
        authService.logout();
        setUser(null);
        setLastActivity(0);
        navigate('/login');
    }, [navigate]);

    /**
     * Initialize authentication state on mount
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setLoading(true);

                // Check if user is already authenticated
                const token = authService.getToken();
                const storedUser = authService.getUser();

                if (token && storedUser) {
                    // Verify token is still valid by fetching current user
                    try {
                        const result = await authService.getCurrentUser();
                        setUser(result);
                        setIsAuthenticated(true);
                    } catch (error) {
                        // Check if it's a network error
                        if (error.code === 'ECONNABORTED' || error.message?.includes('Network Error')) {
                            // Use cached user data if available
                            if (storedUser) {
                                setUser(storedUser);
                                setIsAuthenticated(true);
                                return;
                            }
                        }
                        // Token is invalid, clear auth data
                        authService.clearAuth();
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // Handle initialization errors
                // If we have stored user data, use it temporarily
                const storedUser = authService.getUser();
                if (storedUser) {
                    setUser(storedUser);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, [authService]);

    /**
     * Sign up a new user
     */
    const signUp = useCallback(async (userData) => {
        try {
            setLoading(true);
            const result = await authService.signUp(userData);

            setUser(result.user);
            setIsAuthenticated(true);

            toast.success(result.message || 'Account created successfully!');

            return result;
        } catch (error) {
            toast.error(error.message || 'Failed to create account');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [authService]);

    /**
     * Sign in an existing user
     */
    const signIn = useCallback(async (credentials) => {
        try {
            setLoading(true);
            const result = await authService.signIn(credentials);

            // Only set authenticated state if we have both user and token
            if (result.user && authService.getToken()) {
                setUser(result.user);
                setIsAuthenticated(true);
                toast.success(result.message || 'Login successful!');
            } else {
                // If we're missing user or token, clear everything
                setUser(null);
                setIsAuthenticated(false);
                authService.clearAuth();
                throw new Error('Invalid authentication response');
            }

            return result;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            authService.clearAuth();
            toast.error(error.message || 'Failed to sign in');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [authService]);

    /**
     * Sign out the current user
     */
    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            await authService.signOut();

            setUser(null);
            setIsAuthenticated(false);

            toast.success('You have been signed out successfully');

        } catch (error) {
            // Still clear local state even if API call fails
            setUser(null);
            setIsAuthenticated(false);
            toast.warning('Signed out locally due to error');
        } finally {
            setLoading(false);
        }
    }, [authService]);

    /**
     * Request password reset
     */
    const forgotPassword = useCallback(async (email) => {
        try {
            setLoading(true);
            const result = await authService.forgotPassword(email);

            toast.success(result.message || 'Password reset instructions sent!');

            return result;
        } catch (error) {
            toast.error(error.message || 'Failed to send reset instructions');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [authService]);

    /**
     * Reset password with token
     */
    const resetPassword = useCallback(async (token, newPassword, confirmPassword) => {
        try {
            setLoading(true);
            const result = await authService.resetPassword(token, newPassword, confirmPassword);

            toast.success(result.message || 'Password reset successfully!');

            return result;
        } catch (error) {
            toast.error(error.message || 'Failed to reset password');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [authService]);

    /**
     * Refresh authentication token
     */
    const refreshToken = useCallback(async () => {
        try {
            const result = await authService.refreshToken();

            if (result.user) {
                setUser(result.user);
            }

            return result;
        } catch (error) {
            // Clear auth state if refresh fails
            setUser(null);
            setIsAuthenticated(false);
            authService.clearAuth();
            throw error;
        }
    }, [authService]);

    /**
     * Update user profile
     */
      const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    authService.setUser(updatedUser);
  }, [authService]);

    /**
     * Check if user has specific role or permission
     */
    const hasRole = useCallback((role) => {
        return user?.roles?.includes(role) || false;
    }, [user]);

    /**
     * Check if user has specific permission
     */
    const hasPermission = useCallback((permission) => {
        return user?.permissions?.includes(permission) || false;
    }, [user]);

    return {
        // State
        user,
        loading,
        isAuthenticated,
        isInitialized,

        // Methods
        signUp,
        signIn,
        signOut,
        forgotPassword,
        resetPassword,
        refreshToken,
        updateUser,

        // Utility methods
        hasRole,
        hasPermission,

        // Direct access to auth service if needed
        authService
    };
}

export default useAuth;

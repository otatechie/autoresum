import axios from 'axios';
import { config, log } from '../config/environment';

let instance = null;

/**
 * Comprehensive Authentication Service Class
 * Handles all authentication-related operations with proper error handling,
 * validation, and token management.
 */
class AuthService {
    constructor() {
        if (instance) {
            return instance;
        }
        instance = this;

        this.baseURL = config.api.baseUrl;
        this.tokenKey = config.auth.tokenStorageKey;
        this.userKey = config.auth.userStorageKey;

        // Request queue for managing concurrent requests
        this.requestQueue = [];
        this.maxConcurrentRequests = 3;
        this.activeRequests = 0;
        this.requestTimeout = null;

        // Create axios instance with default config
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            retryCount: 2,
            retryDelay: 1000,
            // Browser will handle connection pooling
            maxContentLength: 2000000, // 2MB max content length
            maxRedirects: 5,          // Maximum number of redirects to follow
            decompress: true          // Enable automatic decompression
        });

        // Setup interceptors
        this.setupInterceptors();
    }

    /**
     * Setup axios interceptors for request/response handling
     */
    setupInterceptors() {
        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                
                // Handle request timeout
                if (error.code === 'ECONNABORTED' && originalRequest && !originalRequest._retry) {
                    originalRequest._retry = true;
                    originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
                    
                    if (originalRequest._retryCount <= originalRequest.retryCount) {
                        // Wait before retrying
                        await new Promise(resolve => setTimeout(resolve, originalRequest.retryDelay));
                        return this.api(originalRequest);
                    }
                }

                // Handle token expiration
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await this.refreshToken();
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return this.api(originalRequest);
                        }
                    } catch (refreshError) {
                        this.clearAuth();
                        return Promise.reject(error);
                    }
                } else if (error.response?.status === 403) {
                    this.clearAuth();
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Queue and manage requests to prevent resource exhaustion
     * @param {Function} requestFn - The request function to execute
     * @returns {Promise} - Request result
     */
    async queueRequest(requestFn) {
        // Clear existing timeout if any
        if (this.requestTimeout) {
            clearTimeout(this.requestTimeout);
        }

        // If we're at max concurrent requests, queue the request
        if (this.activeRequests >= this.maxConcurrentRequests) {
            return new Promise((resolve, reject) => {
                this.requestQueue.push({ requestFn, resolve, reject });
            });
        }

        // Execute the request
        this.activeRequests++;
        try {
            const result = await requestFn();
            return result;
        } finally {
            this.activeRequests--;
            // Process next request in queue if any
            this.processNextRequest();
        }
    }

    /**
     * Process next request in queue
     */
    processNextRequest() {
        if (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
            const { requestFn, resolve, reject } = this.requestQueue.shift();
            this.queueRequest(requestFn).then(resolve).catch(reject);
        }
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} - Validation result with isValid and errors
     */
    validatePassword(password) {
        const errors = [];
        // Enhanced password validation config
        const passwordConfig = {
            minLength: 12,
            maxLength: 128,
            requireLowercase: true,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            commonPasswords: [
                'password123', 'qwerty123', '12345678', 'admin123',
                'letmein123', 'welcome123', 'monkey123', 'football123'
            ]
        };

        if (!password) {
            errors.push('Password is required');
        } else {
            // Check if it's a common password
            if (passwordConfig.commonPasswords.includes(password.toLowerCase())) {
                errors.push('This password is too common. Please choose a stronger password.');
                return { isValid: false, errors };
            }

            // Check password length
            if (password.length < passwordConfig.minLength) {
                errors.push(`Password must be at least ${passwordConfig.minLength} characters long`);
            }
            if (password.length > passwordConfig.maxLength) {
                errors.push(`Password must be no more than ${passwordConfig.maxLength} characters long`);
            }

            // Check for repeated characters
            if (/(.)\1{2,}/.test(password)) {
                errors.push('Password cannot contain repeated characters (e.g., "aaa")');
            }

            // Check for sequential characters
            if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
                errors.push('Password cannot contain sequential characters (e.g., "abc", "123")');
            }

            if (passwordConfig.requireLowercase && !/(?=.*[a-z])/.test(password)) {
                errors.push('Password must contain at least one lowercase letter');
            }
            if (passwordConfig.requireUppercase && !/(?=.*[A-Z])/.test(password)) {
                errors.push('Password must contain at least one uppercase letter');
            }
            if (passwordConfig.requireNumbers && !/(?=.*\d)/.test(password)) {
                errors.push('Password must contain at least one number');
            }
            if (passwordConfig.requireSpecialChars && !/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) {
                errors.push('Password must contain at least one special character');
            }

            // Check for keyboard patterns
            if (/qwert|asdfg|zxcvb|poiuy|lkjhg|mnbvc/i.test(password)) {
                errors.push('Password cannot contain keyboard patterns');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Sanitize user input
     * @param {string} input - Input to sanitize
     * @returns {string} - Sanitized input
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim().replace(/[<>]/g, '');
    }

    /**
     * Store authentication token
     * @param {string} token - JWT token
     */
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Retrieve authentication token
     * @returns {string|null} - JWT token or null
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Store user data
     * @param {object} user - User object
     */
    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    /**
     * Retrieve user data
     * @returns {object|null} - User object or null
     */
    getUser() {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Clear authentication data
     */
    clearAuth() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} - True if authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Handle API errors and format them for UI display
     * @param {object} error - Axios error object
     * @returns {object} - Formatted error object
     */
    handleError(error) {
        let message = 'An unexpected error occurred. Please try again.';
        let status = 500;
        let validationErrors = {};

        if (error.response) {
            status = error.response.status;
            const data = error.response.data;

            // Log the full error response for debugging
            log('error', 'API Error Response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });

            switch (status) {
                case 400:
                    // Handle both object and string error responses
                    if (typeof data === 'object') {
                        // Extract validation errors from the response
                        Object.keys(data).forEach(key => {
                            if (Array.isArray(data[key])) {
                                validationErrors[key] = data[key][0];
                            } else if (typeof data[key] === 'string') {
                                validationErrors[key] = data[key];
                            }
                        });
                        message = Object.values(validationErrors)[0] || 'Invalid request. Please check your input.';
                    } else {
                        message = data || 'Invalid request. Please check your input.';
                    }
                    break;
                case 401:
                    message = 'Invalid credentials. Please check your email and password.';
                    break;
                case 422:
                    message = 'Validation failed. Please check your input.';
                    if (data.errors) {
                        validationErrors = data.errors;
                    }
                    break;
                case 429:
                    message = 'Too many requests. Please wait a moment and try again.';
                    break;
                case 500:
                    message = 'Server error. Please try again later.';
                    break;
                default:
                    message = data?.message || data?.detail || 'An unexpected error occurred. Please try again.';
            }
        } else if (error.request) {
            // The request was made but no response was received
            log('error', 'No response received:', error.request);
            message = 'No response from server. Please check your connection.';
        } else {
            // Something happened in setting up the request
            log('error', 'Request setup error:', error.message);
            message = error.message;
        }

        return {
            message,
            status,
            validationErrors,
            originalError: error
        };
    }

    /**
     * User registration
     * @param {object} userData - User registration data
     * @param {string} userData.email - User email
     * @param {string} userData.password - User password
     * @param {string} userData.confirmPassword - Password confirmation
     * @param {string} userData.firstName - User first name (optional)
     * @param {string} userData.lastName - User last name (optional)
     * @returns {Promise<object>} - Registration result
     */
    async signUp(userData) {
        try {
            log('info', 'Starting user registration', { email: userData.email });

            // Input validation
            const errors = {};

            if (!userData.email) {
                errors.email = 'Email is required';
            } else if (!this.validateEmail(userData.email)) {
                errors.email = 'Please enter a valid email address';
            }

            const passwordValidation = this.validatePassword(userData.password);
            if (!passwordValidation.isValid) {
                errors.password = passwordValidation.errors[0];
            }

            if (userData.password !== userData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }

            if (Object.keys(errors).length > 0) {
                log('warn', 'Registration validation failed', { errors });
                throw {
                    response: {
                        status: 422,
                        data: { errors }
                    }
                };
            }

            // Sanitize input
            const email = this.sanitizeInput(userData.email).toLowerCase();
            const sanitizedData = {
                email: email,
                username: email, // Using email as username
                password: userData.password,
                confirm_password: userData.confirmPassword, // Django expects confirm_password
                first_name: this.sanitizeInput(userData.firstName || ''),
                last_name: this.sanitizeInput(userData.lastName || '')
            };

            // Make API call
            log('debug', 'Making registration API call with data:', {
                ...sanitizedData,
                password: '***',
                confirm_password: '***'
            });

            const response = await this.api.post('/auth/register', sanitizedData);

            log('debug', 'Registration API response:', {
                status: response?.status,
                statusText: response?.statusText,
                data: response?.data ? {
                    ...response.data,
                    access_token: response.data.access_token ? '***' : undefined,
                    refresh_token: response.data.refresh_token ? '***' : undefined,
                    access: response.data.access ? '***' : undefined,
                    refresh: response.data.refresh ? '***' : undefined
                } : null,
                headers: response?.headers
            });

            // Handle successful response - Django JWT returns access_token and refresh_token
            if (!response || !response.data) {
                log('error', 'Invalid response:', response);
                throw new Error('Invalid response from server');
            }

            const { data } = response;

            if (!data.access_token && !data.access) {
                log('error', 'No access token in response data:', {
                    ...data,
                    access_token: data.access_token ? '***' : undefined,
                    refresh_token: data.refresh_token ? '***' : undefined,
                    access: data.access ? '***' : undefined,
                    refresh: data.refresh ? '***' : undefined
                });
                throw new Error('Invalid server response: missing access token');
            }

            // Support both token formats (access_token/refresh_token and access/refresh)
            const accessToken = data.access_token || data.access;
            const refreshToken = data.refresh_token || data.refresh;

            // Store the access token
            this.setToken(accessToken);
            log('debug', 'Token stored successfully');

            // Extract user data (remove token fields)
            const userInfo = { ...data };
            delete userInfo.access_token;
            delete userInfo.refresh_token;
            delete userInfo.access;
            delete userInfo.refresh;

            // Store user data if available
            if (Object.keys(userInfo).length > 0) {
                this.setUser(userInfo);
                log('debug', 'User data stored successfully');
            }

            log('info', 'User registration successful', { userId: userInfo?.id });
            return {
                success: true,
                message: 'Account created successfully!',
                user: userInfo,
                token: accessToken,
                refreshToken: refreshToken
            };

        } catch (error) {
            log('error', 'Registration failed', error);
            const formattedError = this.handleError(error);
            throw formattedError;
        }
    }

    /**
     * User login
     * @param {object} credentials - Login credentials
     * @param {string} credentials.username - Username
     * @param {string} credentials.password - User password
     * @param {boolean} credentials.rememberMe - Remember user (optional)
     * @returns {Promise<object>} - Login result
     */
    async signIn(credentials) {
        try {
            // Input validation
            const errors = {};

            if (!credentials.username) {
                errors.username = 'Username is required';
            }

            if (!credentials.password) {
                errors.password = 'Password is required';
            }

            if (Object.keys(errors).length > 0) {
                throw {
                    response: {
                        status: 422,
                        data: { errors }
                    }
                };
            }

            // Sanitize input
            const sanitizedCredentials = {
                username: this.sanitizeInput(credentials.username),
                password: credentials.password,
                rememberMe: credentials.rememberMe || false
            };

            // Make API call
            const response = await this.api.post('/auth/login', sanitizedCredentials);

            // Handle successful response
            const data = response?.data || response; // Handle both wrapped and unwrapped responses

            if (!data) {
                throw new Error('Invalid response from server');
            }

            // Extract tokens - DRF Simple JWT returns access and refresh tokens
            const token = data.access || data.access_token;

            if (!token) {
                throw new Error('No authentication token received');
            }

            // Store auth data
            this.setToken(token);

            // Get user profile since token response doesn't include it
            try {
                const userResponse = await this.api.get('/auth/profile');
                const userData = userResponse?.data?.user || userResponse?.user;

                if (userData) {
                    this.setUser(userData);
                } else {
                    this.setUser({
                        email: credentials.username
                    });
                }
            } catch (error) {
                // Still proceed with login, just use basic user info
                this.setUser({
                    email: credentials.username
                });
            }

            // Return normalized response
            return {
                success: true,
                message: 'Login successful!',
                user: this.getUser()
            };

        } catch (error) {
            const formattedError = this.handleError(error);
            throw formattedError;
        }
    }

    /**
     * Initiate password reset process
     * @param {string} email - User email
     * @returns {Promise<object>} - Password reset initiation result
     */
    async forgotPassword(email) {
        try {
            // Input validation
            if (!email) {
                throw {
                    response: {
                        status: 422,
                        data: { errors: { email: 'Email is required' } }
                    }
                };
            }

            if (!this.validateEmail(email)) {
                throw {
                    response: {
                        status: 422,
                        data: { errors: { email: 'Please enter a valid email address' } }
                    }
                };
            }

            // Sanitize input
            const sanitizedEmail = this.sanitizeInput(email).toLowerCase();

            // Make API call
            await this.api.post('/auth/forgot-password', {
                email: sanitizedEmail
            });

            return {
                success: true,
                message: 'Password reset instructions have been sent to your email.',
                email: sanitizedEmail
            };

        } catch (error) {
            const formattedError = this.handleError(error);
            throw formattedError;
        }
    }

    /**
     * Complete password reset with token
     * @param {string} token - Password reset token
     * @param {string} newPassword - New password
     * @param {string} confirmPassword - Password confirmation
     * @returns {Promise<object>} - Password reset result
     */
    async resetPassword(token, newPassword, confirmPassword) {
        try {
            // Input validation
            const errors = {};

            if (!token) {
                errors.token = 'Reset token is required';
            }

            const passwordValidation = this.validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                errors.password = passwordValidation.errors[0];
            }

            if (newPassword !== confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }

            if (Object.keys(errors).length > 0) {
                throw {
                    response: {
                        status: 422,
                        data: { errors }
                    }
                };
            }

            // Make API call
            await this.api.post('/auth/reset-password', {
                token: token,
                password: newPassword,
                confirmPassword: confirmPassword
            });

            return {
                success: true,
                message: 'Password has been reset successfully. You can now log in with your new password.',
                redirectTo: '/login'
            };

        } catch (error) {
            const formattedError = this.handleError(error);
            throw formattedError;
        }
    }

    /**
     * Sign out user
     * @returns {Promise<object>} - Sign out result
     */
    async signOut() {
        try {
            // Call backend to invalidate token if authenticated
            if (this.isAuthenticated()) {
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        await this.api.post('/auth/logout', {
                            refresh: refreshToken
                        });
                    }
                } catch (error) {
                    // Continue with local logout even if backend call fails
                    console.warn('Backend logout failed:', error);
                }
            }

            // Clear local authentication data
            this.clearAuth();

            return {
                success: true,
                message: 'You have been signed out successfully.'
            };

        } catch (error) {
            // Always clear local data even if there's an error
            this.clearAuth();
            const formattedError = this.handleError(error);
            throw formattedError;
        }
    }

    /**
     * Refresh the access token
     * @returns {Promise<string>} - New access token
     */
    async refreshToken() {
        const response = await this.api.post('/auth/refresh-token');
        const newToken = response.data.token;
        if (newToken) {
            this.setToken(newToken);
            return newToken;
        }
        throw new Error('No token in refresh response');
    }

    /**
     * Get current user profile
     * @returns {Promise<object>} - User profile
     */
    async getCurrentUser() {
        try {
            const response = await this.queueRequest(() => this.api.get('/auth/profile', {
                // Override default timeout for this specific request
                timeout: 10000,
                retryCount: 1,
                retryDelay: 500
            }));
            
            const userData = response.data?.user;  // Extract user data from nested response

            if (userData) {
                this.setUser(userData);
                return userData;
            }

            return null;
        } catch (error) {
            // If it's a timeout or network error, return the cached user data
            if (error.code === 'ECONNABORTED' || 
                error.message.includes('Network Error') || 
                error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
                const cachedUser = this.getUser();
                if (cachedUser) {
                    // Schedule a retry after a delay
                    this.requestTimeout = setTimeout(() => {
                        this.getCurrentUser().catch(() => {}); // Silent retry
                    }, 5000);
                    return cachedUser;
                }
            }
            const formattedError = this.handleError(error);
            throw formattedError;
        }
    }

    /**
     * Update user profile
     * @param {object} profileData - Profile data to update
     * @returns {Promise<object>} - Updated user data
     */
    async updateProfile(profileData) {
        try {
            // Input validation
            const errors = {};

            if (!profileData.email) {
                errors.email = 'Email is required';
            } else if (!this.validateEmail(profileData.email)) {
                errors.email = 'Please enter a valid email address';
            }

            if (!profileData.first_name?.trim()) {
                errors.first_name = 'First name is required';
            }

            if (!profileData.last_name?.trim()) {
                errors.last_name = 'Last name is required';
            }

            if (Object.keys(errors).length > 0) {
                throw {
                    response: {
                        status: 422,
                        data: { errors }
                    }
                };
            }

            // Sanitize input
            const sanitizedData = {
                email: this.sanitizeInput(profileData.email).toLowerCase(),
                first_name: this.sanitizeInput(profileData.first_name),
                last_name: this.sanitizeInput(profileData.last_name),
                // Add other fields as needed
            };

            // Make API call
            const response = await this.api.patch('/auth/profile', sanitizedData);

            if (!response?.data) {
                throw new Error('Invalid response from server');
            }

            return response.data;

        } catch (error) {
            const formattedError = this.handleError(error);
            throw formattedError;
        }
    }

    /**
     * Change user password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<object>} - Password change result
     */
    async changePassword(currentPassword, newPassword) {
        try {
            // Input validation
            const errors = {};

            if (!currentPassword) {
                errors.currentPassword = 'Current password is required';
            }

            const passwordValidation = this.validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                errors.newPassword = passwordValidation.errors[0];
            }

            if (Object.keys(errors).length > 0) {
                throw {
                    response: {
                        status: 422,
                        data: { errors }
                    }
                };
            }

            // Make API call
            const response = await this.api.post('/auth/change-password', {
                current_password: currentPassword,
                new_password: newPassword
            });

            if (!response?.data) {
                throw new Error('Invalid response from server');
            }

            return response.data;

        } catch (error) {
            const formattedError = this.handleError(error);
            throw formattedError;
        }
    }
}

export default AuthService;

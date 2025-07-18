import axios from 'axios';
import { rateLimit } from '../utils/rateLimit';

// Validate API URL
const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
    throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
}

// Get CSRF token from cookie
function getCSRFToken() {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let cookie of cookieArray) {
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

// Create an axios instance with default config
const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-XSS-Protection': '1; mode=block',
        'X-CSRF-TOKEN': getCSRFToken(),
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin'
    },
    withCredentials: true, // Required for HttpOnly cookies
    timeout: 10000, // 10 seconds
});

// Rate limiting configuration
const limiter = rateLimit({
    maxRequests: 100,
    perWindow: 60000, // 1 minute window
    blacklistAfter: 3 // Block after 3 violations
});

// Add a request interceptor for authentication if needed
api.interceptors.request.use(
    async (config) => {
        // Apply rate limiting
        await limiter.checkLimit();

        // Add CSRF token to non-GET requests
        if (config.method !== 'get') {
            const token = getCSRFToken();
            if (token) {
                config.headers['X-CSRF-TOKEN'] = token;
            }
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors like 401, 403, 500, etc.
        if (error.response?.status === 401) {
            // Clear all auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Let the components handle redirection
        }
        // Standardize error response
        const errorResponse = {
            message: error.response?.data?.message || 'An unexpected error occurred',
            status: error.response?.status || 500,
            code: error.response?.data?.code || 'UNKNOWN_ERROR'
        };
        return Promise.reject(errorResponse);
    }
);

// Example API functions
const apiService = {
    // User related endpoints
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getUser: () => api.get('/user/profile'),

    // Resume related endpoints
    getResumes: () => api.get('/resumes'),
    getResumeById: (id) => api.get(`/resumes/${id}`),
    createResume: (resumeData) => api.post('/resumes', resumeData),
    updateResume: (id, resumeData) => api.put(`/resumes/${id}`, resumeData),
    deleteResume: (id) => api.delete(`/resumes/${id}`),

    // Any other endpoints you need to interact with
    getTemplates: () => api.get('/templates'),
    generateResume: (data) => api.post('/generate', data),
};

export default apiService; 
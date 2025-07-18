/**
 * Environment Configuration
 * Centralized configuration management for the application
 */

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {any} defaultValue - Default value if env var is not set
 * @returns {any} - Environment variable value or default
 */
function getEnvVar(key, defaultValue = null) {
    const value = import.meta.env[key];

    // Handle boolean values
    if (typeof defaultValue === 'boolean') {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return defaultValue;
    }

    // Handle number values
    if (typeof defaultValue === 'number') {
        const numValue = Number(value);
        return isNaN(numValue) ? defaultValue : numValue;
    }

    // Handle string values
    return value || defaultValue;
}

/**
 * Application configuration object
 */
export const config = {
    // API Configuration
    api: {
        baseUrl: getEnvVar('VITE_API_URL', 'http://localhost:8000/api'),
        timeout: getEnvVar('VITE_API_TIMEOUT', 10000),
    },

    // App Configuration
    app: {
        name: getEnvVar('VITE_APP_NAME', 'Autoresum'),
        version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
        environment: getEnvVar('VITE_NODE_ENV', 'development'),
    },

    // Authentication Configuration
    auth: {
        tokenStorageKey: getEnvVar('VITE_TOKEN_STORAGE_KEY', 'auth_token'),
        userStorageKey: getEnvVar('VITE_USER_STORAGE_KEY', 'auth_user'),
        tokenExpiration: getEnvVar('VITE_TOKEN_EXPIRATION', 24 * 60 * 60 * 1000), // 24 hours in ms
    },

    // Feature Flags
    features: {
        googleAuth: getEnvVar('VITE_ENABLE_GOOGLE_AUTH', true),
        registration: getEnvVar('VITE_ENABLE_REGISTRATION', true),
        passwordReset: getEnvVar('VITE_ENABLE_PASSWORD_RESET', true),
        darkMode: getEnvVar('VITE_ENABLE_DARK_MODE', true),
    },

    // Development Configuration
    development: {
        debugMode: getEnvVar('VITE_DEBUG_MODE', false),
        logLevel: getEnvVar('VITE_LOG_LEVEL', 'info'),
        showErrorDetails: getEnvVar('VITE_SHOW_ERROR_DETAILS', false),
    },

    // External Services
    services: {
        googleClientId: getEnvVar('VITE_GOOGLE_CLIENT_ID', ''),
        analyticsId: getEnvVar('VITE_ANALYTICS_ID', ''),
    },

    // UI Configuration
    ui: {
        toastDuration: getEnvVar('VITE_TOAST_DURATION', 5000),
        loadingTimeout: getEnvVar('VITE_LOADING_TIMEOUT', 30000),
        maxFileSize: getEnvVar('VITE_MAX_FILE_SIZE', 5 * 1024 * 1024), // 5MB
    },

    // Validation Configuration
    validation: {
        password: {
            minLength: getEnvVar('VITE_PASSWORD_MIN_LENGTH', 8),
            maxLength: getEnvVar('VITE_PASSWORD_MAX_LENGTH', 128),
            requireUppercase: getEnvVar('VITE_PASSWORD_REQUIRE_UPPERCASE', true),
            requireLowercase: getEnvVar('VITE_PASSWORD_REQUIRE_LOWERCASE', true),
            requireNumbers: getEnvVar('VITE_PASSWORD_REQUIRE_NUMBERS', true),
            requireSpecialChars: getEnvVar('VITE_PASSWORD_REQUIRE_SPECIAL', false),
        },
        email: {
            maxLength: getEnvVar('VITE_EMAIL_MAX_LENGTH', 254),
        },
        name: {
            maxLength: getEnvVar('VITE_NAME_MAX_LENGTH', 50),
        },
    },
};

/**
 * Check if the app is running in development mode
 * @returns {boolean} - True if in development mode
 */
export function isDevelopment() {
    return config.app.environment === 'development' || config.development.debugMode;
}

/**
 * Check if the app is running in production mode
 * @returns {boolean} - True if in production mode
 */
export function isProduction() {
    return config.app.environment === 'production';
}

/**
 * Get API endpoint URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} - Full API URL
 */
export function getApiUrl(endpoint = '') {
    const baseUrl = config.api.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash
    return cleanEndpoint ? `${baseUrl}/${cleanEndpoint}` : baseUrl;
}

/**
 * Log message based on log level
 * @param {string} level - Log level (error, warn, info, debug)
 * @param {string} message - Message to log
 * @param {any} data - Additional data to log
 */
export function log(level, message, data = null) {
    if (!isDevelopment() && !config.development.debugMode) {
        return;
    }

    const logLevels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = logLevels.indexOf(config.development.logLevel);
    const messageLevelIndex = logLevels.indexOf(level);

    if (messageLevelIndex <= currentLevelIndex) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        if (data) {
            console[level](prefix, message, data);
        } else {
            console[level](prefix, message);
        }
    }
}

/**
 * Validate configuration on app startup
 * @returns {object} - Validation result with errors if any
 */
export function validateConfig() {
    const errors = [];
    const warnings = [];

    // Check required API URL
    if (!config.api.baseUrl) {
        errors.push('API base URL is required (VITE_API_URL)');
    }

    // Check API URL format
    try {
        new URL(config.api.baseUrl);
    } catch {
        errors.push('API base URL must be a valid URL');
    }

    // Check Google Auth configuration
    if (config.features.googleAuth && !config.services.googleClientId) {
        warnings.push('Google Auth is enabled but Google Client ID is not configured');
    }

    // Check password validation settings
    if (config.validation.password.minLength < 6) {
        warnings.push('Password minimum length is less than 6 characters');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

// Validate configuration on module load
const validation = validateConfig();
if (!validation.isValid) {
    // Configuration validation failed
}
if (validation.warnings.length > 0) {
    // Configuration warnings present
}

export default config;

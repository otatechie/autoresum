/**
 * Validation Utilities
 * Comprehensive input validation functions for authentication and form fields
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} - Validation result with isValid and error message
 */
export function validateEmail(email) {
	if (!email) {
		return {
			isValid: false,
			error: 'Email is required'
		};
	}

	if (typeof email !== 'string') {
		return {
			isValid: false,
			error: 'Email must be a string'
		};
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const isValid = emailRegex.test(email.trim());

	return {
		isValid,
		error: isValid ? null : 'Please enter a valid email address'
	};
}

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {object} - Validation result with isValid and error message
 */
export function validateUsername(username) {
	if (!username) {
		return {
			isValid: false,
			error: 'Username is required'
		};
	}

	if (typeof username !== 'string') {
		return {
			isValid: false,
			error: 'Username must be a string'
		};
	}

	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	const isValid = usernameRegex.test(username.trim());

	return {
		isValid,
		error: isValid ? null : 'Please enter a valid username'
	};
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result with isValid, errors, and strength score
 */
export function validatePassword(password, options = {}) {
	const {
		minLength = 8,
		requireUppercase = true,
		requireLowercase = true,
		requireNumbers = true,
		requireSpecialChars = false,
		maxLength = 128
	} = options;

	const errors = [];
	let strengthScore = 0;

	if (!password) {
		return {
			isValid: false,
			errors: ['Password is required'],
			strengthScore: 0,
			strength: 'none'
		};
	}

	if (typeof password !== 'string') {
		return {
			isValid: false,
			errors: ['Password must be a string'],
			strengthScore: 0,
			strength: 'none'
		};
	}

	// Length validation
	if (password.length < minLength) {
		errors.push(`Password must be at least ${minLength} characters long`);
	} else {
		strengthScore += 1;
	}

	if (password.length > maxLength) {
		errors.push(`Password must be no more than ${maxLength} characters long`);
	}

	// Character type validation
	if (requireLowercase && !/(?=.*[a-z])/.test(password)) {
		errors.push('Password must contain at least one lowercase letter');
	} else if (/(?=.*[a-z])/.test(password)) {
		strengthScore += 1;
	}

	if (requireUppercase && !/(?=.*[A-Z])/.test(password)) {
		errors.push('Password must contain at least one uppercase letter');
	} else if (/(?=.*[A-Z])/.test(password)) {
		strengthScore += 1;
	}

	if (requireNumbers && !/(?=.*\d)/.test(password)) {
		errors.push('Password must contain at least one number');
	} else if (/(?=.*\d)/.test(password)) {
		strengthScore += 1;
	}

	if (requireSpecialChars && !/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
		errors.push('Password must contain at least one special character');
	} else if (/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
		strengthScore += 1;
	}

	// Additional strength checks
	if (password.length >= 12) {
		strengthScore += 1;
	}

	if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
		strengthScore += 1;
	}

	// Determine strength level
	let strength = 'weak';
	if (strengthScore >= 6) {
		strength = 'very-strong';
	} else if (strengthScore >= 5) {
		strength = 'strong';
	} else if (strengthScore >= 3) {
		strength = 'medium';
	}

	return {
		isValid: errors.length === 0,
		errors,
		strengthScore,
		strength
	};
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {object} - Validation result
 */
export function validatePasswordConfirmation(password, confirmPassword) {
	if (!confirmPassword) {
		return {
			isValid: false,
			error: 'Please confirm your password'
		};
	}

	if (password !== confirmPassword) {
		return {
			isValid: false,
			error: 'Passwords do not match'
		};
	}

	return {
		isValid: true,
		error: null
	};
}

/**
 * Validate name fields (first name, last name)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error messages
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export function validateName(name, fieldName = 'Name', options = {}) {
	const {
		required = false,
		minLength = 1,
		maxLength = 50,
		allowNumbers = false,
		allowSpecialChars = false
	} = options;

	if (!name) {
		return {
			isValid: !required,
			error: required ? `${fieldName} is required` : null
		};
	}

	if (typeof name !== 'string') {
		return {
			isValid: false,
			error: `${fieldName} must be a string`
		};
	}

	const trimmedName = name.trim();

	if (trimmedName.length < minLength) {
		return {
			isValid: false,
			error: `${fieldName} must be at least ${minLength} character${minLength > 1 ? 's' : ''} long`
		};
	}

	if (trimmedName.length > maxLength) {
		return {
			isValid: false,
			error: `${fieldName} must be no more than ${maxLength} characters long`
		};
	}

	// Check for invalid characters
	if (!allowNumbers && /\d/.test(trimmedName)) {
		return {
			isValid: false,
			error: `${fieldName} cannot contain numbers`
		};
	}

	if (!allowSpecialChars && /[^a-zA-Z\s'-]/.test(trimmedName)) {
		return {
			isValid: false,
			error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
		};
	}

	return {
		isValid: true,
		error: null
	};
}

/**
 * Validate form data object
 * @param {object} formData - Form data to validate
 * @param {object} validationRules - Validation rules for each field
 * @returns {object} - Validation result with errors object
 */
export function validateForm(formData, validationRules) {
	const errors = {};
	let isValid = true;

	for (const [fieldName, rules] of Object.entries(validationRules)) {
		const value = formData[fieldName];
		let fieldValid = true;

		for (const rule of rules) {
			const result = rule(value);
			if (!result.isValid) {
				errors[fieldName] = result.error;
				fieldValid = false;
				isValid = false;
				break; // Stop at first error for this field
			}
		}
	}

	return {
		isValid,
		errors
	};
}

/**
 * Sanitize input to prevent XSS and other security issues
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
	if (typeof input !== 'string') {
		return '';
	}

	return input
		.trim()
		.replace(/[<>]/g, '') // Remove potential HTML tags
		.replace(/javascript:/gi, '') // Remove javascript: protocol
		.replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export function validateUrl(url, options = {}) {
	const { required = false, allowedProtocols = ['http', 'https'] } = options;

	if (!url) {
		return {
			isValid: !required,
			error: required ? 'URL is required' : null
		};
	}

	try {
		const urlObj = new URL(url);

		if (!allowedProtocols.includes(urlObj.protocol.slice(0, -1))) {
			return {
				isValid: false,
				error: `URL must use one of these protocols: ${allowedProtocols.join(', ')}`
			};
		}

		return {
			isValid: true,
			error: null
		};
	} catch {
		return {
			isValid: false,
			error: 'Please enter a valid URL'
		};
	}
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export function validatePhone(phone, options = {}) {
	const { required = false, format = 'international' } = options;

	if (!phone) {
		return {
			isValid: !required,
			error: required ? 'Phone number is required' : null
		};
	}

	// Remove all non-digit characters for validation
	const digitsOnly = phone.replace(/\D/g, '');

	if (format === 'us' && digitsOnly.length !== 10) {
		return {
			isValid: false,
			error: 'Please enter a valid 10-digit US phone number'
		};
	}

	if (format === 'international' && (digitsOnly.length < 7 || digitsOnly.length > 15)) {
		return {
			isValid: false,
			error: 'Please enter a valid phone number'
		};
	}

	return {
		isValid: true,
		error: null
	};
}

// Export convenience validation functions
export const validators = {
	email: validateEmail,
	username: validateUsername,
	password: validatePassword,
	passwordConfirmation: validatePasswordConfirmation,
	name: validateName,
	url: validateUrl,
	phone: validatePhone,
	form: validateForm
};

import DOMPurify from 'dompurify';
import React from 'react';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} content - The content to sanitize
 * @returns {string} - Sanitized content
 */
export function sanitizeHtml(content) {
    if (!content) return '';
    return DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
}

/**
 * Sanitize plain text input
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeText(text) {
    if (!text) return '';
    return text.replace(/[<>]/g, '');
}

/**
 * Sanitize email address
 * @param {string} email - The email to sanitize
 * @returns {string} - Sanitized email
 */
export function sanitizeEmail(email) {
    if (!email) return '';
    return email.toLowerCase().trim();
}

/**
 * Sanitize URL
 * @param {string} url - The URL to sanitize
 * @returns {string} - Sanitized URL
 */
export function sanitizeUrl(url) {
    if (!url) return '';
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return '';
        }
        return parsed.toString();
    } catch {
        return '';
    }
}

/**
 * Sanitize phone number
 * @param {string} phone - The phone number to sanitize
 * @returns {string} - Sanitized phone number
 */
export function sanitizePhone(phone) {
    if (!phone) return '';
    return phone.replace(/[^0-9+\-\s()]/g, '');
}

/**
 * Sanitize filename
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
export function sanitizeFilename(filename) {
    if (!filename) return '';
    // Replace common unsafe filename characters and trim
    return filename
        .replace(/[<>:"/\\|?*]/g, '_')  // Replace unsafe characters
        .replace(/\s+/g, '_')           // Replace spaces with underscore
        .replace(/^\.+/, '')            // Remove leading dots
        .trim();
}

/**
 * Sanitize search query
 * @param {string} query - The search query to sanitize
 * @returns {string} - Sanitized search query
 */
export function sanitizeSearchQuery(query) {
    if (!query) return '';
    // Remove special characters and limit length
    return query.replace(/[^\w\s-]/g, '').substring(0, 100);
}

/**
 * Sanitize object by applying sanitization to all string values
 * @param {object} obj - The object to sanitize
 * @returns {object} - Sanitized object
 */
export function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = sanitizeText(value);
        } else if (Array.isArray(value)) {
            result[key] = value.map(item => 
                typeof item === 'string' ? sanitizeText(item) : item
            );
        } else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeObject(value);
        } else {
            result[key] = value;
        }
    }
    return result;
}

/**
 * Safely renders HTML content by stripping potentially dangerous tags and attributes
 * @param {string} html - The HTML content to sanitize
 * @returns {string} - Sanitized HTML content
 */
export const sanitizeHTML = (html) => {
    if (!html || typeof html !== 'string') {
        return '';
    }

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove potentially dangerous tags
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea'];
    dangerousTags.forEach(tag => {
        const elements = tempDiv.getElementsByTagName(tag);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    });

    // Remove potentially dangerous attributes
    const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'];
    const allElements = tempDiv.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        dangerousAttributes.forEach(attr => {
            if (element.hasAttribute(attr)) {
                element.removeAttribute(attr);
            }
        });
    }

    return tempDiv.innerHTML;
};

/**
 * Safely renders HTML content as a React component
 * @param {string} html - The HTML content to render
 * @returns {JSX.Element} - React element with sanitized content
 */
export const SafeHTML = ({ content, className = '', ...props }) => {
    const sanitizedContent = sanitizeHTML(content);
    return React.createElement('div', {
        className,
        dangerouslySetInnerHTML: { __html: sanitizedContent },
        ...props
    });
}; 
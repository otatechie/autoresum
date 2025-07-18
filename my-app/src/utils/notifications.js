/**
 * Simple Toast Notification System
 * Provides user feedback for authentication actions and other operations
 */

/**
 * Create and display a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'warning', 'info')
 * @param {number} duration - How long to show the toast (in milliseconds)
 */
export function showToast(message, type = 'info', duration = 5000) {
	// Remove any existing toasts
	removeExistingToasts();

	// Create toast container if it doesn't exist
	let toastContainer = document.getElementById('toast-container');
	if (!toastContainer) {
		toastContainer = createToastContainer();
	}

	// Create the toast element
	const toast = createToastElement(message, type);

	// Add toast to container
	toastContainer.appendChild(toast);

	// Trigger animation
	setTimeout(() => {
		toast.classList.add('show');
	}, 100);

	// Auto-remove toast after duration
	setTimeout(() => {
		removeToast(toast);
	}, duration);

	// Add click to dismiss
	toast.addEventListener('click', () => {
		removeToast(toast);
	});
}

/**
 * Create the toast container element
 * @returns {HTMLElement} - The toast container
 */
function createToastContainer() {
	const container = document.createElement('div');
	container.id = 'toast-container';
	container.className = 'fixed top-20 right-4 z-50 space-y-2';
	document.body.appendChild(container);
	return container;
}

/**
 * Create a toast element
 * @param {string} message - The message to display
 * @param {string} type - The type of notification
 * @returns {HTMLElement} - The toast element
 */
function createToastElement(message, type) {
	const toast = document.createElement('div');
	toast.className = `
    toast-notification
    max-w-sm w-full
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    rounded-lg shadow-lg
    p-4
    opacity-0
    transition-all duration-300 ease-in-out
    cursor-pointer
    ${getTypeClasses(type)}
  `.replace(/\s+/g, ' ').trim();

	// Create icon
	const icon = createIcon(type);

	// Create message element
	const messageEl = document.createElement('div');
	messageEl.className = 'ml-3 flex-1';
	messageEl.innerHTML = `
    <p class="text-sm font-medium text-gray-900 dark:text-white">
      ${escapeHtml(message)}
    </p>
  `;

	// Create close button
	const closeBtn = document.createElement('button');
	closeBtn.className = 'ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300';
	closeBtn.innerHTML = `
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
    </svg>
  `;

	// Assemble toast
	const content = document.createElement('div');
	content.className = 'flex items-start';
	content.appendChild(icon);
	content.appendChild(messageEl);
	content.appendChild(closeBtn);

	toast.appendChild(content);

	// Add show class for animation
	toast.classList.add('opacity-0');

	return toast;
}

/**
 * Get CSS classes for different toast types
 * @param {string} type - The toast type
 * @returns {string} - CSS classes
 */
function getTypeClasses(type) {
	switch (type) {
		case 'success':
			return 'border-l-4 border-green-500';
		case 'error':
			return 'border-l-4 border-red-500';
		case 'warning':
			return 'border-l-4 border-yellow-500';
		case 'info':
		default:
			return 'border-l-4 border-blue-500';
	}
}

/**
 * Create icon for toast type
 * @param {string} type - The toast type
 * @returns {HTMLElement} - The icon element
 */
function createIcon(type) {
	const iconContainer = document.createElement('div');
	iconContainer.className = 'flex-shrink-0';

	let iconSvg = '';
	let iconColor = '';

	switch (type) {
		case 'success':
			iconColor = 'text-green-500';
			iconSvg = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
      `;
			break;
		case 'error':
			iconColor = 'text-red-500';
			iconSvg = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
      `;
			break;
		case 'warning':
			iconColor = 'text-yellow-500';
			iconSvg = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
      `;
			break;
		case 'info':
		default:
			iconColor = 'text-blue-500';
			iconSvg = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
      `;
			break;
	}

	iconContainer.className += ` ${iconColor}`;
	iconContainer.innerHTML = iconSvg;
	return iconContainer;
}

/**
 * Remove a specific toast
 * @param {HTMLElement} toast - The toast element to remove
 */
function removeToast(toast) {
	if (toast && toast.parentNode) {
		toast.classList.remove('show');
		toast.classList.add('opacity-0');

		setTimeout(() => {
			if (toast.parentNode) {
				toast.parentNode.removeChild(toast);
			}
		}, 300);
	}
}

/**
 * Remove all existing toasts
 */
function removeExistingToasts() {
	const existingToasts = document.querySelectorAll('.toast-notification');
	existingToasts.forEach(toast => {
		removeToast(toast);
	});
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

// Convenience methods for different toast types
export const toast = {
	success: (message, duration) => showToast(message, 'success', duration),
	error: (message, duration) => showToast(message, 'error', duration),
	warning: (message, duration) => showToast(message, 'warning', duration),
	info: (message, duration) => showToast(message, 'info', duration)
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .toast-notification.show {
    opacity: 1 !important;
  }
`;
document.head.appendChild(style);

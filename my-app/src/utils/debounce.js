/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The throttled function
 */
export function throttle(func, wait = 300) {
    let inThrottle = false;
    let lastResult;

    return function throttled(...args) {
        if (!inThrottle) {
            lastResult = func.apply(this, args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, wait);
        }

        return lastResult;
    };
}

/**
 * Creates a function that memoizes the result of func.
 * @param {Function} func - The function to have its output memoized
 * @returns {Function} - The new memoized function
 */
export function memoize(func) {
    const cache = new Map();

    return function memoized(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = func.apply(this, args);
        cache.set(key, result);

        // Limit cache size to prevent memory leaks
        if (cache.size > 100) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        return result;
    };
} 
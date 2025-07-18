/**
 * Rate limiting utility to prevent API abuse
 */
export function rateLimit({ maxRequests, perWindow, blacklistAfter }) {
    let requests = [];
    let blacklisted = false;
    let blacklistCount = 0;

    return {
        checkLimit: async () => {
            if (blacklisted) {
                throw new Error('Too many requests. Please try again later.');
            }

            // Remove old requests outside the window
            const now = Date.now();
            requests = requests.filter(time => now - time < perWindow);

            // Check if we're over the limit
            if (requests.length >= maxRequests) {
                blacklistCount++;
                
                if (blacklistCount >= blacklistAfter) {
                    blacklisted = true;
                    // Reset after 1 hour
                    setTimeout(() => {
                        blacklisted = false;
                        blacklistCount = 0;
                    }, 3600000);
                }

                throw new Error('Rate limit exceeded. Please try again later.');
            }

            // Add current request
            requests.push(now);
            return true;
        },

        reset: () => {
            requests = [];
            blacklisted = false;
            blacklistCount = 0;
        }
    };
} 
/**
 * Hash a password using SHA-256
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password as a hex string
 */
export async function hashPassword(password) {
    if (typeof window === 'undefined') {
        // Server-side (Node.js) fallback
        const crypto = await import('crypto');
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    
    // Browser-side using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
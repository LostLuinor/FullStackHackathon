import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Auth store to manage user authentication state
function createAuthStore() {
    const { subscribe, set, update } = writable({
        user: null,
        isAuthenticated: false,
        isLoading: false
    });

    return {
        subscribe,
        login: (userData) => {
            set({
                user: userData,
                isAuthenticated: true,
                isLoading: false
            });
            if (browser) {
                localStorage.setItem('auth', JSON.stringify(userData));
            }
        },
        logout: () => {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
            if (browser) {
                localStorage.removeItem('auth');
            }
        },
        setLoading: (loading) => {
            update(state => ({ ...state, isLoading: loading }));
        },
        init: () => {
            if (browser) {
                const stored = localStorage.getItem('auth');
                if (stored) {
                    try {
                        const userData = JSON.parse(stored);
                        set({
                            user: userData,
                            isAuthenticated: true,
                            isLoading: false
                        });
                    } catch (e) {
                        localStorage.removeItem('auth');
                    }
                }
            }
        }
    };
}

export const auth = createAuthStore();
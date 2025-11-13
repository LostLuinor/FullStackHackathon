import { browser } from '$app/environment';

const API_BASE_URL = browser 
    ? (import.meta.env.VITE_API_URL || 'http://localhost:8000/api')
    : 'http://localhost:8000/api';

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * @param {string} endpoint
 * @param {RequestInit & { headers?: Record<string, string> }} options
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('API Request URL:', url);
    console.log('API Request Options:', options);
    
    const config = {
        mode: /** @type {'cors'} */ ('cors'),
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    };

    // Add auth token if available
    if (browser) {
        const authData = localStorage.getItem('auth');
        if (authData) {
            try {
                const { token } = JSON.parse(authData);
                if (token) {
                    config.headers = {
                        ...config.headers,
                        'Authorization': `Bearer ${token}`
                    };
                }
            } catch (e) {
                // Ignore invalid auth data
            }
        }
    }

    console.log('Final request config:', config);

    try {
        const response = await fetch(url, config);
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log('Error response data:', errorData);
            throw new ApiError(
                errorData.detail || errorData.message || 'An error occurred',
                response.status,
                errorData
            );
        }

        const data = await response.json();
        console.log('Success response data:', data);
        return data;
    } catch (error) {
        console.error('API request error:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new ApiError('Network error', 0, { originalError: message });
    }
}

export const api = {
    // Auth endpoints
    /** @param {{ mail?: string, name?: string, password: string }} credentials */
    login: (credentials) => request('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    
    /** @param {{ name: string, mail: string, password: string }} userData */
    register: (userData) => request('/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    
    logout: () => request('/auth/logout', {
        method: 'POST',
    }),
    
    // User endpoints
    getProfile: () => request('/user/profile'),
    
    /** @param {Record<string, any>} userData */
    updateProfile: (userData) => request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),

    // Student Dashboard endpoints
    getStudentDashboard: () => request('/student/dashboard'),
    getRecommendations: () => request('/recommendations'),
    getLeaderboard: (limit = 10) => request(`/leaderboard?limit=${limit}`),
    
    // Course endpoints
    getCourses: () => request('/courses'),
    getCourse: (courseId) => request(`/courses/${courseId}`),
    enrollInCourse: (courseId) => request(`/courses/enroll/${courseId}`, {
        method: 'POST',
    }),
    getStudentProgress: () => request('/student/progress'),
    
    // Lesson endpoints
    getLesson: (lessonId) => request(`/lessons/${lessonId}`),
    
    // AI Tutor endpoints
    askAITutor: (question, lessonContext) => request('/ai/tutor', {
        method: 'POST',
        body: JSON.stringify({ question, lessonContext }),
    }),
    
    // Quiz endpoints
    getUpcomingQuizzes: () => request('/student/quizzes/upcoming'),
    getQuizAttempts: () => request('/student/quiz-attempts'),
    
    // Gamification endpoints
    getBadges: () => request('/student/badges'),
    getXPProgress: () => request('/student/xp'),
};

export { ApiError };
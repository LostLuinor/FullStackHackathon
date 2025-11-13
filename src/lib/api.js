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
    getLeaderboard: (courseFilter, limit = 50) => request(`/leaderboard?${courseFilter ? `course=${courseFilter}&` : ''}limit=${limit}`),
    
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
    askAITutor: (requestData) => request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify(requestData),
    }),
    getAITutorHistory: () => request('/ai/history', {
        method: 'GET',
    }),
    saveAITutorConversation: (conversationData) => request('/ai/conversation', {
        method: 'POST',
        body: JSON.stringify(conversationData),
    }),
    loadAITutorConversation: (conversationId) => request(`/ai/conversation/${conversationId}`, {
        method: 'GET',
    }),
    getAIHistory: () => request('/ai/history'),
    
    // AI Feedback endpoints
    getAIFeedback: (quizData) => request('/ai/feedback', {
        method: 'POST',
        body: JSON.stringify(quizData),
    }),
    
    // Quiz endpoints
    getUpcomingQuizzes: () => request('/student/quizzes/upcoming'),
    getQuizAttempts: () => request('/student/quiz-attempts'),
    
    // Gamification endpoints
    getBadges: () => request('/student/badges'),
    getXPProgress: () => request('/student/xp'),
    
    // Achievements endpoints
    getAchievements: () => request('/achievements'),
    
    // Student Profile endpoints 
    getStudentProfile: () => request('/student/profile'),
    updateStudentProfile: (profileData) => request('/student/profile/update', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    }),
    
    // Teacher Dashboard endpoints
    getTeacherDashboard: () => request('/teacher/dashboard'),
    
    // Teacher Course Management endpoints
    getTeacherCourses: () => request('/teacher/courses'),
    updateTeacherCourse: (courseId, courseData) => request(`/teacher/course/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
    }),
    deleteTeacherCourse: (courseId) => request(`/teacher/course/${courseId}`, {
        method: 'DELETE',
    }),
    createTeacherCourse: (courseData) => request('/teacher/course', {
        method: 'POST',
        body: JSON.stringify(courseData),
    }),
    getTeacherCourse: (courseId) => request(`/teacher/course/${courseId}`),
    
    // Teacher Lesson Management endpoints
    createTeacherLesson: (formData) => request('/teacher/lesson', {
        method: 'POST',
        headers: {
            // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
    }),
    updateTeacherLesson: (lessonId, formData) => request(`/teacher/lesson/${lessonId}`, {
        method: 'PUT',
        headers: {
            // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
    }),
    deleteTeacherLesson: (lessonId) => request(`/teacher/lesson/${lessonId}`, {
        method: 'DELETE',
    }),
    getTeacherLesson: (lessonId) => request(`/teacher/lesson/${lessonId}`),
    
    // Teacher Quiz Management endpoints
    createTeacherQuiz: (quizData) => request('/teacher/quiz', {
        method: 'POST',
        body: JSON.stringify(quizData),
    }),
    updateTeacherQuiz: (quizId, quizData) => request(`/teacher/quiz/${quizId}`, {
        method: 'PUT',
        body: JSON.stringify(quizData),
    }),
    deleteTeacherQuiz: (quizId) => request(`/teacher/quiz/${quizId}`, {
        method: 'DELETE',
    }),
    getTeacherQuiz: (quizId) => request(`/teacher/quiz/${quizId}`),
    
    // AI-powered Quiz Generation
    generateQuizWithAI: (aiGenData) => request('/ai/generate-quiz', {
        method: 'POST',
        body: JSON.stringify(aiGenData),
    }),

    // Teacher Analytics
    getTeacherAnalytics: (courseId) => request(`/teacher/analytics/${courseId}`, {
        method: 'GET',
    }),

    // Admin Dashboard
    getAdminDashboard: () => request('/admin/dashboard', {
        method: 'GET',
    }),

    // Admin User Management
    getAdminUsers: () => request('/admin/users', {
        method: 'GET',
    }),
    createAdminUser: (userData) => request('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    updateAdminUser: (userId, userData) => request(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
    deleteAdminUser: (userId) => request(`/admin/users/${userId}`, {
        method: 'DELETE',
    }),

    // Platform Analytics
    getPlatformAnalytics: (timeRange) => request(`/admin/analytics?range=${timeRange}`, {
        method: 'GET',
    }),

    // Hotjar Reports
    getHotjarReports: () => request('/admin/hotjar-report', {
        method: 'GET',
    }),
    uploadHotjarReport: (formData) => request('/admin/hotjar-report', {
        method: 'POST',
        headers: {
            // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
    }),

    // User Settings
    getUserSettings: () => request('/settings', {
        method: 'GET',
    }),
    updateUserSettings: (settingsData) => request('/settings/update', {
        method: 'PUT',
        body: JSON.stringify(settingsData),
    }),
    changePassword: (passwordData) => request('/settings/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
    }),

    // Support & Help
    getSupportData: () => request('/support', {
        method: 'GET',
    }),
    submitSupportTicket: (ticketData) => request('/support/ticket', {
        method: 'POST',
        body: JSON.stringify(ticketData),
    }),
};

export { ApiError };
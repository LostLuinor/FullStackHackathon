import { api } from '$lib/api.js';

export async function load({ fetch }) {
    try {
        // Uncomment when backend is ready
        // const [dashboardData, recommendations, leaderboard] = await Promise.all([
        //     api.getStudentDashboard(),
        //     api.getRecommendations(), 
        //     api.getLeaderboard(5)
        // ]);

        // Return mock data for now
        return {
            // dashboardData,
            // recommendations,
            // leaderboard
        };
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        return {
            error: error.message
        };
    }
}
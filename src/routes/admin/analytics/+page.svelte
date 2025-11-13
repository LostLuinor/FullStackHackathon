<script>
    import { onMount } from 'svelte';
    import api from '$lib/api.js';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let analyticsData = null;
    let loading = true;
    let error = '';
    let selectedTimeRange = '7d';

    // Mock comprehensive analytics data
    const mockAnalyticsData = {
        trafficAnalytics: {
            totalPageViews: 2847392,
            uniqueVisitors: 156783,
            avgSessionDuration: '8m 34s',
            bounceRate: 23.4,
            topPages: [
                { page: '/dashboard', views: 387492, percentage: 35.2 },
                { page: '/courses', views: 298374, percentage: 27.1 },
                { page: '/lessons', views: 245876, percentage: 22.3 },
                { page: '/ai-tutor', views: 167439, percentage: 15.2 },
                { page: '/profile', views: 89234, percentage: 8.1 }
            ],
            hourlyTraffic: [
                { hour: '00:00', users: 234 }, { hour: '02:00', users: 187 },
                { hour: '04:00', users: 156 }, { hour: '06:00', users: 298 },
                { hour: '08:00', users: 567 }, { hour: '10:00', users: 834 },
                { hour: '12:00', users: 923 }, { hour: '14:00', users: 1045 },
                { hour: '16:00', users: 1187 }, { hour: '18:00', users: 1098 },
                { hour: '20:00', users: 876 }, { hour: '22:00', users: 645 }
            ]
        },
        activeUsers: {
            current: 2847,
            daily: 12456,
            weekly: 45672,
            monthly: 156783,
            growth: {
                daily: 8.4,
                weekly: 12.7,
                monthly: 23.1
            },
            deviceBreakdown: [
                { device: 'Desktop', users: 8934, percentage: 52.3 },
                { device: 'Mobile', users: 6789, percentage: 39.7 },
                { device: 'Tablet', users: 1367, percentage: 8.0 }
            ],
            geographyTop: [
                { country: 'United States', users: 4567, flag: '🇺🇸' },
                { country: 'India', users: 3456, flag: '🇮🇳' },
                { country: 'United Kingdom', users: 2345, flag: '🇬🇧' },
                { country: 'Canada', users: 1876, flag: '🇨🇦' },
                { country: 'Germany', users: 1543, flag: '🇩🇪' }
            ]
        },
        coursePopularity: {
            trending: [
                { title: 'Advanced JavaScript', enrollments: 3456, rating: 4.8, growth: 23.4 },
                { title: 'React Mastery', enrollments: 2987, rating: 4.7, growth: 18.9 },
                { title: 'Python for Data Science', enrollments: 2654, rating: 4.9, growth: 31.2 },
                { title: 'Machine Learning Basics', enrollments: 2341, rating: 4.6, growth: 27.8 },
                { title: 'Web Design Fundamentals', enrollments: 1987, rating: 4.5, growth: 15.6 }
            ],
            categories: [
                { name: 'Programming', courses: 145, students: 45672 },
                { name: 'Data Science', courses: 67, students: 23456 },
                { name: 'Design', courses: 89, students: 18734 },
                { name: 'Business', courses: 134, students: 34567 },
                { name: 'Marketing', courses: 78, students: 15674 }
            ]
        },
        engagementRate: {
            overall: 73.2,
            byContent: [
                { type: 'Video Lessons', engagement: 82.4, time: '12m 34s' },
                { type: 'Interactive Quizzes', engagement: 76.8, time: '8m 12s' },
                { type: 'PDF Resources', engagement: 45.2, time: '5m 23s' },
                { type: 'Discussion Forums', engagement: 38.7, time: '6m 45s' },
                { type: 'Live Sessions', engagement: 91.3, time: '42m 18s' }
            ],
            weeklyTrend: [
                { week: 'Week 1', engagement: 68.4 },
                { week: 'Week 2', engagement: 71.2 },
                { week: 'Week 3', engagement: 69.8 },
                { week: 'Week 4', engagement: 73.2 },
                { week: 'Week 5', engagement: 75.6 },
                { week: 'Week 6', engagement: 73.2 }
            ]
        },
        predictionModels: {
            dropoutPrediction: {
                totalAtRisk: 1247,
                riskFactors: [
                    { factor: 'Low engagement (< 30%)', students: 456, severity: 'High' },
                    { factor: 'Missed 3+ assignments', students: 234, severity: 'High' },
                    { factor: 'No login 7+ days', students: 345, severity: 'Medium' },
                    { factor: 'Low quiz scores (< 60%)', students: 212, severity: 'Medium' }
                ],
                interventionSuccess: 67.8
            },
            weakAreas: [
                { topic: 'Advanced JavaScript Concepts', affectedStudents: 3456, difficulty: 89, recommendation: 'Add more interactive examples' },
                { topic: 'Database Design Principles', affectedStudents: 2134, difficulty: 84, recommendation: 'Create visual learning aids' },
                { topic: 'Algorithm Complexity', affectedStudents: 2876, difficulty: 92, recommendation: 'Implement step-by-step tutorials' },
                { topic: 'React Hooks Usage', affectedStudents: 1876, difficulty: 78, recommendation: 'Provide more practice exercises' },
                { topic: 'CSS Grid Layout', affectedStudents: 1543, difficulty: 72, recommendation: 'Add real-world projects' }
            ],
            performancePrediction: {
                expectedCompletionRate: 78.4,
                estimatedRevenue: 89734,
                projectedGrowth: 23.7
            }
        }
    };

    onMount(async () => {
        await loadAnalytics();
    });

    async function loadAnalytics() {
        try {
            loading = true;
            // const response = await api.getPlatformAnalytics(selectedTimeRange);
            // analyticsData = response.data;
            
            setTimeout(() => {
                analyticsData = mockAnalyticsData;
                loading = false;
            }, 1200);
        } catch (err) {
            error = 'Failed to load analytics data';
            loading = false;
        }
    }

    function getGrowthColor(growth) {
        return growth > 0 ? 'text-green-600' : 'text-red-600';
    }

    function getSeverityColor(severity) {
        const colors = {
            'High': 'bg-red-100 text-red-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'Low': 'bg-green-100 text-green-800'
        };
        return colors[severity] || 'bg-gray-100 text-gray-800';
    }

    $: selectedTimeRange && loadAnalytics();
</script>

<svelte:head>
    <title>Platform Analytics - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-purple-200/50 p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        📊 Platform Analytics
                    </h1>
                    <p class="text-gray-600 mt-2">Global insights and predictions</p>
                </div>
                <div class="flex items-center space-x-4">
                    <select bind:value={selectedTimeRange} class="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500">
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button on:click={loadAnalytics} class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                        🔄 Refresh
                    </button>
                </div>
            </div>
        </div>

        {#if loading}
            <div class="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        {:else if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p class="text-red-600 font-medium">⚠️ {error}</p>
            </div>
        {:else if analyticsData}
            
            <!-- Traffic Analytics -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div class="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🌐 Traffic Analytics
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">{analyticsData.trafficAnalytics.totalPageViews.toLocaleString()}</div>
                            <div class="text-sm text-gray-600">Page Views</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">{analyticsData.trafficAnalytics.uniqueVisitors.toLocaleString()}</div>
                            <div class="text-sm text-gray-600">Unique Visitors</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">{analyticsData.trafficAnalytics.avgSessionDuration}</div>
                            <div class="text-sm text-gray-600">Avg Session</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-orange-600">{analyticsData.trafficAnalytics.bounceRate}%</div>
                            <div class="text-sm text-gray-600">Bounce Rate</div>
                        </div>
                    </div>
                    
                    <!-- Hourly Traffic Chart -->
                    <div class="space-y-2">
                        <h4 class="font-semibold text-gray-700">Hourly Traffic Pattern</h4>
                        <div class="flex items-end space-x-1 h-32">
                            {#each analyticsData.trafficAnalytics.hourlyTraffic as point}
                                <div class="flex-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t flex items-end justify-center text-xs text-white font-medium" 
                                     style="height: {(point.users / 1200) * 100}%">
                                    <span class="mb-1">{point.users}</span>
                                </div>
                            {/each}
                        </div>
                        <div class="flex justify-between text-xs text-gray-500">
                            {#each analyticsData.trafficAnalytics.hourlyTraffic as point}
                                <span>{point.hour}</span>
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Active Users -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        👥 Active Users
                    </h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Current Online</span>
                            <span class="text-2xl font-bold text-green-600">{analyticsData.activeUsers.current.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Daily Active</span>
                            <div class="text-right">
                                <div class="font-bold">{analyticsData.activeUsers.daily.toLocaleString()}</div>
                                <div class="{getGrowthColor(analyticsData.activeUsers.growth.daily)} text-sm">
                                    +{analyticsData.activeUsers.growth.daily}%
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Monthly Active</span>
                            <div class="text-right">
                                <div class="font-bold">{analyticsData.activeUsers.monthly.toLocaleString()}</div>
                                <div class="{getGrowthColor(analyticsData.activeUsers.growth.monthly)} text-sm">
                                    +{analyticsData.activeUsers.growth.monthly}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Device Breakdown -->
                    <div class="mt-6">
                        <h4 class="font-semibold text-gray-700 mb-3">Device Usage</h4>
                        {#each analyticsData.activeUsers.deviceBreakdown as device}
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-600">{device.device}</span>
                                <span class="text-sm font-medium">{device.percentage}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                                <div class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style="width: {device.percentage}%"></div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Course Popularity & Engagement -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Course Popularity -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-orange-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        📚 Course Popularity
                    </h3>
                    <div class="space-y-4">
                        {#each analyticsData.coursePopularity.trending as course}
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-semibold text-gray-800">{course.title}</h4>
                                    <span class="text-yellow-500">⭐ {course.rating}</span>
                                </div>
                                <div class="flex justify-between items-center text-sm text-gray-600">
                                    <span>{course.enrollments.toLocaleString()} enrollments</span>
                                    <span class="text-green-600 font-medium">+{course.growth}%</span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Engagement Rate -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🎯 Engagement Rate
                    </h3>
                    <div class="text-center mb-6">
                        <div class="text-4xl font-bold text-purple-600">{analyticsData.engagementRate.overall}%</div>
                        <div class="text-sm text-gray-600">Overall Engagement</div>
                    </div>
                    
                    <div class="space-y-4">
                        {#each analyticsData.engagementRate.byContent as content}
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">{content.type}</span>
                                <div class="text-right">
                                    <div class="text-sm font-bold">{content.engagement}%</div>
                                    <div class="text-xs text-gray-500">{content.time}</div>
                                </div>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style="width: {content.engagement}%"></div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- AI Prediction Models -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Dropout Prediction -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-red-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🚨 Dropout Prediction (AI)
                    </h3>
                    <div class="text-center mb-6">
                        <div class="text-3xl font-bold text-red-600">{analyticsData.predictionModels.dropoutPrediction.totalAtRisk}</div>
                        <div class="text-sm text-gray-600">Students at Risk</div>
                        <div class="text-sm text-green-600 mt-1">{analyticsData.predictionModels.dropoutPrediction.interventionSuccess}% intervention success rate</div>
                    </div>
                    
                    <div class="space-y-3">
                        <h4 class="font-semibold text-gray-700">Risk Factors</h4>
                        {#each analyticsData.predictionModels.dropoutPrediction.riskFactors as factor}
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span class="text-sm text-gray-700">{factor.factor}</span>
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm font-medium">{factor.students}</span>
                                    <span class="{getSeverityColor(factor.severity)} px-2 py-1 rounded-full text-xs font-bold">
                                        {factor.severity}
                                    </span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Weak Areas Detection -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-yellow-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🧠 Weak Areas (AI Analysis)
                    </h3>
                    <div class="space-y-4">
                        {#each analyticsData.predictionModels.weakAreas as area}
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-semibold text-gray-800 text-sm">{area.topic}</h4>
                                    <span class="text-red-600 font-bold text-sm">{area.difficulty}%</span>
                                </div>
                                <div class="text-sm text-gray-600 mb-2">
                                    {area.affectedStudents.toLocaleString()} students affected
                                </div>
                                <div class="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                    💡 {area.recommendation}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Performance Predictions -->
            <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    🔮 Performance Predictions
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-indigo-600">{analyticsData.predictionModels.performancePrediction.expectedCompletionRate}%</div>
                        <div class="text-sm text-gray-600">Expected Completion Rate</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">${analyticsData.predictionModels.performancePrediction.estimatedRevenue.toLocaleString()}</div>
                        <div class="text-sm text-gray-600">Estimated Revenue</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">{analyticsData.predictionModels.performancePrediction.projectedGrowth}%</div>
                        <div class="text-sm text-gray-600">Projected Growth</div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .backdrop-blur-xl {
        backdrop-filter: blur(20px);
    }
</style>
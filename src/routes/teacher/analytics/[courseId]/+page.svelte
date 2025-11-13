<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import api from '$lib/api.js';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let courseId = '';
    let analytics = null;
    let loading = true;
    let error = '';

    // Mock data for demonstration
    const mockAnalytics = {
        courseTitle: "Advanced JavaScript Development",
        totalStudents: 156,
        completionStats: {
            completed: 89,
            inProgress: 45,
            notStarted: 22,
            completionRate: 57
        },
        completionCurve: [
            { week: 1, completed: 12 },
            { week: 2, completed: 28 },
            { week: 3, completed: 45 },
            { week: 4, completed: 62 },
            { week: 5, completed: 78 },
            { week: 6, completed: 89 }
        ],
        quizPerformance: {
            averageScore: 78.5,
            totalQuizzes: 8,
            quizData: [
                { name: "Variables & Functions", avgScore: 85.2, attempts: 145 },
                { name: "DOM Manipulation", avgScore: 72.8, attempts: 142 },
                { name: "Async Programming", avgScore: 68.9, attempts: 138 },
                { name: "ES6 Features", avgScore: 81.4, attempts: 135 },
                { name: "Error Handling", avgScore: 75.6, attempts: 132 }
            ]
        },
        weakTopics: [
            { topic: "Promise Chaining", difficulty: 92, studentsStruggling: 67 },
            { topic: "Async/Await Patterns", difficulty: 87, studentsStruggling: 54 },
            { topic: "Closures & Scope", difficulty: 84, studentsStruggling: 48 },
            { topic: "Event Delegation", difficulty: 79, studentsStruggling: 42 },
            { topic: "Prototype Chain", difficulty: 76, studentsStruggling: 38 }
        ],
        dropoutRisk: [
            { name: "Sarah Johnson", riskScore: 87, lastActive: "3 days ago", completionRate: 23 },
            { name: "Mike Chen", riskScore: 82, lastActive: "5 days ago", completionRate: 31 },
            { name: "Emily Davis", riskScore: 78, lastActive: "2 days ago", completionRate: 28 },
            { name: "Alex Rodriguez", riskScore: 74, lastActive: "1 week ago", completionRate: 19 }
        ],
        skillGaps: [
            { skill: "Advanced DOM APIs", gap: "High", affectedStudents: 89, recommendedAction: "Create focused workshop" },
            { skill: "Modern Testing Practices", gap: "Medium", affectedStudents: 67, recommendedAction: "Add more practice exercises" },
            { skill: "Performance Optimization", gap: "Medium", affectedStudents: 54, recommendedAction: "Provide additional resources" },
            { skill: "Module Systems", gap: "Low", affectedStudents: 32, recommendedAction: "Review existing materials" }
        ]
    };

    onMount(async () => {
        courseId = $page.params.courseId;
        await loadAnalytics();
    });

    async function loadAnalytics() {
        try {
            loading = true;
            // const response = await api.getTeacherAnalytics(courseId);
            // analytics = response.data;
            
            // Using mock data for now
            setTimeout(() => {
                analytics = mockAnalytics;
                loading = false;
            }, 1000);
        } catch (err) {
            error = 'Failed to load analytics data';
            loading = false;
        }
    }

    function getRiskColor(score) {
        if (score >= 80) return 'text-red-600 bg-red-50';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    }

    function getGapColor(gap) {
        const colors = {
            'High': 'text-red-600 bg-red-50',
            'Medium': 'text-yellow-600 bg-yellow-50',
            'Low': 'text-green-600 bg-green-50'
        };
        return colors[gap] || 'text-gray-600 bg-gray-50';
    }
</script>

<svelte:head>
    <title>Course Analytics - Teacher Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/50 p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        📊 Course Analytics
                    </h1>
                    {#if analytics}
                        <p class="text-gray-600 mt-2">{analytics.courseTitle}</p>
                    {/if}
                </div>
                <button on:click={loadAnalytics} class="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                    🔄 Refresh Data
                </button>
            </div>
        </div>

        {#if loading}
            <div class="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        {:else if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p class="text-red-600 font-medium">⚠️ {error}</p>
                <button on:click={loadAnalytics} class="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    Try Again
                </button>
            </div>
        {:else if analytics}
            <!-- Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Total Students</p>
                            <p class="text-2xl font-bold text-blue-600">{analytics.totalStudents}</p>
                        </div>
                        <div class="bg-blue-100 rounded-full p-3">
                            <span class="text-2xl">👥</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Completion Rate</p>
                            <p class="text-2xl font-bold text-green-600">{analytics.completionStats.completionRate}%</p>
                        </div>
                        <div class="bg-green-100 rounded-full p-3">
                            <span class="text-2xl">✅</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-200/50 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Avg Quiz Score</p>
                            <p class="text-2xl font-bold text-purple-600">{analytics.quizPerformance.averageScore}%</p>
                        </div>
                        <div class="bg-purple-100 rounded-full p-3">
                            <span class="text-2xl">📝</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-red-200/50 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">At Risk Students</p>
                            <p class="text-2xl font-bold text-red-600">{analytics.dropoutRisk.length}</p>
                        </div>
                        <div class="bg-red-100 rounded-full p-3">
                            <span class="text-2xl">⚠️</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Course Completion Curve -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-orange-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        📈 Course Completion Curve
                    </h3>
                    <div class="space-y-4">
                        {#each analytics.completionCurve as point}
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-gray-600">Week {point.week}</span>
                                <div class="flex-1 mx-4 bg-gray-200 rounded-full h-3">
                                    <div class="bg-gradient-to-r from-orange-400 to-amber-400 h-3 rounded-full transition-all duration-500" style="width: {(point.completed / analytics.totalStudents) * 100}%"></div>
                                </div>
                                <span class="text-sm font-bold text-orange-600">{point.completed}</span>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Quiz Performance -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        📊 Average Quiz Performance
                    </h3>
                    <div class="space-y-4">
                        {#each analytics.quizPerformance.quizData as quiz}
                            <div class="flex items-center justify-between">
                                <div class="flex-1">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-sm font-medium text-gray-700">{quiz.name}</span>
                                        <span class="text-sm font-bold text-purple-600">{quiz.avgScore}%</span>
                                    </div>
                                    <div class="bg-gray-200 rounded-full h-2">
                                        <div class="bg-gradient-to-r from-purple-400 to-indigo-400 h-2 rounded-full" style="width: {quiz.avgScore}%"></div>
                                    </div>
                                    <span class="text-xs text-gray-500">{quiz.attempts} attempts</span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Weak Topics & Dropout Risk -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Weak Topics (AI Based) -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-red-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🧠 Weak Topics (AI Analysis)
                    </h3>
                    <div class="space-y-4">
                        {#each analytics.weakTopics as topic}
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="font-semibold text-gray-800">{topic.topic}</h4>
                                    <span class="text-red-600 font-bold">{topic.difficulty}% difficulty</span>
                                </div>
                                <div class="flex items-center justify-between text-sm text-gray-600">
                                    <span>{topic.studentsStruggling} students struggling</span>
                                    <div class="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">High Priority</div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Dropout Risk Prediction -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-yellow-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        ⚠️ Dropout Risk Prediction
                    </h3>
                    <div class="space-y-4">
                        {#each analytics.dropoutRisk as student}
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="font-semibold text-gray-800">{student.name}</h4>
                                    <span class="{getRiskColor(student.riskScore)} px-2 py-1 rounded-full text-xs font-bold">
                                        {student.riskScore}% risk
                                    </span>
                                </div>
                                <div class="text-sm text-gray-600 space-y-1">
                                    <div>Last active: {student.lastActive}</div>
                                    <div>Completion: {student.completionRate}%</div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Skill Gap Detection -->
            <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    🎯 Skill Gap Detection
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each analytics.skillGaps as gap}
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex justify-between items-center mb-3">
                                <h4 class="font-semibold text-gray-800">{gap.skill}</h4>
                                <span class="{getGapColor(gap.gap)} px-2 py-1 rounded-full text-xs font-bold">
                                    {gap.gap} Gap
                                </span>
                            </div>
                            <div class="text-sm text-gray-600 mb-3">
                                <div class="mb-1">{gap.affectedStudents} students affected</div>
                                <div class="font-medium text-indigo-600">💡 {gap.recommendedAction}</div>
                            </div>
                            <button class="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg text-sm hover:shadow-lg transition-all duration-200">
                                Take Action
                            </button>
                        </div>
                    {/each}
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
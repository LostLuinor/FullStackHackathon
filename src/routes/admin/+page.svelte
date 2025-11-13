<script>
    import { onMount } from 'svelte';
    import api from '$lib/api.js';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let dashboardData = null;
    let loading = true;
    let error = '';
    let activeTab = 'overview';

    // Mock data for demonstration
    const mockDashboardData = {
        userStats: {
            totalUsers: 12847,
            activeUsers: 8923,
            newUsersToday: 156,
            newUsersThisWeek: 892,
            studentCount: 10234,
            teacherCount: 2613
        },
        courseStats: {
            totalCourses: 1847,
            activeCourses: 1342,
            newCoursesToday: 23,
            newCoursesThisWeek: 167,
            completedCourses: 3421
        },
        platformAnalytics: {
            totalRevenue: 342567,
            monthlyRevenue: 45231,
            completionRate: 73.2,
            averageRating: 4.6,
            totalQuizzes: 15847,
            totalLessons: 28473
        },
        recentUsers: [
            { id: 1, name: "Sarah Johnson", email: "sarah@email.com", role: "Student", joinDate: "2024-11-10", status: "Active" },
            { id: 2, name: "Mike Chen", email: "mike@email.com", role: "Teacher", joinDate: "2024-11-09", status: "Active" },
            { id: 3, name: "Emily Davis", email: "emily@email.com", role: "Student", joinDate: "2024-11-08", status: "Inactive" },
            { id: 4, name: "Alex Rodriguez", email: "alex@email.com", role: "Teacher", joinDate: "2024-11-07", status: "Pending" }
        ],
        topTeachers: [
            { id: 1, name: "Dr. Amanda Wilson", courses: 12, students: 3456, rating: 4.9, revenue: 12340 },
            { id: 2, name: "Prof. David Kim", courses: 8, students: 2341, rating: 4.8, revenue: 9876 },
            { id: 3, name: "Ms. Lisa Brown", courses: 15, students: 4123, rating: 4.7, revenue: 15432 },
            { id: 4, name: "Mr. John Smith", courses: 6, students: 1876, rating: 4.6, revenue: 7654 }
        ],
        systemHealth: {
            serverStatus: "Healthy",
            dbStatus: "Healthy",
            apiResponseTime: "245ms",
            uptime: "99.9%",
            activeConnections: 2847
        }
    };

    onMount(async () => {
        await loadDashboard();
    });

    async function loadDashboard() {
        try {
            loading = true;
            // const response = await api.getAdminDashboard();
            // dashboardData = response.data;
            
            // Using mock data for now
            setTimeout(() => {
                dashboardData = mockDashboardData;
                loading = false;
            }, 1000);
        } catch (err) {
            error = 'Failed to load dashboard data';
            loading = false;
        }
    }

    function handleUserAction(userId, action) {
        console.log(`Action: ${action} for user ${userId}`);
        // Implement user actions (activate, deactivate, delete, etc.)
    }

    function handleTeacherAction(teacherId, action) {
        console.log(`Action: ${action} for teacher ${teacherId}`);
        // Implement teacher actions
    }

    function getStatusColor(status) {
        const colors = {
            'Active': 'bg-green-100 text-green-800',
            'Inactive': 'bg-gray-100 text-gray-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Suspended': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }
</script>

<svelte:head>
    <title>Admin Dashboard - Platform Management</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-indigo-200/50 p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        🛠️ Admin Dashboard
                    </h1>
                    <p class="text-gray-600 mt-2">Platform Management & Analytics</p>
                </div>
                <button on:click={loadDashboard} class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                    🔄 Refresh
                </button>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-2 mb-8">
            <nav class="flex space-x-2">
                <button on:click={() => activeTab = 'overview'} class="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 {activeTab === 'overview' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}">
                    📊 Overview
                </button>
                <button on:click={() => activeTab = 'users'} class="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 {activeTab === 'users' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}">
                    👥 Users
                </button>
                <button on:click={() => activeTab = 'teachers'} class="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 {activeTab === 'teachers' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}">
                    👨‍🏫 Teachers
                </button>
                <button on:click={() => activeTab = 'system'} class="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 {activeTab === 'system' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}">
                    ⚙️ System
                </button>
            </nav>
        </div>

        {#if loading}
            <div class="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        {:else if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p class="text-red-600 font-medium">⚠️ {error}</p>
            </div>
        {:else if dashboardData}

            {#if activeTab === 'overview'}
                <!-- Overview Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Total Users</p>
                                <p class="text-2xl font-bold text-blue-600">{dashboardData.userStats.totalUsers.toLocaleString()}</p>
                                <p class="text-xs text-green-600">+{dashboardData.userStats.newUsersToday} today</p>
                            </div>
                            <div class="bg-blue-100 rounded-full p-3">
                                <span class="text-2xl">👥</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Total Courses</p>
                                <p class="text-2xl font-bold text-green-600">{dashboardData.courseStats.totalCourses.toLocaleString()}</p>
                                <p class="text-xs text-green-600">+{dashboardData.courseStats.newCoursesToday} today</p>
                            </div>
                            <div class="bg-green-100 rounded-full p-3">
                                <span class="text-2xl">📚</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-200/50 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Monthly Revenue</p>
                                <p class="text-2xl font-bold text-purple-600">${dashboardData.platformAnalytics.monthlyRevenue.toLocaleString()}</p>
                                <p class="text-xs text-green-600">↗️ Growing</p>
                            </div>
                            <div class="bg-purple-100 rounded-full p-3">
                                <span class="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-orange-200/50 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Completion Rate</p>
                                <p class="text-2xl font-bold text-orange-600">{dashboardData.platformAnalytics.completionRate}%</p>
                                <p class="text-xs text-gray-600">Platform average</p>
                            </div>
                            <div class="bg-orange-100 rounded-full p-3">
                                <span class="text-2xl">📈</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Platform Analytics -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">📊 Platform Analytics</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Total Revenue</span>
                                <span class="font-bold text-green-600">${dashboardData.platformAnalytics.totalRevenue.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Average Rating</span>
                                <span class="font-bold text-yellow-600">{dashboardData.platformAnalytics.averageRating} ⭐</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Total Quizzes</span>
                                <span class="font-bold text-blue-600">{dashboardData.platformAnalytics.totalQuizzes.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Total Lessons</span>
                                <span class="font-bold text-purple-600">{dashboardData.platformAnalytics.totalLessons.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">📈 User Growth</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Students</span>
                                <span class="font-bold text-blue-600">{dashboardData.userStats.studentCount.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Teachers</span>
                                <span class="font-bold text-orange-600">{dashboardData.userStats.teacherCount.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Active Users</span>
                                <span class="font-bold text-green-600">{dashboardData.userStats.activeUsers.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">New This Week</span>
                                <span class="font-bold text-purple-600">+{dashboardData.userStats.newUsersThisWeek}</span>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'users'}
                <!-- User Management -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">👥 User Management</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-200">
                                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each dashboardData.recentUsers as user}
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-3 px-4 font-medium">{user.name}</td>
                                        <td class="py-3 px-4 text-gray-600">{user.email}</td>
                                        <td class="py-3 px-4">{user.role}</td>
                                        <td class="py-3 px-4">
                                            <span class="{getStatusColor(user.status)} px-2 py-1 rounded-full text-xs font-medium">
                                                {user.status}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 text-gray-600">{user.joinDate}</td>
                                        <td class="py-3 px-4">
                                            <div class="flex space-x-2">
                                                <button on:click={() => handleUserAction(user.id, 'edit')} class="text-blue-600 hover:text-blue-800">Edit</button>
                                                <button on:click={() => handleUserAction(user.id, 'suspend')} class="text-red-600 hover:text-red-800">Suspend</button>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'teachers'}
                <!-- Teacher Management -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">👨‍🏫 Top Teachers</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {#each dashboardData.topTeachers as teacher}
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-start mb-3">
                                    <h4 class="font-semibold text-gray-800">{teacher.name}</h4>
                                    <span class="text-yellow-500">⭐ {teacher.rating}</span>
                                </div>
                                <div class="text-sm text-gray-600 space-y-1 mb-4">
                                    <div>📚 {teacher.courses} courses</div>
                                    <div>👥 {teacher.students.toLocaleString()} students</div>
                                    <div>💰 ${teacher.revenue.toLocaleString()} revenue</div>
                                </div>
                                <div class="flex space-x-2">
                                    <button on:click={() => handleTeacherAction(teacher.id, 'view')} class="flex-1 bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600">
                                        View Profile
                                    </button>
                                    <button on:click={() => handleTeacherAction(teacher.id, 'analytics')} class="flex-1 bg-green-500 text-white py-2 rounded text-sm hover:bg-green-600">
                                        Analytics
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if activeTab === 'system'}
                <!-- System Health -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">⚙️ System Health</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="bg-green-50 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700 font-medium">Server Status</span>
                                <span class="text-green-600 font-bold">✅ {dashboardData.systemHealth.serverStatus}</span>
                            </div>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700 font-medium">Database</span>
                                <span class="text-green-600 font-bold">✅ {dashboardData.systemHealth.dbStatus}</span>
                            </div>
                        </div>
                        <div class="bg-blue-50 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700 font-medium">API Response</span>
                                <span class="text-blue-600 font-bold">{dashboardData.systemHealth.apiResponseTime}</span>
                            </div>
                        </div>
                        <div class="bg-purple-50 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700 font-medium">Uptime</span>
                                <span class="text-purple-600 font-bold">{dashboardData.systemHealth.uptime}</span>
                            </div>
                        </div>
                        <div class="bg-orange-50 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700 font-medium">Active Users</span>
                                <span class="text-orange-600 font-bold">{dashboardData.systemHealth.activeConnections.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    .backdrop-blur-xl {
        backdrop-filter: blur(20px);
    }
</style>
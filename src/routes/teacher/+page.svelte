<script>
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	// Redirect if not authenticated or not a teacher
	$: if (!$auth.isAuthenticated && !$auth.isLoading) {
		goto('/login');
	}

	/** @type {any} */
	let dashboardData = null;
	let loading = true;
	let error = null;

	// Mock teacher dashboard data
	const mockDashboard = {
		overview: {
			coursesCreated: 12,
			studentsEnrolled: 347,
			averagePerformance: 87.3,
			totalRevenue: 24580,
			activeStudents: 298,
			completionRate: 73.2
		},
		courses: [
			{
				id: 1,
				title: 'Advanced React Development',
				thumbnail: '⚛️',
				studentsCount: 89,
				lessonsCount: 24,
				averageRating: 4.8,
				revenue: 8900,
				status: 'active',
				createdAt: '2024-01-15',
				lastActivity: '2024-03-15T14:30:00Z'
			},
			{
				id: 2,
				title: 'Node.js Backend Mastery',
				thumbnail: '🟢',
				studentsCount: 76,
				lessonsCount: 18,
				averageRating: 4.6,
				revenue: 7600,
				status: 'active',
				createdAt: '2024-02-01',
				lastActivity: '2024-03-14T16:45:00Z'
			},
			{
				id: 3,
				title: 'Python Data Science',
				thumbnail: '🐍',
				studentsCount: 94,
				lessonsCount: 32,
				averageRating: 4.9,
				revenue: 9400,
				status: 'active',
				createdAt: '2024-01-08',
				lastActivity: '2024-03-13T11:20:00Z'
			},
			{
				id: 4,
				title: 'Machine Learning Basics',
				thumbnail: '🤖',
				studentsCount: 67,
				lessonsCount: 28,
				averageRating: 4.7,
				revenue: 6700,
				status: 'draft',
				createdAt: '2024-03-01',
				lastActivity: '2024-03-10T09:15:00Z'
			},
			{
				id: 5,
				title: 'Full Stack Web Development',
				thumbnail: '🌐',
				studentsCount: 21,
				lessonsCount: 45,
				averageRating: 4.5,
				revenue: 2100,
				status: 'active',
				createdAt: '2024-02-20',
				lastActivity: '2024-03-12T13:30:00Z'
			}
		],
		recentActivity: [
			{
				id: 1,
				type: 'enrollment',
				studentName: 'Alice Johnson',
				courseName: 'Advanced React Development',
				timestamp: '2024-03-15T14:30:00Z',
				avatar: '👩‍💼'
			},
			{
				id: 2,
				type: 'completion',
				studentName: 'Bob Smith',
				courseName: 'Python Data Science',
				timestamp: '2024-03-15T13:45:00Z',
				avatar: '👨‍💻',
				score: 95
			},
			{
				id: 3,
				type: 'question',
				studentName: 'Carol Davis',
				courseName: 'Node.js Backend Mastery',
				timestamp: '2024-03-15T12:20:00Z',
				avatar: '👩‍🎓',
				message: 'How do I handle async operations in Node.js?'
			},
			{
				id: 4,
				type: 'quiz_submission',
				studentName: 'David Wilson',
				courseName: 'Machine Learning Basics',
				timestamp: '2024-03-15T11:15:00Z',
				avatar: '👨‍🔬',
				score: 88
			},
			{
				id: 5,
				type: 'review',
				studentName: 'Eva Martinez',
				courseName: 'Full Stack Web Development',
				timestamp: '2024-03-15T10:30:00Z',
				avatar: '👩‍🚀',
				rating: 5,
				comment: 'Excellent course! Very comprehensive and well-structured.'
			},
			{
				id: 6,
				type: 'enrollment',
				studentName: 'Frank Thompson',
				courseName: 'Advanced React Development',
				timestamp: '2024-03-14T16:45:00Z',
				avatar: '👨‍🎨'
			}
		],
		performance: {
			weeklyStats: [
				{ week: 'Week 1', enrollments: 23, completions: 12, revenue: 2300 },
				{ week: 'Week 2', enrollments: 31, completions: 18, revenue: 3100 },
				{ week: 'Week 3', enrollments: 28, completions: 15, revenue: 2800 },
				{ week: 'Week 4', enrollments: 35, completions: 22, revenue: 3500 }
			],
			topPerformingCourses: [
				{ title: 'Python Data Science', rating: 4.9, enrollments: 94 },
				{ title: 'Advanced React Development', rating: 4.8, enrollments: 89 },
				{ title: 'Machine Learning Basics', rating: 4.7, enrollments: 67 }
			]
		}
	};

	async function loadDashboard() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// dashboardData = await api.getTeacherDashboard();

			// Use mock data for now
			await new Promise(resolve => setTimeout(resolve, 1000));
			dashboardData = mockDashboard;
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	function formatCurrency(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatTimeAgo(dateString) {
		const now = new Date();
		const date = new Date(dateString);
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	}

	function getActivityIcon(type) {
		switch(type) {
			case 'enrollment': return '📝';
			case 'completion': return '✅';
			case 'question': return '❓';
			case 'quiz_submission': return '📊';
			case 'review': return '⭐';
			default: return '📋';
		}
	}

	function getActivityColor(type) {
		switch(type) {
			case 'enrollment': return 'bg-blue-50 border-blue-200 text-blue-800';
			case 'completion': return 'bg-green-50 border-green-200 text-green-800';
			case 'question': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			case 'quiz_submission': return 'bg-purple-50 border-purple-200 text-purple-800';
			case 'review': return 'bg-pink-50 border-pink-200 text-pink-800';
			default: return 'bg-gray-50 border-gray-200 text-gray-800';
		}
	}

	function getStatusColor(status) {
		switch(status) {
			case 'active': return 'bg-green-100 text-green-800 border-green-300';
			case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'archived': return 'bg-gray-100 text-gray-800 border-gray-300';
			default: return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadDashboard();
		}
	});
</script>

<svelte:head>
	<title>Teacher Dashboard - E-Learning Platform</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
			<div class="text-center">
				<LoadingSpinner size="large" />
				<p class="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
			</div>
		</div>
	{:else if error}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
			<div class="text-center">
				<div class="text-6xl mb-4">❌</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<button on:click={() => window.location.reload()} class="primary-btn px-6 py-3 rounded-xl">
					Try Again
				</button>
			</div>
		</div>
	{:else if dashboardData}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
			<!-- Header -->
			<div class="bg-white/70 backdrop-blur-xl border-b border-gray-200/20">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="text-4xl font-bold text-gray-900">🎓 Teacher Dashboard</h1>
							<p class="text-gray-600 mt-2 text-lg">Welcome back! Here's your teaching overview</p>
						</div>
						<div class="flex space-x-3">
							<button class="primary-btn px-6 py-3 rounded-xl">
								📚 Create Course
							</button>
							<button class="secondary-btn px-6 py-3 rounded-xl">
								📝 Add Quiz
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<!-- Overview Cards -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">Courses Created</p>
								<p class="text-3xl font-bold text-blue-600">{dashboardData.overview.coursesCreated}</p>
							</div>
							<div class="text-4xl">📚</div>
						</div>
						<div class="mt-4">
							<div class="flex items-center text-sm text-green-600">
								<span>+2 this month</span>
							</div>
						</div>
					</div>

					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">Students Enrolled</p>
								<p class="text-3xl font-bold text-green-600">{dashboardData.overview.studentsEnrolled.toLocaleString()}</p>
							</div>
							<div class="text-4xl">👥</div>
						</div>
						<div class="mt-4">
							<div class="flex items-center text-sm text-green-600">
								<span>+{dashboardData.overview.activeStudents} active</span>
							</div>
						</div>
					</div>

					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">Avg Performance</p>
								<p class="text-3xl font-bold text-purple-600">{dashboardData.overview.averagePerformance}%</p>
							</div>
							<div class="text-4xl">📊</div>
						</div>
						<div class="mt-4">
							<div class="flex items-center text-sm text-green-600">
								<span>{dashboardData.overview.completionRate}% completion</span>
							</div>
						</div>
					</div>

					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">Total Revenue</p>
								<p class="text-3xl font-bold text-orange-600">{formatCurrency(dashboardData.overview.totalRevenue)}</p>
							</div>
							<div class="text-4xl">💰</div>
						</div>
						<div class="mt-4">
							<div class="flex items-center text-sm text-green-600">
								<span>+12% this month</span>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<!-- Courses Created -->
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
						<div class="p-6 border-b border-gray-200">
							<div class="flex items-center justify-between">
								<h2 class="text-2xl font-bold text-gray-900">📚 Your Courses</h2>
								<button class="text-primary hover:text-primary/80 text-sm font-medium">
									View All
								</button>
							</div>
						</div>

						<div class="max-h-96 overflow-y-auto">
							{#each dashboardData.courses as course}
								<div class="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
									<div class="flex items-start space-x-4">
										<div class="text-3xl">{course.thumbnail}</div>
										<div class="flex-1 min-w-0">
											<h3 class="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
											<div class="flex items-center space-x-4 text-sm text-gray-600 mb-2">
												<span>{course.studentsCount} students</span>
												<span>•</span>
												<span>{course.lessonsCount} lessons</span>
												<span>•</span>
												<span>⭐ {course.averageRating}</span>
											</div>
											<div class="flex items-center justify-between">
												<span class="inline-flex items-center px-2 py-1 text-xs rounded-full border {getStatusColor(course.status)}">
													{course.status.charAt(0).toUpperCase() + course.status.slice(1)}
												</span>
												<span class="text-sm font-medium text-green-600">
													{formatCurrency(course.revenue)}
												</span>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Recent Student Activity -->
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
						<div class="p-6 border-b border-gray-200">
							<h2 class="text-2xl font-bold text-gray-900">🔔 Recent Activity</h2>
						</div>

						<div class="max-h-96 overflow-y-auto">
							{#each dashboardData.recentActivity as activity}
								<div class="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
									<div class="flex items-start space-x-3">
										<div class="flex-shrink-0">
											<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
												{activity.avatar}
											</div>
										</div>
										<div class="flex-1 min-w-0">
											<div class="flex items-center space-x-2 mb-1">
												<span class="text-sm font-medium text-gray-900">{activity.studentName}</span>
												<span class="inline-flex items-center px-2 py-1 text-xs rounded-full border {getActivityColor(activity.type)}">
													{getActivityIcon(activity.type)}
												</span>
											</div>
											
											{#if activity.type === 'enrollment'}
												<p class="text-sm text-gray-600">Enrolled in <span class="font-medium">{activity.courseName}</span></p>
											{:else if activity.type === 'completion'}
												<p class="text-sm text-gray-600">
													Completed <span class="font-medium">{activity.courseName}</span>
													{#if activity.score}
														<span class="text-green-600 font-medium"> • {activity.score}%</span>
													{/if}
												</p>
											{:else if activity.type === 'question'}
												<p class="text-sm text-gray-600">Asked a question in <span class="font-medium">{activity.courseName}</span></p>
												{#if activity.message}
													<p class="text-xs text-gray-500 mt-1 italic">"{activity.message}"</p>
												{/if}
											{:else if activity.type === 'quiz_submission'}
												<p class="text-sm text-gray-600">
													Submitted quiz in <span class="font-medium">{activity.courseName}</span>
													{#if activity.score}
														<span class="text-purple-600 font-medium"> • {activity.score}%</span>
													{/if}
												</p>
											{:else if activity.type === 'review'}
												<p class="text-sm text-gray-600">
													Left a review for <span class="font-medium">{activity.courseName}</span>
													{#if activity.rating}
														<span class="text-yellow-600 font-medium"> • {activity.rating}⭐</span>
													{/if}
												</p>
												{#if activity.comment}
													<p class="text-xs text-gray-500 mt-1 italic">"{activity.comment}"</p>
												{/if}
											{/if}
											
											<p class="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Performance Insights -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl mt-8">
					<div class="p-6 border-b border-gray-200">
						<h2 class="text-2xl font-bold text-gray-900">📈 Performance Insights</h2>
					</div>
					
					<div class="p-6">
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<!-- Weekly Stats -->
							<div>
								<h3 class="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
								<div class="space-y-4">
									{#each dashboardData.performance.weeklyStats as week}
										<div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
											<div>
												<p class="font-medium text-gray-900">{week.week}</p>
												<p class="text-sm text-gray-600">{week.enrollments} enrollments • {week.completions} completions</p>
											</div>
											<div class="text-right">
												<p class="font-semibold text-green-600">{formatCurrency(week.revenue)}</p>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Top Performing Courses -->
							<div>
								<h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
								<div class="space-y-4">
									{#each dashboardData.performance.topPerformingCourses as course, index}
										<div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
											<div class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
												{index + 1}
											</div>
											<div class="flex-1">
												<p class="font-medium text-gray-900">{course.title}</p>
												<div class="flex items-center space-x-3 text-sm text-gray-600">
													<span>⭐ {course.rating}</span>
													<span>•</span>
													<span>{course.enrollments} students</span>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="bg-gradient-to-r from-primary to-purple-600 text-white rounded-3xl p-8 mt-8 text-center">
					<h2 class="text-2xl font-bold mb-4">🚀 Quick Actions</h2>
					<p class="text-lg mb-6 opacity-90">Create engaging content for your students</p>
					<div class="flex justify-center space-x-4">
						<button class="bg-white text-primary px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
							📚 Create New Course
						</button>
						<button class="bg-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-colors">
							📝 Design Quiz
						</button>
						<button class="bg-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-colors">
							📊 View Analytics
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
		<LoadingSpinner />
	</div>
{/if}
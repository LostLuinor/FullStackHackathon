<script>
	import { auth } from '$lib/stores/auth.js';
	import { api } from '$lib/api.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	// Redirect if not authenticated
	$: if (!$auth.isAuthenticated && !$auth.isLoading) {
		goto('/login');
	}

	let userData = $auth.user;
	let dashboardData = null;
	/** @type {any[]} */
	let recommendations = [];
	/** @type {any[]} */
	let leaderboard = [];
	let loading = true;
	let error = null;

	// Mock data (replace with real API calls)
	let studentProgress = {
		totalCourses: 8,
		completedCourses: 3,
		inProgressCourses: 2,
		overallProgress: 67,
		totalXP: 2450,
		currentLevel: 15,
		xpToNextLevel: 550
	};

	let enrolledCourses = [
		{
			id: 1,
			title: "Introduction to Machine Learning",
			progress: 85,
			totalLessons: 24,
			completedLessons: 20,
			instructor: "Dr. Sarah Chen",
			thumbnail: "🤖",
			lastAccessed: "2 hours ago"
		},
		{
			id: 2,
			title: "Web Development Fundamentals",
			progress: 92,
			totalLessons: 18,
			completedLessons: 17,
			instructor: "John Martinez",
			thumbnail: "🌐",
			lastAccessed: "1 day ago"
		},
		{
			id: 3,
			title: "Data Structures & Algorithms",
			progress: 45,
			totalLessons: 32,
			completedLessons: 14,
			instructor: "Prof. Michael Kim",
			thumbnail: "⚡",
			lastAccessed: "3 days ago"
		}
	];

	let upcomingQuizzes = [
		{
			id: 1,
			title: "Neural Networks Quiz",
			course: "Machine Learning",
			dueDate: "Tomorrow, 2:00 PM",
			difficulty: "Hard"
		},
		{
			id: 2,
			title: "JavaScript Basics",
			course: "Web Development",
			dueDate: "Dec 15, 10:00 AM",
			difficulty: "Medium"
		}
	];

	let earnedBadges = [
		{ name: "Quick Learner", icon: "⚡", description: "Complete 3 lessons in one day" },
		{ name: "Quiz Master", icon: "🏆", description: "Score 90%+ on 5 quizzes" },
		{ name: "Streak Champion", icon: "🔥", description: "7-day learning streak" },
		{ name: "First Steps", icon: "👶", description: "Complete your first course" }
	];

	let continueLearnigCard = enrolledCourses[0]; // Last viewed course

	async function loadDashboardData() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// const [dashboardResponse, recommendationsResponse, leaderboardResponse] = await Promise.all([
			// 	api.getStudentDashboard(),
			// 	api.getRecommendations(),
			// 	api.getLeaderboard(5)
			// ]);
			
			// dashboardData = dashboardResponse;
			// recommendations = recommendationsResponse;
			// leaderboard = leaderboardResponse;

			// Mock recommendations for now
			recommendations = [
				{
					id: 4,
					title: "Python for Data Science",
					reason: "Based on your ML progress",
					thumbnail: "🐍",
					instructor: "Dr. Lisa Wang",
					rating: 4.8,
					students: 12500
				},
				{
					id: 5,
					title: "Advanced JavaScript",
					reason: "Continue your web dev journey",
					thumbnail: "⚡",
					instructor: "Alex Thompson",
					rating: 4.9,
					students: 8700
				}
			];

			// Mock leaderboard
			leaderboard = [
				{ rank: 1, name: "Alex Chen", xp: 3250, avatar: "👨‍💻" },
				{ rank: 2, name: "Sarah Kim", xp: 3100, avatar: "👩‍🔬" },
				{ rank: 3, name: "You", xp: 2450, avatar: "🚀", isCurrentUser: true },
				{ rank: 4, name: "Mike Johnson", xp: 2300, avatar: "👨‍🎓" },
				{ rank: 5, name: "Emily Davis", xp: 2150, avatar: "👩‍💼" }
			];

		} catch (/** @type {any} */ err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadDashboardData();
		}
	});

	/** @param {number} progress */
	function getProgressColor(progress) {
		if (progress >= 80) return 'bg-green-500';
		if (progress >= 60) return 'bg-blue-500';
		if (progress >= 40) return 'bg-yellow-500';
		return 'bg-red-500';
	}

	/** @param {string} difficulty */
	function getDifficultyColor(difficulty) {
		switch(difficulty.toLowerCase()) {
			case 'easy': return 'bg-green-100 text-green-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'hard': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
</script>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<LoadingSpinner />
		</div>
	{:else}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<!-- Welcome Header -->
			<div class="bg-white/70 backdrop-blur-xl border-b border-gray-200/20">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="text-4xl font-bold text-gray-900">Welcome back!</h1>
							<p class="text-gray-600 mt-1 text-lg">Hello, {/** @type {any} */($auth.user)?.name || /** @type {any} */($auth.user)?.email || 'Student'}! Ready to continue learning?</p>
						</div>
						<div class="flex items-center space-x-4">
							<div class="text-center">
								<div class="text-2xl font-bold text-primary">{studentProgress.currentLevel}</div>
								<div class="text-xs text-gray-500">Level</div>
							</div>
							<div class="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
								{/** @type {any} */($auth.user)?.name?.charAt(0).toUpperCase() || '👨‍🎓'}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<!-- Progress Summary Cards -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
									<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Courses Enrolled</dt>
									<dd class="text-2xl font-bold text-gray-900">{studentProgress.totalCourses}</dd>
								</dl>
							</div>
						</div>
					</div>

					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
									<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
									<dd class="text-2xl font-bold text-gray-900">{studentProgress.overallProgress}%</dd>
								</dl>
							</div>
						</div>
					</div>

					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center">
									<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Total XP</dt>
									<dd class="text-2xl font-bold text-gray-900">{studentProgress.totalXP.toLocaleString()}</dd>
								</dl>
							</div>
						</div>
					</div>

					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
									<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Badges Earned</dt>
									<dd class="text-2xl font-bold text-gray-900">{earnedBadges.length}</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Continue Learning Card -->
					<div class="lg:col-span-2">
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl mb-8">
							<h3 class="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h3>
							{#if continueLearnigCard}
								<div class="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
									<div class="flex items-center justify-between mb-4">
										<div class="flex items-center space-x-4">
											<div class="text-4xl">{continueLearnigCard.thumbnail}</div>
											<div>
												<h4 class="text-xl font-bold">{continueLearnigCard.title}</h4>
												<p class="text-blue-100">by {continueLearnigCard.instructor}</p>
											</div>
										</div>
										<div class="text-right">
											<div class="text-2xl font-bold">{continueLearnigCard.progress}%</div>
											<div class="text-sm text-blue-100">Complete</div>
										</div>
									</div>
									
									<div class="mb-4">
										<div class="bg-white/20 rounded-full h-2">
											<div class="bg-white rounded-full h-2 transition-all duration-500" style="width: {continueLearnigCard.progress}%"></div>
										</div>
										<p class="text-sm text-blue-100 mt-2">
											{continueLearnigCard.completedLessons} of {continueLearnigCard.totalLessons} lessons completed
										</p>
									</div>
									
									<div class="flex justify-between items-center">
										<span class="text-sm text-blue-100">Last accessed: {continueLearnigCard.lastAccessed}</span>
										<button 
											on:click={() => goto(`/courses/${continueLearnigCard.id}`)}
											class="bg-white text-primary font-semibold py-2 px-6 rounded-xl hover:bg-blue-50 transition-colors duration-200"
										>
											Resume Learning
										</button>
									</div>
								</div>
							{/if}
						</div>

						<!-- My Courses -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
							<div class="flex items-center justify-between mb-6">
								<h3 class="text-2xl font-bold text-gray-900">My Courses</h3>
								<button 
									on:click={() => goto('/courses')}
									class="text-primary hover:text-primary-dark font-medium"
								>
									View All
								</button>
							</div>

							<div class="space-y-4">
								{#each enrolledCourses as course}
									<div class="bg-gray-50/50 rounded-2xl p-6 hover:bg-white/80 transition-all duration-200">
									<div class="flex items-center space-x-4">
										<div class="text-3xl">{course.thumbnail}</div>
										<div class="flex-1">
											<h4 class="font-bold text-gray-900">{course.title}</h4>
											<p class="text-gray-600 text-sm">by {course.instructor}</p>
											<div class="mt-3">
												<div class="flex justify-between text-sm mb-1">
													<span>Progress</span>
													<span class="font-medium">{course.progress}%</span>
												</div>
												<div class="bg-gray-200 rounded-full h-2">
													<div class="{getProgressColor(course.progress)} rounded-full h-2 transition-all duration-500" style="width: {course.progress}%"></div>
												</div>
											</div>
										</div>
										<button 
											on:click={() => goto(`/courses/${course.id}`)}
											class="text-primary hover:text-primary-dark font-medium bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-all duration-200"
										>
											Continue
										</button>
									</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Right Sidebar -->
					<div class="space-y-8">
						<!-- Recommended for You -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
							<h3 class="text-xl font-bold text-gray-900 mb-4">Recommended for You</h3>
							<div class="space-y-4">
								{#each recommendations as rec}
									<div class="bg-gray-50/50 rounded-xl p-4 hover:bg-white/80 transition-colors duration-200">
										<div class="flex items-start space-x-3">
											<div class="text-2xl">{rec.thumbnail}</div>
											<div class="flex-1">
												<h4 class="font-semibold text-gray-900 text-sm">{rec.title}</h4>
												<p class="text-xs text-gray-600">{rec.instructor}</p>
												<p class="text-xs text-primary mt-1">{rec.reason}</p>
												<div class="flex items-center mt-2 text-xs text-gray-500">
													<span>⭐ {rec.rating}</span>
													<span class="ml-2">👥 {rec.students.toLocaleString()}</span>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Upcoming Quizzes -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
							<h3 class="text-xl font-bold text-gray-900 mb-4">Upcoming Quizzes</h3>
							<div class="space-y-3">
								{#each upcomingQuizzes as quiz}
									<div class="bg-gray-50/50 rounded-xl p-4">
										<div class="flex justify-between items-start mb-2">
											<h4 class="font-semibold text-gray-900 text-sm">{quiz.title}</h4>
											<span class="px-2 py-1 text-xs rounded-full {getDifficultyColor(quiz.difficulty)}">
												{quiz.difficulty}
											</span>
										</div>
										<p class="text-xs text-gray-600 mb-1">{quiz.course}</p>
										<p class="text-xs text-red-600">📅 {quiz.dueDate}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Leaderboard Preview -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
							<div class="flex items-center justify-between mb-4">
								<h3 class="text-xl font-bold text-gray-900">Leaderboard</h3>
								<button class="text-primary hover:text-primary-dark font-medium text-sm">View All</button>
							</div>
							<div class="space-y-3">
								{#each leaderboard as user}
									<div class="flex items-center space-x-3 {user.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50/50'} rounded-xl p-3">
										<div class="text-lg font-bold {user.isCurrentUser ? 'text-primary' : 'text-gray-600'} w-6 text-center">
											#{user.rank}
										</div>
										<div class="text-xl">{user.avatar}</div>
										<div class="flex-1">
											<p class="font-medium text-gray-900 text-sm">{user.name}</p>
											<p class="text-xs text-gray-600">{user.xp.toLocaleString()} XP</p>
										</div>
										{#if user.isCurrentUser}
											<div class="text-xs text-primary font-medium">You</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<!-- Badges -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
							<div class="flex items-center justify-between mb-4">
								<h3 class="text-xl font-bold text-gray-900">Your Badges</h3>
								<button class="text-primary hover:text-primary-dark font-medium text-sm">View All</button>
							</div>
							<div class="grid grid-cols-2 gap-3">
								{#each earnedBadges as badge}
									<div class="bg-gray-50/50 rounded-xl p-3 text-center hover:bg-white/80 transition-colors duration-200">
										<div class="text-2xl mb-1">{badge.icon}</div>
										<h4 class="font-semibold text-gray-900 text-xs">{badge.name}</h4>
										<p class="text-xs text-gray-600 mt-1">{badge.description}</p>
									</div>
								{/each}
							</div>
						</div>
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
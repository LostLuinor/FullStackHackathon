<script>
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	// Redirect if not authenticated
	$: if (!$auth.isAuthenticated && !$auth.isLoading) {
		goto('/login');
	}

	/** @type {any} */
	let achievementData = null;
	let loading = true;
	let error = null;
	let selectedCategory = 'all';

	// Categories for filtering badges
	const categories = [
		{ id: 'all', name: 'All Badges', icon: '🎭' },
		{ id: 'academic', name: 'Academic', icon: '🎓' },
		{ id: 'engagement', name: 'Engagement', icon: '⚡' },
		{ id: 'milestone', name: 'Milestones', icon: '🏆' },
		{ id: 'special', name: 'Special', icon: '⭐' },
		{ id: 'community', name: 'Community', icon: '🤝' }
	];

	// Mock achievement data
	const mockAchievements = {
		user: {
			id: $auth.user?.id || 1,
			name: $auth.user?.name || "Current User",
			totalXP: 9850,
			level: 9,
			earnedBadgesCount: 8,
			totalBadgesCount: 24,
			completionPercentage: 33
		},
		earnedBadges: [
			{
				id: 1,
				name: "First Steps",
				description: "Complete your first lesson",
				category: "milestone",
				icon: "👣",
				color: "blue",
				rarity: "common",
				xpReward: 100,
				earnedAt: "2024-01-15T10:30:00Z",
				progress: {
					current: 1,
					required: 1,
					isComplete: true
				}
			},
			{
				id: 2,
				name: "Speed Learner",
				description: "Complete 5 lessons in one day",
				category: "engagement",
				icon: "⚡",
				color: "yellow",
				rarity: "uncommon",
				xpReward: 250,
				earnedAt: "2024-01-20T16:45:00Z",
				progress: {
					current: 5,
					required: 5,
					isComplete: true
				}
			},
			{
				id: 3,
				name: "Quiz Champion",
				description: "Score 100% on 10 quizzes",
				category: "academic",
				icon: "🥇",
				color: "gold",
				rarity: "rare",
				xpReward: 500,
				earnedAt: "2024-02-01T14:20:00Z",
				progress: {
					current: 10,
					required: 10,
					isComplete: true
				}
			},
			{
				id: 4,
				name: "Consistency King",
				description: "Maintain a 30-day learning streak",
				category: "milestone",
				icon: "📅",
				color: "purple",
				rarity: "epic",
				xpReward: 750,
				earnedAt: "2024-02-15T09:15:00Z",
				progress: {
					current: 30,
					required: 30,
					isComplete: true
				}
			},
			{
				id: 5,
				name: "Course Completion Master",
				description: "Complete 5 full courses",
				category: "academic",
				icon: "🎓",
				color: "green",
				rarity: "rare",
				xpReward: 1000,
				earnedAt: "2024-03-01T12:00:00Z",
				progress: {
					current: 5,
					required: 5,
					isComplete: true
				}
			},
			{
				id: 6,
				name: "Early Bird",
				description: "Complete lessons before 8 AM for 7 days",
				category: "special",
				icon: "🌅",
				color: "orange",
				rarity: "uncommon",
				xpReward: 300,
				earnedAt: "2024-03-10T07:30:00Z",
				progress: {
					current: 7,
					required: 7,
					isComplete: true
				}
			},
			{
				id: 7,
				name: "Community Helper",
				description: "Help 10 other students",
				category: "community",
				icon: "🤝",
				color: "teal",
				rarity: "rare",
				xpReward: 400,
				earnedAt: "2024-03-20T19:45:00Z",
				progress: {
					current: 10,
					required: 10,
					isComplete: true
				}
			},
			{
				id: 8,
				name: "Rising Star",
				description: "Reach level 5",
				category: "milestone",
				icon: "🌟",
				color: "gold",
				rarity: "uncommon",
				xpReward: 200,
				earnedAt: "2024-03-25T11:20:00Z",
				progress: {
					current: 5,
					required: 5,
					isComplete: true
				}
			}
		],
		lockedBadges: [
			{
				id: 9,
				name: "Perfect Score",
				description: "Score 100% on 25 quizzes",
				category: "academic",
				icon: "💯",
				color: "green",
				rarity: "epic",
				xpReward: 800,
				requirements: [
					"Score 100% on 25 quizzes",
					"Complete at least 3 different courses",
					"Maintain minimum 90% average across all quizzes"
				],
				progress: {
					current: 10,
					required: 25,
					isComplete: false
				}
			},
			{
				id: 10,
				name: "Marathon Runner",
				description: "Maintain a 100-day learning streak",
				category: "milestone",
				icon: "🏃",
				color: "red",
				rarity: "legendary",
				xpReward: 2000,
				requirements: [
					"Complete at least one lesson every day for 100 days",
					"No breaks allowed",
					"Must include weekends"
				],
				progress: {
					current: 47,
					required: 100,
					isComplete: false
				}
			},
			{
				id: 11,
				name: "Night Owl",
				description: "Complete 20 lessons after 10 PM",
				category: "special",
				icon: "🦉",
				color: "purple",
				rarity: "uncommon",
				xpReward: 350,
				requirements: [
					"Complete lessons after 10 PM local time",
					"Minimum 20 lessons required",
					"Must be on different days"
				],
				progress: {
					current: 12,
					required: 20,
					isComplete: false
				}
			},
			{
				id: 12,
				name: "Master Scholar",
				description: "Complete 15 courses with 95%+ average",
				category: "academic",
				icon: "🎖️",
				color: "gold",
				rarity: "legendary",
				xpReward: 2500,
				requirements: [
					"Complete 15 full courses",
					"Maintain 95% or higher average in each course",
					"No failed quizzes allowed"
				],
				progress: {
					current: 5,
					required: 15,
					isComplete: false
				}
			},
			{
				id: 13,
				name: "Speed Demon",
				description: "Complete a full course in under 3 days",
				category: "engagement",
				icon: "🔥",
				color: "red",
				rarity: "epic",
				xpReward: 600,
				requirements: [
					"Complete all lessons in a course within 72 hours",
					"Must include all quizzes and assignments",
					"Minimum 80% score required"
				],
				progress: {
					current: 0,
					required: 1,
					isComplete: false
				}
			},
			{
				id: 14,
				name: "Social Butterfly",
				description: "Participate in 50 community discussions",
				category: "community",
				icon: "🦋",
				color: "pink",
				rarity: "rare",
				xpReward: 450,
				requirements: [
					"Post meaningful comments in 50 discussions",
					"Receive at least 100 total likes",
					"Help answer other students' questions"
				],
				progress: {
					current: 23,
					required: 50,
					isComplete: false
				}
			},
			{
				id: 15,
				name: "Practice Makes Perfect",
				description: "Complete 100 practice exercises",
				category: "engagement",
				icon: "💪",
				color: "blue",
				rarity: "rare",
				xpReward: 400,
				requirements: [
					"Complete 100 practice exercises",
					"From at least 5 different subjects",
					"Maintain 85% average score"
				],
				progress: {
					current: 67,
					required: 100,
					isComplete: false
				}
			},
			{
				id: 16,
				name: "Weekend Warrior",
				description: "Complete 20 lessons on weekends",
				category: "special",
				icon: "⚔️",
				color: "orange",
				rarity: "uncommon",
				xpReward: 300,
				requirements: [
					"Complete lessons on Saturday or Sunday",
					"Minimum 20 lessons total",
					"Must be spread across multiple weekends"
				],
				progress: {
					current: 8,
					required: 20,
					isComplete: false
				}
			}
		]
	};

	async function loadAchievements() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// achievementData = await api.getAchievements();

			// Use mock data for now
			await new Promise(resolve => setTimeout(resolve, 1000));
			achievementData = mockAchievements;
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	function getBadgeColor(color) {
		switch(color) {
			case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'blue': return 'bg-blue-100 text-blue-800 border-blue-300';
			case 'green': return 'bg-green-100 text-green-800 border-green-300';
			case 'purple': return 'bg-purple-100 text-purple-800 border-purple-300';
			case 'red': return 'bg-red-100 text-red-800 border-red-300';
			case 'orange': return 'bg-orange-100 text-orange-800 border-orange-300';
			case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'teal': return 'bg-teal-100 text-teal-800 border-teal-300';
			case 'pink': return 'bg-pink-100 text-pink-800 border-pink-300';
			default: return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	}

	function getRarityColor(rarity) {
		switch(rarity) {
			case 'common': return 'text-gray-600';
			case 'uncommon': return 'text-green-600';
			case 'rare': return 'text-blue-600';
			case 'epic': return 'text-purple-600';
			case 'legendary': return 'text-orange-600';
			default: return 'text-gray-600';
		}
	}

	function getRarityBorder(rarity) {
		switch(rarity) {
			case 'common': return 'border-gray-300';
			case 'uncommon': return 'border-green-300';
			case 'rare': return 'border-blue-300';
			case 'epic': return 'border-purple-300';
			case 'legendary': return 'border-orange-300';
			default: return 'border-gray-300';
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getFilteredBadges(badges, category) {
		if (category === 'all') {
			return badges;
		}
		return badges.filter(badge => badge.category === category);
	}

	function getProgressPercentage(current, required) {
		return Math.min((current / required) * 100, 100);
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadAchievements();
		}
	});
</script>

<svelte:head>
	<title>Badges & Achievements - E-Learning Platform</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
			<div class="text-center">
				<LoadingSpinner size="large" />
				<p class="mt-4 text-lg text-gray-600">Loading your achievements...</p>
			</div>
		</div>
	{:else if error}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
			<div class="text-center">
				<div class="text-6xl mb-4">❌</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Achievements</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<button on:click={() => goto('/dashboard')} class="primary-btn px-6 py-3 rounded-xl">
					← Back to Dashboard
				</button>
			</div>
		</div>
	{:else if achievementData}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
			<!-- Header -->
			<div class="bg-white/70 backdrop-blur-xl border-b border-gray-200/20">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div class="flex items-center justify-between">
						<div>
							<nav class="flex items-center space-x-2 text-sm text-gray-600 mb-2">
								<button on:click={() => goto('/dashboard')} class="hover:text-primary">
									Dashboard
								</button>
								<span>›</span>
								<span class="text-primary font-medium">Badges & Achievements</span>
							</nav>
							<h1 class="text-4xl font-bold text-gray-900">🏆 Your Achievements</h1>
							<p class="text-gray-600 mt-2 text-lg">Collect badges and unlock your potential</p>
						</div>
						<button on:click={() => goto('/dashboard')} class="secondary-btn px-6 py-3 rounded-xl">
							← Back to Dashboard
						</button>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<!-- Achievement Stats Overview -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl mb-8">
					<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div class="text-center">
							<div class="text-3xl font-bold text-primary mb-2">
								{achievementData.user.earnedBadgesCount}/{achievementData.user.totalBadgesCount}
							</div>
							<div class="text-sm text-gray-600">Badges Earned</div>
							<div class="bg-gray-200 rounded-full h-2 mt-2">
								<div 
									class="bg-primary rounded-full h-2 transition-all duration-500" 
									style="width: {achievementData.user.completionPercentage}%"
								></div>
							</div>
						</div>
						<div class="text-center">
							<div class="text-3xl font-bold text-green-600 mb-2">
								{achievementData.user.totalXP.toLocaleString()}
							</div>
							<div class="text-sm text-gray-600">Total XP Earned</div>
						</div>
						<div class="text-center">
							<div class="text-3xl font-bold text-orange-600 mb-2">
								{achievementData.user.level}
							</div>
							<div class="text-sm text-gray-600">Current Level</div>
						</div>
						<div class="text-center">
							<div class="text-3xl font-bold text-purple-600 mb-2">
								{achievementData.earnedBadges.reduce((total, badge) => total + badge.xpReward, 0).toLocaleString()}
							</div>
							<div class="text-sm text-gray-600">XP from Badges</div>
						</div>
					</div>
				</div>

				<!-- Category Filter -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl mb-8">
					<h3 class="text-lg font-bold text-gray-900 mb-4">🎯 Filter by Category</h3>
					<div class="flex flex-wrap gap-3">
						{#each categories as category}
							<button
								on:click={() => selectedCategory = category.id}
								class="flex items-center space-x-2 px-4 py-2 rounded-xl border transition-colors {
									selectedCategory === category.id 
										? 'bg-primary text-white border-primary' 
										: 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
								}"
							>
								<span>{category.icon}</span>
								<span class="font-medium">{category.name}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Earned Badges Section -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl mb-8 overflow-hidden">
					<div class="p-6 border-b border-gray-200">
						<h2 class="text-2xl font-bold text-gray-900">🎉 Earned Badges</h2>
						<p class="text-gray-600 mt-1">Your collection of achievements</p>
					</div>

					{@const filteredEarnedBadges = getFilteredBadges(achievementData.earnedBadges, selectedCategory)}
					{#if filteredEarnedBadges.length > 0}
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
							{#each filteredEarnedBadges as badge}
								<div class="bg-white border-2 {getRarityBorder(badge.rarity)} rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
									<div class="text-center mb-4">
										<div class="text-4xl mb-2">{badge.icon}</div>
										<h3 class="text-lg font-bold text-gray-900">{badge.name}</h3>
										<p class="text-sm text-gray-600 mt-1">{badge.description}</p>
									</div>

									<div class="space-y-3">
										<div class="flex items-center justify-between text-sm">
											<span class="font-medium {getRarityColor(badge.rarity)} capitalize">
												{badge.rarity}
											</span>
											<span class="px-2 py-1 text-xs rounded-full border {getBadgeColor(badge.color)}">
												+{badge.xpReward} XP
											</span>
										</div>

										<div class="text-xs text-gray-500 text-center">
											🎉 Earned on {formatDate(badge.earnedAt)}
										</div>

										<div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
											<div class="text-green-600 font-medium text-sm">
												✅ Completed
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="p-12 text-center text-gray-500">
							<div class="text-4xl mb-4">🎭</div>
							<p>No earned badges in this category yet.</p>
						</div>
					{/if}
				</div>

				<!-- Locked Badges Section -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
					<div class="p-6 border-b border-gray-200">
						<h2 class="text-2xl font-bold text-gray-900">🔒 Locked Badges</h2>
						<p class="text-gray-600 mt-1">Challenges waiting to be conquered</p>
					</div>

					{@const filteredLockedBadges = getFilteredBadges(achievementData.lockedBadges, selectedCategory)}
					{#if filteredLockedBadges.length > 0}
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
							{#each filteredLockedBadges as badge}
								<div class="bg-white border-2 border-gray-200 rounded-2xl p-6 opacity-80 hover:opacity-100 transition-opacity">
									<div class="text-center mb-4">
										<div class="text-4xl mb-2 grayscale">{badge.icon}</div>
										<h3 class="text-lg font-bold text-gray-900">{badge.name}</h3>
										<p class="text-sm text-gray-600 mt-1">{badge.description}</p>
									</div>

									<div class="space-y-3">
										<div class="flex items-center justify-between text-sm">
											<span class="font-medium {getRarityColor(badge.rarity)} capitalize">
												{badge.rarity}
											</span>
											<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200">
												+{badge.xpReward} XP
											</span>
										</div>

										<!-- Progress -->
										<div class="space-y-2">
											<div class="flex items-center justify-between text-xs text-gray-600">
												<span>Progress</span>
												<span>{badge.progress.current}/{badge.progress.required}</span>
											</div>
											<div class="bg-gray-200 rounded-full h-2">
												<div 
													class="bg-primary rounded-full h-2 transition-all duration-500" 
													style="width: {getProgressPercentage(badge.progress.current, badge.progress.required)}%"
												></div>
											</div>
										</div>

										<!-- Requirements -->
										<div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
											<h4 class="text-xs font-medium text-gray-700 mb-2">Requirements:</h4>
											<ul class="space-y-1">
												{#each badge.requirements as requirement}
													<li class="text-xs text-gray-600 flex items-start">
														<span class="mr-2">•</span>
														<span>{requirement}</span>
													</li>
												{/each}
											</ul>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="p-12 text-center text-gray-500">
							<div class="text-4xl mb-4">🔒</div>
							<p>No locked badges in this category.</p>
						</div>
					{/if}
				</div>

				<!-- Call to Action -->
				<div class="bg-gradient-to-r from-primary to-purple-600 text-white rounded-3xl p-8 text-center">
					<h2 class="text-2xl font-bold mb-4">🚀 Keep Learning, Keep Earning!</h2>
					<p class="text-lg mb-6 opacity-90">
						Complete more courses and challenges to unlock amazing badges and climb the leaderboard!
					</p>
					<div class="flex justify-center space-x-4">
						<button on:click={() => goto('/dashboard')} class="bg-white text-primary px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
							Continue Learning
						</button>
						<button on:click={() => goto('/leaderboard')} class="bg-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-colors">
							View Leaderboard
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
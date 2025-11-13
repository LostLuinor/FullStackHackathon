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

	/** @type {any[]} */
	let leaderboard = [];
	/** @type {any[]} */
	let filteredLeaderboard = [];
	let loading = true;
	let error = null;
	let selectedCourse = 'all';
	let currentUserRank = null;

	// Available courses for filtering
	let courses = [
		{ id: 'all', name: 'All Courses' },
		{ id: 1, name: 'Introduction to Machine Learning' },
		{ id: 2, name: 'Web Development Fundamentals' },
		{ id: 3, name: 'Data Structures & Algorithms' },
		{ id: 4, name: 'Python for Data Science' },
		{ id: 5, name: 'Mobile App Development' },
		{ id: 6, name: 'Introduction to Cybersecurity' }
	];

	// Mock leaderboard data
	let mockLeaderboard = [
		{
			rank: 1,
			userId: 101,
			name: "Alex Thompson",
			avatar: "🏆",
			totalXP: 15420,
			courseXP: 3250,
			badges: [
				{ id: 1, name: "Course Completion Master", icon: "🎓", color: "gold" },
				{ id: 2, name: "Speed Learner", icon: "⚡", color: "blue" },
				{ id: 3, name: "Quiz Champion", icon: "🥇", color: "gold" },
				{ id: 4, name: "Consistency King", icon: "📅", color: "purple" }
			],
			coursesCompleted: 12,
			streak: 47,
			level: 15,
			isCurrentUser: false
		},
		{
			rank: 2,
			userId: 102,
			name: "Sarah Chen",
			avatar: "🌟",
			totalXP: 14850,
			courseXP: 2890,
			badges: [
				{ id: 1, name: "Course Completion Master", icon: "🎓", color: "gold" },
				{ id: 5, name: "Perfect Score", icon: "💯", color: "green" },
				{ id: 6, name: "Early Bird", icon: "🌅", color: "orange" }
			],
			coursesCompleted: 10,
			streak: 32,
			level: 14,
			isCurrentUser: false
		},
		{
			rank: 3,
			userId: 103,
			name: "Michael Rodriguez",
			avatar: "🚀",
			totalXP: 13920,
			courseXP: 2750,
			badges: [
				{ id: 2, name: "Speed Learner", icon: "⚡", color: "blue" },
				{ id: 7, name: "Practice Makes Perfect", icon: "💪", color: "red" },
				{ id: 8, name: "Community Helper", icon: "🤝", color: "teal" }
			],
			coursesCompleted: 9,
			streak: 28,
			level: 13,
			isCurrentUser: false
		},
		{
			rank: 4,
			userId: 104,
			name: "Emily Johnson",
			avatar: "⭐",
			totalXP: 12750,
			courseXP: 2450,
			badges: [
				{ id: 1, name: "Course Completion Master", icon: "🎓", color: "gold" },
				{ id: 9, name: "Night Owl", icon: "🦉", color: "purple" }
			],
			coursesCompleted: 8,
			streak: 15,
			level: 12,
			isCurrentUser: false
		},
		{
			rank: 5,
			userId: 105,
			name: "David Kim",
			avatar: "🎯",
			totalXP: 11890,
			courseXP: 2320,
			badges: [
				{ id: 3, name: "Quiz Champion", icon: "🥇", color: "gold" },
				{ id: 10, name: "Focus Master", icon: "🎯", color: "blue" }
			],
			coursesCompleted: 7,
			streak: 21,
			level: 11,
			isCurrentUser: false
		},
		{
			rank: 6,
			userId: $auth.user?.id || 106,
			name: $auth.user?.name || "You",
			avatar: "👤",
			totalXP: 9850,
			courseXP: 1950,
			badges: [
				{ id: 2, name: "Speed Learner", icon: "⚡", color: "blue" },
				{ id: 11, name: "Rising Star", icon: "🌟", color: "yellow" }
			],
			coursesCompleted: 5,
			streak: 12,
			level: 9,
			isCurrentUser: true
		},
		{
			rank: 7,
			userId: 107,
			name: "Lisa Wang",
			avatar: "💎",
			totalXP: 8920,
			courseXP: 1820,
			badges: [
				{ id: 12, name: "Dedication Badge", icon: "🔥", color: "red" }
			],
			coursesCompleted: 4,
			streak: 18,
			level: 8,
			isCurrentUser: false
		},
		{
			rank: 8,
			userId: 108,
			name: "James Wilson",
			avatar: "🎲",
			totalXP: 7850,
			courseXP: 1650,
			badges: [
				{ id: 13, name: "Explorer", icon: "🗺️", color: "green" }
			],
			coursesCompleted: 3,
			streak: 9,
			level: 7,
			isCurrentUser: false
		},
		{
			rank: 9,
			userId: 109,
			name: "Anna Martinez",
			avatar: "🎨",
			totalXP: 6920,
			courseXP: 1480,
			badges: [
				{ id: 14, name: "Creative Thinker", icon: "🎨", color: "purple" }
			],
			coursesCompleted: 3,
			streak: 7,
			level: 6,
			isCurrentUser: false
		},
		{
			rank: 10,
			userId: 110,
			name: "Robert Taylor",
			avatar: "⚡",
			totalXP: 5950,
			courseXP: 1320,
			badges: [
				{ id: 15, name: "Newcomer", icon: "👋", color: "blue" }
			],
			coursesCompleted: 2,
			streak: 5,
			level: 5,
			isCurrentUser: false
		}
	];

	async function loadLeaderboard() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// leaderboard = await api.getLeaderboard(selectedCourse === 'all' ? null : selectedCourse);

			// Use mock data for now
			await new Promise(resolve => setTimeout(resolve, 800));
			leaderboard = [...mockLeaderboard];
			
			// Find current user rank
			const currentUser = leaderboard.find(player => player.isCurrentUser);
			currentUserRank = currentUser ? currentUser.rank : null;
			
			filterLeaderboard();
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	function filterLeaderboard() {
		if (selectedCourse === 'all') {
			filteredLeaderboard = [...leaderboard];
		} else {
			// In a real app, this would filter by course-specific XP
			// For now, we'll just show the same data but highlight it's filtered
			filteredLeaderboard = [...leaderboard];
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
			default: return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	}

	function getRankIcon(rank) {
		switch(rank) {
			case 1: return '🥇';
			case 2: return '🥈';
			case 3: return '🥉';
			default: return `#${rank}`;
		}
	}

	function getRankStyle(rank) {
		switch(rank) {
			case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
			case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
			case 3: return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
			default: return 'bg-gray-100 text-gray-700';
		}
	}

	function getXPForLevel(level) {
		return level * 1000; // Simple calculation - 1000 XP per level
	}

	function getProgressToNextLevel(totalXP, level) {
		const currentLevelXP = getXPForLevel(level);
		const nextLevelXP = getXPForLevel(level + 1);
		const progress = totalXP - currentLevelXP;
		const total = nextLevelXP - currentLevelXP;
		return Math.min((progress / total) * 100, 100);
	}

	// Watch for course filter changes
	$: {
		if (selectedCourse && leaderboard.length > 0) {
			filterLeaderboard();
		}
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadLeaderboard();
		}
	});
</script>

<svelte:head>
	<title>Leaderboard - E-Learning Platform</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
			<div class="text-center">
				<LoadingSpinner size="large" />
				<p class="mt-4 text-lg text-gray-600">Loading leaderboard...</p>
			</div>
		</div>
	{:else if error}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
			<div class="text-center">
				<div class="text-6xl mb-4">❌</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Leaderboard</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<button on:click={() => goto('/dashboard')} class="primary-btn px-6 py-3 rounded-xl">
					← Back to Dashboard
				</button>
			</div>
		</div>
	{:else}
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
								<span class="text-primary font-medium">Leaderboard</span>
							</nav>
							<h1 class="text-4xl font-bold text-gray-900">🏆 Leaderboard</h1>
							<p class="text-gray-600 mt-2 text-lg">See how you rank among your peers</p>
						</div>
						<button on:click={() => goto('/dashboard')} class="secondary-btn px-6 py-3 rounded-xl">
							← Back to Dashboard
						</button>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<!-- Current User Stats (if in top rankings) -->
				{#if currentUserRank && currentUserRank <= 10}
					<div class="bg-white/70 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 shadow-xl mb-8">
						<div class="text-center">
							<h2 class="text-xl font-bold text-gray-900 mb-4">🎉 Your Current Ranking</h2>
							{@const currentUser = filteredLeaderboard.find(p => p.isCurrentUser)}
							{#if currentUser}
								<div class="inline-flex items-center space-x-4 bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4">
									<div class="text-3xl">{currentUser.avatar}</div>
									<div class="text-left">
										<h3 class="text-lg font-bold text-primary">Rank #{currentUser.rank}</h3>
										<p class="text-sm text-gray-600">{currentUser.totalXP.toLocaleString()} XP • Level {currentUser.level}</p>
									</div>
									<div class="flex space-x-1">
										{#each currentUser.badges.slice(0, 3) as badge}
											<span class="px-2 py-1 text-xs rounded-full border {getBadgeColor(badge.color)}">
												{badge.icon}
											</span>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Course Filter -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl mb-8">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-bold text-gray-900">🎯 Filter by Course</h3>
						<div class="flex items-center space-x-4">
							<select
								bind:value={selectedCourse}
								on:change={() => loadLeaderboard()}
								class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[200px]"
							>
								{#each courses as course}
									<option value={course.id}>{course.name}</option>
								{/each}
							</select>
							<span class="text-sm text-gray-600">
								Showing {filteredLeaderboard.length} players
							</span>
						</div>
					</div>
				</div>

				<!-- Leaderboard List -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
					<div class="p-6 border-b border-gray-200">
						<h2 class="text-2xl font-bold text-gray-900">🏁 Top Performers</h2>
					</div>

					<div class="divide-y divide-gray-200">
						{#each filteredLeaderboard as player, i}
							<div class="p-6 hover:bg-gray-50/50 transition-colors {player.isCurrentUser ? 'bg-blue-50 border-l-4 border-primary' : ''}">
								<div class="flex items-center space-x-6">
									<!-- Rank -->
									<div class="flex-shrink-0">
										<div class="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold {getRankStyle(player.rank)}">
											{getRankIcon(player.rank)}
										</div>
									</div>

									<!-- Player Info -->
									<div class="flex-1 min-w-0">
										<div class="flex items-center space-x-3 mb-2">
											<div class="text-3xl">{player.avatar}</div>
											<div>
												<h3 class="text-lg font-bold text-gray-900 {player.isCurrentUser ? 'text-primary' : ''}">
													{player.name} {player.isCurrentUser ? '(You)' : ''}
												</h3>
												<div class="flex items-center space-x-4 text-sm text-gray-600">
													<span>Level {player.level}</span>
													<span>•</span>
													<span>{player.coursesCompleted} courses completed</span>
													<span>•</span>
													<span>{player.streak} day streak</span>
												</div>
											</div>
										</div>

										<!-- XP and Progress -->
										<div class="mb-3">
											<div class="flex items-center justify-between mb-1">
												<span class="text-sm font-medium text-gray-700">
													{player.totalXP.toLocaleString()} XP
												</span>
												<span class="text-xs text-gray-500">
													{(player.totalXP - getXPForLevel(player.level)).toLocaleString()} / {(getXPForLevel(player.level + 1) - getXPForLevel(player.level)).toLocaleString()} to next level
												</span>
											</div>
											<div class="bg-gray-200 rounded-full h-2">
												<div 
													class="bg-primary rounded-full h-2 transition-all duration-500" 
													style="width: {getProgressToNextLevel(player.totalXP, player.level)}%"
												></div>
											</div>
										</div>

										<!-- Badges -->
										{#if player.badges && player.badges.length > 0}
											<div class="flex flex-wrap gap-2">
												{#each player.badges as badge}
													<span 
														class="inline-flex items-center space-x-1 px-3 py-1 text-xs rounded-full border {getBadgeColor(badge.color)}"
														title={badge.name}
													>
														<span>{badge.icon}</span>
														<span>{badge.name}</span>
													</span>
												{/each}
											</div>
										{/if}
									</div>

									<!-- Stats -->
									<div class="flex-shrink-0 text-right">
										<div class="text-2xl font-bold text-primary">
											{selectedCourse === 'all' ? player.totalXP.toLocaleString() : player.courseXP.toLocaleString()}
										</div>
										<div class="text-xs text-gray-600">XP</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Load More / Pagination (Future Enhancement) -->
				<div class="mt-8 text-center">
					<button class="secondary-btn px-6 py-3 rounded-xl" disabled>
						Load More Players
					</button>
					<p class="text-sm text-gray-600 mt-2">Showing top 10 players</p>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
		<LoadingSpinner />
	</div>
{/if}
<script>
	import { page } from '$app/stores';
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	// Redirect if not authenticated
	$: if (!$auth.isAuthenticated && !$auth.isLoading) {
		goto('/login');
	}

	let courseId = $page.params.id;
	let course = null;
	let lessons = [];
	let currentLesson = null;
	let loading = true;
	let error = null;

	// Mock course data
	let mockCourse = {
		id: courseId,
		title: "Introduction to Machine Learning",
		description: "Learn the fundamentals of machine learning with hands-on projects and real-world applications.",
		instructor: "Dr. Sarah Chen",
		duration: "8 weeks",
		difficulty: "Intermediate",
		rating: 4.8,
		studentsEnrolled: 15420,
		thumbnail: "🤖",
		category: "Artificial Intelligence",
		skills: ["Python", "Data Analysis", "Neural Networks", "Classification", "Regression"],
		progress: {
			completed: 15,
			total: 24,
			percentage: 63
		}
	};

	let mockLessons = [
		{
			id: 1,
			title: "Introduction to Machine Learning",
			type: "video",
			duration: "15 min",
			completed: true,
			locked: false
		},
		{
			id: 2,
			title: "Types of Machine Learning",
			type: "reading",
			duration: "10 min",
			completed: true,
			locked: false
		},
		{
			id: 3,
			title: "Python for ML - Setup",
			type: "video",
			duration: "20 min",
			completed: true,
			locked: false
		},
		{
			id: 4,
			title: "Data Preprocessing",
			type: "hands-on",
			duration: "30 min",
			completed: false,
			locked: false,
			current: true
		},
		{
			id: 5,
			title: "Linear Regression",
			type: "video",
			duration: "25 min",
			completed: false,
			locked: false
		},
		{
			id: 6,
			title: "Classification Algorithms",
			type: "quiz",
			duration: "15 min",
			completed: false,
			locked: true
		}
	];

	async function loadCourse() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// course = await api.getCourse(courseId);
			// lessons = await api.getCourseLessons(courseId);

			// Use mock data for now
			course = mockCourse;
			lessons = mockLessons;
			currentLesson = lessons.find(l => l.current) || lessons[0];
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	function getLessonIcon(type) {
		switch(type) {
			case 'video': return '▶️';
			case 'reading': return '📖';
			case 'hands-on': return '💻';
			case 'quiz': return '❓';
			default: return '📝';
		}
	}

	function getLessonTypeColor(type) {
		switch(type) {
			case 'video': return 'bg-blue-100 text-blue-800';
			case 'reading': return 'bg-green-100 text-green-800';
			case 'hands-on': return 'bg-purple-100 text-purple-800';
			case 'quiz': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	function selectLesson(lesson) {
		if (lesson.locked) return; // Don't allow access to locked lessons
		currentLesson = lesson;
	}

	function startLesson(lesson) {
		if (lesson.locked) return; // Don't allow access to locked lessons
		goto(`/lessons/${lesson.id}`);
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadCourse();
		}
	});
</script>

<svelte:head>
	<title>{course?.title || 'Course'} - E-Learning Platform</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<LoadingSpinner size="large" />
		</div>
	{:else if error}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<div class="text-center">
				<div class="text-6xl mb-4">😞</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<button on:click={() => goto('/dashboard')} class="primary-btn px-6 py-2 rounded-xl">
					Back to Dashboard
				</button>
			</div>
		</div>
	{:else if course}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<!-- Course Header -->
			<div class="bg-white/70 backdrop-blur-xl border-b border-gray-200/20">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-4">
							<button on:click={() => goto('/dashboard')} class="text-gray-600 hover:text-gray-900 transition-colors">
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<div class="text-4xl">{course.thumbnail}</div>
							<div>
								<h1 class="text-2xl font-bold text-gray-900">{course.title}</h1>
								<p class="text-gray-600">by {course.instructor}</p>
							</div>
						</div>
						<div class="text-right">
							<div class="text-3xl font-bold text-primary">{course.progress.percentage}%</div>
							<div class="text-sm text-gray-600">Complete</div>
						</div>
					</div>

					<!-- Progress Bar -->
					<div class="mt-6">
						<div class="bg-gray-200 rounded-full h-3">
							<div class="bg-gradient-to-r from-primary to-blue-600 rounded-full h-3 transition-all duration-500" 
								 style="width: {course.progress.percentage}%"></div>
						</div>
						<div class="flex justify-between text-sm text-gray-600 mt-2">
							<span>{course.progress.completed} of {course.progress.total} lessons completed</span>
							<span>{course.duration}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
					<!-- Course Content -->
					<div class="lg:col-span-3">
						{#if currentLesson}
							<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl mb-8">
								<div class="flex items-center justify-between mb-6">
									<div class="flex items-center space-x-4">
										<div class="text-3xl">{getLessonIcon(currentLesson.type)}</div>
										<div>
											<h2 class="text-2xl font-bold text-gray-900">{currentLesson.title}</h2>
											<div class="flex items-center space-x-4 mt-2">
												<span class="px-3 py-1 text-xs rounded-full {getLessonTypeColor(currentLesson.type)}">
													{currentLesson.type.charAt(0).toUpperCase() + currentLesson.type.slice(1)}
												</span>
												<span class="text-gray-600">⏱️ {currentLesson.duration}</span>
											</div>
										</div>
									</div>
								</div>

								<!-- Lesson Content Area -->
								<div class="bg-gray-900 rounded-2xl p-8 mb-6">
									<div class="text-center text-white">
										<div class="text-6xl mb-4">🎬</div>
										<h3 class="text-xl font-bold mb-2">Lesson Content</h3>
										<p class="text-gray-300 mb-6">
											Ready to start this lesson? Click below to access the full lesson viewer with video content, notes, and AI assistance.
										</p>
										<div class="flex justify-center space-x-4">
											<button 
												on:click={() => startLesson(currentLesson)}
												class="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
												disabled={currentLesson.locked}
											>
												{#if currentLesson.completed}
													🔄 Review Lesson
												{:else}
													▶️ Start Lesson
												{/if}
											</button>
											<button 
												on:click={() => startLesson(currentLesson)}
												class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
												disabled={currentLesson.locked}
											>
												📖 View in Lesson Viewer
											</button>
										</div>
									</div>
								</div>

								<!-- Lesson Navigation -->
								<div class="flex justify-between items-center">
									<button class="secondary-btn px-6 py-3 rounded-xl" disabled>
										← Previous Lesson
									</button>
									<div class="flex space-x-3">
										<button class="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
											✓ Mark Complete
										</button>
										<button class="primary-btn px-6 py-3 rounded-xl">
											Next Lesson →
										</button>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Course Sidebar -->
					<div class="space-y-6">
						<!-- Course Info -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
							<h3 class="font-bold text-gray-900 mb-4">Course Details</h3>
							<div class="space-y-3 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-600">Difficulty</span>
									<span class="font-medium text-gray-900">{course.difficulty}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Duration</span>
									<span class="font-medium text-gray-900">{course.duration}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Students</span>
									<span class="font-medium text-gray-900">{course.studentsEnrolled.toLocaleString()}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Rating</span>
									<span class="font-medium text-gray-900">⭐ {course.rating}</span>
								</div>
							</div>

							<div class="mt-4">
								<h4 class="font-semibold text-gray-900 mb-2">Skills You'll Learn</h4>
								<div class="flex flex-wrap gap-2">
									{#each course.skills as skill}
										<span class="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">{skill}</span>
									{/each}
								</div>
							</div>
						</div>

						<!-- Lessons List -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
							<h3 class="font-bold text-gray-900 mb-4">Course Lessons</h3>
							<div class="space-y-2">
								{#each lessons as lesson, i}
									<div class="flex items-center space-x-3 p-3 rounded-xl {lesson.current ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50/50'} transition-colors cursor-pointer {lesson.locked ? 'opacity-60' : ''}"
										 on:click={() => selectLesson(lesson)}
										 on:keydown={(e) => e.key === 'Enter' && selectLesson(lesson)}
										 role="button"
										 tabindex="0">
										<div class="flex-shrink-0">
											{#if lesson.completed}
												<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
													<svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
													</svg>
												</div>
											{:else if lesson.locked}
												<div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
													<svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
													</svg>
												</div>
											{:else}
												<div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
													{i + 1}
												</div>
											{/if}
										</div>
										<div class="flex-1 min-w-0">
											<p class="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
											<div class="flex items-center space-x-2 text-xs text-gray-600">
												<span>{getLessonIcon(lesson.type)}</span>
												<span>{lesson.duration}</span>
												{#if lesson.locked}
													<span class="text-amber-600">🔒 Locked</span>
												{/if}
											</div>
										</div>
										{#if !lesson.locked}
											<button 
												on:click|stopPropagation={() => startLesson(lesson)}
												class="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary/80 p-1"
												title="Open in Lesson Viewer"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
											</button>
										{/if}
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
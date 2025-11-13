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
	let courses = [];
	/** @type {any[]} */
	let filteredCourses = [];
	let loading = true;
	let error = null;
	let searchTerm = '';
	let selectedCategory = 'all';
	let selectedDifficulty = 'all';

	// Mock courses data
	let mockCourses = [
		{
			id: 1,
			title: "Introduction to Machine Learning",
			description: "Learn the fundamentals of machine learning with hands-on projects and real-world applications.",
			instructor: "Dr. Sarah Chen",
			duration: "8 weeks",
			difficulty: "Intermediate",
			rating: 4.8,
			studentsEnrolled: 15420,
			thumbnail: "🤖",
			category: "AI & Machine Learning",
			price: "$99",
			enrolled: true,
			progress: 63
		},
		{
			id: 2,
			title: "Web Development Fundamentals",
			description: "Master HTML, CSS, JavaScript and modern web development practices.",
			instructor: "John Martinez",
			duration: "6 weeks",
			difficulty: "Beginner",
			rating: 4.9,
			studentsEnrolled: 25680,
			thumbnail: "🌐",
			category: "Web Development",
			price: "$79",
			enrolled: true,
			progress: 92
		},
		{
			id: 3,
			title: "Data Structures & Algorithms",
			description: "Comprehensive course on data structures, algorithms, and problem-solving techniques.",
			instructor: "Prof. Michael Kim",
			duration: "10 weeks",
			difficulty: "Advanced",
			rating: 4.7,
			studentsEnrolled: 12340,
			thumbnail: "⚡",
			category: "Computer Science",
			price: "$129",
			enrolled: true,
			progress: 45
		},
		{
			id: 4,
			title: "Python for Data Science",
			description: "Learn Python programming specifically for data analysis and visualization.",
			instructor: "Dr. Lisa Wang",
			duration: "7 weeks",
			difficulty: "Intermediate",
			rating: 4.8,
			studentsEnrolled: 18750,
			thumbnail: "🐍",
			category: "Data Science",
			price: "$89",
			enrolled: false,
			progress: 0
		},
		{
			id: 5,
			title: "Mobile App Development with React Native",
			description: "Build cross-platform mobile applications using React Native framework.",
			instructor: "Alex Thompson",
			duration: "9 weeks",
			difficulty: "Intermediate",
			rating: 4.6,
			studentsEnrolled: 9850,
			thumbnail: "📱",
			category: "Mobile Development",
			price: "$119",
			enrolled: false,
			progress: 0
		},
		{
			id: 6,
			title: "Introduction to Cybersecurity",
			description: "Learn the basics of cybersecurity, ethical hacking, and information protection.",
			instructor: "Dr. James Wilson",
			duration: "6 weeks",
			difficulty: "Beginner",
			rating: 4.5,
			studentsEnrolled: 14320,
			thumbnail: "🔒",
			category: "Cybersecurity",
			price: "$99",
			enrolled: false,
			progress: 0
		}
	];

	let categories = [
		"AI & Machine Learning",
		"Web Development",
		"Data Science",
		"Mobile Development",
		"Computer Science",
		"Cybersecurity"
	];

	let difficulties = ["Beginner", "Intermediate", "Advanced"];

	async function loadCourses() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// courses = await api.getCourses();

			// Use mock data for now
			courses = mockCourses;
			filteredCourses = courses;
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	function filterCourses() {
		filteredCourses = courses.filter(course => {
			const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
								course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
								course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
			const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;

			return matchesSearch && matchesCategory && matchesDifficulty;
		});
	}

	function getDifficultyColor(difficulty) {
		switch(difficulty.toLowerCase()) {
			case 'beginner': return 'bg-green-100 text-green-800';
			case 'intermediate': return 'bg-yellow-100 text-yellow-800';
			case 'advanced': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	function enrollInCourse(courseId) {
		// This would call the API to enroll the student
		console.log(`Enrolling in course ${courseId}`);
		
		// Update the course enrollment status
		courses = courses.map(course => 
			course.id === courseId 
				? { ...course, enrolled: true, progress: 0 }
				: course
		);
		filterCourses();
	}

	// Watch for changes in search and filter inputs
	$: {
		searchTerm, selectedCategory, selectedDifficulty;
		if (courses.length > 0) {
			filterCourses();
		}
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadCourses();
		}
	});
</script>

<svelte:head>
	<title>Courses - E-Learning Platform</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<LoadingSpinner size="large" />
		</div>
	{:else}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<!-- Header -->
			<div class="bg-white/70 backdrop-blur-xl border-b border-gray-200/20">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="text-4xl font-bold text-gray-900">Explore Courses</h1>
							<p class="text-gray-600 mt-2 text-lg">Discover new skills and advance your knowledge</p>
						</div>
						<button on:click={() => goto('/dashboard')} class="secondary-btn px-6 py-3 rounded-xl">
							← Back to Dashboard
						</button>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<!-- Search and Filters -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl mb-8">
					<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
						<!-- Search -->
						<div class="md:col-span-2">
							<label for="search" class="block text-sm font-medium text-gray-700 mb-2">
								Search Courses
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
								<input
									id="search"
									type="text"
									bind:value={searchTerm}
									placeholder="Search for courses, instructors, or topics..."
									class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
								/>
							</div>
						</div>

						<!-- Category Filter -->
						<div>
							<label for="category" class="block text-sm font-medium text-gray-700 mb-2">
								Category
							</label>
							<select
								id="category"
								bind:value={selectedCategory}
								class="block w-full py-3 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
							>
								<option value="all">All Categories</option>
								{#each categories as category}
									<option value={category}>{category}</option>
								{/each}
							</select>
						</div>

						<!-- Difficulty Filter -->
						<div>
							<label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">
								Difficulty
							</label>
							<select
								id="difficulty"
								bind:value={selectedDifficulty}
								class="block w-full py-3 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
							>
								<option value="all">All Levels</option>
								{#each difficulties as difficulty}
									<option value={difficulty}>{difficulty}</option>
								{/each}
							</select>
						</div>
					</div>

					<!-- Results Summary -->
					<div class="mt-4 text-sm text-gray-600">
						Showing {filteredCourses.length} of {courses.length} courses
					</div>
				</div>

				<!-- Courses Grid -->
				{#if filteredCourses.length === 0}
					<div class="text-center py-12">
						<div class="text-6xl mb-4">📚</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
						<p class="text-gray-600">Try adjusting your search criteria or browse all courses.</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{#each filteredCourses as course}
							<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
								<!-- Course Header -->
								<div class="flex items-center space-x-4 mb-4">
									<div class="text-4xl">{course.thumbnail}</div>
									<div class="flex-1">
										<h3 class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
											{course.title}
										</h3>
										<p class="text-sm text-gray-600">by {course.instructor}</p>
									</div>
									{#if course.enrolled}
										<div class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
											Enrolled
										</div>
									{/if}
								</div>

								<!-- Course Description -->
								<p class="text-sm text-gray-700 mb-4 line-clamp-3">{course.description}</p>

								<!-- Course Metadata -->
								<div class="space-y-3 mb-6">
									<div class="flex justify-between items-center text-sm">
										<span class="text-gray-600">Category</span>
										<span class="font-medium text-primary">{course.category}</span>
									</div>
									<div class="flex justify-between items-center text-sm">
										<span class="text-gray-600">Duration</span>
										<span class="font-medium text-gray-900">{course.duration}</span>
									</div>
									<div class="flex justify-between items-center text-sm">
										<span class="text-gray-600">Difficulty</span>
										<span class="px-2 py-1 text-xs rounded-full {getDifficultyColor(course.difficulty)}">
											{course.difficulty}
										</span>
									</div>
									<div class="flex justify-between items-center text-sm">
										<span class="text-gray-600">Rating</span>
										<span class="font-medium text-gray-900">⭐ {course.rating} ({course.studentsEnrolled.toLocaleString()} students)</span>
									</div>
								</div>

								<!-- Progress Bar (for enrolled courses) -->
								{#if course.enrolled && course.progress > 0}
									<div class="mb-4">
										<div class="flex justify-between text-sm text-gray-600 mb-1">
											<span>Progress</span>
											<span>{course.progress}%</span>
										</div>
										<div class="bg-gray-200 rounded-full h-2">
											<div class="bg-primary rounded-full h-2 transition-all duration-500" style="width: {course.progress}%"></div>
										</div>
									</div>
								{/if}

								<!-- Course Actions -->
								<div class="flex justify-between items-center">
									<div class="text-lg font-bold text-primary">{course.price}</div>
									<div class="flex space-x-2">
										{#if course.enrolled}
											<button 
												on:click={() => goto(`/courses/${course.id}`)}
												class="primary-btn px-4 py-2 text-sm rounded-xl"
											>
												{course.progress > 0 ? 'Continue' : 'Start'} Learning
											</button>
										{:else}
											<button 
												on:click={() => enrollInCourse(course.id)}
												class="primary-btn px-4 py-2 text-sm rounded-xl"
											>
												Enroll Now
											</button>
										{/if}
										<button 
											on:click={() => goto(`/courses/${course.id}`)}
											class="secondary-btn px-4 py-2 text-sm rounded-xl"
										>
											View Details
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
		<LoadingSpinner />
	</div>
{/if}
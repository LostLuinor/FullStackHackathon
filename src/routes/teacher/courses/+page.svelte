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

	/** @type {any[]} */
	let courses = [];
	let loading = true;
	let error = null;
	let searchTerm = '';
	let filterStatus = 'all';
	let sortBy = 'recent';
	let showDeleteModal = false;
	let showEditModal = false;
	/** @type {any} */
	let courseToDelete = null;
	/** @type {any} */
	let courseToEdit = null;
	let deleting = false;
	let saving = false;

	// Filter and sort options
	const statusOptions = [
		{ value: 'all', label: 'All Courses' },
		{ value: 'active', label: 'Active' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'archived', label: 'Archived' }
	];

	const sortOptions = [
		{ value: 'recent', label: 'Most Recent' },
		{ value: 'title', label: 'Title A-Z' },
		{ value: 'students', label: 'Most Students' },
		{ value: 'rating', label: 'Highest Rating' },
		{ value: 'revenue', label: 'Highest Revenue' }
	];

	// Edit form data
	let editForm = {
		title: '',
		description: '',
		status: 'active',
		price: 0,
		category: ''
	};

	// Mock courses data
	const mockCourses = [
		{
			id: 1,
			title: 'Advanced React Development',
			description: 'Master advanced React concepts including hooks, context, and performance optimization.',
			thumbnail: '⚛️',
			studentsCount: 89,
			lessonsCount: 24,
			averageRating: 4.8,
			totalReviews: 67,
			revenue: 8900,
			price: 99.99,
			status: 'active',
			category: 'Web Development',
			createdAt: '2024-01-15T08:00:00Z',
			lastUpdated: '2024-03-10T14:30:00Z',
			isPublished: true,
			completionRate: 78.5,
			enrollmentTrend: '+12%'
		},
		{
			id: 2,
			title: 'Node.js Backend Mastery',
			description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
			thumbnail: '🟢',
			studentsCount: 76,
			lessonsCount: 18,
			averageRating: 4.6,
			totalReviews: 54,
			revenue: 7600,
			price: 89.99,
			status: 'active',
			category: 'Backend Development',
			createdAt: '2024-02-01T10:15:00Z',
			lastUpdated: '2024-03-08T16:45:00Z',
			isPublished: true,
			completionRate: 82.3,
			enrollmentTrend: '+8%'
		},
		{
			id: 3,
			title: 'Python Data Science',
			description: 'Comprehensive guide to data science using Python, pandas, and machine learning.',
			thumbnail: '🐍',
			studentsCount: 94,
			lessonsCount: 32,
			averageRating: 4.9,
			totalReviews: 78,
			revenue: 9400,
			price: 129.99,
			status: 'active',
			category: 'Data Science',
			createdAt: '2024-01-08T09:30:00Z',
			lastUpdated: '2024-03-12T11:20:00Z',
			isPublished: true,
			completionRate: 85.1,
			enrollmentTrend: '+15%'
		},
		{
			id: 4,
			title: 'Machine Learning Basics',
			description: 'Introduction to machine learning algorithms and practical implementations.',
			thumbnail: '🤖',
			studentsCount: 67,
			lessonsCount: 28,
			averageRating: 4.7,
			totalReviews: 45,
			revenue: 6700,
			price: 109.99,
			status: 'draft',
			category: 'Machine Learning',
			createdAt: '2024-03-01T14:00:00Z',
			lastUpdated: '2024-03-10T09:15:00Z',
			isPublished: false,
			completionRate: 0,
			enrollmentTrend: 'Not published'
		},
		{
			id: 5,
			title: 'Full Stack Web Development',
			description: 'Complete full stack development course covering frontend and backend technologies.',
			thumbnail: '🌐',
			studentsCount: 21,
			lessonsCount: 45,
			averageRating: 4.5,
			totalReviews: 18,
			revenue: 2100,
			price: 149.99,
			status: 'active',
			category: 'Web Development',
			createdAt: '2024-02-20T12:00:00Z',
			lastUpdated: '2024-03-12T13:30:00Z',
			isPublished: true,
			completionRate: 65.2,
			enrollmentTrend: '+5%'
		},
		{
			id: 6,
			title: 'DevOps Fundamentals',
			description: 'Learn DevOps practices including CI/CD, Docker, and cloud deployment.',
			thumbnail: '🔧',
			studentsCount: 43,
			lessonsCount: 20,
			averageRating: 4.4,
			totalReviews: 32,
			revenue: 4300,
			price: 79.99,
			status: 'active',
			category: 'DevOps',
			createdAt: '2024-01-25T15:45:00Z',
			lastUpdated: '2024-03-05T10:00:00Z',
			isPublished: true,
			completionRate: 71.8,
			enrollmentTrend: '+3%'
		},
		{
			id: 7,
			title: 'Advanced JavaScript Patterns',
			description: 'Deep dive into JavaScript design patterns and advanced programming techniques.',
			thumbnail: '🟨',
			studentsCount: 0,
			lessonsCount: 15,
			averageRating: 0,
			totalReviews: 0,
			revenue: 0,
			price: 69.99,
			status: 'archived',
			category: 'Programming',
			createdAt: '2023-12-15T08:30:00Z',
			lastUpdated: '2024-01-20T16:00:00Z',
			isPublished: false,
			completionRate: 0,
			enrollmentTrend: 'Archived'
		}
	];

	async function loadCourses() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// courses = await api.getTeacherCourses();

			// Use mock data for now
			await new Promise(resolve => setTimeout(resolve, 800));
			courses = [...mockCourses];
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	async function deleteCourse() {
		if (!courseToDelete) return;
		
		try {
			deleting = true;
			// Uncomment when backend is ready
			// await api.deleteTeacherCourse(courseToDelete.id);

			// Mock delete
			await new Promise(resolve => setTimeout(resolve, 1000));
			courses = courses.filter(course => course.id !== courseToDelete.id);
			
			showDeleteModal = false;
			courseToDelete = null;
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			deleting = false;
		}
	}

	async function saveCourse() {
		if (!courseToEdit) return;
		
		try {
			saving = true;
			// Uncomment when backend is ready
			// await api.updateTeacherCourse(courseToEdit.id, editForm);

			// Mock save
			await new Promise(resolve => setTimeout(resolve, 1000));
			const index = courses.findIndex(course => course.id === courseToEdit.id);
			if (index !== -1) {
				courses[index] = {
					...courses[index],
					...editForm,
					lastUpdated: new Date().toISOString()
				};
			}
			
			showEditModal = false;
			courseToEdit = null;
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			saving = false;
		}
	}

	function openDeleteModal(course) {
		courseToDelete = course;
		showDeleteModal = true;
	}

	function openEditModal(course) {
		courseToEdit = course;
		editForm = {
			title: course.title,
			description: course.description,
			status: course.status,
			price: course.price,
			category: course.category
		};
		showEditModal = true;
	}

	function closeModals() {
		showDeleteModal = false;
		showEditModal = false;
		courseToDelete = null;
		courseToEdit = null;
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

	function getStatusColor(status) {
		switch(status) {
			case 'active': return 'bg-green-100 text-green-800 border-green-300';
			case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'archived': return 'bg-gray-100 text-gray-800 border-gray-300';
			default: return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	}

	function getTrendColor(trend) {
		if (trend.startsWith('+')) return 'text-green-600';
		if (trend.startsWith('-')) return 'text-red-600';
		return 'text-gray-600';
	}

	// Computed filtered and sorted courses
	$: filteredCourses = courses.filter(course => {
		const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
							course.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
		return matchesSearch && matchesStatus;
	}).sort((a, b) => {
		switch(sortBy) {
			case 'title':
				return a.title.localeCompare(b.title);
			case 'students':
				return b.studentsCount - a.studentsCount;
			case 'rating':
				return b.averageRating - a.averageRating;
			case 'revenue':
				return b.revenue - a.revenue;
			case 'recent':
			default:
				return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
		}
	});

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadCourses();
		}
	});
</script>

<svelte:head>
	<title>Course Management - Teacher Dashboard</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
			<div class="text-center">
				<LoadingSpinner size="large" />
				<p class="mt-4 text-lg text-gray-600">Loading your courses...</p>
			</div>
		</div>
	{:else if error}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
			<div class="text-center">
				<div class="text-6xl mb-4">❌</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Courses</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<button on:click={() => goto('/teacher')} class="primary-btn px-6 py-3 rounded-xl">
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
								<button on:click={() => goto('/teacher')} class="hover:text-primary">
									Teacher Dashboard
								</button>
								<span>›</span>
								<span class="text-primary font-medium">Course Management</span>
							</nav>
							<h1 class="text-4xl font-bold text-gray-900">📚 Course Management</h1>
							<p class="text-gray-600 mt-2 text-lg">Manage your courses and track performance</p>
						</div>
						<button
							on:click={() => goto('/teacher/courses/create')}
							class="primary-btn px-6 py-3 rounded-xl"
						>
							➕ Create New Course
						</button>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<!-- Summary Stats -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
						<div class="text-2xl font-bold text-blue-600">{courses.length}</div>
						<div class="text-sm text-gray-600">Total Courses</div>
					</div>
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
						<div class="text-2xl font-bold text-green-600">{courses.filter(c => c.status === 'active').length}</div>
						<div class="text-sm text-gray-600">Active Courses</div>
					</div>
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
						<div class="text-2xl font-bold text-purple-600">{courses.reduce((sum, c) => sum + c.studentsCount, 0)}</div>
						<div class="text-sm text-gray-600">Total Students</div>
					</div>
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
						<div class="text-2xl font-bold text-orange-600">{formatCurrency(courses.reduce((sum, c) => sum + c.revenue, 0))}</div>
						<div class="text-sm text-gray-600">Total Revenue</div>
					</div>
				</div>

				<!-- Filters and Search -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
					<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
							<input
								bind:value={searchTerm}
								type="text"
								placeholder="Search by title or description..."
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
							<select
								bind:value={filterStatus}
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							>
								{#each statusOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
							<select
								bind:value={sortBy}
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							>
								{#each sortOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>
						<div class="flex items-end">
							<span class="text-sm text-gray-600">
								Showing {filteredCourses.length} of {courses.length} courses
							</span>
						</div>
					</div>
				</div>

				<!-- Courses List -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
					{#if filteredCourses.length === 0}
						<div class="p-12 text-center">
							<div class="text-6xl mb-4">📚</div>
							<h3 class="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
							<p class="text-gray-600">
								{searchTerm || filterStatus !== 'all' 
									? 'Try adjusting your search or filters'
									: 'Create your first course to get started'
								}
							</p>
						</div>
					{:else}
						<div class="divide-y divide-gray-200">
							{#each filteredCourses as course}
								<div class="p-6 hover:bg-gray-50/50 transition-colors">
									<div class="flex items-center space-x-6">
										<!-- Course Thumbnail -->
										<div class="flex-shrink-0">
											<div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
												{course.thumbnail}
											</div>
										</div>

										<!-- Course Info -->
										<div class="flex-1 min-w-0">
											<div class="flex items-start justify-between mb-2">
												<div>
													<h3 class="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
													<p class="text-sm text-gray-600 line-clamp-2">{course.description}</p>
												</div>
												<span class="inline-flex items-center px-3 py-1 text-xs rounded-full border {getStatusColor(course.status)}">
													{course.status.charAt(0).toUpperCase() + course.status.slice(1)}
												</span>
											</div>

											<div class="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
												<div>
													<span class="text-gray-500">Students:</span>
													<span class="font-medium">{course.studentsCount}</span>
												</div>
												<div>
													<span class="text-gray-500">Lessons:</span>
													<span class="font-medium">{course.lessonsCount}</span>
												</div>
												<div>
													<span class="text-gray-500">Rating:</span>
													<span class="font-medium">⭐ {course.averageRating > 0 ? course.averageRating : 'N/A'}</span>
												</div>
												<div>
													<span class="text-gray-500">Revenue:</span>
													<span class="font-medium text-green-600">{formatCurrency(course.revenue)}</span>
												</div>
												<div>
													<span class="text-gray-500">Completion:</span>
													<span class="font-medium">{course.completionRate > 0 ? `${course.completionRate}%` : 'N/A'}</span>
												</div>
												<div>
													<span class="text-gray-500">Trend:</span>
													<span class="font-medium {getTrendColor(course.enrollmentTrend)}">{course.enrollmentTrend}</span>
												</div>
											</div>

											<div class="flex items-center justify-between mt-4">
												<div class="text-xs text-gray-500">
													Created: {formatDate(course.createdAt)} • Updated: {formatDate(course.lastUpdated)}
												</div>
												<div class="flex space-x-2">
													<button 
														on:click={() => goto(`/teacher/courses/${course.id}/analytics`)}
														class="secondary-btn px-3 py-1 text-xs rounded-lg"
													>
														📊 Analytics
													</button>
													<button 
														on:click={() => goto(`/teacher/courses/edit/${course.id}`)}
														class="secondary-btn px-3 py-1 text-xs rounded-lg"
													>
														✏️ Edit
													</button>
													<button 
														on:click={() => openDeleteModal(course)}
														class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1 text-xs rounded-lg transition-colors"
													>
														🗑️ Delete
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Delete Modal -->
		{#if showDeleteModal && courseToDelete}
			<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
				<div class="bg-white rounded-2xl p-6 max-w-md w-full">
					<div class="text-center">
						<div class="text-4xl mb-4">⚠️</div>
						<h3 class="text-lg font-bold text-gray-900 mb-2">Delete Course</h3>
						<p class="text-gray-600 mb-6">
							Are you sure you want to delete "<strong>{courseToDelete.title}</strong>"? 
							This action cannot be undone and will affect {courseToDelete.studentsCount} enrolled students.
						</p>
						<div class="flex space-x-3">
							<button 
								on:click={closeModals}
								disabled={deleting}
								class="flex-1 secondary-btn px-4 py-3 rounded-xl disabled:opacity-50"
							>
								Cancel
							</button>
							<button 
								on:click={deleteCourse}
								disabled={deleting}
								class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl disabled:opacity-50 transition-colors"
							>
								{deleting ? 'Deleting...' : 'Delete Course'}
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Edit Modal -->
		{#if showEditModal && courseToEdit}
			<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
				<div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
					<h3 class="text-lg font-bold text-gray-900 mb-4">Edit Course</h3>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
							<input
								bind:value={editForm.title}
								type="text"
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
							<textarea
								bind:value={editForm.description}
								rows="3"
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
							></textarea>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
							<select
								bind:value={editForm.status}
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							>
								<option value="active">Active</option>
								<option value="draft">Draft</option>
								<option value="archived">Archived</option>
							</select>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
							<input
								bind:value={editForm.price}
								type="number"
								step="0.01"
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
							<input
								bind:value={editForm.category}
								type="text"
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
					</div>
					<div class="flex space-x-3 mt-6">
						<button 
							on:click={closeModals}
							disabled={saving}
							class="flex-1 secondary-btn px-4 py-3 rounded-xl disabled:opacity-50"
						>
							Cancel
						</button>
						<button 
							on:click={saveCourse}
							disabled={saving}
							class="flex-1 primary-btn px-4 py-3 rounded-xl disabled:opacity-50"
						>
							{saving ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
		<LoadingSpinner />
	</div>
{/if}
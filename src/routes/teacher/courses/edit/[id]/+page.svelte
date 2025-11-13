<script>
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth.js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	// Redirect if not authenticated or not a teacher
	$: if (!$auth.isAuthenticated && !$auth.isLoading) {
		goto('/login');
	}

	const courseId = $page.params.id;

	let loading = true;
	let saving = false;
	let error = null;
	let activeTab = 'details';
	let originalCourse = null;

	// Course form data
	let courseForm = {
		title: '',
		description: '',
		category: '',
		price: 0,
		duration: '',
		level: 'beginner',
		language: 'en',
		thumbnail: '',
		status: 'draft',
		tags: [],
		requirements: [],
		objectives: [],
		modules: []
	};

	// New items being added
	let newTag = '';
	let newRequirement = '';
	let newObjective = '';
	let newModule = {
		title: '',
		description: '',
		lessons: []
	};
	let newLesson = {
		title: '',
		type: 'video',
		duration: '',
		content: ''
	};

	// Available options
	const categories = [
		'Web Development',
		'Mobile Development', 
		'Data Science',
		'Machine Learning',
		'DevOps',
		'Cybersecurity',
		'Design',
		'Business',
		'Programming Languages',
		'Databases'
	];

	const levels = [
		{ value: 'beginner', label: 'Beginner' },
		{ value: 'intermediate', label: 'Intermediate' },
		{ value: 'advanced', label: 'Advanced' },
		{ value: 'expert', label: 'Expert' }
	];

	const languages = [
		{ value: 'en', label: 'English' },
		{ value: 'es', label: 'Spanish' },
		{ value: 'fr', label: 'French' },
		{ value: 'de', label: 'German' }
	];

	const lessonTypes = [
		{ value: 'video', label: '🎥 Video', icon: '🎥' },
		{ value: 'text', label: '📝 Article', icon: '📝' },
		{ value: 'quiz', label: '📊 Quiz', icon: '📊' },
		{ value: 'assignment', label: '📋 Assignment', icon: '📋' },
		{ value: 'live', label: '🔴 Live Session', icon: '🔴' }
	];

	const thumbnailOptions = [
		'⚛️', '🟢', '🐍', '🤖', '🌐', '🔧', '🟨', '🎨', 
		'📱', '💻', '🔒', '📊', '🎓', '💡', '🚀', '⭐'
	];

	onMount(async () => {
		try {
			loading = true;
			
			// Mock load course data
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Mock course data based on course ID
			const mockCourse = {
				id: courseId,
				title: 'Advanced React Development',
				description: 'Master advanced React concepts including hooks, context, performance optimization, and modern patterns.',
				category: 'Web Development',
				price: 99.99,
				level: 'advanced',
				language: 'en',
				thumbnail: '⚛️',
				status: 'active',
				tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
				requirements: [
					'Basic JavaScript knowledge',
					'Understanding of HTML/CSS',
					'Familiarity with ES6+ features'
				],
				objectives: [
					'Master React Hooks and custom hooks',
					'Implement performance optimizations',
					'Build reusable component libraries',
					'Handle complex state management'
				],
				modules: [
					{
						id: 1,
						title: 'Advanced Hooks',
						description: 'Deep dive into React Hooks',
						lessons: [
							{
								id: 1,
								title: 'useEffect Advanced Patterns',
								type: 'video',
								duration: '25',
								content: '',
								order: 1
							},
							{
								id: 2,
								title: 'Custom Hooks Development',
								type: 'video',
								duration: '30',
								content: '',
								order: 2
							}
						]
					},
					{
						id: 2,
						title: 'Performance Optimization',
						description: 'Optimize React applications',
						lessons: [
							{
								id: 3,
								title: 'React.memo and useMemo',
								type: 'video',
								duration: '20',
								content: '',
								order: 1
							}
						]
					}
				],
				createdAt: '2024-01-15T10:00:00Z',
				lastUpdated: '2024-01-20T14:30:00Z'
			};

			// Uncomment when backend is ready
			// const course = await api.getTeacherCourse(courseId);

			originalCourse = mockCourse;
			courseForm = { ...mockCourse };

		} catch (err) {
			error = /** @type {any} */(err).message || 'Failed to load course';
		} finally {
			loading = false;
		}
	});

	async function updateCourse() {
		try {
			saving = true;
			
			// Validate required fields
			if (!courseForm.title.trim()) {
				throw new Error('Course title is required');
			}
			if (!courseForm.description.trim()) {
				throw new Error('Course description is required');
			}
			if (!courseForm.category) {
				throw new Error('Course category is required');
			}

			// Prepare course data
			const courseData = {
				...courseForm,
				lastUpdated: new Date().toISOString()
			};

			// Uncomment when backend is ready
			// const result = await api.updateTeacherCourse(courseId, courseData);

			// Mock save
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			goto('/teacher/courses');
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			saving = false;
		}
	}

	function addTag() {
		if (newTag.trim() && !courseForm.tags.includes(newTag.trim())) {
			courseForm.tags = [...courseForm.tags, newTag.trim()];
			newTag = '';
		}
	}

	function removeTag(index) {
		courseForm.tags = courseForm.tags.filter((_, i) => i !== index);
	}

	function addRequirement() {
		if (newRequirement.trim()) {
			courseForm.requirements = [...courseForm.requirements, newRequirement.trim()];
			newRequirement = '';
		}
	}

	function removeRequirement(index) {
		courseForm.requirements = courseForm.requirements.filter((_, i) => i !== index);
	}

	function addObjective() {
		if (newObjective.trim()) {
			courseForm.objectives = [...courseForm.objectives, newObjective.trim()];
			newObjective = '';
		}
	}

	function removeObjective(index) {
		courseForm.objectives = courseForm.objectives.filter((_, i) => i !== index);
	}

	function addModule() {
		if (newModule.title.trim()) {
			courseForm.modules = [...courseForm.modules, {
				...newModule,
				id: Date.now(),
				lessons: [...newModule.lessons]
			}];
			newModule = { title: '', description: '', lessons: [] };
		}
	}

	function removeModule(index) {
		courseForm.modules = courseForm.modules.filter((_, i) => i !== index);
	}

	function addLesson(moduleIndex) {
		if (newLesson.title.trim()) {
			const updatedModules = [...courseForm.modules];
			updatedModules[moduleIndex].lessons.push({
				...newLesson,
				id: Date.now(),
				order: updatedModules[moduleIndex].lessons.length + 1
			});
			courseForm.modules = updatedModules;
			newLesson = { title: '', type: 'video', duration: '', content: '' };
		}
	}

	function removeLesson(moduleIndex, lessonIndex) {
		const updatedModules = [...courseForm.modules];
		updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
		courseForm.modules = updatedModules;
	}

	function getLessonTypeIcon(type) {
		const lessonType = lessonTypes.find(t => t.value === type);
		return lessonType ? lessonType.icon : '📝';
	}

	function moveModule(index, direction) {
		if (direction === 'up' && index > 0) {
			const modules = [...courseForm.modules];
			[modules[index], modules[index - 1]] = [modules[index - 1], modules[index]];
			courseForm.modules = modules;
		} else if (direction === 'down' && index < courseForm.modules.length - 1) {
			const modules = [...courseForm.modules];
			[modules[index], modules[index + 1]] = [modules[index + 1], modules[index]];
			courseForm.modules = modules;
		}
	}

	function calculateTotalDuration() {
		let totalMinutes = 0;
		courseForm.modules.forEach(module => {
			module.lessons.forEach(lesson => {
				if (lesson.duration) {
					const minutes = parseInt(lesson.duration);
					if (!isNaN(minutes)) totalMinutes += minutes;
				}
			});
		});
		return totalMinutes;
	}

	function formatDuration(minutes) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	}

	function resetForm() {
		if (originalCourse) {
			courseForm = { ...originalCourse };
			error = null;
		}
	}

	$: totalDuration = calculateTotalDuration();
	$: totalLessons = courseForm.modules.reduce((total, module) => total + module.lessons.length, 0);
	$: hasChanges = JSON.stringify(courseForm) !== JSON.stringify(originalCourse);
</script>

<svelte:head>
	<title>Edit Course - Teacher Dashboard</title>
</svelte:head>

{#if loading}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
		<LoadingSpinner />
	</div>
{:else if $auth.isAuthenticated}
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
							<button on:click={() => goto('/teacher/courses')} class="hover:text-primary">
								Course Management
							</button>
							<span>›</span>
							<span class="text-primary font-medium">Edit Course</span>
						</nav>
						<h1 class="text-4xl font-bold text-gray-900">📝 Edit Course</h1>
						<p class="text-gray-600 mt-2 text-lg">{courseForm.title}</p>
						{#if hasChanges}
							<p class="text-orange-600 mt-1 text-sm">⚠️ You have unsaved changes</p>
						{/if}
					</div>
					<div class="flex space-x-3">
						{#if hasChanges}
							<button 
								on:click={resetForm}
								class="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm"
							>
								Reset Changes
							</button>
						{/if}
						<button 
							on:click={() => goto('/teacher/courses')}
							class="secondary-btn px-6 py-3 rounded-xl"
						>
							Cancel
						</button>
						<button 
							on:click={updateCourse}
							disabled={saving || !hasChanges}
							class="primary-btn px-6 py-3 rounded-xl disabled:opacity-50"
						>
							{saving ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">
					{error}
				</div>
			{/if}

			<!-- Course Stats -->
			<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl mb-8">
				<div class="grid grid-cols-1 md:grid-cols-5 gap-6">
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">{courseForm.modules.length}</div>
						<div class="text-sm text-gray-600">Modules</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">{totalLessons}</div>
						<div class="text-sm text-gray-600">Lessons</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-600">{totalDuration > 0 ? formatDuration(totalDuration) : '0m'}</div>
						<div class="text-sm text-gray-600">Duration</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600">{courseForm.price > 0 ? `$${courseForm.price}` : 'Free'}</div>
						<div class="text-sm text-gray-600">Price</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold {
							courseForm.status === 'active' ? 'text-green-600' :
							courseForm.status === 'draft' ? 'text-yellow-600' : 'text-gray-600'
						}">
							{courseForm.status === 'active' ? '🟢' : courseForm.status === 'draft' ? '🟡' : '⚫'}
						</div>
						<div class="text-sm text-gray-600 capitalize">{courseForm.status}</div>
					</div>
				</div>
			</div>

			<!-- Tab Navigation -->
			<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl mb-8 overflow-hidden">
				<div class="flex border-b border-gray-200">
					<button
						on:click={() => activeTab = 'details'}
						class="flex-1 px-6 py-4 text-center font-medium transition-colors {
							activeTab === 'details' 
								? 'bg-primary text-white' 
								: 'text-gray-600 hover:text-primary hover:bg-gray-50'
						}"
					>
						📝 Course Details
					</button>
					<button
						on:click={() => activeTab = 'content'}
						class="flex-1 px-6 py-4 text-center font-medium transition-colors {
							activeTab === 'content' 
								? 'bg-primary text-white' 
								: 'text-gray-600 hover:text-primary hover:bg-gray-50'
						}"
					>
						📚 Course Content
					</button>
					<button
						on:click={() => activeTab = 'settings'}
						class="flex-1 px-6 py-4 text-center font-medium transition-colors {
							activeTab === 'settings' 
								? 'bg-primary text-white' 
								: 'text-gray-600 hover:text-primary hover:bg-gray-50'
						}"
					>
						⚙️ Settings
					</button>
				</div>

				<!-- Tab Content (same as create page) -->
				<div class="p-8">
					{#if activeTab === 'details'}
						<div class="space-y-8">
							<!-- Basic Information -->
							<div>
								<h3 class="text-xl font-bold text-gray-900 mb-6">Basic Information</h3>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div class="md:col-span-2">
										<label class="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
										<input
											bind:value={courseForm.title}
											type="text"
											placeholder="Enter course title..."
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										/>
									</div>
									<div class="md:col-span-2">
										<label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
										<textarea
											bind:value={courseForm.description}
											rows="4"
											placeholder="Describe what students will learn..."
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
										></textarea>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
										<select
											bind:value={courseForm.category}
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										>
											<option value="">Select a category</option>
											{#each categories as category}
												<option value={category}>{category}</option>
											{/each}
										</select>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
										<input
											bind:value={courseForm.price}
											type="number"
											step="0.01"
											min="0"
											placeholder="0.00"
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
										<select
											bind:value={courseForm.level}
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										>
											{#each levels as level}
												<option value={level.value}>{level.label}</option>
											{/each}
										</select>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
										<select
											bind:value={courseForm.language}
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										>
											{#each languages as language}
												<option value={language.value}>{language.label}</option>
											{/each}
										</select>
									</div>
								</div>
							</div>

							<!-- Thumbnail Selection -->
							<div>
								<h3 class="text-xl font-bold text-gray-900 mb-6">Course Thumbnail</h3>
								<div class="grid grid-cols-8 gap-4">
									{#each thumbnailOptions as thumbnail}
										<button
											on:click={() => courseForm.thumbnail = thumbnail}
											class="w-12 h-12 text-2xl border-2 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors {
												courseForm.thumbnail === thumbnail 
													? 'border-primary bg-primary/10' 
													: 'border-gray-200'
											}"
										>
											{thumbnail}
										</button>
									{/each}
								</div>
							</div>

							<!-- Tags -->
							<div>
								<h3 class="text-xl font-bold text-gray-900 mb-6">Tags</h3>
								<div class="flex flex-wrap gap-2 mb-4">
									{#each courseForm.tags as tag, index}
										<span class="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
											<span>{tag}</span>
											<button on:click={() => removeTag(index)} class="text-blue-600 hover:text-blue-800">
												×
											</button>
										</span>
									{/each}
								</div>
								<div class="flex space-x-2">
									<input
										bind:value={newTag}
										type="text"
										placeholder="Add a tag..."
										class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										on:keypress={(e) => e.key === 'Enter' && addTag()}
									/>
									<button on:click={addTag} class="secondary-btn px-4 py-3 rounded-xl">
										Add
									</button>
								</div>
							</div>

							<!-- Requirements -->
							<div>
								<h3 class="text-xl font-bold text-gray-900 mb-6">Prerequisites</h3>
								<div class="space-y-2 mb-4">
									{#each courseForm.requirements as requirement, index}
										<div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
											<span class="text-sm text-gray-700">• {requirement}</span>
											<button on:click={() => removeRequirement(index)} class="text-red-600 hover:text-red-800 text-sm">
												Remove
											</button>
										</div>
									{/each}
								</div>
								<div class="flex space-x-2">
									<input
										bind:value={newRequirement}
										type="text"
										placeholder="Add a prerequisite..."
										class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										on:keypress={(e) => e.key === 'Enter' && addRequirement()}
									/>
									<button on:click={addRequirement} class="secondary-btn px-4 py-3 rounded-xl">
										Add
									</button>
								</div>
							</div>

							<!-- Learning Objectives -->
							<div>
								<h3 class="text-xl font-bold text-gray-900 mb-6">Learning Objectives</h3>
								<div class="space-y-2 mb-4">
									{#each courseForm.objectives as objective, index}
										<div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
											<span class="text-sm text-gray-700">✓ {objective}</span>
											<button on:click={() => removeObjective(index)} class="text-red-600 hover:text-red-800 text-sm">
												Remove
											</button>
										</div>
									{/each}
								</div>
								<div class="flex space-x-2">
									<input
										bind:value={newObjective}
										type="text"
										placeholder="What will students learn?"
										class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										on:keypress={(e) => e.key === 'Enter' && addObjective()}
									/>
									<button on:click={addObjective} class="secondary-btn px-4 py-3 rounded-xl">
										Add
									</button>
								</div>
							</div>
						</div>

					{:else if activeTab === 'content'}
						<div class="space-y-8">
							<div class="flex items-center justify-between">
								<h3 class="text-xl font-bold text-gray-900">Course Modules</h3>
								<span class="text-sm text-gray-600">
									{courseForm.modules.length} modules • {totalLessons} lessons
								</span>
							</div>

							<!-- Modules List -->
							<div class="space-y-6">
								{#each courseForm.modules as module, moduleIndex}
									<div class="bg-white border border-gray-200 rounded-2xl p-6">
										<div class="flex items-start justify-between mb-4">
											<div class="flex-1">
												<h4 class="text-lg font-semibold text-gray-900">{module.title}</h4>
												<p class="text-sm text-gray-600 mt-1">{module.description}</p>
												<div class="text-xs text-gray-500 mt-2">
													{module.lessons.length} lessons
												</div>
											</div>
											<div class="flex space-x-2">
												<button
													on:click={() => moveModule(moduleIndex, 'up')}
													disabled={moduleIndex === 0}
													class="secondary-btn px-3 py-1 text-xs rounded-lg disabled:opacity-50"
												>
													↑
												</button>
												<button
													on:click={() => moveModule(moduleIndex, 'down')}
													disabled={moduleIndex === courseForm.modules.length - 1}
													class="secondary-btn px-3 py-1 text-xs rounded-lg disabled:opacity-50"
												>
													↓
												</button>
												<button
													on:click={() => removeModule(moduleIndex)}
													class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1 text-xs rounded-lg transition-colors"
												>
													Remove
												</button>
											</div>
										</div>

										<!-- Lessons in Module -->
										{#if module.lessons.length > 0}
											<div class="space-y-2 mb-4">
												{#each module.lessons as lesson, lessonIndex}
													<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
														<div class="flex items-center space-x-3">
															<span class="text-lg">{getLessonTypeIcon(lesson.type)}</span>
															<div>
																<span class="text-sm font-medium text-gray-900">{lesson.title}</span>
																{#if lesson.duration}
																	<span class="text-xs text-gray-500 ml-2">({lesson.duration} min)</span>
																{/if}
															</div>
														</div>
														<button
															on:click={() => removeLesson(moduleIndex, lessonIndex)}
															class="text-red-600 hover:text-red-800 text-xs"
														>
															Remove
														</button>
													</div>
												{/each}
											</div>
										{/if}

										<!-- Add Lesson Form -->
										<div class="border-t border-gray-200 pt-4">
											<h5 class="text-sm font-medium text-gray-900 mb-3">Add Lesson</h5>
											<div class="grid grid-cols-1 md:grid-cols-4 gap-3">
												<input
													bind:value={newLesson.title}
													type="text"
													placeholder="Lesson title..."
													class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
												/>
												<select
													bind:value={newLesson.type}
													class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
												>
													{#each lessonTypes as type}
														<option value={type.value}>{type.label}</option>
													{/each}
												</select>
												<input
													bind:value={newLesson.duration}
													type="number"
													placeholder="Duration (min)"
													class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
												/>
												<button
													on:click={() => addLesson(moduleIndex)}
													class="secondary-btn px-3 py-2 rounded-lg text-sm"
												>
													Add Lesson
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>

							<!-- Add Module Form -->
							<div class="bg-gray-50 border border-gray-200 rounded-2xl p-6">
								<h4 class="text-lg font-semibold text-gray-900 mb-4">Add New Module</h4>
								<div class="space-y-4">
									<input
										bind:value={newModule.title}
										type="text"
										placeholder="Module title..."
										class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									/>
									<input
										bind:value={newModule.description}
										type="text"
										placeholder="Module description..."
										class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									/>
									<button on:click={addModule} class="primary-btn px-6 py-3 rounded-xl">
										Add Module
									</button>
								</div>
							</div>
						</div>

					{:else if activeTab === 'settings'}
						<div class="space-y-8">
							<div>
								<h3 class="text-xl font-bold text-gray-900 mb-6">Publication Settings</h3>
								<div class="space-y-4">
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
										<select
											bind:value={courseForm.status}
											class="w-full md:w-64 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										>
											<option value="draft">Draft</option>
											<option value="active">Published</option>
											<option value="archived">Archived</option>
										</select>
									</div>
									
									{#if originalCourse}
										<div class="pt-4 border-t border-gray-200">
											<h4 class="text-lg font-medium text-gray-900 mb-4">Course Information</h4>
											<div class="space-y-2 text-sm text-gray-600">
												<div>Created: {new Date(originalCourse.createdAt).toLocaleDateString()}</div>
												<div>Last Updated: {new Date(originalCourse.lastUpdated).toLocaleDateString()}</div>
												<div>Course ID: {courseId}</div>
											</div>
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
		<LoadingSpinner />
	</div>
{/if}
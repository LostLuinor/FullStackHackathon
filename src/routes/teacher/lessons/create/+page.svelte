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

	let saving = false;
	let error = null;
	let uploadProgress = {
		video: 0,
		document: 0
	};

	// Form data
	let lessonForm = {
		title: '',
		summary: '',
		tags: [],
		videoFile: null,
		videoUrl: '',
		documentFile: null,
		documentUrl: '',
		type: 'video', // video, document, mixed
		duration: '',
		courseId: '',
		moduleId: ''
	};

	let newTag = '';
	let dragOver = false;

	// Available options
	const lessonTypes = [
		{ value: 'video', label: '🎥 Video Lesson', description: 'Upload a video file for this lesson' },
		{ value: 'document', label: '📄 Document/PDF', description: 'Upload PDF notes or documents' },
		{ value: 'mixed', label: '📚 Mixed Content', description: 'Include both video and documents' }
	];

	const tagSuggestions = [
		'JavaScript', 'React', 'Node.js', 'Python', 'HTML', 'CSS', 
		'Backend', 'Frontend', 'Database', 'API', 'Authentication',
		'Security', 'Performance', 'Testing', 'DevOps', 'Git'
	];

	async function savLesson() {
		try {
			saving = true;
			error = null;
			
			// Validate required fields
			if (!lessonForm.title.trim()) {
				throw new Error('Lesson title is required');
			}
			if (!lessonForm.summary.trim()) {
				throw new Error('Lesson summary is required');
			}
			if (lessonForm.type === 'video' || lessonForm.type === 'mixed') {
				if (!lessonForm.videoFile && !lessonForm.videoUrl.trim()) {
					throw new Error('Video file or URL is required for video lessons');
				}
			}
			if (lessonForm.type === 'document' || lessonForm.type === 'mixed') {
				if (!lessonForm.documentFile && !lessonForm.documentUrl.trim()) {
					throw new Error('Document file or URL is required for document lessons');
				}
			}

			// Create FormData for file uploads
			const formData = new FormData();
			formData.append('title', lessonForm.title);
			formData.append('summary', lessonForm.summary);
			formData.append('type', lessonForm.type);
			formData.append('tags', JSON.stringify(lessonForm.tags));
			
			if (lessonForm.videoFile) {
				formData.append('video', lessonForm.videoFile);
			}
			if (lessonForm.videoUrl) {
				formData.append('videoUrl', lessonForm.videoUrl);
			}
			if (lessonForm.documentFile) {
				formData.append('document', lessonForm.documentFile);
			}
			if (lessonForm.documentUrl) {
				formData.append('documentUrl', lessonForm.documentUrl);
			}
			if (lessonForm.duration) {
				formData.append('duration', lessonForm.duration);
			}
			if (lessonForm.courseId) {
				formData.append('courseId', lessonForm.courseId);
			}
			if (lessonForm.moduleId) {
				formData.append('moduleId', lessonForm.moduleId);
			}

			// Simulate file upload progress
			if (lessonForm.videoFile || lessonForm.documentFile) {
				for (let i = 0; i <= 100; i += 10) {
					if (lessonForm.videoFile) uploadProgress.video = i;
					if (lessonForm.documentFile) uploadProgress.document = i;
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			}

			// Uncomment when backend is ready
			// const result = await api.createTeacherLesson(formData);

			// Mock save
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			goto('/teacher/courses');
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			saving = false;
			uploadProgress = { video: 0, document: 0 };
		}
	}

	function handleFileUpload(event, type) {
		const file = event.target.files[0];
		if (file) {
			if (type === 'video') {
				// Validate video file
				const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
				if (!validVideoTypes.includes(file.type)) {
					error = 'Please upload a valid video file (MP4, WebM, OGG, AVI, MOV)';
					return;
				}
				if (file.size > 500 * 1024 * 1024) { // 500MB limit
					error = 'Video file size must be less than 500MB';
					return;
				}
				lessonForm.videoFile = file;
				lessonForm.videoUrl = ''; // Clear URL if file uploaded
			} else if (type === 'document') {
				// Validate document file
				const validDocTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
				if (!validDocTypes.includes(file.type)) {
					error = 'Please upload a valid document file (PDF, TXT, DOC, DOCX)';
					return;
				}
				if (file.size > 50 * 1024 * 1024) { // 50MB limit
					error = 'Document file size must be less than 50MB';
					return;
				}
				lessonForm.documentFile = file;
				lessonForm.documentUrl = ''; // Clear URL if file uploaded
			}
			error = null;
		}
	}

	function handleDragOver(event, type) {
		event.preventDefault();
		dragOver = type;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleDrop(event, type) {
		event.preventDefault();
		dragOver = false;
		const file = event.dataTransfer.files[0];
		if (file) {
			// Create a fake event object for handleFileUpload
			const fakeEvent = {
				target: {
					files: [file]
				}
			};
			handleFileUpload(fakeEvent, type);
		}
	}

	function addTag() {
		if (newTag.trim() && !lessonForm.tags.includes(newTag.trim())) {
			lessonForm.tags = [...lessonForm.tags, newTag.trim()];
			newTag = '';
		}
	}

	function addSuggestedTag(tag) {
		if (!lessonForm.tags.includes(tag)) {
			lessonForm.tags = [...lessonForm.tags, tag];
		}
	}

	function removeTag(index) {
		lessonForm.tags = lessonForm.tags.filter((_, i) => i !== index);
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function calculateVideoDuration(file) {
		return new Promise((resolve) => {
			const video = document.createElement('video');
			video.preload = 'metadata';
			video.onloadedmetadata = function() {
				resolve(Math.round(video.duration / 60)); // Convert to minutes
			};
			video.src = URL.createObjectURL(file);
		});
	}

	async function onVideoFileChange(event) {
		handleFileUpload(event, 'video');
		if (lessonForm.videoFile) {
			try {
				const duration = await calculateVideoDuration(lessonForm.videoFile);
				lessonForm.duration = duration.toString();
			} catch (err) {
				console.log('Could not calculate video duration');
			}
		}
	}
</script>

<svelte:head>
	<title>Create Lesson - Teacher Dashboard</title>
</svelte:head>

{#if $auth.isAuthenticated}
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
							<span class="text-primary font-medium">Create Lesson</span>
						</nav>
						<h1 class="text-4xl font-bold text-gray-900">🎥 Create New Lesson</h1>
						<p class="text-gray-600 mt-2 text-lg">Upload course content and materials</p>
					</div>
					<div class="flex space-x-3">
						<button 
							on:click={() => goto('/teacher/courses')}
							class="secondary-btn px-6 py-3 rounded-xl"
						>
							Cancel
						</button>
						<button 
							on:click={savLesson}
							disabled={saving}
							class="primary-btn px-6 py-3 rounded-xl disabled:opacity-50"
						>
							{saving ? 'Creating...' : 'Create Lesson'}
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">
					{error}
				</div>
			{/if}

			<div class="space-y-8">
				<!-- Basic Information -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
					<h2 class="text-2xl font-bold text-gray-900 mb-6">📝 Lesson Details</h2>
					
					<div class="space-y-6">
						<!-- Lesson Title -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
							<input
								bind:value={lessonForm.title}
								type="text"
								placeholder="Enter lesson title..."
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>

						<!-- Lesson Type -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-3">Lesson Type *</label>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								{#each lessonTypes as type}
									<label class="relative cursor-pointer">
										<input
											type="radio"
											bind:group={lessonForm.type}
											value={type.value}
											class="sr-only"
										/>
										<div class="border-2 rounded-xl p-4 transition-all {
											lessonForm.type === type.value 
												? 'border-primary bg-primary/10' 
												: 'border-gray-200 hover:border-gray-300'
										}">
											<div class="text-lg mb-1">{type.label}</div>
											<div class="text-xs text-gray-600">{type.description}</div>
										</div>
									</label>
								{/each}
							</div>
						</div>

						<!-- Duration -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
								<input
									bind:value={lessonForm.duration}
									type="number"
									min="1"
									placeholder="e.g., 15"
									class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
							</div>
						</div>

						<!-- Summary -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Lesson Summary *</label>
							<textarea
								bind:value={lessonForm.summary}
								rows="4"
								placeholder="Provide a brief summary of what students will learn in this lesson..."
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
							></textarea>
						</div>
					</div>
				</div>

				<!-- Content Upload -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
					<h2 class="text-2xl font-bold text-gray-900 mb-6">📤 Upload Content</h2>

					<!-- Video Upload Section -->
					{#if lessonForm.type === 'video' || lessonForm.type === 'mixed'}
						<div class="space-y-6">
							<h3 class="text-lg font-semibold text-gray-900">🎥 Video Content</h3>
							
							<!-- File Upload -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-3">Upload Video File</label>
								<div
									class="border-2 border-dashed rounded-xl p-8 text-center transition-colors {
										dragOver === 'video' 
											? 'border-primary bg-primary/10' 
											: 'border-gray-300 hover:border-gray-400'
									}"
									on:dragover|preventDefault={(e) => handleDragOver(e, 'video')}
									on:dragleave={handleDragLeave}
									on:drop|preventDefault={(e) => handleDrop(e, 'video')}
								>
									{#if lessonForm.videoFile}
										<div class="space-y-2">
											<div class="text-green-600 text-2xl">✓</div>
											<div class="text-sm font-medium text-gray-900">{lessonForm.videoFile.name}</div>
											<div class="text-xs text-gray-600">{formatFileSize(lessonForm.videoFile.size)}</div>
											{#if uploadProgress.video > 0 && uploadProgress.video < 100}
												<div class="w-full bg-gray-200 rounded-full h-2">
													<div class="bg-primary h-2 rounded-full" style="width: {uploadProgress.video}%"></div>
												</div>
												<div class="text-xs text-gray-600">{uploadProgress.video}% uploaded</div>
											{/if}
										</div>
									{:else}
										<div class="space-y-2">
											<div class="text-4xl text-gray-400">🎥</div>
											<div class="text-sm text-gray-600">Drag and drop your video file here, or</div>
										</div>
									{/if}
									<input
										type="file"
										accept="video/*"
										on:change={onVideoFileChange}
										class="hidden"
										id="video-upload"
									/>
									<label for="video-upload" class="inline-block mt-2 cursor-pointer secondary-btn px-4 py-2 rounded-lg text-sm">
										Choose File
									</label>
								</div>
								<div class="text-xs text-gray-500 mt-2">
									Supported formats: MP4, WebM, OGG, AVI, MOV (Max: 500MB)
								</div>
							</div>

							<!-- Video URL Alternative -->
							<div class="text-center text-gray-500 text-sm">OR</div>
							
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
								<input
									bind:value={lessonForm.videoUrl}
									type="url"
									placeholder="https://www.youtube.com/watch?v=..."
									class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
								<div class="text-xs text-gray-500 mt-2">
									YouTube, Vimeo, or direct video URL
								</div>
							</div>
						</div>
					{/if}

					<!-- Document Upload Section -->
					{#if lessonForm.type === 'document' || lessonForm.type === 'mixed'}
						<div class="space-y-6 {lessonForm.type === 'mixed' ? 'mt-8 pt-8 border-t border-gray-200' : ''}">
							<h3 class="text-lg font-semibold text-gray-900">📄 Document/PDF Content</h3>
							
							<!-- Document Upload -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-3">Upload Document/PDF</label>
								<div
									class="border-2 border-dashed rounded-xl p-8 text-center transition-colors {
										dragOver === 'document' 
											? 'border-primary bg-primary/10' 
											: 'border-gray-300 hover:border-gray-400'
									}"
									on:dragover|preventDefault={(e) => handleDragOver(e, 'document')}
									on:dragleave={handleDragLeave}
									on:drop|preventDefault={(e) => handleDrop(e, 'document')}
								>
									{#if lessonForm.documentFile}
										<div class="space-y-2">
											<div class="text-green-600 text-2xl">✓</div>
											<div class="text-sm font-medium text-gray-900">{lessonForm.documentFile.name}</div>
											<div class="text-xs text-gray-600">{formatFileSize(lessonForm.documentFile.size)}</div>
											{#if uploadProgress.document > 0 && uploadProgress.document < 100}
												<div class="w-full bg-gray-200 rounded-full h-2">
													<div class="bg-primary h-2 rounded-full" style="width: {uploadProgress.document}%"></div>
												</div>
												<div class="text-xs text-gray-600">{uploadProgress.document}% uploaded</div>
											{/if}
										</div>
									{:else}
										<div class="space-y-2">
											<div class="text-4xl text-gray-400">📄</div>
											<div class="text-sm text-gray-600">Drag and drop your document here, or</div>
										</div>
									{/if}
									<input
										type="file"
										accept=".pdf,.doc,.docx,.txt"
										on:change={(e) => handleFileUpload(e, 'document')}
										class="hidden"
										id="document-upload"
									/>
									<label for="document-upload" class="inline-block mt-2 cursor-pointer secondary-btn px-4 py-2 rounded-lg text-sm">
										Choose File
									</label>
								</div>
								<div class="text-xs text-gray-500 mt-2">
									Supported formats: PDF, DOC, DOCX, TXT (Max: 50MB)
								</div>
							</div>

							<!-- Document URL Alternative -->
							<div class="text-center text-gray-500 text-sm">OR</div>
							
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Document URL</label>
								<input
									bind:value={lessonForm.documentUrl}
									type="url"
									placeholder="https://example.com/document.pdf"
									class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
								<div class="text-xs text-gray-500 mt-2">
									Direct link to PDF or document
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Tags Section -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
					<h2 class="text-2xl font-bold text-gray-900 mb-6">🏷️ Tags (for AI)</h2>
					<p class="text-gray-600 mb-4">Add tags to help AI understand and categorize your lesson content for better recommendations.</p>

					<!-- Current Tags -->
					{#if lessonForm.tags.length > 0}
						<div class="flex flex-wrap gap-2 mb-4">
							{#each lessonForm.tags as tag, index}
								<span class="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
									<span>{tag}</span>
									<button on:click={() => removeTag(index)} class="text-blue-600 hover:text-blue-800">
										×
									</button>
								</span>
							{/each}
						</div>
					{/if}

					<!-- Add Tag -->
					<div class="flex space-x-2 mb-4">
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

					<!-- Suggested Tags -->
					<div>
						<div class="text-sm font-medium text-gray-700 mb-2">Suggested Tags:</div>
						<div class="flex flex-wrap gap-2">
							{#each tagSuggestions as tag}
								{#if !lessonForm.tags.includes(tag)}
									<button
										on:click={() => addSuggestedTag(tag)}
										class="px-3 py-1 text-xs border border-gray-200 rounded-full hover:bg-gray-50 text-gray-700 transition-colors"
									>
										+ {tag}
									</button>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
		<LoadingSpinner />
	</div>
{/if}
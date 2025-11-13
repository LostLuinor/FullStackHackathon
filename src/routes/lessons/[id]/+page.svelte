<script>git </script>
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth.js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	// Redirect if not authenticated
	$: if (!$auth.isAuthenticated && !$auth.isLoading) {
		goto('/login');
	}

	/** @type {any} */
	let lesson = null;
	let loading = true;
	let error = null;
	let showAITutor = false;
	let aiQuestion = '';
	let aiResponse = '';
	let aiLoading = false;

	// Get lesson ID from URL
	$: lessonId = $page.params.id;

	// Mock lesson data for testing
	let mockLesson = {
		id: 1,
		title: "Introduction to Variables and Data Types",
		description: "Learn about different data types in programming and how to work with variables effectively.",
		courseId: 1,
		courseName: "Python for Data Science",
		instructor: "Dr. Lisa Wang",
		duration: "45 minutes",
		type: "video", // "video", "pdf", "text"
		videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video
		pdfUrl: null,
		content: `
# Introduction to Variables and Data Types

In this lesson, we'll explore the fundamental concepts of variables and data types in programming.

## What are Variables?
Variables are containers for storing data values. In Python, variables are created when you assign a value to them.

## Common Data Types:
- **Integer (int)**: Whole numbers like 5, -3, 100
- **Float**: Decimal numbers like 3.14, -0.5, 2.0
- **String (str)**: Text data like "Hello", 'Python', "123"
- **Boolean (bool)**: True or False values

## Examples:
\`\`\`python
# Integer variable
age = 25

# Float variable
price = 19.99

# String variable
name = "Alice"

# Boolean variable
is_student = True
\`\`\`

## Best Practices:
1. Use descriptive variable names
2. Follow naming conventions (snake_case in Python)
3. Initialize variables before using them
4. Choose appropriate data types for your data
		`,
		notes: [
			"Variables are fundamental building blocks in programming",
			"Python is dynamically typed - you don't need to declare variable types",
			"Variable names should be descriptive and follow conventions",
			"Understanding data types helps prevent errors in your code"
		],
		attachments: [
			{
				id: 1,
				name: "Variables_Cheatsheet.pdf",
				size: "2.1 MB",
				url: "/attachments/variables-cheatsheet.pdf"
			},
			{
				id: 2,
				name: "Code_Examples.py",
				size: "1.5 KB",
				url: "/attachments/code-examples.py"
			},
			{
				id: 3,
				name: "Practice_Exercises.pdf",
				size: "854 KB",
				url: "/attachments/practice-exercises.pdf"
			}
		],
		nextLessonId: 2,
		nextLessonTitle: "Working with Lists and Dictionaries",
		progress: 0
	};

	async function loadLesson() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// lesson = await api.getLesson(lessonId);

			// Use mock data for now
			lesson = mockLesson;
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	async function askAITutor() {
		if (!aiQuestion.trim()) return;
		
		try {
			aiLoading = true;
			aiResponse = '';
			
			// Uncomment when backend is ready
			// const response = await api.askAITutor(aiQuestion, {
			//     lessonId: lesson.id,
			//     lessonTitle: lesson.title,
			//     lessonContent: lesson.content
			// });
			// aiResponse = response.answer;

			// Mock AI response for now
			await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
			aiResponse = `Based on the lesson about "${lesson.title}", here's my response to your question:

**${aiQuestion}**

Great question! In this lesson, we covered variables and data types. ${
				aiQuestion.toLowerCase().includes('variable') 
					? 'Variables are containers that store data values. In Python, you create a variable simply by assigning a value to it using the = operator.' 
					: aiQuestion.toLowerCase().includes('data type')
					? 'Data types define what kind of data a variable can hold. Python has several built-in data types including integers (int), floating-point numbers (float), strings (str), and booleans (bool).'
					: 'This concept is fundamental to programming. Let me know if you need clarification on any specific part of the lesson!'
			}

Would you like me to explain any other concepts from this lesson?`;
			
		} catch (err) {
			aiResponse = 'Sorry, I encountered an error while processing your question. Please try again.';
		} finally {
			aiLoading = false;
		}
	}

	function downloadAttachment(attachment) {
		// In a real app, this would handle the download
		console.log(`Downloading: ${attachment.name}`);
		// window.open(attachment.url, '_blank');
		alert(`Download started: ${attachment.name}`);
	}

	function goToNextLesson() {
		if (lesson?.nextLessonId) {
			goto(`/lessons/${lesson.nextLessonId}`);
		}
	}

	function formatFileSize(bytes) {
		const sizes = ['B', 'KB', 'MB', 'GB'];
		if (bytes === 0) return '0 B';
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
	}

	onMount(() => {
		if ($auth.isAuthenticated && lessonId) {
			loadLesson();
		}
	});
</script>

<svelte:head>
	<title>
		{lesson ? `${lesson.title} - Lesson` : 'Lesson'} - E-Learning Platform
	</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<LoadingSpinner size="large" />
		</div>
	{:else if error}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
			<div class="text-center">
				<div class="text-6xl mb-4">❌</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Lesson</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<button on:click={() => goto('/courses')} class="primary-btn px-6 py-3 rounded-xl">
					← Back to Courses
				</button>
			</div>
		</div>
	{:else if lesson}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<!-- Header -->
			<div class="bg-white/70 backdrop-blur-xl border-b border-gray-200/20">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<nav class="flex items-center space-x-2 text-sm text-gray-600 mb-2">
								<button on:click={() => goto('/courses')} class="hover:text-primary">
									Courses
								</button>
								<span>›</span>
								<button on:click={() => goto(`/courses/${lesson.courseId}`)} class="hover:text-primary">
									{lesson.courseName}
								</button>
								<span>›</span>
								<span class="text-primary font-medium">Lesson</span>
							</nav>
							<h1 class="text-3xl font-bold text-gray-900">{lesson.title}</h1>
							<p class="text-gray-600 mt-1">by {lesson.instructor} • {lesson.duration}</p>
						</div>
						<button on:click={() => goto(`/courses/${lesson.courseId}`)} class="secondary-btn px-6 py-3 rounded-xl">
							← Back to Course
						</button>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Main Content -->
					<div class="lg:col-span-2 space-y-8">
						<!-- Video/PDF Viewer -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
							{#if lesson.type === 'video' && lesson.videoUrl}
								<div class="aspect-video">
									<video 
										controls 
										class="w-full h-full object-cover"
										poster="https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Video+Lesson"
									>
										<source src={lesson.videoUrl} type="video/mp4">
										Your browser does not support the video tag.
									</video>
								</div>
							{:else if lesson.type === 'pdf' && lesson.pdfUrl}
								<div class="aspect-[4/5] bg-gray-100">
									<iframe 
										src={lesson.pdfUrl} 
										class="w-full h-full border-0"
										title="Lesson PDF"
									>
										Your browser does not support PDFs. 
										<a href={lesson.pdfUrl} target="_blank">Download the PDF</a>
									</iframe>
								</div>
							{:else}
								<div class="p-8">
									<div class="flex items-center justify-center h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
										<div class="text-center">
											<div class="text-6xl mb-4">📚</div>
											<h3 class="text-xl font-semibold text-gray-800">Text-based Lesson</h3>
											<p class="text-gray-600">Content is displayed in the notes section below</p>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Lesson Notes -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
							<h2 class="text-2xl font-bold text-gray-900 mb-6">📝 Lesson Notes</h2>
							
							{#if lesson.content}
								<div class="prose prose-lg max-w-none">
									<!-- Render markdown-like content -->
									{@html lesson.content
										.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-4">$1</h1>')
										.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-gray-800 mb-3 mt-6">$1</h2>')
										.replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium text-gray-700 mb-2 mt-4">$1</h3>')
										.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
										.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
										.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
										.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
										.replace(/\n\n/g, '</p><p class="mb-4">')
										.replace(/\n/g, '<br>')
									}
								</div>
							{/if}

							{#if lesson.notes && lesson.notes.length > 0}
								<div class="mt-8 pt-6 border-t border-gray-200">
									<h3 class="text-lg font-semibold text-gray-800 mb-4">Key Points:</h3>
									<ul class="space-y-2">
										{#each lesson.notes as note}
											<li class="flex items-start space-x-2">
												<span class="text-blue-500 mt-1">•</span>
												<span class="text-gray-700">{note}</span>
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					</div>

					<!-- Sidebar -->
					<div class="space-y-6">
						<!-- AI Tutor Assistance -->
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
							<div class="flex items-center space-x-3 mb-4">
								<div class="text-2xl">🤖</div>
								<h3 class="text-lg font-bold text-gray-900">AI Tutor</h3>
							</div>
							<p class="text-sm text-gray-600 mb-4">Need help with this lesson? Ask me anything!</p>
							<button 
								on:click={() => showAITutor = true}
								class="w-full primary-btn px-4 py-3 rounded-xl"
							>
								Ask AI a Question
							</button>
						</div>

						<!-- Download Attachments -->
						{#if lesson.attachments && lesson.attachments.length > 0}
							<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
								<div class="flex items-center space-x-3 mb-4">
									<div class="text-2xl">📎</div>
									<h3 class="text-lg font-bold text-gray-900">Attachments</h3>
								</div>
								<div class="space-y-3">
									{#each lesson.attachments as attachment}
										<div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
											<div class="flex-1">
												<h4 class="text-sm font-medium text-gray-900">{attachment.name}</h4>
												<p class="text-xs text-gray-600">{attachment.size}</p>
											</div>
											<button 
												on:click={() => downloadAttachment(attachment)}
												class="ml-3 text-primary hover:text-primary/80 transition-colors"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
											</button>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Next Lesson -->
						{#if lesson.nextLessonId}
							<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
								<div class="flex items-center space-x-3 mb-4">
									<div class="text-2xl">➡️</div>
									<h3 class="text-lg font-bold text-gray-900">Up Next</h3>
								</div>
								<p class="text-sm text-gray-600 mb-4">{lesson.nextLessonTitle}</p>
								<button 
									on:click={goToNextLesson}
									class="w-full primary-btn px-4 py-3 rounded-xl"
								>
									Next Lesson →
								</button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- AI Tutor Modal -->
		{#if showAITutor}
			<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
				<div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
					<div class="p-6 border-b border-gray-200">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<div class="text-3xl">🤖</div>
								<h3 class="text-xl font-bold text-gray-900">AI Tutor Assistant</h3>
							</div>
							<button 
								on:click={() => { showAITutor = false; aiQuestion = ''; aiResponse = ''; }}
								class="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>

					<div class="p-6 max-h-[60vh] overflow-y-auto">
						<div class="space-y-4">
							<div>
								<label for="ai-question" class="block text-sm font-medium text-gray-700 mb-2">
									Ask a question about "{lesson.title}":
								</label>
								<textarea
									id="ai-question"
									bind:value={aiQuestion}
									rows="4"
									placeholder="e.g., Can you explain the difference between integers and floats?"
									class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
								></textarea>
							</div>

							{#if aiResponse}
								<div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
									<h4 class="font-semibold text-blue-900 mb-2">AI Response:</h4>
									<div class="text-blue-800 whitespace-pre-line">{aiResponse}</div>
								</div>
							{/if}
						</div>
					</div>

					<div class="p-6 border-t border-gray-200 flex space-x-3">
						<button
							on:click={() => { showAITutor = false; aiQuestion = ''; aiResponse = ''; }}
							class="flex-1 secondary-btn px-4 py-3 rounded-xl"
						>
							Cancel
						</button>
						<button
							on:click={askAITutor}
							disabled={!aiQuestion.trim() || aiLoading}
							class="flex-1 primary-btn px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if aiLoading}
								<span class="flex items-center justify-center space-x-2">
									<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Thinking...</span>
								</span>
							{:else}
								Ask AI
							{/if}
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

<style>
	.prose {
		color: theme('colors.gray.700');
	}
	
	.prose p {
		margin-bottom: 1rem;
		line-height: 1.6;
	}
	
	.prose ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}
	
	.prose ol {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}
</style>
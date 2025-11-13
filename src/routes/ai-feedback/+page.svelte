<script>
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
	let feedbackData = null;
	let loading = true;
	let error = null;

	// Get quiz data from URL parameters or mock data
	$: quizId = $page.url.searchParams.get('quiz') || '1';
	$: score = parseInt($page.url.searchParams.get('score') || '75');
	$: total = parseInt($page.url.searchParams.get('total') || '10');

	// Mock quiz feedback data
	let mockFeedback = {
		quizId: quizId,
		quizTitle: "Machine Learning Fundamentals Quiz",
		courseId: 1,
		courseName: "Introduction to Machine Learning",
		score: score,
		totalQuestions: total,
		correctAnswers: Math.floor((score / 100) * total),
		wrongAnswers: total - Math.floor((score / 100) * total),
		percentage: score,
		grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
		timeSpent: "12 minutes 45 seconds",
		submittedAt: new Date().toLocaleString(),
		
		// Detailed answer breakdown
		questionBreakdown: [
			{
				id: 1,
				question: "What is the primary goal of supervised learning?",
				userAnswer: "To predict outcomes based on labeled training data",
				correctAnswer: "To predict outcomes based on labeled training data",
				isCorrect: true,
				explanation: "Correct! Supervised learning uses labeled data to train models that can make predictions on new, unseen data."
			},
			{
				id: 2,
				question: "Which algorithm is best for linear regression?",
				userAnswer: "Decision Trees",
				correctAnswer: "Least Squares Method",
				isCorrect: false,
				explanation: "The Least Squares Method is the standard approach for linear regression. Decision trees are used for classification and non-linear regression problems."
			},
			{
				id: 3,
				question: "What does overfitting mean?",
				userAnswer: "When a model performs well on training data but poorly on test data",
				correctAnswer: "When a model performs well on training data but poorly on test data",
				isCorrect: true,
				explanation: "Excellent! Overfitting occurs when a model learns the training data too well, including noise, making it perform poorly on new data."
			}
		],

		// AI-generated feedback
		aiFeedback: {
			weakAreas: [
				{
					topic: "Linear Regression Algorithms",
					description: "You seem to have difficulty distinguishing between different regression algorithms and their specific use cases.",
					impact: "This affects your ability to choose the right algorithm for prediction problems."
				},
				{
					topic: "Feature Engineering",
					description: "Questions about data preprocessing and feature selection were answered incorrectly.",
					impact: "Understanding feature engineering is crucial for building effective ML models."
				}
			],
			recommendedLessons: [
				{
					id: 5,
					title: "Linear Regression Deep Dive",
					description: "Comprehensive overview of linear regression algorithms and when to use them",
					estimatedTime: "30 minutes"
				},
				{
					id: 8,
					title: "Feature Engineering Techniques",
					description: "Learn how to select, transform, and create features for better model performance",
					estimatedTime: "45 minutes"
				},
				{
					id: 12,
					title: "Model Evaluation and Validation",
					description: "Understanding different metrics and validation techniques",
					estimatedTime: "25 minutes"
				}
			],
			improvementTips: [
				"Practice identifying the characteristics of different ML algorithms",
				"Work through more hands-on examples with real datasets",
				"Focus on understanding the mathematical foundations of algorithms",
				"Review the preprocessing steps before applying ML algorithms",
				"Take time to understand when and why certain algorithms are preferred"
			],
			overallAssessment: "You have a solid understanding of the fundamental concepts of machine learning. Your performance shows good grasp of core principles, but there's room for improvement in algorithm selection and technical implementation details. Focus on the recommended lessons to strengthen your weak areas."
		}
	};

	async function loadFeedback() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// feedbackData = await api.getAIFeedback({
			//     quizId: quizId,
			//     score: score,
			//     answers: userAnswers
			// });

			// Use mock data for now
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
			feedbackData = mockFeedback;
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	function getScoreColor(percentage) {
		if (percentage >= 90) return 'text-green-600';
		if (percentage >= 80) return 'text-blue-600';
		if (percentage >= 70) return 'text-yellow-600';
		if (percentage >= 60) return 'text-orange-600';
		return 'text-red-600';
	}

	function getGradeColor(grade) {
		switch(grade) {
			case 'A': return 'bg-green-100 text-green-800 border-green-200';
			case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
			case 'F': return 'bg-red-100 text-red-800 border-red-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	function goToLesson(lessonId) {
		goto(`/lessons/${lessonId}`);
	}

	function retakeQuiz() {
		// Navigate back to quiz
		goto(`/quiz/${feedbackData.quizId}`);
	}

	function goToCourse() {
		goto(`/courses/${feedbackData.courseId}`);
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadFeedback();
		}
	});
</script>

<svelte:head>
	<title>Quiz Feedback - AI Analysis - E-Learning Platform</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
			<div class="text-center">
				<LoadingSpinner size="large" />
				<p class="mt-4 text-lg text-gray-600">Analyzing your quiz performance...</p>
			</div>
		</div>
	{:else if error}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
			<div class="text-center">
				<div class="text-6xl mb-4">❌</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Feedback</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<button on:click={() => goto('/dashboard')} class="primary-btn px-6 py-3 rounded-xl">
					← Back to Dashboard
				</button>
			</div>
		</div>
	{:else if feedbackData}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
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
								<button on:click={goToCourse} class="hover:text-primary">
									{feedbackData.courseName}
								</button>
								<span>›</span>
								<span class="text-primary font-medium">Quiz Feedback</span>
							</nav>
							<h1 class="text-4xl font-bold text-gray-900">🤖 AI Feedback Analysis</h1>
							<p class="text-gray-600 mt-2 text-lg">{feedbackData.quizTitle}</p>
						</div>
						<button on:click={goToCourse} class="secondary-btn px-6 py-3 rounded-xl">
							← Back to Course
						</button>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<!-- Score Summary -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
					<!-- Main Score Card -->
					<div class="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
						<div class="flex items-center justify-between mb-6">
							<h2 class="text-2xl font-bold text-gray-900">📊 Quiz Results</h2>
							<div class="flex items-center space-x-3">
								<span class="px-4 py-2 border-2 rounded-xl font-bold text-lg {getGradeColor(feedbackData.grade)}">
									Grade: {feedbackData.grade}
								</span>
							</div>
						</div>

						<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
							<div class="text-center">
								<div class="text-3xl font-bold {getScoreColor(feedbackData.percentage)}">{feedbackData.percentage}%</div>
								<div class="text-sm text-gray-600">Overall Score</div>
							</div>
							<div class="text-center">
								<div class="text-3xl font-bold text-green-600">{feedbackData.correctAnswers}</div>
								<div class="text-sm text-gray-600">Correct</div>
							</div>
							<div class="text-center">
								<div class="text-3xl font-bold text-red-600">{feedbackData.wrongAnswers}</div>
								<div class="text-sm text-gray-600">Wrong</div>
							</div>
							<div class="text-center">
								<div class="text-3xl font-bold text-blue-600">{feedbackData.totalQuestions}</div>
								<div class="text-sm text-gray-600">Total Questions</div>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
							<div>
								<span class="font-medium">Time Spent:</span> {feedbackData.timeSpent}
							</div>
							<div>
								<span class="font-medium">Submitted:</span> {feedbackData.submittedAt}
							</div>
						</div>
					</div>

					<!-- Quick Actions -->
					<div class="space-y-6">
						<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
							<h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
							<div class="space-y-3">
								<button 
									on:click={retakeQuiz}
									class="w-full primary-btn px-4 py-3 rounded-xl"
								>
									🔄 Retake Quiz
								</button>
								<button 
									on:click={goToCourse}
									class="w-full secondary-btn px-4 py-3 rounded-xl"
								>
									📚 Continue Course
								</button>
								<button 
									on:click={() => goto('/ai-tutor')}
									class="w-full bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
								>
									🤖 Ask AI Tutor
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Question Breakdown -->
				<div class="mb-8">
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
						<h2 class="text-2xl font-bold text-gray-900 mb-6">📝 Question Analysis</h2>
						<div class="space-y-6">
							{#each feedbackData.questionBreakdown as question, i}
								<div class="border border-gray-200 rounded-2xl p-6 {question.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
									<div class="flex items-start space-x-4">
										<div class="flex-shrink-0">
											{#if question.isCorrect}
												<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
													<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
													</svg>
												</div>
											{:else}
												<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
													<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
													</svg>
												</div>
											{/if}
										</div>
										<div class="flex-1">
											<h4 class="font-semibold text-gray-900 mb-2">Question {i + 1}</h4>
											<p class="text-gray-700 mb-3">{question.question}</p>
											
											<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
												<div>
													<span class="text-sm font-medium text-gray-600">Your Answer:</span>
													<p class="text-sm {question.isCorrect ? 'text-green-700' : 'text-red-700'}">{question.userAnswer}</p>
												</div>
												{#if !question.isCorrect}
													<div>
														<span class="text-sm font-medium text-gray-600">Correct Answer:</span>
														<p class="text-sm text-green-700">{question.correctAnswer}</p>
													</div>
												{/if}
											</div>
											
											<div class="bg-white/70 rounded-xl p-3">
												<span class="text-sm font-medium text-gray-600">Explanation:</span>
												<p class="text-sm text-gray-700 mt-1">{question.explanation}</p>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- AI Feedback Section -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<!-- Weak Areas -->
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
						<h2 class="text-2xl font-bold text-gray-900 mb-6">🎯 Areas for Improvement</h2>
						<div class="space-y-4">
							{#each feedbackData.aiFeedback.weakAreas as area}
								<div class="border border-orange-200 bg-orange-50 rounded-xl p-4">
									<h4 class="font-semibold text-orange-900 mb-2">{area.topic}</h4>
									<p class="text-sm text-orange-800 mb-2">{area.description}</p>
									<p class="text-xs text-orange-700 italic">Impact: {area.impact}</p>
								</div>
							{/each}
						</div>

						<!-- Improvement Tips -->
						<div class="mt-6">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Improvement</h3>
							<ul class="space-y-2">
								{#each feedbackData.aiFeedback.improvementTips as tip}
									<li class="flex items-start space-x-2">
										<span class="text-blue-500 mt-1">•</span>
										<span class="text-sm text-gray-700">{tip}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>

					<!-- Recommended Lessons -->
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
						<h2 class="text-2xl font-bold text-gray-900 mb-6">📚 Recommended Lessons</h2>
						<div class="space-y-4">
							{#each feedbackData.aiFeedback.recommendedLessons as lesson}
								<div class="border border-blue-200 bg-blue-50 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
									 on:click={() => goToLesson(lesson.id)}
									 on:keydown={(e) => e.key === 'Enter' && goToLesson(lesson.id)}
									 role="button"
									 tabindex="0">
									<div class="flex items-center justify-between mb-2">
										<h4 class="font-semibold text-blue-900">{lesson.title}</h4>
										<span class="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
											⏱️ {lesson.estimatedTime}
										</span>
									</div>
									<p class="text-sm text-blue-800">{lesson.description}</p>
									<div class="mt-2 flex items-center text-xs text-blue-600">
										<span>Click to start lesson</span>
										<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Overall Assessment -->
				<div class="mt-8">
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
						<h2 class="text-2xl font-bold text-gray-900 mb-6">🤖 AI Assessment</h2>
						<div class="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
							<p class="text-gray-700 leading-relaxed">{feedbackData.aiFeedback.overallAssessment}</p>
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
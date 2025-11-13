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
	let generating = false;
	let error = null;
	let activeTab = 'manual';

	// Quiz form data
	let quizForm = {
		title: '',
		description: '',
		courseId: '',
		moduleId: '',
		timeLimit: 30,
		passingScore: 70,
		attemptsAllowed: 3,
		questions: []
	};

	// AI Generation form
	let aiGenForm = {
		topic: '',
		difficulty: 'intermediate',
		questionCount: 10,
		questionTypes: ['multiple-choice']
	};

	// Generated questions from AI
	let aiGeneratedQuestions = [];
	let showPreview = false;

	// New question form
	let newQuestion = {
		type: 'multiple-choice',
		question: '',
		options: ['', '', '', ''],
		correctAnswer: 0,
		explanation: '',
		points: 1
	};

	const questionTypes = [
		{ value: 'multiple-choice', label: 'Multiple Choice', icon: '🔘' },
		{ value: 'true-false', label: 'True/False', icon: '✅' },
		{ value: 'short-answer', label: 'Short Answer', icon: '📝' },
		{ value: 'essay', label: 'Essay', icon: '📄' }
	];

	const difficultyLevels = [
		{ value: 'beginner', label: 'Beginner', color: 'text-green-600' },
		{ value: 'intermediate', label: 'Intermediate', color: 'text-yellow-600' },
		{ value: 'advanced', label: 'Advanced', color: 'text-red-600' }
	];

	const topicSuggestions = [
		'JavaScript Fundamentals', 'React Components', 'Node.js APIs', 'Python Basics',
		'HTML5 Semantics', 'CSS Flexbox', 'Database Design', 'Authentication',
		'RESTful APIs', 'Git Version Control', 'DevOps Basics', 'Security Best Practices'
	];

	async function generateQuiz() {
		try {
			generating = true;
			error = null;

			// Validate AI form
			if (!aiGenForm.topic.trim()) {
				throw new Error('Topic is required for AI generation');
			}
			if (aiGenForm.questionCount < 1 || aiGenForm.questionCount > 50) {
				throw new Error('Question count must be between 1 and 50');
			}

			// Mock AI generation
			await new Promise(resolve => setTimeout(resolve, 3000));

			// Generate mock questions based on the form
			const mockQuestions = [];
			for (let i = 0; i < aiGenForm.questionCount; i++) {
				mockQuestions.push({
					type: aiGenForm.questionTypes[Math.floor(Math.random() * aiGenForm.questionTypes.length)],
					question: `${aiGenForm.topic} - Sample question ${i + 1}?`,
					options: [
						'Option A - Correct answer',
						'Option B - Incorrect',
						'Option C - Incorrect',
						'Option D - Incorrect'
					],
					correctAnswer: 0,
					explanation: `This is the explanation for question ${i + 1} about ${aiGenForm.topic}.`,
					points: 1,
					difficulty: aiGenForm.difficulty
				});
			}

			aiGeneratedQuestions = mockQuestions;
			showPreview = true;

			// Uncomment when backend is ready
			// const response = await api.generateQuizWithAI(aiGenForm);
			// aiGeneratedQuestions = response.questions;

		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			generating = false;
		}
	}

	function acceptAIQuestions() {
		quizForm.questions = [...quizForm.questions, ...aiGeneratedQuestions];
		aiGeneratedQuestions = [];
		showPreview = false;
		activeTab = 'manual';
	}

	function rejectAIQuestions() {
		aiGeneratedQuestions = [];
		showPreview = false;
	}

	function addManualQuestion() {
		// Validate question
		if (!newQuestion.question.trim()) {
			error = 'Question text is required';
			return;
		}

		if (newQuestion.type === 'multiple-choice') {
			const filledOptions = newQuestion.options.filter(opt => opt.trim());
			if (filledOptions.length < 2) {
				error = 'Multiple choice questions need at least 2 options';
				return;
			}
			if (newQuestion.correctAnswer >= filledOptions.length) {
				error = 'Please select a valid correct answer';
				return;
			}
		}

		// Add question
		const question = {
			...newQuestion,
			id: Date.now(),
			options: newQuestion.type === 'multiple-choice' ? 
				newQuestion.options.filter(opt => opt.trim()) : []
		};

		quizForm.questions = [...quizForm.questions, question];

		// Reset form
		newQuestion = {
			type: 'multiple-choice',
			question: '',
			options: ['', '', '', ''],
			correctAnswer: 0,
			explanation: '',
			points: 1
		};
		error = null;
	}

	function removeQuestion(index) {
		quizForm.questions = quizForm.questions.filter((_, i) => i !== index);
	}

	function moveQuestion(index, direction) {
		if (direction === 'up' && index > 0) {
			const questions = [...quizForm.questions];
			[questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
			quizForm.questions = questions;
		} else if (direction === 'down' && index < quizForm.questions.length - 1) {
			const questions = [...quizForm.questions];
			[questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
			quizForm.questions = questions;
		}
	}

	async function saveQuiz() {
		try {
			saving = true;
			error = null;

			// Validate quiz
			if (!quizForm.title.trim()) {
				throw new Error('Quiz title is required');
			}
			if (quizForm.questions.length === 0) {
				throw new Error('Quiz must have at least one question');
			}

			const quizData = {
				...quizForm,
				createdAt: new Date().toISOString(),
				totalPoints: quizForm.questions.reduce((sum, q) => sum + (q.points || 1), 0)
			};

			// Uncomment when backend is ready
			// const result = await api.createTeacherQuiz(quizData);

			// Mock save
			await new Promise(resolve => setTimeout(resolve, 2000));

			goto('/teacher/courses');
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			saving = false;
		}
	}

	function getQuestionIcon(type) {
		const questionType = questionTypes.find(qt => qt.value === type);
		return questionType ? questionType.icon : '❓';
	}

	function addOption() {
		if (newQuestion.options.length < 8) {
			newQuestion.options = [...newQuestion.options, ''];
		}
	}

	function removeOption(index) {
		if (newQuestion.options.length > 2) {
			newQuestion.options = newQuestion.options.filter((_, i) => i !== index);
			if (newQuestion.correctAnswer >= newQuestion.options.length) {
				newQuestion.correctAnswer = 0;
			}
		}
	}

	$: totalPoints = quizForm.questions.reduce((sum, q) => sum + (q.points || 1), 0);
	$: estimatedTime = Math.max(5, Math.ceil(quizForm.questions.length * 1.5));
</script>

<svelte:head>
	<title>Create Quiz - Teacher Dashboard</title>
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
							<span class="text-primary font-medium">Create Quiz</span>
						</nav>
						<h1 class="text-4xl font-bold text-gray-900">📊 Create New Quiz</h1>
						<p class="text-gray-600 mt-2 text-lg">Create assessments manually or with AI assistance</p>
					</div>
					<div class="flex space-x-3">
						<button 
							on:click={() => goto('/teacher/courses')}
							class="secondary-btn px-6 py-3 rounded-xl"
						>
							Cancel
						</button>
						<button 
							on:click={saveQuiz}
							disabled={saving || quizForm.questions.length === 0}
							class="primary-btn px-6 py-3 rounded-xl disabled:opacity-50"
						>
							{saving ? 'Creating...' : 'Create Quiz'}
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

			<!-- Quiz Summary -->
			<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl mb-8">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">{quizForm.questions.length}</div>
						<div class="text-sm text-gray-600">Questions</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">{totalPoints}</div>
						<div class="text-sm text-gray-600">Total Points</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-600">{estimatedTime} min</div>
						<div class="text-sm text-gray-600">Estimated Time</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600">{quizForm.passingScore}%</div>
						<div class="text-sm text-gray-600">Passing Score</div>
					</div>
				</div>
			</div>

			<!-- Quiz Basic Information -->
			<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl mb-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">📝 Quiz Information</h2>
				
				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
							<input
								bind:value={quizForm.title}
								type="text"
								placeholder="Enter quiz title..."
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
							<input
								bind:value={quizForm.timeLimit}
								type="number"
								min="1"
								max="300"
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
						<textarea
							bind:value={quizForm.description}
							rows="3"
							placeholder="Brief description of the quiz..."
							class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
						></textarea>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
							<input
								bind:value={quizForm.passingScore}
								type="number"
								min="0"
								max="100"
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Attempts Allowed</label>
							<select
								bind:value={quizForm.attemptsAllowed}
								class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							>
								<option value={1}>1 attempt</option>
								<option value={2}>2 attempts</option>
								<option value={3}>3 attempts</option>
								<option value={5}>5 attempts</option>
								<option value={-1}>Unlimited</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<!-- Tab Navigation -->
			<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl mb-8 overflow-hidden">
				<div class="flex border-b border-gray-200">
					<button
						on:click={() => activeTab = 'manual'}
						class="flex-1 px-6 py-4 text-center font-medium transition-colors {
							activeTab === 'manual' 
								? 'bg-primary text-white' 
								: 'text-gray-600 hover:text-primary hover:bg-gray-50'
						}"
					>
						✏️ Manual Creation
					</button>
					<button
						on:click={() => activeTab = 'ai'}
						class="flex-1 px-6 py-4 text-center font-medium transition-colors {
							activeTab === 'ai' 
								? 'bg-primary text-white' 
								: 'text-gray-600 hover:text-primary hover:bg-gray-50'
						}"
					>
						🤖 AI Generation
					</button>
				</div>

				<div class="p-8">
					{#if activeTab === 'manual'}
						<div class="space-y-8">
							<!-- Questions List -->
							{#if quizForm.questions.length > 0}
								<div>
									<h3 class="text-xl font-bold text-gray-900 mb-4">Quiz Questions ({quizForm.questions.length})</h3>
									<div class="space-y-4">
										{#each quizForm.questions as question, index}
											<div class="bg-white border border-gray-200 rounded-2xl p-6">
												<div class="flex items-start justify-between">
													<div class="flex-1">
														<div class="flex items-center space-x-2 mb-2">
															<span class="text-lg">{getQuestionIcon(question.type)}</span>
															<span class="text-sm font-medium text-gray-500">
																Question {index + 1} • {question.points || 1} point{(question.points || 1) !== 1 ? 's' : ''}
															</span>
														</div>
														<h4 class="text-lg font-semibold text-gray-900 mb-2">{question.question}</h4>
														{#if question.type === 'multiple-choice'}
															<div class="space-y-1">
																{#each question.options as option, optIndex}
																	<div class="flex items-center space-x-2">
																		<div class="w-4 h-4 border border-gray-300 rounded-full {optIndex === question.correctAnswer ? 'bg-green-500' : ''}"></div>
																		<span class="text-sm {optIndex === question.correctAnswer ? 'font-medium text-green-700' : 'text-gray-600'}">
																			{option}
																		</span>
																	</div>
																{/each}
															</div>
														{/if}
													</div>
													<div class="flex space-x-2">
														<button
															on:click={() => moveQuestion(index, 'up')}
															disabled={index === 0}
															class="secondary-btn px-3 py-1 text-xs rounded-lg disabled:opacity-50"
														>
															↑
														</button>
														<button
															on:click={() => moveQuestion(index, 'down')}
															disabled={index === quizForm.questions.length - 1}
															class="secondary-btn px-3 py-1 text-xs rounded-lg disabled:opacity-50"
														>
															↓
														</button>
														<button
															on:click={() => removeQuestion(index)}
															class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1 text-xs rounded-lg transition-colors"
														>
															Remove
														</button>
													</div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Add Question Form -->
							<div class="bg-gray-50 border border-gray-200 rounded-2xl p-6">
								<h3 class="text-xl font-bold text-gray-900 mb-6">Add New Question</h3>
								
								<div class="space-y-6">
									<!-- Question Type -->
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-3">Question Type</label>
										<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
											{#each questionTypes as type}
												<label class="relative cursor-pointer">
													<input
														type="radio"
														bind:group={newQuestion.type}
														value={type.value}
														class="sr-only"
													/>
													<div class="border-2 rounded-lg p-3 text-center transition-all {
														newQuestion.type === type.value 
															? 'border-primary bg-primary/10' 
															: 'border-gray-200 hover:border-gray-300'
													}">
														<div class="text-2xl mb-1">{type.icon}</div>
														<div class="text-xs font-medium">{type.label}</div>
													</div>
												</label>
											{/each}
										</div>
									</div>

									<!-- Question Text -->
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Question *</label>
										<textarea
											bind:value={newQuestion.question}
											rows="2"
											placeholder="Enter your question..."
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
										></textarea>
									</div>

									<!-- Options (for multiple choice) -->
									{#if newQuestion.type === 'multiple-choice'}
										<div>
											<label class="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>
											<div class="space-y-3">
												{#each newQuestion.options as option, optIndex}
													<div class="flex items-center space-x-3">
														<input
															type="radio"
															bind:group={newQuestion.correctAnswer}
															value={optIndex}
															class="w-4 h-4 text-primary focus:ring-primary border-gray-300"
														/>
														<input
															bind:value={newQuestion.options[optIndex]}
															type="text"
															placeholder="Enter option..."
															class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
														/>
														{#if newQuestion.options.length > 2}
															<button
																on:click={() => removeOption(optIndex)}
																class="text-red-600 hover:text-red-800 text-sm px-2"
															>
																Remove
															</button>
														{/if}
													</div>
												{/each}
											</div>
											{#if newQuestion.options.length < 8}
												<button
													on:click={addOption}
													class="mt-3 secondary-btn px-4 py-2 rounded-lg text-sm"
												>
													+ Add Option
												</button>
											{/if}
										</div>
									{/if}

									<!-- Points and Explanation -->
									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label class="block text-sm font-medium text-gray-700 mb-2">Points</label>
											<input
												bind:value={newQuestion.points}
												type="number"
												min="1"
												max="10"
												class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											/>
										</div>
									</div>

									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Explanation (optional)</label>
										<textarea
											bind:value={newQuestion.explanation}
											rows="2"
											placeholder="Explain the correct answer..."
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
										></textarea>
									</div>

									<button
										on:click={addManualQuestion}
										class="primary-btn px-6 py-3 rounded-xl"
									>
										Add Question
									</button>
								</div>
							</div>
						</div>

					{:else if activeTab === 'ai'}
						<div class="space-y-8">
							{#if !showPreview}
								<!-- AI Generation Form -->
								<div class="space-y-6">
									<h3 class="text-xl font-bold text-gray-900">🤖 Generate Quiz with AI</h3>
									<p class="text-gray-600">Describe what you want to test and let AI create questions for you.</p>

									<!-- Topic -->
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
										<input
											bind:value={aiGenForm.topic}
											type="text"
											placeholder="e.g., JavaScript Functions, React Hooks, Database Normalization"
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										/>
										<div class="mt-2 flex flex-wrap gap-2">
											<span class="text-xs text-gray-500">Suggestions:</span>
											{#each topicSuggestions as suggestion}
												<button
													on:click={() => aiGenForm.topic = suggestion}
													class="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
												>
													{suggestion}
												</button>
											{/each}
										</div>
									</div>

									<!-- Settings Grid -->
									<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
										<div>
											<label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
											<select
												bind:value={aiGenForm.difficulty}
												class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											>
												{#each difficultyLevels as level}
													<option value={level.value}>{level.label}</option>
												{/each}
											</select>
										</div>

										<div>
											<label class="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
											<input
												bind:value={aiGenForm.questionCount}
												type="number"
												min="1"
												max="50"
												class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											/>
										</div>

										<div>
											<label class="block text-sm font-medium text-gray-700 mb-2">Question Types</label>
											<select
												bind:value={aiGenForm.questionTypes[0]}
												class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											>
												{#each questionTypes as type}
													<option value={type.value}>{type.label}</option>
												{/each}
											</select>
										</div>
									</div>

									<button
										on:click={generateQuiz}
										disabled={generating || !aiGenForm.topic.trim()}
										class="primary-btn px-8 py-4 rounded-xl disabled:opacity-50 flex items-center space-x-2"
									>
										{#if generating}
											<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
											<span>Generating Quiz...</span>
										{:else}
											<span>🤖</span>
											<span>Generate Quiz with AI</span>
										{/if}
									</button>
								</div>

							{:else}
								<!-- AI Generated Questions Preview -->
								<div class="space-y-6">
									<div class="flex items-center justify-between">
										<h3 class="text-xl font-bold text-gray-900">🎯 Generated Questions Preview</h3>
										<div class="text-sm text-gray-600">
											{aiGeneratedQuestions.length} questions • {aiGenForm.topic}
										</div>
									</div>

									<!-- Generated Questions List -->
									<div class="space-y-4 max-h-96 overflow-y-auto">
										{#each aiGeneratedQuestions as question, index}
											<div class="bg-white border border-gray-200 rounded-xl p-4">
												<div class="flex items-start justify-between mb-2">
													<h4 class="font-medium text-gray-900">Question {index + 1}</h4>
													<span class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
														{question.difficulty}
													</span>
												</div>
												<p class="text-gray-700 mb-3">{question.question}</p>
												{#if question.options}
													<div class="space-y-1">
														{#each question.options as option, optIndex}
															<div class="flex items-center space-x-2 text-sm">
																<div class="w-3 h-3 border border-gray-300 rounded-full {optIndex === question.correctAnswer ? 'bg-green-500' : ''}"></div>
																<span class="{optIndex === question.correctAnswer ? 'font-medium text-green-700' : 'text-gray-600'}">
																	{option}
																</span>
															</div>
														{/each}
													</div>
												{/if}
											</div>
										{/each}
									</div>

									<!-- Preview Actions -->
									<div class="flex space-x-4">
										<button
											on:click={acceptAIQuestions}
											class="primary-btn px-6 py-3 rounded-xl flex-1"
										>
											✅ Accept All Questions
										</button>
										<button
											on:click={rejectAIQuestions}
											class="secondary-btn px-6 py-3 rounded-xl flex-1"
										>
											❌ Regenerate
										</button>
									</div>
								</div>
							{/if}
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
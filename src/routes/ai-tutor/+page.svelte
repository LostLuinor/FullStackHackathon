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

	/** @type {any[]} */
	let messages = [];
	/** @type {any[]} */
	let conversationHistory = [];
	let currentMessage = '';
	let loading = false;
	let historyLoading = true;
	let selectedContext = '';
	let showContextOptions = false;

	// Context options for lesson injection
	let contextOptions = [
		{ id: 'explain_topic', label: 'Explain this topic', icon: '💡' },
		{ id: 'practice_questions', label: 'Generate practice questions', icon: '❓' },
		{ id: 'code_examples', label: 'Show code examples', icon: '💻' },
		{ id: 'real_world', label: 'Real-world applications', icon: '🌍' },
		{ id: 'study_guide', label: 'Create study guide', icon: '📋' },
		{ id: 'quiz_prep', label: 'Quiz preparation tips', icon: '🎯' }
	];

	// Mock conversation history
	let mockHistory = [
		{
			id: 1,
			title: "Machine Learning Basics",
			preview: "What is the difference between supervised and unsupervised learning?",
			timestamp: "2 hours ago",
			messageCount: 8
		},
		{
			id: 2,
			title: "Python Data Structures",
			preview: "Can you help me understand lists vs dictionaries?",
			timestamp: "1 day ago",
			messageCount: 12
		},
		{
			id: 3,
			title: "Linear Regression",
			preview: "How do I implement linear regression from scratch?",
			timestamp: "3 days ago",
			messageCount: 6
		}
	];

	// Mock current conversation
	let mockMessages = [
		{
			id: 1,
			type: 'system',
			content: "Hello! I'm your AI tutor. I'm here to help you learn and understand any topic. You can ask me questions, request explanations, or use the context options below to get targeted help with specific lessons.",
			timestamp: new Date(Date.now() - 300000)
		}
	];

	async function loadConversationHistory() {
		try {
			historyLoading = true;
			// Uncomment when backend is ready
			// conversationHistory = await api.getAIHistory();

			// Use mock data for now
			await new Promise(resolve => setTimeout(resolve, 800));
			conversationHistory = mockHistory;
			messages = [...mockMessages];
		} catch (err) {
			console.error('Error loading conversation history:', err);
		} finally {
			historyLoading = false;
		}
	}

	async function sendMessage() {
		if (!currentMessage.trim() || loading) return;

		const userMessage = currentMessage.trim();
		const messageId = Date.now();

		// Add user message to conversation
		messages = [...messages, {
			id: messageId,
			type: 'user',
			content: userMessage,
			timestamp: new Date()
		}];

		currentMessage = '';
		loading = true;

		try {
			// Show typing indicator
			messages = [...messages, {
				id: messageId + 1,
				type: 'typing',
				content: 'AI is typing...',
				timestamp: new Date()
			}];

			// Prepare context if selected
			let lessonContext = null;
			if (selectedContext) {
				lessonContext = {
					contextType: selectedContext,
					lessonId: $page.url.searchParams.get('lesson'),
					courseId: $page.url.searchParams.get('course')
				};
			}

			// Uncomment when backend is ready
			// const response = await api.askAITutor(userMessage, lessonContext);

			// Mock AI response
			await new Promise(resolve => setTimeout(resolve, 2000));
			const aiResponse = generateMockResponse(userMessage, selectedContext);

			// Remove typing indicator and add AI response
			messages = messages.filter(m => m.type !== 'typing');
			messages = [...messages, {
				id: messageId + 2,
				type: 'ai',
				content: aiResponse,
				timestamp: new Date()
			}];

			selectedContext = ''; // Clear context after use
		} catch (err) {
			// Remove typing indicator and show error
			messages = messages.filter(m => m.type !== 'typing');
			messages = [...messages, {
				id: messageId + 2,
				type: 'error',
				content: 'Sorry, I encountered an error while processing your question. Please try again.',
				timestamp: new Date()
			}];
		} finally {
			loading = false;
			scrollToBottom();
		}
	}

	function generateMockResponse(question, context) {
		const responses = {
			explain_topic: `Let me explain this topic step by step:

**Key Concepts:**
1. **Foundation**: ${question.includes('machine learning') ? 'Machine learning is about training algorithms to find patterns in data' : 'This concept builds on fundamental principles'}
2. **Application**: How this applies in real-world scenarios
3. **Examples**: Practical examples to illustrate the concept

**In Simple Terms:**
${question.includes('machine learning') ? 
	'Think of machine learning like teaching a computer to recognize patterns, just like how you learn to recognize faces or handwriting.' :
	'This concept is like building blocks - each part connects to create a larger understanding.'}

Would you like me to dive deeper into any specific aspect?`,

			practice_questions: `Here are some practice questions to test your understanding:

**Beginner Level:**
1. What are the main differences between the concepts we discussed?
2. Can you give an example of how this would be used?

**Intermediate Level:**
3. What would happen if we changed one key parameter?
4. How does this relate to other concepts you've learned?

**Advanced Level:**
5. What are the limitations of this approach?
6. How would you optimize this for better performance?

Try answering these, and I'll provide feedback on your responses!`,

			code_examples: `Here are some code examples to illustrate the concept:

\`\`\`python
# Basic example
def example_function(data):
    """
    This function demonstrates the core concept
    """
    result = process_data(data)
    return result

# Advanced example
class ConceptImplementation:
    def __init__(self, parameters):
        self.params = parameters
    
    def execute(self):
        # Implementation details here
        return self.optimize()
\`\`\`

**Explanation:**
- The basic example shows the fundamental approach
- The advanced example demonstrates real-world implementation
- Notice how we structure the code for clarity and reusability

Would you like me to explain any specific part of this code?`,

			default: question.toLowerCase().includes('hello') || question.toLowerCase().includes('hi') ?
				`Hello! I'm excited to help you learn. I can assist you with:

🎓 **Subject Explanations** - Break down complex topics
📝 **Practice Questions** - Test your understanding  
💻 **Code Examples** - Show practical implementations
🌍 **Real-world Applications** - Connect theory to practice
📚 **Study Guides** - Organize your learning
🎯 **Exam Preparation** - Get ready for assessments

What would you like to explore today?` :

				`That's a great question! Let me help you understand this better.

**Based on your question about "${question}":**

${question.toLowerCase().includes('what') ? 
	'This is asking for a definition or explanation. Let me break it down for you.' :
	question.toLowerCase().includes('how') ?
	'This is asking about a process or method. Let me walk you through the steps.' :
	question.toLowerCase().includes('why') ?
	'This is asking for reasoning or justification. Let me explain the underlying principles.' :
	'Let me provide you with a comprehensive answer.'}

The key points to understand are:
1. **Core concept**: The fundamental idea behind this
2. **Practical application**: How this is used in real scenarios
3. **Common mistakes**: What to avoid when learning this

Would you like me to elaborate on any of these points or provide examples?`
		};

		return responses[context] || responses.default;
	}

	function selectContext(contextId) {
		selectedContext = contextId;
		showContextOptions = false;
		const option = contextOptions.find(opt => opt.id === contextId);
		if (option) {
			currentMessage = `${option.icon} ${option.label}: `;
			document.getElementById('message-input')?.focus();
		}
	}

	function loadConversation(conversationId) {
		// In a real app, this would load the specific conversation
		console.log('Loading conversation:', conversationId);
		// Reset to show selected conversation
		messages = [
			{
				id: 1,
				type: 'system',
				content: `Loaded conversation ${conversationId}. Previous messages would be displayed here.`,
				timestamp: new Date()
			}
		];
	}

	function startNewConversation() {
		messages = [...mockMessages];
		selectedContext = '';
	}

	function scrollToBottom() {
		setTimeout(() => {
			const chatContainer = document.getElementById('chat-container');
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 100);
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadConversationHistory();
		}
	});
</script>

<svelte:head>
	<title>AI Tutor - Interactive Learning Assistant - E-Learning Platform</title>
</svelte:head>

{#if $auth.isAuthenticated}
	<div class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
		<!-- Header -->
		<div class="bg-white/70 backdrop-blur-xl border-b border-gray-200/20">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div class="flex items-center justify-between">
					<div>
						<nav class="flex items-center space-x-2 text-sm text-gray-600 mb-2">
							<button on:click={() => goto('/dashboard')} class="hover:text-primary">
								Dashboard
							</button>
							<span>›</span>
							<span class="text-primary font-medium">AI Tutor</span>
						</nav>
						<h1 class="text-3xl font-bold text-gray-900">🤖 AI Tutor Assistant</h1>
						<p class="text-gray-600 mt-1">Your personal learning companion</p>
					</div>
					<button on:click={() => goto('/dashboard')} class="secondary-btn px-6 py-3 rounded-xl">
						← Back to Dashboard
					</button>
				</div>
			</div>
		</div>

		<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
				<!-- Conversation History Sidebar -->
				<div class="lg:col-span-1">
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl h-full">
						<div class="flex items-center justify-between mb-6">
							<h2 class="text-lg font-bold text-gray-900">📚 Conversations</h2>
							<button 
								on:click={startNewConversation}
								class="text-primary hover:text-primary/80 transition-colors p-1"
								title="New Conversation"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
							</button>
						</div>

						{#if historyLoading}
							<div class="flex items-center justify-center py-8">
								<LoadingSpinner />
							</div>
						{:else}
							<div class="space-y-3 overflow-y-auto h-full">
								{#each conversationHistory as conversation}
									<div class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
										 on:click={() => loadConversation(conversation.id)}
										 on:keydown={(e) => e.key === 'Enter' && loadConversation(conversation.id)}
										 role="button"
										 tabindex="0">
										<h4 class="font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors truncate">
											{conversation.title}
										</h4>
										<p class="text-sm text-gray-600 mb-2 line-clamp-2">{conversation.preview}</p>
										<div class="flex items-center justify-between text-xs text-gray-500">
											<span>{conversation.timestamp}</span>
											<span>{conversation.messageCount} messages</span>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Main Chat Area -->
				<div class="lg:col-span-3">
					<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl h-full flex flex-col">
						<!-- Chat Header -->
						<div class="px-6 py-4 border-b border-gray-200/50">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
										<span class="text-white text-lg">🤖</span>
									</div>
									<div>
										<h3 class="font-semibold text-gray-900">AI Learning Assistant</h3>
										<p class="text-sm text-gray-600">Always here to help you learn</p>
									</div>
								</div>
								<div class="flex items-center space-x-2">
									<button 
										on:click={() => showContextOptions = !showContextOptions}
										class="secondary-btn px-4 py-2 rounded-xl"
									>
										🎯 Context Options
									</button>
								</div>
							</div>
						</div>

						<!-- Context Options (when expanded) -->
						{#if showContextOptions}
							<div class="px-6 py-4 border-b border-gray-200/50 bg-gray-50/50">
								<h4 class="font-medium text-gray-900 mb-3">Choose a learning context:</h4>
								<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
									{#each contextOptions as option}
										<button 
											on:click={() => selectContext(option.id)}
											class="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left"
										>
											<span class="text-lg">{option.icon}</span>
											<span class="text-sm font-medium text-gray-700">{option.label}</span>
										</button>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Chat Messages -->
						<div id="chat-container" class="flex-1 overflow-y-auto p-6 space-y-4">
							{#each messages as message}
								<div class="flex {message.type === 'user' ? 'justify-end' : 'justify-start'}">
									{#if message.type === 'user'}
										<div class="max-w-xs lg:max-w-md">
											<div class="bg-primary text-white rounded-2xl rounded-br-sm px-4 py-3">
												<p class="text-sm whitespace-pre-wrap">{message.content}</p>
											</div>
											<p class="text-xs text-gray-500 mt-1 text-right">
												{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											</p>
										</div>
									{:else if message.type === 'ai'}
										<div class="max-w-xs lg:max-w-2xl">
											<div class="flex items-start space-x-3">
												<div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
													<span class="text-white text-sm">🤖</span>
												</div>
												<div class="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3">
													<div class="text-sm whitespace-pre-wrap leading-relaxed">{@html message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 rounded">$1</code>').replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-800 text-white p-2 rounded mt-2 mb-2 overflow-x-auto"><code>$2</code></pre>')}</div>
												</div>
											</div>
											<p class="text-xs text-gray-500 mt-1 ml-11">
												{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											</p>
										</div>
									{:else if message.type === 'system'}
										<div class="max-w-xs lg:max-w-md mx-auto">
											<div class="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl px-4 py-3 text-center">
												<p class="text-sm">{message.content}</p>
											</div>
										</div>
									{:else if message.type === 'typing'}
										<div class="max-w-xs lg:max-w-md">
											<div class="flex items-start space-x-3">
												<div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
													<span class="text-white text-sm">🤖</span>
												</div>
												<div class="bg-gray-100 text-gray-600 rounded-2xl rounded-bl-sm px-4 py-3">
													<div class="flex items-center space-x-1">
														<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
														<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
														<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
														<span class="ml-2 text-sm">AI is thinking...</span>
													</div>
												</div>
											</div>
										</div>
									{:else if message.type === 'error'}
										<div class="max-w-xs lg:max-w-md">
											<div class="bg-red-50 border border-red-200 text-red-800 rounded-2xl px-4 py-3">
												<p class="text-sm">{message.content}</p>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>

						<!-- Message Input -->
						<div class="p-6 border-t border-gray-200/50">
							{#if selectedContext}
								<div class="mb-3 flex items-center space-x-2">
									<span class="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
										Context: {contextOptions.find(opt => opt.id === selectedContext)?.label}
									</span>
									<button 
										on:click={() => selectedContext = ''}
										class="text-gray-400 hover:text-gray-600"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							{/if}
							
							<div class="flex space-x-4">
								<div class="flex-1">
									<textarea
										id="message-input"
										bind:value={currentMessage}
										on:keypress={handleKeyPress}
										placeholder="Ask me anything about your studies..."
										class="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
										rows="1"
										disabled={loading}
									></textarea>
								</div>
								<button
									on:click={sendMessage}
									disabled={!currentMessage.trim() || loading}
									class="px-6 py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
								>
									{#if loading}
										<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									{:else}
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
										</svg>
									{/if}
								</button>
							</div>
							
							<p class="text-xs text-gray-500 mt-2">
								💡 Tip: Use context options above for targeted help, or press Enter to send your message
							</p>
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

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
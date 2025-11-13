<script>
	import { auth } from '$lib/stores/auth.js';
</script>

<!-- Hero Section -->
<div class="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50 overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full opacity-30 blur-3xl -translate-x-36 -translate-y-36"></div>
	<div class="absolute top-1/4 right-0 w-96 h-96 bg-slate-100 rounded-full opacity-30 blur-3xl translate-x-48"></div>
	<div class="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-50 rounded-full opacity-30 blur-3xl translate-y-40"></div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
		<div class="text-center">
			<h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
				<span class="block">Welcome to</span>
				<span class="text-primary">
					My Application
				</span>
			</h1>
			<p class="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed">
				A modern, secure, and elegant web application built with cutting-edge technology. 
				Experience seamless authentication and beautiful design.
			</p>
			
			{#if $auth.isAuthenticated}
				<!-- Authenticated User Welcome -->
				<div class="mt-12 max-w-2xl mx-auto">
					<div class="card-glass rounded-3xl p-8 shadow-2xl">
						<div class="flex items-center justify-center mb-4">
							<div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
						<h3 class="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h3>
						<p class="text-gray-600 mb-6">
							Hello, <span class="font-semibold text-primary">{$auth.user?.name || $auth.user?.email}</span>! 
							Ready to explore your dashboard?
						</p>
						<a
							href="/dashboard"
							class="inline-flex items-center primary-btn px-8 py-4 font-semibold rounded-2xl shadow-lg"
						>
							Go to Dashboard
							<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</a>
					</div>
				</div>
			{:else}
				<!-- Call to Action for Non-authenticated Users -->
				<div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
					<a
						href="/signup"
						class="group primary-btn px-10 py-4 font-semibold rounded-2xl shadow-xl text-lg"
					>
						Get Started
						<svg class="inline ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
					<a
						href="/login"
						class="secondary-btn px-10 py-4 font-semibold rounded-2xl shadow-lg text-lg"
					>
						Sign In
					</a>
				</div>
			{/if}
		</div>

		<!-- Feature Preview Cards -->
		<div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			<div class="group card-glass rounded-3xl p-8 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 shadow-xl">
				<div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300">
					<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-3">Secure Authentication</h3>
				<p class="text-gray-600 leading-relaxed">
					Enterprise-grade security with JWT tokens, secure password handling, and protected routes.
				</p>
			</div>

			<div class="group card-glass rounded-3xl p-8 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 shadow-xl">
				<div class="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300">
					<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
					</svg>
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-3">Modern Design</h3>
				<p class="text-gray-600 leading-relaxed">
					Beautiful, responsive interface with glass-morphism effects and smooth animations.
				</p>
			</div>

			<div class="group card-glass rounded-3xl p-8 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 shadow-xl">
				<div class="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300">
					<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
				<p class="text-gray-600 leading-relaxed">
					Built with SvelteKit for optimal performance and instant page loads.
				</p>
			</div>
		</div>
	</div>
</div>

<!-- Features Section -->
<div class="py-24 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
				Everything you need to 
				<span class="text-primary">succeed</span>
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
				Our platform provides all the tools and features you need to build amazing applications
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<!-- Feature List -->
			<div class="space-y-8">
				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-gray-900 mb-2">User Authentication</h3>
						<p class="text-gray-600 leading-relaxed">Complete login and registration system with email validation and secure password handling.</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-gray-900 mb-2">Beautiful UI Components</h3>
						<p class="text-gray-600 leading-relaxed">Modern, accessible components built with TailwindCSS and thoughtful design principles.</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-xl flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-gray-900 mb-2">API Integration</h3>
						<p class="text-gray-600 leading-relaxed">Seamless backend integration with error handling, loading states, and real-time updates.</p>
					</div>
				</div>

				<div class="flex items-start space-x-4">
					<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-gray-900 mb-2">Mobile Responsive</h3>
						<p class="text-gray-600 leading-relaxed">Perfect experience across all devices with mobile-first design approach.</p>
					</div>
				</div>
			</div>

			<!-- Feature Image/Illustration -->
			<div class="relative">
				<div class="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 lg:p-12">
					<div class="space-y-4">
						<!-- Mock UI Elements -->
						<div class="bg-white rounded-2xl p-6 shadow-lg">
							<div class="flex items-center space-x-3 mb-4">
								<div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
								<div class="space-y-1">
									<div class="w-24 h-3 bg-gray-300 rounded"></div>
									<div class="w-16 h-2 bg-gray-200 rounded"></div>
								</div>
							</div>
							<div class="space-y-2">
								<div class="w-full h-3 bg-gray-100 rounded"></div>
								<div class="w-3/4 h-3 bg-gray-100 rounded"></div>
							</div>
						</div>

						<div class="bg-white rounded-2xl p-6 shadow-lg">
							<div class="space-y-3">
								<div class="flex justify-between items-center">
									<div class="w-20 h-3 bg-gray-300 rounded"></div>
									<div class="w-12 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
								</div>
								<div class="space-y-2">
									<div class="w-full h-2 bg-gray-100 rounded"></div>
									<div class="w-5/6 h-2 bg-gray-100 rounded"></div>
								</div>
							</div>
						</div>

						<div class="bg-white rounded-2xl p-6 shadow-lg">
							<div class="flex items-center justify-between">
								<div class="space-y-2">
									<div class="w-16 h-3 bg-gray-300 rounded"></div>
									<div class="w-24 h-2 bg-gray-200 rounded"></div>
								</div>
								<div class="w-16 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl"></div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Decorative elements -->
				<div class="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-2xl opacity-60 blur-xl"></div>
				<div class="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-600 rounded-2xl opacity-60 blur-xl"></div>
			</div>
		</div>
	</div>
</div>

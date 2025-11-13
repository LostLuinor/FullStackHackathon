<script>
	import { auth } from '$lib/stores/auth.js';
	import { api, ApiError } from '$lib/api.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let identifier = '';
	let password = '';
	let error = '';
	let successMessage = '';
	let isLoading = false;
	let rememberMe = false;
	let loginMode = 'email'; // 'email' or 'name'

	// Check for success message in URL params
	$: {
		const message = $page.url.searchParams.get('message');
		if (message) {
			successMessage = message;
			// Clear the URL parameter
			const url = new URL($page.url);
			url.searchParams.delete('message');
			history.replaceState({}, '', url);
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		
		if (!identifier || !password) {
			error = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		error = '';
		successMessage = '';
		
		try {			
			const credentials = { password: password };
			if (loginMode === 'email') {
				credentials.mail = identifier;
			} else {
				credentials.name = identifier;
			}
			
			const response = await api.login(credentials);
			if (response.status === 'ok' && response.user) {
				auth.login(response.user);
				goto('/dashboard');
			} else {
				error = response.message || 'Login failed';
			}
		} catch (err) {
			if (err instanceof ApiError) {
				error = err.data?.detail || err.message || 'Login failed';
			} else {
				error = 'An unexpected error occurred';
			}
		} finally {
			isLoading = false;
		}
	}

	function handleSocialLogin(platform) {
		// Placeholder for social login implementation
		console.log(`Login with ${platform}`);
	}

	function toggleLoginMode() {
		loginMode = loginMode === 'email' ? 'name' : 'email';
		identifier = '';
		error = '';
	}
</script>

<div class="min-h-screen auth-bg flex items-center justify-center p-4">
	<div class="w-full max-w-4xl">
		<div class="auth-card rounded-3xl shadow-2xl overflow-hidden">
			<div class="flex flex-col lg:flex-row min-h-[600px]">
				
				<!-- Left Panel - Welcome Message -->
				<div class="lg:w-1/2 bg-primary p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
					<!-- Decorative elements -->
					<div class="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-20 -translate-y-20"></div>
					<div class="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-16 translate-y-16"></div>
					
					<div class="relative z-10 text-center">
						<h2 class="text-4xl font-bold mb-4">Hello, Welcome!</h2>
						<p class="text-xl mb-8 opacity-90 leading-relaxed">
							Enter your personal details and start your journey with us
						</p>
						<div class="space-y-4">
							<p class="text-lg opacity-80">Don't have an account?</p>
							<a href="/signup" 
							   class="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-dark transition-all duration-300 transform hover:scale-105">
								Register
							</a>
						</div>
					</div>
				</div>

				<!-- Right Panel - Login Form -->
				<div class="lg:w-1/2 p-12 flex flex-col justify-center bg-white">
					<div class="max-w-md mx-auto w-full">
						<div class="text-center mb-8">
							<h1 class="text-3xl font-bold text-gray-800 mb-2">Login</h1>
							<p class="text-gray-600">Welcome back! Please login to your account</p>
						</div>

						<form on:submit={handleSubmit} class="space-y-6">
							<!-- Login Mode Toggle -->
							<div class="flex justify-center mb-6">
								<div class="bg-gray-100 rounded-full p-1">
									<button
										type="button"
										class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
										class:bg-primary={loginMode === 'email'}
										class:text-white={loginMode === 'email'}
										class:text-gray-600={loginMode !== 'email'}
										on:click={() => {loginMode = 'email'; identifier = ''; error = '';}}
									>
										Email
									</button>
									<button
										type="button"
										class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
										class:bg-primary={loginMode === 'name'}
										class:text-white={loginMode === 'name'}
										class:text-gray-600={loginMode !== 'name'}
										on:click={() => {loginMode = 'name'; identifier = ''; error = '';}}
									>
										Username
									</button>
								</div>
							</div>

							<!-- Email/Name Input -->
							<div class="space-y-2">
								<label for="identifier" class="block text-sm font-medium text-gray-700">
									{loginMode === 'email' ? 'Email' : 'Username'}
								</label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										{#if loginMode === 'email'}
											<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
											</svg>
										{:else}
											<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										{/if}
									</div>
									<input
										id="identifier"
										name="identifier"
										type={loginMode === 'email' ? 'email' : 'text'}
										autocomplete={loginMode === 'email' ? 'email' : 'username'}
										required
										bind:value={identifier}
										class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
										placeholder={loginMode === 'email' ? 'Enter your email' : 'Enter your username'}
									/>
								</div>
							</div>

							<!-- Password Input -->
							<div class="space-y-2">
								<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									</div>
									<input
										id="password"
										name="password"
										type="password"
										autocomplete="current-password"
										required
										bind:value={password}
										class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
										placeholder="Enter your password"
									/>
								</div>
							</div>

							<!-- Remember Me and Forgot Password -->
							<div class="flex items-center justify-between">
								<label class="flex items-center">
									<input
										type="checkbox"
										bind:checked={rememberMe}
										class="h-4 w-4 text-primary border-gray-300 rounded"
									/>
									<span class="ml-2 text-sm text-gray-600">Remember me</span>
								</label>
								<a href="#" class="text-sm text-primary hover:text-primary-dark font-medium">
									Forgot Password?
								</a>
							</div>

							<!-- Success Message -->
							{#if successMessage}
								<div class="bg-green-50 border border-green-200 rounded-2xl p-4">
									<div class="flex">
										<svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<p class="ml-3 text-sm text-green-700">{successMessage}</p>
									</div>
								</div>
							{/if}

							<!-- Error Message -->
							{#if error}
								<div class="bg-red-50 border border-red-200 rounded-2xl p-4">
									<div class="flex">
										<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<p class="ml-3 text-sm text-red-700">{error}</p>
									</div>
								</div>
							{/if}

							<!-- Login Button -->
							<button
								type="submit"
								disabled={isLoading}
								class="w-full primary-btn font-semibold py-3 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
							>
								{#if isLoading}
									<div class="flex items-center justify-center">
										<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Signing in...
									</div>
								{:else}
									Login
								{/if}
							</button>
						</form>

						<!-- Social Login -->
						<div class="mt-8">
							<div class="relative">
								<div class="absolute inset-0 flex items-center">
									<div class="w-full border-t border-gray-300"></div>
								</div>
								<div class="relative flex justify-center text-sm">
									<span class="px-2 bg-white text-gray-500">or login with social platforms</span>
								</div>
							</div>

							<div class="mt-6 grid grid-cols-4 gap-3">
								<!-- Google -->
								<button
									on:click={() => handleSocialLogin('google')}
									class="social-icon w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-2xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
								>
									<svg class="h-5 w-5" viewBox="0 0 24 24">
										<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
										<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
										<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
										<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
									</svg>
								</button>

								<!-- Facebook -->
								<button
									on:click={() => handleSocialLogin('facebook')}
									class="social-icon w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-2xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
								>
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd" />
									</svg>
								</button>

								<!-- GitHub -->
								<button
									on:click={() => handleSocialLogin('github')}
									class="social-icon w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-2xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
								>
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
									</svg>
								</button>

								<!-- LinkedIn -->
								<button
									on:click={() => handleSocialLogin('linkedin')}
									class="social-icon w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-2xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
								>
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
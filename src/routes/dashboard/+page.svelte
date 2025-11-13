<script>
	import { auth } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Redirect if not authenticated
	$: if (!$auth.isAuthenticated && !$auth.isLoading) {
		goto('/login');
	}

	let userData = $auth.user;
</script>

{#if $auth.isAuthenticated}
	<div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
		<!-- Header -->
		<div class="bg-white/70 backdrop-blur-xl border-b border-gray-200/20">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
						<p class="text-gray-600 mt-1">Welcome back, {userData?.name || userData?.email}!</p>
					</div>
					<div class="flex items-center space-x-4">
						<div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Profile Views</dt>
								<dd class="text-2xl font-bold text-gray-900">1,247</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
								<dd class="text-2xl font-bold text-gray-900">18</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Messages</dt>
								<dd class="text-2xl font-bold text-gray-900">7</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Activity Score</dt>
								<dd class="text-2xl font-bold text-gray-900">98%</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- User Profile Card -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
					<div class="flex items-center space-x-4 mb-6">
						<div class="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center">
							<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<div>
							<h3 class="text-2xl font-bold text-gray-900">Profile Information</h3>
							<p class="text-gray-600">Manage your account details</p>
						</div>
					</div>

					<div class="space-y-4">
						<div class="flex justify-between items-center py-3 border-b border-gray-100">
							<span class="text-sm font-medium text-gray-500">Full Name</span>
							<span class="text-sm text-gray-900 font-semibold">{userData?.name || 'Not provided'}</span>
						</div>
						<div class="flex justify-between items-center py-3 border-b border-gray-100">
							<span class="text-sm font-medium text-gray-500">Email</span>
							<span class="text-sm text-gray-900 font-semibold">{userData?.email || 'Not provided'}</span>
						</div>
						<div class="flex justify-between items-center py-3 border-b border-gray-100">
							<span class="text-sm font-medium text-gray-500">Member Since</span>
							<span class="text-sm text-gray-900 font-semibold">
								{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
							</span>
						</div>
						<div class="flex justify-between items-center py-3">
							<span class="text-sm font-medium text-gray-500">Status</span>
							<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
								Active
							</span>
						</div>
					</div>

					<div class="mt-6">
						<button class="w-full primary-btn font-semibold py-3 px-6 rounded-2xl shadow-lg">
							Edit Profile
						</button>
					</div>
				</div>

				<!-- Quick Actions Card -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
					<div class="mb-6">
						<h3 class="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h3>
						<p class="text-gray-600">Frequently used features</p>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<button class="group bg-primary text-white p-6 rounded-2xl hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 shadow-lg">
							<div class="text-center">
								<svg class="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
								<span class="text-sm font-medium">Analytics</span>
							</div>
						</button>

						<button class="group bg-green-600 text-white p-6 rounded-2xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
							<div class="text-center">
								<svg class="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								<span class="text-sm font-medium">Add New</span>
							</div>
						</button>

						<button class="group bg-orange-500 text-white p-6 rounded-2xl hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
							<div class="text-center">
								<svg class="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								<span class="text-sm font-medium">Settings</span>
							</div>
						</button>

						<button class="group bg-purple-500 text-white p-6 rounded-2xl hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
							<div class="text-center">
								<svg class="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span class="text-sm font-medium">Support</span>
							</div>
						</button>
					</div>
				</div>
			</div>

			<!-- Recent Activity Section -->
			<div class="mt-8 bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-2xl font-bold text-gray-900">Recent Activity</h3>
					<button class="text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
				</div>

				<div class="space-y-4">
					<div class="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/50 transition-colors duration-200">
						<div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-gray-900">Profile updated successfully</p>
							<p class="text-xs text-gray-500">2 hours ago</p>
						</div>
					</div>

					<div class="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/50 transition-colors duration-200">
						<div class="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-gray-900">New task created</p>
							<p class="text-xs text-gray-500">5 hours ago</p>
						</div>
					</div>

					<div class="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/50 transition-colors duration-200">
						<div class="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
							</svg>
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-gray-900">New message received</p>
							<p class="text-xs text-gray-500">1 day ago</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
		<div class="text-center">
			<div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 animate-spin">
				<div class="w-full h-full border-4 border-transparent border-t-white rounded-full"></div>
			</div>
			<p class="text-gray-600">Loading your dashboard...</p>
		</div>
	</div>
{/if}
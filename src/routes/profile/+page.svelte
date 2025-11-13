<script>
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	// Redirect if not authenticated
	$: if (!$auth.isAuthenticated && !$auth.isLoading) {
		goto('/login');
	}

	/** @type {any} */
	let profileData = null;
	let loading = true;
	let error = null;
	let isEditing = false;
	let saving = false;
	let activeTab = 'personal';
	let showPasswordForm = false;

	// Form data
	let personalInfo = {
		name: '',
		email: '',
		dateOfBirth: '',
		phone: '',
		bio: '',
		profilePicture: ''
	};

	let contactInfo = {
		address: '',
		city: '',
		country: '',
		emergencyContact: '',
		emergencyPhone: ''
	};

	let passwordForm = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	};

	let accountSettings = {
		emailNotifications: true,
		pushNotifications: true,
		weeklyProgress: true,
		courseUpdates: true,
		marketingEmails: false,
		language: 'en',
		timezone: 'UTC',
		theme: 'light'
	};

	// Mock profile data
	const mockProfile = {
		personalInfo: {
			id: $auth.user?.id || 1,
			name: $auth.user?.name || 'Sarah Johnson',
			email: $auth.user?.email || 'sarah.johnson@example.com',
			dateOfBirth: '1995-03-15',
			phone: '+1 (555) 123-4567',
			bio: 'Passionate about technology and continuous learning. Currently specializing in full-stack development and machine learning.',
			profilePicture: '👩‍💻',
			joinedDate: '2024-01-15'
		},
		contactInfo: {
			address: '123 Tech Street, Apt 456',
			city: 'San Francisco',
			country: 'United States',
			emergencyContact: 'John Johnson (Brother)',
			emergencyPhone: '+1 (555) 987-6543'
		},
		progressStats: {
			totalXP: 9850,
			level: 9,
			coursesCompleted: 5,
			coursesInProgress: 3,
			totalLessons: 127,
			completedLessons: 89,
			averageScore: 92,
			studyStreak: 12,
			totalStudyTime: 156, // hours
			badges: 8,
			certificates: 3,
			weeklyGoal: 10, // hours per week
			weeklyProgress: 7.5
		},
		accountSettings: {
			emailNotifications: true,
			pushNotifications: true,
			weeklyProgress: true,
			courseUpdates: true,
			marketingEmails: false,
			language: 'en',
			timezone: 'America/Los_Angeles',
			theme: 'light',
			privacy: 'friends',
			showProgress: true,
			allowMessages: true
		}
	};

	async function loadProfile() {
		try {
			loading = true;
			// Uncomment when backend is ready
			// profileData = await api.getStudentProfile();

			// Use mock data for now
			await new Promise(resolve => setTimeout(resolve, 800));
			profileData = mockProfile;
			
			// Populate form fields
			personalInfo = { ...profileData.personalInfo };
			contactInfo = { ...profileData.contactInfo };
			accountSettings = { ...profileData.accountSettings };
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			loading = false;
		}
	}

	async function saveProfile() {
		try {
			saving = true;
			const updateData = {
				personalInfo,
				contactInfo,
				accountSettings
			};

			// Uncomment when backend is ready
			// await api.updateStudentProfile(updateData);

			// Mock save
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Update local data
			profileData.personalInfo = { ...personalInfo };
			profileData.contactInfo = { ...contactInfo };
			profileData.accountSettings = { ...accountSettings };
			
			isEditing = false;
			alert('Profile updated successfully!');
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			saving = false;
		}
	}

	async function changePassword() {
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			alert('New passwords do not match');
			return;
		}

		if (passwordForm.newPassword.length < 6) {
			alert('Password must be at least 6 characters long');
			return;
		}

		try {
			saving = true;
			// Mock password change
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
			showPasswordForm = false;
			alert('Password changed successfully!');
		} catch (err) {
			error = /** @type {any} */(err).message;
		} finally {
			saving = false;
		}
	}

	function cancelEdit() {
		if (profileData) {
			personalInfo = { ...profileData.personalInfo };
			contactInfo = { ...profileData.contactInfo };
			accountSettings = { ...profileData.accountSettings };
		}
		isEditing = false;
	}

	function getProgressPercentage(current, total) {
		return Math.min((current / total) * 100, 100);
	}

	function formatStudyTime(hours) {
		if (hours < 1) return `${Math.round(hours * 60)} min`;
		return `${hours.toFixed(1)} hrs`;
	}

	onMount(() => {
		if ($auth.isAuthenticated) {
			loadProfile();
		}
	});
</script>

<svelte:head>
	<title>Profile - E-Learning Platform</title>
</svelte:head>

{#if $auth.isAuthenticated}
	{#if loading}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
			<div class="text-center">
				<LoadingSpinner size="large" />
				<p class="mt-4 text-lg text-gray-600">Loading your profile...</p>
			</div>
		</div>
	{:else if error}
		<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
			<div class="text-center">
				<div class="text-6xl mb-4">❌</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<button on:click={() => goto('/dashboard')} class="primary-btn px-6 py-3 rounded-xl">
					← Back to Dashboard
				</button>
			</div>
		</div>
	{:else if profileData}
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
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
								<span class="text-primary font-medium">Profile</span>
							</nav>
							<h1 class="text-4xl font-bold text-gray-900">👤 My Profile</h1>
							<p class="text-gray-600 mt-2 text-lg">Manage your personal information and settings</p>
						</div>
						<div class="flex space-x-3">
							{#if isEditing}
								<button on:click={cancelEdit} class="secondary-btn px-6 py-3 rounded-xl">
									Cancel
								</button>
								<button 
									on:click={saveProfile} 
									disabled={saving}
									class="primary-btn px-6 py-3 rounded-xl disabled:opacity-50"
								>
									{saving ? 'Saving...' : 'Save Changes'}
								</button>
							{:else}
								<button on:click={() => isEditing = true} class="primary-btn px-6 py-3 rounded-xl">
									Edit Profile
								</button>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<!-- Profile Summary Card -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl mb-8">
					<div class="flex items-center space-x-6">
						<div class="text-6xl">{profileData.personalInfo.profilePicture}</div>
						<div class="flex-1">
							<h2 class="text-3xl font-bold text-gray-900">{profileData.personalInfo.name}</h2>
							<p class="text-lg text-gray-600">{profileData.personalInfo.email}</p>
							<p class="text-gray-500 mt-1">Member since {new Date(profileData.personalInfo.joinedDate).toLocaleDateString()}</p>
							<div class="flex items-center space-x-6 mt-4 text-sm text-gray-600">
								<span>Level {profileData.progressStats.level}</span>
								<span>•</span>
								<span>{profileData.progressStats.totalXP.toLocaleString()} XP</span>
								<span>•</span>
								<span>{profileData.progressStats.coursesCompleted} Courses Completed</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Tab Navigation -->
				<div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl mb-8 overflow-hidden">
					<div class="flex border-b border-gray-200">
						<button
							on:click={() => activeTab = 'personal'}
							class="flex-1 px-6 py-4 text-center font-medium transition-colors {
								activeTab === 'personal' 
									? 'bg-primary text-white' 
									: 'text-gray-600 hover:text-primary hover:bg-gray-50'
							}"
						>
							👤 Personal Info
						</button>
						<button
							on:click={() => activeTab = 'contact'}
							class="flex-1 px-6 py-4 text-center font-medium transition-colors {
								activeTab === 'contact' 
									? 'bg-primary text-white' 
									: 'text-gray-600 hover:text-primary hover:bg-gray-50'
							}"
						>
							📧 Contact Info
						</button>
						<button
							on:click={() => activeTab = 'progress'}
							class="flex-1 px-6 py-4 text-center font-medium transition-colors {
								activeTab === 'progress' 
									? 'bg-primary text-white' 
									: 'text-gray-600 hover:text-primary hover:bg-gray-50'
							}"
						>
							📊 Progress
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

					<!-- Tab Content -->
					<div class="p-8">
						{#if activeTab === 'personal'}
							<div class="space-y-6">
								<h3 class="text-xl font-bold text-gray-900">Personal Information</h3>
								
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
										<input
											bind:value={personalInfo.name}
											disabled={!isEditing}
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
										<input
											bind:value={personalInfo.email}
											disabled={!isEditing}
											type="email"
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
										<input
											bind:value={personalInfo.dateOfBirth}
											disabled={!isEditing}
											type="date"
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
										<input
											bind:value={personalInfo.phone}
											disabled={!isEditing}
											type="tel"
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
								</div>
								
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
									<textarea
										bind:value={personalInfo.bio}
										disabled={!isEditing}
										rows="4"
										class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 resize-none"
									></textarea>
								</div>

								<!-- Change Password Section -->
								<div class="border-t border-gray-200 pt-6">
									<div class="flex items-center justify-between mb-4">
										<h4 class="text-lg font-medium text-gray-900">Password</h4>
										{#if !showPasswordForm}
											<button 
												on:click={() => showPasswordForm = true}
												class="secondary-btn px-4 py-2 rounded-lg text-sm"
											>
												Change Password
											</button>
										{/if}
									</div>

									{#if showPasswordForm}
										<div class="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
											<div>
												<label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
												<input
													bind:value={passwordForm.currentPassword}
													type="password"
													class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
												/>
											</div>
											<div>
												<label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
												<input
													bind:value={passwordForm.newPassword}
													type="password"
													class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
												/>
											</div>
											<div>
												<label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
												<input
													bind:value={passwordForm.confirmPassword}
													type="password"
													class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
												/>
											</div>
											<div class="flex space-x-3">
												<button 
													on:click={() => showPasswordForm = false}
													class="secondary-btn px-4 py-2 rounded-lg text-sm"
												>
													Cancel
												</button>
												<button 
													on:click={changePassword}
													disabled={saving}
													class="primary-btn px-4 py-2 rounded-lg text-sm disabled:opacity-50"
												>
													{saving ? 'Updating...' : 'Update Password'}
												</button>
											</div>
										</div>
									{/if}
								</div>
							</div>

						{:else if activeTab === 'contact'}
							<div class="space-y-6">
								<h3 class="text-xl font-bold text-gray-900">Contact Information</h3>
								
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div class="md:col-span-2">
										<label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
										<input
											bind:value={contactInfo.address}
											disabled={!isEditing}
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">City</label>
										<input
											bind:value={contactInfo.city}
											disabled={!isEditing}
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
										<input
											bind:value={contactInfo.country}
											disabled={!isEditing}
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
										<input
											bind:value={contactInfo.emergencyContact}
											disabled={!isEditing}
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
										<input
											bind:value={contactInfo.emergencyPhone}
											disabled={!isEditing}
											type="tel"
											class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
										/>
									</div>
								</div>
							</div>

						{:else if activeTab === 'progress'}
							<div class="space-y-6">
								<h3 class="text-xl font-bold text-gray-900">Progress Statistics</h3>
								
								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
									<div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6">
										<div class="text-3xl font-bold">{profileData.progressStats.totalXP.toLocaleString()}</div>
										<div class="text-blue-100 mt-1">Total XP</div>
									</div>
									<div class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
										<div class="text-3xl font-bold">{profileData.progressStats.coursesCompleted}</div>
										<div class="text-green-100 mt-1">Courses Completed</div>
									</div>
									<div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6">
										<div class="text-3xl font-bold">{profileData.progressStats.averageScore}%</div>
										<div class="text-purple-100 mt-1">Average Score</div>
									</div>
									<div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-6">
										<div class="text-3xl font-bold">{profileData.progressStats.studyStreak}</div>
										<div class="text-orange-100 mt-1">Day Streak</div>
									</div>
								</div>

								<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<!-- Learning Progress -->
									<div class="bg-white border border-gray-200 rounded-2xl p-6">
										<h4 class="text-lg font-medium text-gray-900 mb-4">Learning Progress</h4>
										<div class="space-y-4">
											<div>
												<div class="flex items-center justify-between text-sm text-gray-600 mb-2">
													<span>Lessons Completed</span>
													<span>{profileData.progressStats.completedLessons}/{profileData.progressStats.totalLessons}</span>
												</div>
												<div class="bg-gray-200 rounded-full h-2">
													<div 
														class="bg-blue-500 rounded-full h-2 transition-all duration-500"
														style="width: {getProgressPercentage(profileData.progressStats.completedLessons, profileData.progressStats.totalLessons)}%"
													></div>
												</div>
											</div>
											<div>
												<div class="flex items-center justify-between text-sm text-gray-600 mb-2">
													<span>Weekly Goal</span>
													<span>{formatStudyTime(profileData.progressStats.weeklyProgress)} / {formatStudyTime(profileData.progressStats.weeklyGoal)}</span>
												</div>
												<div class="bg-gray-200 rounded-full h-2">
													<div 
														class="bg-green-500 rounded-full h-2 transition-all duration-500"
														style="width: {getProgressPercentage(profileData.progressStats.weeklyProgress, profileData.progressStats.weeklyGoal)}%"
													></div>
												</div>
											</div>
										</div>
									</div>

									<!-- Achievements -->
									<div class="bg-white border border-gray-200 rounded-2xl p-6">
										<h4 class="text-lg font-medium text-gray-900 mb-4">Achievements</h4>
										<div class="grid grid-cols-3 gap-4 text-center">
											<div>
												<div class="text-2xl font-bold text-yellow-600">{profileData.progressStats.badges}</div>
												<div class="text-sm text-gray-600">Badges</div>
											</div>
											<div>
												<div class="text-2xl font-bold text-purple-600">{profileData.progressStats.certificates}</div>
												<div class="text-sm text-gray-600">Certificates</div>
											</div>
											<div>
												<div class="text-2xl font-bold text-blue-600">{formatStudyTime(profileData.progressStats.totalStudyTime)}</div>
												<div class="text-sm text-gray-600">Study Time</div>
											</div>
										</div>
									</div>
								</div>
							</div>

						{:else if activeTab === 'settings'}
							<div class="space-y-6">
								<h3 class="text-xl font-bold text-gray-900">Account Settings</h3>
								
								<!-- Notifications -->
								<div class="bg-white border border-gray-200 rounded-2xl p-6">
									<h4 class="text-lg font-medium text-gray-900 mb-4">Notifications</h4>
									<div class="space-y-4">
										<div class="flex items-center justify-between">
											<div>
												<label class="text-sm font-medium text-gray-700">Email Notifications</label>
												<p class="text-xs text-gray-500">Receive notifications via email</p>
											</div>
											<label class="relative inline-flex items-center cursor-pointer">
												<input 
													type="checkbox" 
													bind:checked={accountSettings.emailNotifications}
													disabled={!isEditing}
													class="sr-only peer"
												>
												<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
											</label>
										</div>
										<div class="flex items-center justify-between">
											<div>
												<label class="text-sm font-medium text-gray-700">Push Notifications</label>
												<p class="text-xs text-gray-500">Receive push notifications</p>
											</div>
											<label class="relative inline-flex items-center cursor-pointer">
												<input 
													type="checkbox" 
													bind:checked={accountSettings.pushNotifications}
													disabled={!isEditing}
													class="sr-only peer"
												>
												<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
											</label>
										</div>
										<div class="flex items-center justify-between">
											<div>
												<label class="text-sm font-medium text-gray-700">Weekly Progress</label>
												<p class="text-xs text-gray-500">Weekly progress summary</p>
											</div>
											<label class="relative inline-flex items-center cursor-pointer">
												<input 
													type="checkbox" 
													bind:checked={accountSettings.weeklyProgress}
													disabled={!isEditing}
													class="sr-only peer"
												>
												<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
											</label>
										</div>
									</div>
								</div>

								<!-- Preferences -->
								<div class="bg-white border border-gray-200 rounded-2xl p-6">
									<h4 class="text-lg font-medium text-gray-900 mb-4">Preferences</h4>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
											<select
												bind:value={accountSettings.language}
												disabled={!isEditing}
												class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
											>
												<option value="en">English</option>
												<option value="es">Spanish</option>
												<option value="fr">French</option>
												<option value="de">German</option>
											</select>
										</div>
										<div>
											<label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
											<select
												bind:value={accountSettings.timezone}
												disabled={!isEditing}
												class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
											>
												<option value="America/Los_Angeles">Pacific Time</option>
												<option value="America/Denver">Mountain Time</option>
												<option value="America/Chicago">Central Time</option>
												<option value="America/New_York">Eastern Time</option>
												<option value="UTC">UTC</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						{/if}
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
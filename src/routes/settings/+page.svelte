<script>
    import { onMount } from 'svelte';
    import api from '$lib/api.js';
    import { auth } from '$lib/stores/auth.js';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let settings = null;
    let loading = true;
    let error = '';
    let success = '';
    let saving = false;

    // Password change form
    let passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    let showPasswords = false;
    let passwordStrength = 0;

    // Settings form
    let settingsForm = {
        notifications: {
            email: true,
            push: true,
            courseUpdates: true,
            newLessons: true,
            quizReminders: true,
            achievements: true,
            weeklyDigest: false,
            marketingEmails: false
        },
        preferences: {
            darkMode: false,
            language: 'en',
            timezone: 'UTC',
            emailFrequency: 'immediate',
            autoplay: true,
            subtitles: false
        },
        privacy: {
            profileVisibility: 'public',
            showProgress: true,
            showAchievements: true,
            allowDataCollection: true
        }
    };

    // Mock current settings
    const mockSettings = {
        notifications: {
            email: true,
            push: false,
            courseUpdates: true,
            newLessons: true,
            quizReminders: false,
            achievements: true,
            weeklyDigest: true,
            marketingEmails: false
        },
        preferences: {
            darkMode: false,
            language: 'en',
            timezone: 'America/New_York',
            emailFrequency: 'daily',
            autoplay: true,
            subtitles: false
        },
        privacy: {
            profileVisibility: 'public',
            showProgress: true,
            showAchievements: true,
            allowDataCollection: true
        }
    };

    onMount(async () => {
        await loadSettings();
    });

    async function loadSettings() {
        try {
            loading = true;
            // const response = await api.getUserSettings();
            // settings = response.data;
            
            setTimeout(() => {
                settings = mockSettings;
                settingsForm = { ...settings };
                loading = false;
            }, 600);
        } catch (err) {
            error = 'Failed to load settings';
            loading = false;
        }
    }

    async function saveSettings() {
        try {
            saving = true;
            error = '';
            success = '';

            // await api.updateUserSettings(settingsForm);
            
            // Simulate API call
            setTimeout(() => {
                success = 'Settings saved successfully!';
                settings = { ...settingsForm };
                saving = false;
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    success = '';
                }, 3000);
            }, 800);

        } catch (err) {
            error = 'Failed to save settings';
            saving = false;
        }
    }

    async function changePassword() {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            error = 'New passwords do not match';
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            error = 'Password must be at least 8 characters long';
            return;
        }

        try {
            saving = true;
            error = '';
            success = '';

            // await api.changePassword(passwordForm);
            
            // Simulate API call
            setTimeout(() => {
                success = 'Password changed successfully!';
                passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
                saving = false;
                
                setTimeout(() => {
                    success = '';
                }, 3000);
            }, 800);

        } catch (err) {
            error = 'Failed to change password';
            saving = false;
        }
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^A-Za-z0-9]/.test(password)) strength += 10;
        return Math.min(strength, 100);
    }

    function getPasswordStrengthColor(strength) {
        if (strength < 30) return 'bg-red-500';
        if (strength < 60) return 'bg-yellow-500';
        if (strength < 80) return 'bg-blue-500';
        return 'bg-green-500';
    }

    function getPasswordStrengthLabel(strength) {
        if (strength < 30) return 'Weak';
        if (strength < 60) return 'Fair';
        if (strength < 80) return 'Good';
        return 'Strong';
    }

    $: passwordStrength = calculatePasswordStrength(passwordForm.newPassword);
</script>

<svelte:head>
    <title>Settings - Account Preferences</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-indigo-200/50 p-6 mb-8">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ⚙️ Settings
            </h1>
            <p class="text-gray-600 mt-2">Manage your account preferences and security</p>
        </div>

        <!-- Status Messages -->
        {#if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p class="text-red-600 font-medium">⚠️ {error}</p>
            </div>
        {/if}

        {#if success}
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p class="text-green-600 font-medium">✅ {success}</p>
            </div>
        {/if}

        {#if loading}
            <div class="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        {:else}
            <div class="space-y-8">
                
                <!-- Password Change Section -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-red-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🔐 Change Password
                    </h3>
                    
                    <div class="space-y-4 max-w-md">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <div class="relative">
                                <input 
                                    type={showPasswords ? 'text' : 'password'} 
                                    bind:value={passwordForm.currentPassword}
                                    class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                                    placeholder="Enter current password"
                                />
                                <button 
                                    type="button"
                                    on:click={() => showPasswords = !showPasswords}
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input 
                                type={showPasswords ? 'text' : 'password'} 
                                bind:value={passwordForm.newPassword}
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                                placeholder="Enter new password"
                            />
                            {#if passwordForm.newPassword}
                                <div class="mt-2">
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-gray-600">Password Strength</span>
                                        <span class="font-medium">{getPasswordStrengthLabel(passwordStrength)}</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div class="{getPasswordStrengthColor(passwordStrength)} h-2 rounded-full transition-all duration-300" style="width: {passwordStrength}%"></div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input 
                                type={showPasswords ? 'text' : 'password'} 
                                bind:value={passwordForm.confirmPassword}
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                                placeholder="Confirm new password"
                            />
                        </div>
                        
                        <button 
                            on:click={changePassword}
                            disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                            class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </div>

                <!-- Notification Preferences -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🔔 Notification Preferences
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-semibold text-gray-700 mb-4">Communication</h4>
                            <div class="space-y-3">
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.notifications.email} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Email notifications</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.notifications.push} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Push notifications</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.notifications.weeklyDigest} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Weekly digest</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.notifications.marketingEmails} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Marketing emails</span>
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-700 mb-4">Course Updates</h4>
                            <div class="space-y-3">
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.notifications.courseUpdates} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Course updates</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.notifications.newLessons} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">New lessons</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.notifications.quizReminders} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Quiz reminders</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.notifications.achievements} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Achievement notifications</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Display & Accessibility -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🎨 Display & Accessibility
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <label class="flex items-center justify-between">
                                    <span class="text-gray-700 font-medium">Dark Mode</span>
                                    <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input 
                                            type="checkbox" 
                                            bind:checked={settingsForm.preferences.darkMode}
                                            class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                        />
                                        <label class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                    </div>
                                </label>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                <select bind:value={settingsForm.preferences.language} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="zh">Chinese</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                <select bind:value={settingsForm.preferences.timezone} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Europe/Paris">Paris</option>
                                    <option value="Asia/Tokyo">Tokyo</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Frequency</label>
                                <select bind:value={settingsForm.preferences.emailFrequency} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                    <option value="immediate">Immediate</option>
                                    <option value="daily">Daily digest</option>
                                    <option value="weekly">Weekly summary</option>
                                    <option value="never">Never</option>
                                </select>
                            </div>
                            
                            <div class="space-y-3">
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.preferences.autoplay} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Autoplay videos</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" bind:checked={settingsForm.preferences.subtitles} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    <span class="ml-2 text-gray-700">Show subtitles by default</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Privacy Settings -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        🔒 Privacy Settings
                    </h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                            <select bind:value={settingsForm.privacy.profileVisibility} class="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                <option value="public">Public</option>
                                <option value="friends">Friends only</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        
                        <div class="space-y-3">
                            <label class="flex items-center">
                                <input type="checkbox" bind:checked={settingsForm.privacy.showProgress} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                <span class="ml-2 text-gray-700">Show learning progress to others</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" bind:checked={settingsForm.privacy.showAchievements} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                <span class="ml-2 text-gray-700">Display achievements publicly</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" bind:checked={settingsForm.privacy.allowDataCollection} class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                <span class="ml-2 text-gray-700">Allow data collection for platform improvement</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="font-semibold text-gray-800">Save Changes</h4>
                            <p class="text-sm text-gray-600 mt-1">Your preferences will be applied immediately</p>
                        </div>
                        <button 
                            on:click={saveSettings}
                            disabled={saving}
                            class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .backdrop-blur-xl {
        backdrop-filter: blur(20px);
    }
    
    .toggle-checkbox:checked {
        right: 0;
        border-color: #6366f1;
        background-color: #6366f1;
    }
    
    .toggle-checkbox:checked + .toggle-label {
        background-color: #6366f1;
    }
</style>
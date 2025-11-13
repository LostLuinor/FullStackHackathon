<script>
    import { auth } from '$lib/stores/auth.js';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    async function handleLogout() {
        try {
            await auth.logout();
            goto('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
</script>

<nav class="bg-white/90 backdrop-blur-xl border-b border-gray-200/20 shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="text-2xl font-bold text-primary">
                        My App
                    </a>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a 
                        href="/" 
                        class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 {$page.url.pathname === '/' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                    >
                        Home
                    </a>
                    {#if $auth.isAuthenticated}
                        <a 
                            href="/dashboard" 
                            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 {$page.url.pathname === '/dashboard' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                        >
                            Dashboard
                        </a>
                        <a 
                            href="/courses" 
                            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 {$page.url.pathname.startsWith('/courses') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                        >
                            Courses
                        </a>
                    {/if}
                </div>
            </div>
            
            <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                {#if $auth.isAuthenticated}
                    <div class="flex items-center space-x-4">
                        <div class="text-sm text-gray-700">
                            Welcome, <span class="font-semibold">{$auth.user?.name || $auth.user?.email}</span>
                        </div>
                        <button
                            on:click={handleLogout}
                            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                {:else}
                    <div class="flex items-center space-x-3">
                        <a
                            href="/login"
                            class="text-gray-700 hover:text-primary px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
                        >
                            Login
                        </a>
                        <a
                            href="/signup"
                            class="primary-btn px-4 py-2 rounded-xl text-sm font-medium shadow-md"
                        >
                            Sign Up
                        </a>
                    </div>
                {/if}
            </div>
            
            <!-- Mobile menu button -->
            <div class="sm:hidden flex items-center">
                <button
                    type="button"
                    class="bg-white/50 backdrop-blur-xl inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 transition-colors duration-200"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                >
                    <span class="sr-only">Open main menu</span>
                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Mobile menu -->
    <div class="sm:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/20" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
            <a href="/" class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {$page.url.pathname === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}">Home</a>
            {#if $auth.isAuthenticated}
                <a href="/dashboard" class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {$page.url.pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}">Dashboard</a>
                <a href="/courses" class="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 {$page.url.pathname.startsWith('/courses') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}">Courses</a>
            {/if}
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
            {#if $auth.isAuthenticated}
                <div class="px-4">
                    <div class="text-base font-medium text-gray-800">{$auth.user?.name || $auth.user?.email}</div>
                </div>
                <div class="mt-3 space-y-1">
                    <button
                        on:click={handleLogout}
                        class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>
            {:else}
                <div class="space-y-1">
                    <a href="/login" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200">Login</a>
                    <a href="/signup" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200">Sign Up</a>
                </div>
            {/if}
        </div>
    </div>
</nav>
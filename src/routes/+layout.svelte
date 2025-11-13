<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';
	import { auth } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		// Initialize auth state from localStorage
		auth.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<Navigation />
	<main>
		{@render children()}
	</main>
</div>

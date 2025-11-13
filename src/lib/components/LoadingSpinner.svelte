<script>
	export let size = 'medium'; // small, medium, large
	export let color = 'indigo'; // indigo, white, gray
	
	const sizeClasses = {
		small: 'h-4 w-4',
		medium: 'h-8 w-8',
		large: 'h-16 w-16'
	};
	
	const colorClasses = {
		indigo: 'border-indigo-600',
		white: 'border-white',
		gray: 'border-gray-600'
	};
</script>

<div class="flex justify-center items-center">
	<div class="animate-spin rounded-full {sizeClasses[size]} border-b-2 {colorClasses[color]}"></div>
</div>
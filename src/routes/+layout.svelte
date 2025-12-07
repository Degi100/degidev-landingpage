<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../styles/global.scss';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>DegiDev</title>
</svelte:head>

{@render children()}

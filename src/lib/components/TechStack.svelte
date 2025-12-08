<script lang="ts">
	import { stackToTechItems, groupByCategory, type Category } from '$lib/tech-utils';
	import TechBadge from './TechBadge.svelte';

	let { stack }: { stack: string[] } = $props();

	function getGroupedTech(techStack: string[]) {
		const items = stackToTechItems(techStack);
		const grouped = groupByCategory(items);
		const order: Category[] = ['frontend', 'backend', 'database', 'tools', 'language'];
		return order
			.filter(cat => grouped[cat].length > 0)
			.map(cat => ({ category: cat, items: grouped[cat] }));
	}
</script>

<div class="tech-stack">
	{#each getGroupedTech(stack) as group}
		<div class="tech-category">
			{#each group.items as tech}
				<TechBadge {tech} />
			{/each}
		</div>
	{/each}
</div>

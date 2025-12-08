<script lang="ts">
	import { getDeviconClass, CATEGORY_COLORS, type TechItem } from '$lib/tech-utils';

	let { tech }: { tech: TechItem } = $props();
</script>

<span class="tech-badge" title={tech.name} style="--cat-color: {CATEGORY_COLORS[tech.category]}">
	<i class={getDeviconClass(tech.icon)}></i>
	<span class="tech-name">{tech.name}</span>
</span>

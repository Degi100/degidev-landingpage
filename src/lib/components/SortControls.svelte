<script lang="ts">
	import { type SortOption, sortOptions } from '$lib/types';

	let {
		currentSort,
		onSortChange
	}: {
		currentSort: SortOption;
		onSortChange: (sort: SortOption) => void;
	} = $props();

	let isOpen = $state(false);

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectOption(value: SortOption) {
		onSortChange(value);
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.sort-dropdown')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="sort-dropdown">
	<button class="sort-toggle" onclick={toggleDropdown}>
		<span class="sort-icon">{sortOptions[currentSort].icon}</span>
		<span class="sort-label">{sortOptions[currentSort].label}</span>
		<span class="sort-arrow" class:open={isOpen}>▼</span>
	</button>
	{#if isOpen}
		<div class="sort-menu">
			{#each Object.entries(sortOptions) as [value, config]}
				<button
					class="sort-option"
					class:active={currentSort === value}
					onclick={() => selectOption(value as SortOption)}
				>
					<span class="sort-icon">{config.icon}</span>
					<span>{config.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

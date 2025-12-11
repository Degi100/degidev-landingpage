<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import {
		ProjectCard,
		ProjectModal,
		AdminControls,
		SortControls,
		CircleView
	} from '$lib/components';
	import { type Project, type SortOption, statusConfig } from '$lib/types';

	let { data }: { data: PageData } = $props();

	// Sort state with LocalStorage
	const SORT_STORAGE_KEY = 'degidev-sort-preference';
	const VIEW_STORAGE_KEY = 'degidev-view-preference';
	const validSortOptions: SortOption[] = ['live', 'beta', 'wip', 'coming_soon', 'alpha'];

	let currentSort = $state<SortOption>('live');
	let viewMode = $state<'grid' | 'circle'>('grid');

	// Load preferences after mount
	$effect(() => {
		if (browser) {
			// Load sort preference
			const savedSort = localStorage.getItem(SORT_STORAGE_KEY);
			if (savedSort && validSortOptions.includes(savedSort as SortOption)) {
				currentSort = savedSort as SortOption;
			}

			// Load view preference
			const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
			if (savedView === 'grid' || savedView === 'circle') {
				viewMode = savedView;
			}
		}
	});

	function handleSortChange(sort: SortOption) {
		currentSort = sort;
		if (browser) {
			localStorage.setItem(SORT_STORAGE_KEY, sort);
		}
	}

	function toggleViewMode() {
		viewMode = viewMode === 'grid' ? 'circle' : 'grid';
		if (browser) {
			localStorage.setItem(VIEW_STORAGE_KEY, viewMode);
		}
	}

	// Effective view mode (now supports circle on mobile too)
	const effectiveViewMode = $derived(viewMode);

	// Sorted projects - gewaehlter Status zuerst, dann die anderen nach Prioritaet
	const sortedProjects = $derived.by(() => {
		const projects = [...data.projects] as Project[];

		if (currentSort === 'alpha') {
			return projects.sort((a, b) => a.name.localeCompare(b.name, 'de'));
		}

		// Status-basierte Sortierung: gewaehlter Status zuerst
		const priorityStatus = currentSort;
		return projects.sort((a, b) => {
			const statusA = a.status || 'live';
			const statusB = b.status || 'live';

			// Gewaehlter Status hat hoechste Prioritaet (kommt zuerst)
			const isAPriority = statusA === priorityStatus;
			const isBPriority = statusB === priorityStatus;

			if (isAPriority && !isBPriority) return -1;
			if (!isAPriority && isBPriority) return 1;

			// Innerhalb gleicher Gruppe: nach normaler Status-Prioritaet
			const priorityA = statusConfig[statusA].priority;
			const priorityB = statusConfig[statusB].priority;
			if (priorityA !== priorityB) return priorityA - priorityB;

			return a.order - b.order;
		});
	});

	// UI state
	let expandedStack = $state<string | null>(null);
	let showModal = $state(false);
	let editingProject = $state<Project | null>(null);
	let deleteConfirm = $state<string | null>(null);

	function toggleStack(id: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		expandedStack = expandedStack === id ? null : id;
	}

	function openAddModal() {
		editingProject = null;
		showModal = true;
	}

	function openEditModal(project: Project, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		editingProject = project;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingProject = null;
	}

	function confirmDelete(id: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		deleteConfirm = id;
	}

	function cancelDelete(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		deleteConfirm = null;
	}
</script>

<main class="container" class:circle-mode={effectiveViewMode === 'circle'}>
	{#if effectiveViewMode === 'circle'}
		<!-- Circle View - ohne Header, View Toggle eingebaut -->
		<CircleView
			projects={sortedProjects}
			isAdmin={!!data.user}
			onEdit={openEditModal}
			onDeleteConfirm={confirmDelete}
			onToggleView={toggleViewMode}
			onAddProject={openAddModal}
			username={data.user?.username}
		/>
	{:else}
		<!-- Grid View - normaler Header -->
		<header class="home-header">
			<h1>DegiDev</h1>
			<p class="subtitle">Meine Projekte & Services</p>
			{#if data.user}
				<AdminControls username={data.user.username} onAddProject={openAddModal} />
			{/if}
		</header>

		<section class="projects">
			<div class="projects-header">
				<button class="view-toggle" onclick={toggleViewMode} title="Ansicht wechseln">
					<span class="view-icon">◯</span>
					<span class="view-label">Circle</span>
				</button>
				<SortControls {currentSort} onSortChange={handleSortChange} />
			</div>
			{#if sortedProjects.length === 0}
				<p class="empty">Noch keine Projekte vorhanden.</p>
			{:else}
				<div class="grid">
					{#each sortedProjects as project (project._id)}
						<ProjectCard
							{project}
							isAdmin={!!data.user}
							{expandedStack}
							{deleteConfirm}
							onToggleStack={toggleStack}
							onEdit={openEditModal}
							onDeleteConfirm={confirmDelete}
							onDeleteCancel={cancelDelete}
						/>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</main>

{#if data.user}
	<ProjectModal
		show={showModal}
		{editingProject}
		onClose={closeModal}
		onSuccess={() => {}}
	/>
{/if}

<footer class="site-footer">
	<a href="/impressum">Impressum</a>
</footer>

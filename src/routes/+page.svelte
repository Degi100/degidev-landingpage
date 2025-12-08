<script lang="ts">
	import type { PageData } from './$types';
	import { ProjectCard, ProjectModal, AdminControls } from '$lib/components';

	let { data }: { data: PageData } = $props();

	// UI state
	let expandedStack = $state<string | null>(null);
	let showModal = $state(false);
	let editingProject = $state<typeof data.projects[0] | null>(null);
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

	function openEditModal(project: typeof data.projects[0], event: MouseEvent) {
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

<main class="container">
	<header class="home-header">
		<h1>DegiDev</h1>
		<p class="subtitle">Meine Projekte & Services</p>
		{#if data.user}
			<AdminControls username={data.user.username} onAddProject={openAddModal} />
		{/if}
	</header>

	<section class="projects">
		{#if data.projects.length === 0}
			<p class="empty">Noch keine Projekte vorhanden.</p>
		{:else}
			<div class="grid">
				{#each data.projects as project (project._id)}
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
</main>

{#if data.user}
	<ProjectModal
		show={showModal}
		{editingProject}
		onClose={closeModal}
		onSuccess={() => {}}
	/>
{/if}

<script lang="ts">
	import { type Project, statusConfig } from '$lib/types';
	import TechStack from './TechStack.svelte';

	let {
		projects,
		isAdmin = false,
		username,
		onEdit,
		onDeleteConfirm,
		onToggleView,
		onAddProject
	}: {
		projects: Project[];
		isAdmin?: boolean;
		username?: string;
		onEdit?: (project: Project, event: MouseEvent) => void;
		onDeleteConfirm?: (id: string, event: MouseEvent) => void;
		onToggleView?: () => void;
		onAddProject?: () => void;
	} = $props();

	let hoveredId = $state<string | null>(null);

	function handleMouseEnter(id: string) {
		hoveredId = id;
	}

	function handleMouseLeave() {
		hoveredId = null;
	}

	// Calculate position on circle for each project
	function getPosition(index: number, total: number) {
		const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
		const radius = 42; // percentage from center
		const x = 50 + radius * Math.cos(angle);
		const y = 50 + radius * Math.sin(angle);
		return { x, y, angle };
	}
</script>

<div class="circle-container">
	<!-- Top controls -->
	<div class="circle-controls">
		<button class="view-toggle" onclick={onToggleView} title="Zur Grid-Ansicht">
			<span class="view-icon">▦</span>
			<span class="view-label">Grid</span>
		</button>
		{#if isAdmin && username}
			<div class="circle-admin-top">
				<span class="admin-user">{username}</span>
				<button class="admin-add-btn" onclick={onAddProject}>+ Projekt</button>
				<form method="POST" action="/logout">
					<button type="submit" class="admin-logout-btn">Logout</button>
				</form>
			</div>
		{/if}
	</div>

	<div class="circle-wrapper">
		<!-- Center branding -->
		<div class="center-brand">
			<div class="brand-logo">D</div>
			<span class="brand-name">DegiDev</span>
			<span class="brand-tagline">Projekte & Services</span>
		</div>

		<!-- Project items around the circle -->
		{#each projects as project, index}
			{@const pos = getPosition(index, projects.length)}
			{@const status = statusConfig[project.status || 'live']}
			{@const isHovered = hoveredId === project._id}
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				class="circle-item"
				class:expanded={isHovered}
				class:coming-soon={project.status === 'coming_soon'}
				style="left: {pos.x}%; top: {pos.y}%;"
				onmouseenter={() => handleMouseEnter(project._id)}
				onmouseleave={handleMouseLeave}
			>
				<div class="item-card">
					<!-- Icon/Avatar always visible -->
					<div class="card-icon-wrap">
						{#if project.icon}
							<img src={project.icon} alt={project.name} class="card-icon" />
						{:else}
							<span class="card-fallback">{project.name.charAt(0)}</span>
						{/if}
					</div>

					<!-- Expanded content -->
					<div class="card-content">
						<div class="card-header">
							<h3 class="card-title">{project.name}</h3>
							<span class="card-status {status.class}">{status.label}</span>
						</div>
						<p class="card-description">{project.description}</p>
						{#if project.stack && project.stack.length > 0}
							<div class="card-stack">
								<TechStack stack={project.stack} expanded={true} />
							</div>
						{/if}
						<span class="card-hint">Klicken zum Öffnen →</span>
					</div>
				</div>

				<!-- Status badge (visible when not expanded) -->
				{#if !isHovered && status.label}
					<span class="item-status {status.class}">{status.label}</span>
				{/if}

				<!-- Name below circle (visible when not expanded) -->
				{#if !isHovered}
					<span class="item-name">{project.name}</span>
				{/if}
			</a>
		{/each}
	</div>

	<!-- Admin actions for hovered project -->
	{#if isAdmin && hoveredId}
		{@const hoveredProject = projects.find(p => p._id === hoveredId)}
		{#if hoveredProject}
			<div class="circle-admin-actions">
				<button
					class="admin-btn edit"
					onclick={(e) => onEdit?.(hoveredProject, e)}
				>
					Bearbeiten
				</button>
				<button
					class="admin-btn delete"
					onclick={(e) => onDeleteConfirm?.(hoveredProject._id, e)}
				>
					Löschen
				</button>
			</div>
		{/if}
	{/if}
</div>

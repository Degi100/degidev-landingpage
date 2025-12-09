<script lang="ts">
	import { type Project, statusConfig } from '$lib/types';
	import { techNameToItem, getDeviconClass, CATEGORY_COLORS } from '$lib/tech-utils';
	import { browser } from '$app/environment';

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
	let expandedStackId = $state<string | null>(null);
	let isTouchDevice = $state(false);

	// Detect touch device
	$effect(() => {
		if (browser) {
			isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		}
	});

	function handleMouseEnter(id: string) {
		if (!isTouchDevice) {
			hoveredId = id;
		}
	}

	function handleMouseLeave() {
		if (!isTouchDevice) {
			hoveredId = null;
			expandedStackId = null;
		}
	}

	function handleTap(id: string, event: MouseEvent | TouchEvent) {
		if (isTouchDevice) {
			event.preventDefault();
			// Toggle: if already expanded, close it; otherwise expand
			if (hoveredId === id) {
				hoveredId = null;
				expandedStackId = null;
			} else {
				hoveredId = id;
			}
		}
	}

	function handleOutsideTap(event: MouseEvent | TouchEvent) {
		if (isTouchDevice) {
			const target = event.target as HTMLElement;
			// Close if tapping outside a circle-item
			if (!target.closest('.circle-item')) {
				hoveredId = null;
				expandedStackId = null;
			}
		}
	}

	function toggleStackExpansion(id: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		expandedStackId = expandedStackId === id ? null : id;
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

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="circle-container" onclick={handleOutsideTap}>
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
				<form method="POST" action="/admin?/logout">
					<button type="submit" class="admin-logout-btn">Logout</button>
				</form>
			</div>
		{/if}
	</div>

	<div class="circle-wrapper">
		<!-- Connection lines - one per project -->
		{#each projects as project, index}
			{@const pos = getPosition(index, projects.length)}
			{@const delay = index * 0.08}
			{@const isActive = hoveredId === project._id}
			<svg
				class="connection-line-svg"
				class:active={isActive}
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid meet"
				style="--delay: {delay}s;"
			>
				<line
					class="connection-line"
					x1="50"
					y1="50"
					x2={pos.x}
					y2={pos.y}
				/>
			</svg>
		{/each}

		<!-- Center branding -->
		<div class="center-brand">
			<div class="brand-logo">D</div>
			<div class="brand-text">
				<span class="brand-name">DegiDev</span>
				<span class="brand-tagline">Projekte & Services</span>
			</div>
		</div>

		<!-- Project items around the circle -->
		{#each projects as project, index}
			{@const pos = getPosition(index, projects.length)}
			{@const status = statusConfig[project.status || 'live']}
			{@const isHovered = hoveredId === project._id}
			{@const delay = index * 0.08}
			<a
				href={isHovered || !isTouchDevice ? project.url : undefined}
				target="_blank"
				rel="noopener noreferrer"
				class="circle-item animate-in"
				class:expanded={isHovered}
				class:coming-soon={project.status === 'coming_soon'}
				style="left: {pos.x}%; top: {pos.y}%; --delay: {delay}s;"
				data-project={project._id}
				onmouseenter={() => handleMouseEnter(project._id)}
				onmouseleave={handleMouseLeave}
				onclick={(e) => handleTap(project._id, e)}
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
							{@const isStackExpanded = expandedStackId === project._id}
							{@const visibleStack = isStackExpanded ? project.stack : project.stack.slice(0, 4)}
							{@const hiddenCount = project.stack.length - 4}
							<div class="card-stack" class:stack-expanded={isStackExpanded}>
								<div class="stack-badges">
									{#each visibleStack as techName}
										{@const tech = techNameToItem(techName)}
										<span class="mini-badge" style="--cat-color: {CATEGORY_COLORS[tech.category]}">
											<i class={getDeviconClass(tech.icon)}></i>
											{tech.name}
										</span>
									{/each}
									{#if hiddenCount > 0}
										<button
											class="stack-toggle"
											onclick={(e) => toggleStackExpansion(project._id, e)}
										>
											{isStackExpanded ? '↑' : `+${hiddenCount}`}
										</button>
									{/if}
								</div>
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

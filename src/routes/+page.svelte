<script lang="ts">
	import type { PageData } from './$types';
	import { stackToTechItems, groupByCategory, CATEGORY_COLORS, getDeviconClass, type TechItem, type Category } from '$lib/tech-utils';

	let { data }: { data: PageData } = $props();
	let expandedStack = $state<string | null>(null);

	function toggleStack(id: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		expandedStack = expandedStack === id ? null : id;
	}

	function getProjectTech(stack: string[]) {
		const items = stackToTechItems(stack);
		const grouped = groupByCategory(items);
		// Return categories that have items, in order
		const order: Category[] = ['frontend', 'backend', 'database', 'tools', 'language'];
		return order
			.filter(cat => grouped[cat].length > 0)
			.map(cat => ({ category: cat, items: grouped[cat] }));
	}
</script>

<main class="container">
	<header>
		<h1>DegiDev</h1>
		<p class="subtitle">Meine Projekte & Services</p>
	</header>

	<section class="projects">
		{#if data.projects.length === 0}
			<p class="empty">Noch keine Projekte vorhanden.</p>
		{:else}
			<div class="grid">
				{#each data.projects as project}
					<a href={project.url} class="card" target="_blank" rel="noopener noreferrer">
						<div class="card-icon">
							{#if project.icon}
								<img src={project.icon} alt={project.name} />
							{:else}
								<span class="placeholder-icon">{project.name.charAt(0)}</span>
							{/if}
						</div>
						<div class="card-content">
							<h2>{project.name}</h2>
							<p>{project.description}</p>
							{#if project.stack && project.stack.length > 0}
								{@const techGroups = getProjectTech(project.stack)}
								<div class="tech-stack-wrapper">
									<button
										class="stack-toggle"
										class:expanded={expandedStack === project._id}
										onclick={(e) => toggleStack(project._id, e)}
									>
										<span class="stack-label">Stack ({project.stack.length})</span>
										<span class="stack-arrow">▼</span>
									</button>
									{#if expandedStack === project._id}
										<div class="tech-stack">
											{#each techGroups as group}
												<div class="tech-category" style="--cat-color: {CATEGORY_COLORS[group.category]}">
													{#each group.items as tech}
														<span class="tech-badge" title={tech.name}>
															<i class={getDeviconClass(tech.icon)}></i>
															<span class="tech-name">{tech.name}</span>
														</span>
													{/each}
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</main>

<style lang="scss">
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
	}

	header {
		text-align: center;
		margin-bottom: 4rem;
		padding-top: 4rem;

		h1 {
			font-size: 3.5rem;
			font-weight: 700;
			margin-bottom: 0.5rem;
			background: linear-gradient(135deg, #fff 0%, #a0a0a0 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}

		.subtitle {
			color: var(--text-secondary);
			font-size: 1.25rem;
		}
	}

	.projects {
		.empty {
			text-align: center;
			color: var(--text-secondary);
			padding: 4rem;
		}

		.grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 1.5rem;
		}
	}

	.card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 12px;
		transition: all 0.3s ease;
		color: var(--text-primary);

		&:hover {
			border-color: var(--accent);
			transform: translateY(-2px);
			box-shadow: 0 8px 30px rgba(100, 108, 255, 0.15);
		}

		.card-icon {
			width: 48px;
			height: 48px;
			border-radius: 10px;
			background: var(--bg-secondary);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;

			img {
				width: 32px;
				height: 32px;
				object-fit: contain;
			}

			.placeholder-icon {
				font-size: 1.5rem;
				font-weight: 600;
				color: var(--accent);
			}
		}

		.card-content {
			min-width: 0;
			overflow: hidden;
			flex: 1;

			h2 {
				font-size: 1.1rem;
				font-weight: 600;
				margin-bottom: 0.25rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			p {
				font-size: 0.875rem;
				color: var(--text-secondary);
				margin: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.tech-stack-wrapper {
				margin-top: 0.625rem;

				.stack-toggle {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					padding: 0.25rem 0.5rem;
					background: var(--bg-secondary);
					border: 1px solid var(--border);
					border-radius: 4px;
					cursor: pointer;
					font-size: 0.75rem;
					color: var(--text-secondary);
					transition: all 0.2s ease;

					&:hover {
						border-color: var(--accent);
						color: var(--text-primary);
					}

					.stack-arrow {
						font-size: 0.6rem;
						transition: transform 0.2s ease;
					}

					&.expanded .stack-arrow {
						transform: rotate(180deg);
					}
				}

				.tech-stack {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
					margin-top: 0.5rem;
					animation: slideDown 0.2s ease;

					.tech-category {
						display: flex;
						flex-wrap: wrap;
						gap: 0.375rem;

						.tech-badge {
							display: flex;
							align-items: center;
							gap: 0.35rem;
							font-size: 0.7rem;
							padding: 0.25rem 0.5rem;
							background: color-mix(in srgb, var(--cat-color) 10%, var(--bg-secondary));
							border: 1px solid color-mix(in srgb, var(--cat-color) 30%, var(--border));
							border-radius: 4px;
							color: var(--cat-color);
							transition: all 0.2s ease;

							i {
								font-size: 0.85rem;
								opacity: 0.9;
							}

							.tech-name {
								color: var(--text-secondary);
							}

							&:hover {
								background: color-mix(in srgb, var(--cat-color) 20%, var(--bg-secondary));
								border-color: var(--cat-color);
							}
						}
					}
				}
			}

			@keyframes slideDown {
				from {
					opacity: 0;
					transform: translateY(-5px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
		}
	}
</style>

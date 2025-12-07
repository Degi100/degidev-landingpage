<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
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
		align-items: center;
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
			h2 {
				font-size: 1.1rem;
				font-weight: 600;
				margin-bottom: 0.25rem;
			}

			p {
				font-size: 0.875rem;
				color: var(--text-secondary);
				margin: 0;
			}
		}
	}
</style>

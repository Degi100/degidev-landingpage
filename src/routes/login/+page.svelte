<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<main class="login-container">
	<div class="login-box">
		<h1>Admin Login</h1>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<form method="POST" use:enhance>
			<div class="field">
				<label for="username">Username</label>
				<input type="text" id="username" name="username" required />
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" required />
			</div>

			<button type="submit" class="primary">Login</button>
		</form>

		<a href="/" class="back">Zurueck zur Startseite</a>
	</div>
</main>

<style lang="scss">
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.login-box {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 2.5rem;
		width: 100%;
		max-width: 400px;

		h1 {
			text-align: center;
			margin-bottom: 2rem;
			font-size: 1.75rem;
		}

		.error {
			background: rgba(248, 113, 113, 0.1);
			border: 1px solid var(--error);
			color: var(--error);
			padding: 0.75rem;
			border-radius: 8px;
			margin-bottom: 1.5rem;
			text-align: center;
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 1.25rem;
		}

		.field {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			label {
				font-size: 0.875rem;
				color: var(--text-secondary);
			}
		}

		button {
			margin-top: 0.5rem;
			width: 100%;
		}

		.back {
			display: block;
			text-align: center;
			margin-top: 1.5rem;
			font-size: 0.875rem;
			color: var(--text-secondary);

			&:hover {
				color: var(--accent);
			}
		}
	}
</style>

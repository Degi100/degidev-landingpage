<script lang="ts">
	let {
		username,
		onAddProject
	}: {
		username: string;
		onAddProject: () => void;
	} = $props();
</script>

<div class="admin-controls">
	<span class="user-badge">{username}</span>
	<button class="add-btn" onclick={onAddProject}>+ Projekt</button>
	<a href="/admin" class="admin-link">Dashboard</a>
	<form method="POST" action="/admin?/logout" class="logout-form">
		<button type="submit" class="logout-btn">Logout</button>
	</form>
</div>

<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	const exploreFundsId = $page.url.searchParams.get('id');
	export let data: PageData;
</script>

<div>{exploreFundsId}</div>

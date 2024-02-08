<script lang="ts">
	import { getDateTimeString } from '$lib/utils/helpers/date';
	export let sipCreatedTs: number;
</script>

<div class="mt-5 rounded bg-background px-4 py-2 text-center text-xs font-normal text-body">
	SIP created on <span class="font-medium text-title"
		>{getDateTimeString(sipCreatedTs, 'DATE', true)}</span
	>
</div>

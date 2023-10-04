<script lang="ts">
	import { getDateTimeString } from '$lib/utils/helpers/date';
	export let sipCreatedTs: number;
</script>

<div class="mt-5 rounded bg-grey px-4 py-2 text-center text-xs font-normal text-grey-body">
	SIP created on <span class="font-medium text-black-title"
		>{getDateTimeString(sipCreatedTs, 'DATE', true)}</span
	>
</div>

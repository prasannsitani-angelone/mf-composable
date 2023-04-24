<script lang="ts">
	import { getDateTimeString } from '$lib/utils/helpers/date';
	export let sipCreatedTs: number;
</script>

<div class="mt-5 rounded bg-grey px-4 py-2 text-center text-xs font-medium text-grey-body">
	SIP created on <span class="font-semibold text-black-title"
		>{getDateTimeString(sipCreatedTs, 'DATE', true)}</span
	>
</div>

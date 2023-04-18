<script lang="ts">
	import { getDateTimeString } from '$lib/utils/helpers/date';
	export let sipCreatedTs: number;
</script>

<section class="mt-2 rounded-lg bg-white px-4 py-2 shadow-csm">
	<div class="rounded bg-grey px-4 py-2 text-center text-xs font-medium text-grey-body">
		SIP was created on <span class="font-semibold text-black-title"
			>{getDateTimeString(sipCreatedTs, 'DATE', true)}</span
		>
	</div>
</section>

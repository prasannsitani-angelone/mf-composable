<script lang="ts">
	import type { ISipHealthDetails } from '$lib/types/ISipType';
	import { WMSIcon } from 'svelte-components';

	export let sipHealthDetails: ISipHealthDetails;
</script>

<article class="text-sm">
	<article class="flex items-start">
		{#if sipHealthDetails?.icon === 'green'}
			<WMSIcon width={16} height={17} name="checkbox-checked-circle" stroke="#008F75" />
		{:else if sipHealthDetails?.icon === 'yellow'}
			<WMSIcon name="exclamation-circle-solid" class="-m-0.5" width={21} height={21} />
		{/if}
		<div class="ml-2 w-full">
			<article class="flex">
				<div class="font-medium">
					{sipHealthDetails?.title || ''}
				</div>
				<slot name="titleTag" />
			</article>
			<div class="mt-2 text-body">
				{sipHealthDetails?.description || ''}
			</div>
			<slot name="footer" />
		</div>
	</article>
</article>

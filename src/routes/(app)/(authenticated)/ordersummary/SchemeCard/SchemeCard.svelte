<script lang="ts">
	import type { SchemeCardItems } from '../type';

	export let logoUrl: string;
	export let schemePlan = '';
	export let schemeName = '';
	export let schemeCardItems: Array<SchemeCardItems> = [];
	export let clazz = '';
</script>

<article
	class={`w-full rounded border border-grey-line bg-white px-2 py-3 sm:px-4 sm:py-6 ${clazz}`}
>
	<div class="mb-2 flex w-full flex-row items-center">
		<div class="mr-2 h-8 w-8 flex-none rounded-full border border-grey-line bg-white">
			<img alt="Bank Logo" src={logoUrl} class="h-full w-full object-cover" />
		</div>
		<div class="flex flex-col">
			<div class="text-xs font-normal text-grey-body">{schemePlan}</div>
			<div class="text-sm font-normal text-black-title">{schemeName}</div>
		</div>
	</div>
	<div class="flex flex-row justify-between rounded bg-blue-background px-2 py-2 sm:px-6 sm:py-4">
		{#each schemeCardItems as item, index}
			<div class="flex flex-col">
				<div class="mb-1 text-xs font-normal text-grey-body sm:text-sm">{item.title}</div>
				<div
					class={`text-sm font-normal text-black-title sm:text-base ${
						index === schemeCardItems.length - 1 && index > 0 ? 'text-right' : 'text-left'
					}`}
				>
					{item.value}
				</div>
			</div>
		{/each}
	</div>
</article>

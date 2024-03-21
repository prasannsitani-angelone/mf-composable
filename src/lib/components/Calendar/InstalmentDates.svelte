<script lang="ts">
	import type { instalmentDate } from '$lib/types/Calendar/ICalendar';

	let instalmentDateList: instalmentDate[];
	let showRemark: boolean;

	export { instalmentDateList, showRemark };
</script>

{#if instalmentDateList?.length}
	<section class="mx-4 mb-1.5 rounded-lg border">
		<article class="flex items-center justify-center">
			{#each instalmentDateList as instalment, index}
				<article
					class="flex {instalmentDateList?.length > 1
						? 'items-start'
						: 'items-center'} my-2.5 w-full flex-col justify-center px-3 {index > 0 && 'border-l'}"
				>
					<div class="text-xs font-normal text-body">
						{instalment?.title}
					</div>
					<div class="mt-1 text-sm font-medium text-title">
						{instalment?.date}
					</div>
				</article>
			{/each}
		</article>
		<slot name="instalmentDetailsRemarks">
			{#if instalmentDateList?.length > 1 && showRemark}
				<article class="border-t p-3 text-[10px] font-normal text-body">
					Future instalments start at least 30 days after your first instalment, as per BSE
					guidelines
				</article>
			{/if}
		</slot>
	</section>
{/if}

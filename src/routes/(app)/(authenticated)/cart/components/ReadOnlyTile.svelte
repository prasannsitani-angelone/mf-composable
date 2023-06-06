<script lang="ts">
	import { formatAmount } from '$lib/utils/helpers/formatAmount';

	export let schemeLogo = '';
	export let schemeName = '';
	export let isSip = false;
	export let amount: number;
	export let sipDate: number;
</script>

<div
	class="grid w-full grid-cols-[55%_45%] gap-y-2 border-b border-grey-line bg-white px-3 py-3 sm:grid-cols-[46%_18%_18%_18%] sm:items-center sm:px-6 sm:py-4"
>
	<div class="col-start-1 row-start-1 flex flex-row items-center">
		<div
			class="mr-2 flex h-6 w-6 min-w-[24px] items-center rounded-full border border-grey-line bg-white shadow-csm sm:h-12 sm:w-12 sm:min-w-[48px]"
		>
			<img src={schemeLogo} alt="scheme logo" />
		</div>
		<div class="text-sm font-medium text-black-title">{schemeName}</div>
	</div>
	<div
		class="col-start-1 row-start-2 ml-8 text-xs font-medium text-black-title sm:col-start-2 sm:row-start-1 sm:ml-0"
	>
		{isSip ? 'SIP' : 'ONE TIME'}
	</div>
	{#if isSip}
		<div
			class="col-start-2 row-start-2 flex justify-end text-xs font-medium text-black-title sm:col-start-3 sm:row-start-1 sm:justify-start"
		>
			{`SIP Date : ${sipDate}`}
		</div>
	{:else}
		<div class="col-start-2 row-start-2 sm:col-start-3 sm:row-start-1" />
	{/if}
	<div
		class="col-start-2 row-start-1 flex justify-end text-sm text-black sm:col-start-4 sm:justify-start"
	>
		₹{formatAmount(amount?.toString())}
	</div>
</div>

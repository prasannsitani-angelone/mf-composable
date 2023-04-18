<script lang="ts">
	import BigDotIcon from '$lib/images/icons/BigDotIcon.svelte';
	import AutopayEnabledIcon from '$lib/images/icons/AutopayEnabledIcon.svelte';
	let bankAccountNumber: string;
	let bankName: string;
	let bankLogo: string;
	export { bankAccountNumber, bankName, bankLogo };
</script>

<section class={`rounded-lg bg-white p-4 pl-2 shadow-csm ${$$props.class}`}>
	{#if bankAccountNumber}
		<section class="flex items-center justify-between">
			<section class="flex items-center text-black-title">
				<div class="px-3 py-1.5">
					<img src={bankLogo} alt="bank logo" class="h-4 w-4" />
				</div>

				<article class="flex flex-col items-start">
					<div class="text-sm font-medium">
						{bankName}
					</div>
					<article class="flex items-center">
						{#each Array(4) as item}
							<BigDotIcon class="mr-1" />
						{/each}
						<div class="text-xs font-medium text-grey-body">
							{bankAccountNumber?.slice(bankAccountNumber?.length - 4)}
						</div>
					</article>
				</article>
			</section>

			<section class="flex items-center">
				<AutopayEnabledIcon class="mr-1" />
				<div class="text-xs font-medium text-grey-body">Autopay Enabled</div>
			</section>
		</section>
	{/if}
</section>

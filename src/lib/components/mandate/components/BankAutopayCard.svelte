<script lang="ts">
	import BigDotIcon from '$lib/images/icons/BigDotIcon.svelte';
	import AutopayEnabledIcon from '$lib/images/icons/AutopayEnabledIcon.svelte';
	let bankAccountNumber: string;
	let bankName: string;
	let bankLogo: string;
	let cardBodyClass = '';
	let bankLogoClass = '';
	let bankDetailsClass = '';
	let bankAccNoClass = '';
	export {
		bankAccountNumber,
		bankName,
		bankLogo,
		cardBodyClass,
		bankLogoClass,
		bankDetailsClass,
		bankAccNoClass
	};
</script>

<section class={`rounded-lg bg-background-alt p-4 pl-2 shadow-csm ${$$props.class}`}>
	<slot name="header" />

	<article class={cardBodyClass}>
		<section class="flex items-center justify-between">
			<section class="flex items-center text-title">
				<div class="px-3 py-1.5 {bankLogoClass}">
					<img src={bankLogo} alt="bank logo" class="h-4 w-4" />
				</div>

				<article class="flex flex-col items-start {bankDetailsClass}">
					<div class="text-sm font-normal">
						{bankName}
					</div>
					<article class="flex items-center {bankAccNoClass}">
						{#each Array(4) as item}
							<BigDotIcon class="mr-1" />
						{/each}
						<div class="text-xs font-normal text-body">
							{bankAccountNumber?.slice(bankAccountNumber?.length - 4)}
						</div>
					</article>
				</article>
			</section>

			<slot name="autopayStatusSlot">
				<section class="flex items-center">
					<AutopayEnabledIcon class="mr-1" />
					<div class="text-xs font-normal text-body">Autopay Enabled</div>
				</section>
			</slot>
		</section>
	</article>

	<slot name="footer" />
</section>

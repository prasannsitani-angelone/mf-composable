<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import LockInIcon from '$lib/images/icons/LockInIcon.svelte';
	import MinLumpSumIcon from '$lib/images/icons/MinLumpSumIcon.svelte';
	import PiggyBankIcon from '$lib/images/icons/PiggyBankIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	let schemeDetails: SchemeDetails;

	export { schemeDetails };
</script>

<article class="max-w-4xl rounded-lg bg-white pb-0 text-sm sm:w-full sm:pb-0">
	<section class="origin-top transition duration-100">
		<div class="flex flex-col">
			<div class="flex gap-2">
				<div class="flex flex-row rounded-lg bg-grey py-3 pl-3 sm:grow sm:basis-0">
					<div class="flex">
						{#if schemeDetails?.isSipAllowed === 'Y'}
							<PiggyBankIcon class="h-9 w-9" />
							<div class="ml-2">
								<div class="text-xs font-medium text-black-title">
									<AmountText amount={schemeDetails?.minSipAmount} />
								</div>
								<div class="text-xs font-normal text-grey-body sm:text-sm">
									Minimum SIP investment
								</div>
							</div>
						{:else}
							<PiggyBankIcon disabled={true} />
							<div class="ml-2 flex justify-center">
								<span class="text-center text-xs font-normal">
									This fund does not support SIP Investment
								</span>
							</div>
						{/if}
					</div>
				</div>
				<div class="flex flex-row rounded-lg bg-grey py-3 pl-3 sm:grow sm:basis-0">
					<div class="flex">
						{#if schemeDetails?.isLumpsumAllowed === 'Y'}
							<MinLumpSumIcon class="h-9 w-9" />
							<div class="ml-2">
								<div class="text-xs font-medium text-black-title">
									<AmountText amount={schemeDetails?.minLumpsumAmount} />
								</div>
								<div class="text-xs font-normal text-grey-body sm:text-sm">
									Minimum one time investment
								</div>
							</div>
						{:else}
							<MinLumpSumIcon disabled={true} />
							<div class="ml-2 flex justify-center">
								<span class="text-center text-xs font-normal">
									This fund does not support One-Time Investment
								</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>
</article>

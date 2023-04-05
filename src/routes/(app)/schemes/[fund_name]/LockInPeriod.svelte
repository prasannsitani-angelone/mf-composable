<script lang="ts">
	import LockInIcon from '$lib/images/icons/LockInIcon.svelte';
	import MinLumpSumIcon from '$lib/images/icons/MinLumpSumIcon.svelte';
	import PiggyBankIcon from '$lib/images/icons/PiggyBankIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	let schemeDetails: SchemeDetails;

	export { schemeDetails };
</script>

<article class="mt-4 max-w-4xl rounded-lg bg-white pb-4 text-sm shadow-csm sm:pb-0">
	<section class="origin-top transition duration-100">
		<div class="flex flex-col px-3 py-4">
			<div class="flex gap-2">
				<div class="flex flex-row rounded-lg bg-grey py-3 pl-3 sm:grow sm:basis-0">
					<div class="flex">
						{#if schemeDetails?.isSipAllowed === 'Y'}
							<PiggyBankIcon class="h-9 w-9" />
							<div class="ml-2">
								<div class="text-base font-medium text-black-title sm:text-2xl">
									₹{schemeDetails?.minSipAmount}
								</div>
								<div class="text-xs font-medium text-grey-body sm:text-sm">
									Minimum SIP investment
								</div>
							</div>
						{:else}
							<PiggyBankIcon disabled={true} />
							<div class="ml-2 flex justify-center">
								<span class="text-center text-xs font-medium">
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
								<div class="text-base font-medium text-black-title sm:text-2xl">
									₹{schemeDetails?.minLumpsumAmount}
								</div>
								<div class="text-xs font-medium text-grey-body sm:text-sm">
									Minimum one time investment
								</div>
							</div>
						{:else}
							<MinLumpSumIcon disabled={true} />
							<div class="ml-2 flex justify-center">
								<span class="text-center text-xs font-medium">
									This fund does not support One-Time Investment
								</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
			<div
				class="mt-3 flex items-center justify-center rounded border border-grey-line py-2 font-medium text-black-title"
			>
				<LockInIcon />
				<span class="font-semibold"> Lock-in:</span>
				{#if schemeDetails?.sipLockinPeriodFlag === 'Y'}
					<div>
						Fund has {schemeDetails?.sipLockinPeriod}Y lock-in period
					</div>
				{:else}
					Fund has no lock-in period
				{/if}
			</div>
		</div>
	</section>
</article>

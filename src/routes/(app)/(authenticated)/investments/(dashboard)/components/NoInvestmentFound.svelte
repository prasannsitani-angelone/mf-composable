<script lang="ts">
	import NoInvestments from '$lib/images/NoInvestments.svg';
	import Button from '$components/Button.svelte';
	import { getMaskedMobileNumber } from '$lib/utils/helpers/masked';
	import { tefTryAgainClickAnlytics } from '../../analytics';
	import type { PageData } from '../$types';

	export let data: PageData;
	export let onConfirmation = () => '';

	const onConfirmationClick = () => {
		onConfirmation();
		tefTryAgainClickAnlytics({ message: 'No investments found' });
	};
</script>

<section class="rounded-lg bg-white px-4 py-6 text-center max-sm:shadow-csm sm:py-7">
	<div class="m-auto max-w-[230px] text-center sm:max-w-[500px]">
		<img
			src={NoInvestments}
			class="inline-block"
			loading="lazy"
			alt="Illustration shoeing first time import"
		/>
		<div class="mb-3 mt-5 text-base font-medium text-black-title sm:mt-8">No Investment Found</div>
		<div class="mb-6 text-sm text-grey-body">
			We could not find any investments linked to your <span class="font-medium text-black"
				>PAN {getMaskedMobileNumber(data.profile.pan)}</span
			>
		</div>
		<Button class="w-40" variant="outlined" onClick={onConfirmationClick}>TRY AGAIN</Button>
	</div>
</section>

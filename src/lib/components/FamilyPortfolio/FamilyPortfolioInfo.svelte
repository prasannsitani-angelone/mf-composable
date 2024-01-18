<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	import InfoModal from '$components/InfoModal.svelte';
	import {
		familyPortfolioInfoButtonClickAnalytics,
		familyPortfolioInfoPopupImpressionAnalytics
	} from '$lib/analytics/familyPortfolio/familyPortfolio';

	let showModal = false;

	const toggleShowModal = () => {
		showModal = !showModal;

		if (showModal) {
			familyPortfolioInfoButtonClickAnalytics();
			familyPortfolioInfoPopupImpressionAnalytics();
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section class={$$props?.class || ''} on:click={toggleShowModal}>
	<WMSIcon name="info-in-circle-dark" class="h-4 w-4" />
</section>

<InfoModal
	{showModal}
	heading="Family Portfolio"
	headingClass="!font-medium !text-lg !text-black-key md:px-4 md:pb-3"
	on:crossClicked={toggleShowModal}
>
	<svelte:fragment slot="heading">
		<div class="flex items-center justify-start px-4 pb-3 pt-6 md:px-4 md:pt-6">
			<slot name="headingDetails">
				<span class="text-lg font-medium text-black-key md:text-lg"> Family Portfolio </span>
			</slot>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="crossIconSlot">
		<span />
	</svelte:fragment>
	<svelte:fragment slot="horizontalLine">
		<span class="hidden md:block" />
	</svelte:fragment>
	<svelte:fragment slot="bodySection">
		<section class="px-4 pb-6 pt-0 text-sm md:px-4 md:pt-0">
			<article>
				<p class="text-left font-normal text-black-bolder">
					View and track the holdings of all your family members at one place with family portfolio
				</p>
			</article>
		</section>
	</svelte:fragment>
</InfoModal>

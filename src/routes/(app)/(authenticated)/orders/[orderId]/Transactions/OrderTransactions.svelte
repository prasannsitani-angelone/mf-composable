<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import InfoPopup from '$components/Popup/InfoPopup.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { IStatusObject } from '../type';
	import {
		expectedNavDateCloseAnalytics,
		expectedNavDateOpenAnalytics
	} from '../analytics/navDate';
	import type { IOrderDetails } from '$lib/types/IOrderDetails';
	import { copyToClipboard } from '$lib/utils/share';
	export let statusItems: IStatusObject;
	export let orderDetails: IOrderDetails;
	let isModalOpen = false;
	const handleOpenExpectedNavDateModal = () => {
		isModalOpen = true;
		expectedNavDateOpenAnalytics(orderDetails);
	};

	const handleCloseExpectedNavDateModal = () => {
		isModalOpen = false;
		expectedNavDateCloseAnalytics();
	};
</script>

<AccordianCardComponent
	data={{
		title: 'Transaction Details'
	}}
	titleStyle="!ml-0"
	titleFontSize="text-sm"
	class="mb-2 max-w-8xl"
	headerClass="!px-3 !py-4 md:!px-3 md:!py-4"
>
	<svelte:fragment slot="accordionBody">
		<!-- Card -->
		<div class="flex flex-wrap px-5 pb-5 pt-1">
			{#each Object.keys(statusItems) as key, index (index)}
				<div class="mb-2 flex w-6/12 flex-col md:w-4/12 lg:w-3/12">
					<div class="flex items-center text-1xs text-body">
						{statusItems[key].title}
						{#if statusItems[key].informationIcon}
							<WMSIcon
								height={16}
								width={16}
								class="ml-1 cursor-pointer"
								name="info-in-circle"
								on:click={handleOpenExpectedNavDateModal}
							/>
							<InfoPopup
								detailText={statusItems[key]?.informationSubheading}
								{isModalOpen}
								closeModal={handleCloseExpectedNavDateModal}
							>
								<svelte:fragment slot="popupHeader">
									<div class="flex items-center justify-between px-4 pb-3 pt-6 md:px-8 md:py-6">
										<span class="text-lg font-normal text-title md:text-xl">
											{statusItems[key]?.informationHeading}
										</span>
									</div>
								</svelte:fragment>
							</InfoPopup>
						{/if}
					</div>
					<div class="flex items-center text-sm font-normal">
						{#if statusItems[key].node}
							{@html statusItems[key].value}
						{:else}
							{statusItems[key].value}
						{/if}
						{#if statusItems[key].copyIcon}
							<WMSIcon
								class="ml-4 cursor-pointer active:opacity-50"
								on:click={() => copyToClipboard(statusItems[key].value)}
								height={16}
								width={17}
								stroke="var(--PRIMARY)"
								name="copy"
							/>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</svelte:fragment>
</AccordianCardComponent>

<script lang="ts">
	import { page } from '$app/stores';
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import ContactCard from '$components/ContactCard.svelte';
	import { faqHelpClickAnalytics } from '$lib/analytics/orders/orders';
	import type { FAQ } from '../type';
	let faq: FAQ;
	let showContactCard: boolean;
	$: eventMetaData = {
		Status: $page?.data?.Status || '',
		Message: 'Didn’t find what you were looking for? Call us or Write to us'
	};

	const faqHelpAnalytics = () => {
		faqHelpClickAnalytics(eventMetaData);
	};
	export { faq, showContactCard };
</script>

<div class="h-full px-2 py-2 md:px-0 md:py-0">
	<AccordianCardComponent
		data={{
			title: faq?.question
		}}
		disableCollapse={true}
		titleStyle="!ml-0 text-black-title"
		titleFontSize="text-sm"
		class="!mt-0 mb-0 max-w-8xl md:rounded-t-none"
		headerClass="!p-3 md:!p-4"
	>
		<svelte:fragment slot="accordionBody">
			<section class="details-container mt-1 px-4 pb-5 text-grey-body">
				{#if faq?.contentType === 'html'}
					{@html faq?.content}
				{:else}
					{faq?.content}
				{/if}
			</section>
		</svelte:fragment>
	</AccordianCardComponent>
	{#if showContactCard}
		<ContactCard title="Didn't find what you were looking for?" helpAnalytics={faqHelpAnalytics} />
	{/if}
</div>

<style>
	@media screen and (max-width: 640px) {
		:global(.details-container table) {
			display: block;
		}
	}
	:global(.details-container ol) {
		list-style: decimal;
		list-style-position: inside;
	}
	:global(.details-container p) {
		user-select: text;
	}
	:global(.details-container table) {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;
		border: 1px solid #425061;
	}
	:global(.details-container table th) {
		background-color: #c2c6cc;
	}
	:global(.details-container table th, td) {
		padding: 10px;
		color: #2a394e;
	}
	:global(.details-container table td) {
		text-align: center;
		font-weight: 500;
	}
	:global(.details-container a) {
		color: #3f5bd9;
		font-weight: 600;
	}
</style>

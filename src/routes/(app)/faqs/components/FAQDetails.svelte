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
	{#if !showContactCard}
		<AccordianCardComponent
			data={{
				title: faq?.question
			}}
			disableCollapse={true}
			titleStyle="!ml-0 text-title"
			titleFontSize="text-sm"
			class="!mt-0 mb-0 max-w-8xl md:rounded-t-none"
			headerClass="!p-3 md:!p-4"
		>
			<svelte:fragment slot="accordionBody">
				<section class="details-container mt-1 px-4 pb-5 text-body">
					{#if faq?.contentType === 'html'}
						{@html faq?.content}
					{:else}
						{faq?.content}
					{/if}
				</section>
			</svelte:fragment>
		</AccordianCardComponent>
	{:else}
		<ContactCard {faq} helpAnalytics={faqHelpAnalytics} />
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
		border: 1px solid var(--BODY);
	}
	:global(.details-container table th) {
		background-color: var(--BORDER);
	}
	:global(.details-container table th, td) {
		padding: 10px;
		color: var(--TITLE);
	}
	:global(.details-container table td) {
		text-align: center;
		font-weight: 500;
	}
	:global(.details-container a) {
		color: var(--PRIMARY);
		font-weight: 600;
	}
</style>

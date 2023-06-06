<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import ContactCard from '$components/ContactCard.svelte';
	import type { FAQ } from '../type';
	let faq: FAQ;
	export { faq };
</script>

<div class="h-full px-2 py-2 md:px-0 md:py-0">
	<AccordianCardComponent
		data={{
			title: faq?.question
		}}
		disableCollapse={true}
		titleStyle="!ml-0 text-grey-body"
		titleFontSize="text-sm"
		class="mb-0 !mt-0 max-w-8xl md:rounded-t-none"
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
	<ContactCard title="Didn't find what you were looking for?" />
</div>

<style>
	:global(.details-container table) {
		display: block;
		overflow-x: auto;
		white-space: nowrap;
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
</style>

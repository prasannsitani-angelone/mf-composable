<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import AccordionLoader from './AccordionLoader.svelte';
	import Table from './Table.svelte';

	export let data = [[]];
	export let title = '';
	export let cardToggled = (): void => undefined;
	export let loading = false;
	export let isDefaultExpanded = false;
</script>

<div class="bg-background-alt">
	<AccordianCardComponent
		data={{ title }}
		titleStyle="!ml-0 !font-medium"
		titleFontSize="!text-xs !font-medium !text-body"
		headerClass="!p-4"
		class="!mt-0 !max-w-none !rounded-none"
		disableCollapse={false}
		{isDefaultExpanded}
		on:cardToggled={cardToggled}
	>
		<svelte:fragment slot="accordionBody">
			{#if loading}
				<AccordionLoader />
			{:else}
				<Table {data}>
					<svelte:fragment slot="header">
						<slot name="header" />
					</svelte:fragment>
					<svelte:fragment slot="footer">
						<slot name="footer" />
					</svelte:fragment>
				</Table>
			{/if}
		</svelte:fragment>
	</AccordianCardComponent>
</div>

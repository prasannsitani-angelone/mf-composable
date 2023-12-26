<script lang="ts">
	import AccordianCardComponent from '$components/Accordian/AccordianCardComponent.svelte';
	import Table from './Table.svelte';

	export let data = [[]];
	export let title = '';
	export let cardToggled = (): void => undefined;
</script>

<div class="bg-white">
	<AccordianCardComponent
		data={{ title }}
		titleStyle="!ml-0"
		titleFontSize="!text-xs !font-medium !text-black-bolder"
		headerClass="!p-4"
		class="!mt-0 !max-w-none !rounded-none"
		disableCollapse={false}
		on:cardToggled={cardToggled}
	>
		<svelte:fragment slot="accordionBody">
			<Table {data}>
				<svelte:fragment slot="header">
					<slot name="header" />
				</svelte:fragment>
				<svelte:fragment slot="footer">
					<slot name="footer" />
				</svelte:fragment>
			</Table>
		</svelte:fragment>
	</AccordianCardComponent>
</div>

<script lang="ts">
	import type { OrdersSummary } from '$lib/types/IInvestments';
	import { createEventDispatcher } from 'svelte';
	import { Input } from 'wms-ui-component';
	const dispatch = createEventDispatcher();
	let ordersSummary: OrdersSummary;
	let filters: { [key: string]: boolean } = {
		failed: false,
		completed: true,
		inprogress: true
	};
	const handleChange = (e: Event) => {
		if ((e.target as HTMLInputElement)?.checked) {
			filters[(e.target as HTMLInputElement)?.value] = true;
		} else {
			filters[(e.target as HTMLInputElement)?.value] = false;
		}
		dispatch('checked', filters);
	};
	let classes = {
		input: 'h-4 !w-4 cursor-pointer focus:outline-none accent-blue-primary',
		label: 'ml-2 pointer-events-none text-xs font-medium text-black-title md:text-sm',
		error: '',
		container: '',
		parent: 'flex items-center flex-row-reverse'
	};
	export { ordersSummary };
</script>

<section class="mb-3 flex flex-col rounded-lg border bg-white px-4 py-3 md:px-5 md:pt-4 md:pb-5">
	<article class="mb-3 text-1xs text-grey-body md:mb-5 md:text-xs">FILTER BY</article>
	<article class="flex justify-between md:flex-col">
		<div class="flex items-center">
			<Input
				id="progress-checkbox"
				type="checkbox"
				name="progress-checkbox"
				value="inprogress"
				inputMode="none"
				checked={filters.inprogress}
				onInputChange={(e) => handleChange(e)}
				{classes}
				label={`In Progress (${ordersSummary.totalProcessingOrders})`}
			/>
		</div>
		<div class="flex items-center md:mt-6">
			<Input
				id="completed-checkbox"
				type="checkbox"
				name="completed-checkbox"
				value="completed"
				inputMode="none"
				checked={filters.completed}
				onInputChange={(e) => handleChange(e)}
				{classes}
				label={`Completed (${ordersSummary.totalCompletedOrders})`}
			/>
		</div>
		<div class="flex items-center md:mt-6">
			<Input
				id="failed-checkbox"
				type="checkbox"
				name="failed-checkbox"
				value="failed"
				inputMode="none"
				checked={filters.failed}
				onInputChange={(e) => handleChange(e)}
				{classes}
				label={`Failed (${ordersSummary.totalFailedOrders})`}
			/>
		</div>
	</article>
</section>

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
			filters[(e.target as HTMLInputElement)?.name] = true;
		} else {
			filters[(e.target as HTMLInputElement)?.name] = false;
		}
		dispatch('checked', filters);
	};
	let classes = {
		input: 'h-4 !w-4 cursor-pointer focus:outline-none accent-blue-primary',
		label: '',
		error: '',
		container: '',
		parent: ''
	};
	export { ordersSummary };
</script>

<section class="mb-3 flex flex-col rounded-lg border bg-white px-4 py-3 md:px-5 md:pt-4 md:pb-5">
	<article class="mb-3 text-1xs text-grey-body md:mb-5 md:text-xs">FILTER BY</article>
	<article class="flex justify-between md:flex-col">
		<div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="flex items-center text-xs font-medium text-black-title md:text-sm">
				<Input
					id="inprogress"
					type="checkbox"
					name="inprogress"
					inputMode="none"
					checked={filters.inprogress}
					onInputChange={(e) => handleChange(e)}
					{classes}
				/>
				<div class="ml-2">{`In Progress (${ordersSummary.totalProcessingOrders})`}</div>
			</label>
		</div>
		<div class="md:mt-6">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="flex items-center text-xs font-medium text-black-title md:text-sm">
				<Input
					id="completed"
					type="checkbox"
					name="completed"
					inputMode="none"
					checked={filters.completed}
					onInputChange={(e) => handleChange(e)}
					{classes}
				/>
				<div class="ml-2">{`Completed (${ordersSummary.totalCompletedOrders})`}</div>
			</label>
		</div>
		<div class="md:mt-6">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="flex items-center text-xs font-medium text-black-title md:text-sm">
				<Input
					id="failed"
					type="checkbox"
					name="failed"
					inputMode="none"
					checked={filters.failed}
					onInputChange={(e) => handleChange(e)}
					{classes}
				/>
				<div class="ml-2">{`Failed (${ordersSummary.totalFailedOrders})`}</div>
			</label>
		</div>
	</article>
</section>

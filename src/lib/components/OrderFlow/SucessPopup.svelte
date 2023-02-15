<script>
	import SuccessTickInCircleIcon from '$lib/images/icons/SuccessTickInCircleIcon.svelte';
	import BasePopUp from '$lib/components/BasePopUp.svelte';
	import { overlay } from '$lib/stores/OverLayStore.js';
	import OrderSummary from '$lib/components/OrderSummary.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<BasePopUp class="py-8" onBackDropClicked={() => ($overlay.isOpen = false)}>
	<div class="flex flex-col items-center" slot="header">
		<SuccessTickInCircleIcon />
		<h1 class="mt-4 text-2xl">Application requested!</h1>
	</div>
	<div class="mt-4 flex w-11/12 flex-col items-center" slot="content">
		<div class="mt-2 flex w-full flex-col items-center bg-[#F8F5F5] px-6 py-3 shadow-md">
			<h5 class="text text-black-title">SGB Series 10-2021</h5>
			<OrderSummary
				investmentAmt="5000"
				issuePrice="5000"
				appliedDate="2 nov 2021"
				class="w-full"
			/>
		</div>
		<h5 class="mt-4 text-center text-sm text-grey-body">
			After successful application, allotment will take upto 7 days
		</h5>
	</div>
	<div class="mt-4" slot="footer">
		<a href="/orders/orderspage"><Button variant="outlined">SEE STATUS</Button></a>
	</div>
</BasePopUp>

<script>
	import ModalWithAnimation from '$components/ModalWithAnimation.svelte';

	export let title = 'Exit Load';
	export let exitLoadValue = 'Nil';

	export let showFundDetailExitLoadModal = false;
</script>

<ModalWithAnimation bind:isModalOpen={showFundDetailExitLoadModal} on:backdropclicked>
	<section
		class="w-full rounded-t-2xl bg-background-alt px-4 py-6 shadow-clg sm:w-120 sm:rounded-lg sm:p-6 {$$props.class}"
	>
		<div class="mb-2 text-lg font-medium text-title">{title}</div>

		<div class="text-sm text-body">
			{exitLoadValue}
		</div>
	</section>
</ModalWithAnimation>

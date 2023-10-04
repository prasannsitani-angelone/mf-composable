<script lang="ts">
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import Modal from '$components/Modal.svelte';
	import { base } from '$app/paths';

	export let heading = '';
</script>

<Modal isModalOpen>
	<div
		class="flex h-full w-full flex-col items-center justify-between overflow-y-auto rounded-none bg-white px-12 py-16 shadow-clg sm:h-max sm:w-120 sm:rounded-lg sm:px-12 sm:py-20"
	>
		<div class="mb-16 flex flex-col items-center">
			<img src={`${base}/images/AngelOneLogo.webp`} class="w-32" alt="Angelone logo" />
			<div class="mt-4 text-center text-base font-normal text-black-title">
				{heading}
			</div>
		</div>

		<LoadingIndicator svgClass="!w-28 !h-28 mr-0 mb-16" />

		<div class="flex flex-col items-center">
			<div class="mb-4 text-center text-xl font-normal text-black-title">Please wait</div>
			<div class="mb-4 text-center text-sm text-grey-body">
				Note: Do not press back or close the app
			</div>
		</div>
	</div>
</Modal>

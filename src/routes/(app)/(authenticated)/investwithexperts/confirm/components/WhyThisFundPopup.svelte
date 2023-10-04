<script lang="ts">
	import Modal from '$components/Modal.svelte';
	export let hide: () => void;
</script>

<Modal isModalOpen={true} on:backdropclicked={hide}>
	<div class="flex flex-col rounded-t-2xl bg-white">
		<div class="px-4 py-6 text-lg font-normal text-black-title">Why these funds?</div>
		<div class="p-4 pt-0 text-sm text-grey-body">
			<div class="mb-5">
				This portfolio includes a mix of large cap, mid cap, small cap, and index funds, offering
				diversification across equity categories.
			</div>
			<div class="mb-5">
				This balanced approach reduces risks and provides exposure to different market segments. The
				combination of large, mid, and small cap funds, along with an index fund, ensures smoother
				performance during market fluctuations.
			</div>
			<div>
				Moreover, you can start an SIP in all of these with one step, making it a convenient and
				hassle-free investment option.
			</div>
		</div>
	</div>
</Modal>

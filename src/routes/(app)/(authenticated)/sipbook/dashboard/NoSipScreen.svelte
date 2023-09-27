<script lang="ts">
	import Link from '$components/Link.svelte';
	import type { PageData } from '../../../../$types';
	import NoSipImage from '$lib/images/icons/NoSipImage.svelte';
	let showInactiveSipsCta: boolean;
	let data: PageData;
	export { showInactiveSipsCta, data };
</script>

<section
	class="cardHeight mt-2 flex flex-col items-center justify-center rounded-lg bg-white px-8 shadow-csm"
>
	<NoSipImage />
	<div class="mt-2 text-center text-lg font-medium text-black-title">
		You do not have any active SIP
	</div>

	<div class="mt-2 text-center text-sm font-normal text-grey-body">
		Start investing with SIPs today to generate long term returns and grow your wealth
	</div>

	<Link to={`/explorefunds/high-returns?id=19`}>
		<div
			class="mt-5 w-52 cursor-default rounded border border-blue-primary bg-white py-4 text-center text-sm font-semibold text-blue-primary active:opacity-95 md:cursor-pointer"
		>
			START SIP
		</div>
	</Link>

	<!-- Inactive SIPs CTA section -->
	<Link to="/sipbook/inactivesips">
		{#if showInactiveSipsCta}
			<section class="mt-7 cursor-default text-center text-sm font-semibold text-blue-primary">
				INACTIVE SIPs
			</section>
		{/if}
	</Link>
</section>

<style>
	.cardHeight {
		height: calc(100vh - 236px);
	}
</style>

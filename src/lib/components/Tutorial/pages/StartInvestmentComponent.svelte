<script lang="ts">
	import Icon5 from '$components/Tutorial/icons/AllDoneBgIcon.svelte';
	import Icon6 from '$components/Tutorial/icons/Icon6.svelte';
	import Icon7 from '$components/Tutorial/icons/Icon7.svelte';
	import Icon8 from '$components/Tutorial/icons/Icon8.svelte';
	import Link from '$components/Link.svelte';
	import { HEIGHT_OFFSET } from '$components/Tutorial/pages/const';

	let clientHeight = 0;
</script>

<div bind:clientHeight class="flex h-screen flex-col bg-[#E4EDFB] p-5 {$$props.class}">
	<p class="mb-3 mt-10 text-2xl font-medium text-title">All Done!</p>
	<p class="mb-6 text-2xl font-medium text-primary">
		You are now ready to start your investment journey
	</p>
	{#if clientHeight > HEIGHT_OFFSET}
		<Icon5 class="mx-auto mb-6" />
	{/if}

	<p class="mx-auto mb-6 w-fit text-sm font-medium text-title">Proceed to build your wealth?</p>

	<div class="mb-3 flex flex-row gap-3">
		<Link
			to={'/categories?id=105'}
			class="flex flex-1 flex-col justify-center rounded-lg border-2 border-[#D1D8F6] bg-background-alt p-3 pr-10"
		>
			<Icon6 class="mb-1" />
			<p class=" text-xs font-normal uppercase text-primary">Start Your First SIP</p>
		</Link>
		<Link
			to="/buyPortfolio"
			class="flex flex-1 flex-col justify-center rounded-lg border-2 border-[#D1D8F6] bg-background-alt p-3 pr-10"
		>
			<Icon7 class="mb-1" />
			<p class=" text-xs font-normal uppercase text-primary">BUY a Balanced Portfolio</p>
		</Link>
	</div>

	<Link
		to="/filters/items"
		class="flex w-full flex-row items-center justify-center rounded-lg border-2 border-[#D1D8F6] bg-background-alt p-3"
	>
		<Icon8 class="mr-2" />
		<p class="text-xs font-normal uppercase text-primary">Explore Mutual Funds</p>
	</Link>
</div>

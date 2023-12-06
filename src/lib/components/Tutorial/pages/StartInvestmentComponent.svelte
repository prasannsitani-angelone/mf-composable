<script lang="ts">
	import Icon5 from '$components/Tutorial/icons/Icon5.svelte';
	import Icon6 from '$components/Tutorial/icons/Icon6.svelte';
	import Icon7 from '$components/Tutorial/icons/Icon7.svelte';
	import Icon8 from '$components/Tutorial/icons/Icon8.svelte';
	import Link from '$components/Link.svelte';

	$: height = window.innerHeight;
</script>

<div class="flex flex-col bg-[#E4EDFB] px-8 py-5 {$$props.class}" style="height: {height}px">
	<p class="mb-5 mt-10 text-2xl font-medium text-black-key">All Done!</p>
	<p class="mb-10 text-2xl font-medium text-blue-primary">
		You are now ready to start your investment journey
	</p>
	<Icon5 class="mx-auto mb-10" />

	<p class="mx-auto mb-5 w-fit text-sm font-medium text-black-title">
		Proceed to build your wealth?
	</p>

	<div class="mb-5 flex flex-row gap-3">
		<Link
			to={'/categories?id=105'}
			class="flex flex-1 flex-col justify-center rounded-lg border-2 border-[#D1D8F6] bg-white p-3 pr-10"
		>
			<Icon6 class="mb-1" />
			<p class=" text-xs font-normal uppercase text-blue-primary">Start Your First SIP</p>
		</Link>
		<Link
			to="/buyPortfolio"
			class="flex flex-1 flex-col justify-center rounded-lg border-2 border-[#D1D8F6] bg-white p-3 pr-10"
		>
			<Icon7 class="mb-1" />
			<p class=" text-xs font-normal uppercase text-blue-primary">BUY a Balanced Portfolio</p>
		</Link>
	</div>

	<Link
		to="/filters/items"
		class="flex w-full flex-row items-center justify-center rounded-lg border-2 border-[#D1D8F6] bg-white p-3"
	>
		<Icon8 class="mr-2" />
		<p class="text-xs font-normal uppercase text-blue-primary">Explore Mutual Funds</p>
	</Link>
</div>

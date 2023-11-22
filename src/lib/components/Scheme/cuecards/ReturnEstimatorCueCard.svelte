<script lang="ts">
	import ReturnEstimator from '$components/ReturnEstimator/ReturnEstimator.svelte';

	export let returns3yr: number;
	export let returns5yr: number;
	export let categoryName: string;
	export let minSipAmount: number;
	export let minLumpsumAmount: number;
</script>

<ReturnEstimator
	class="mx-2 h-[580px] {$$props.class}"
	{returns3yr}
	{returns5yr}
	{categoryName}
	{minSipAmount}
	{minLumpsumAmount}
/>

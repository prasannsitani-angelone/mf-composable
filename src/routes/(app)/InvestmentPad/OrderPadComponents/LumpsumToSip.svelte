<script lang="ts">
	import Button from '$components/Button.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { createEventDispatcher } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let sipAmount = '';

	const dispatch = createEventDispatcher();

	const primaryCtaClick = () => {
		dispatch('primaryCtaClick');
	};

	const secondaryCtaClick = () => {
		dispatch('secondaryCtaClick');
	};

	const pointsData = [
		{
			title: 'Reduced Risk',
			detail: 'Put only a portion of your money at risk and average out purchase price over time',
			iconName: 'graph-down'
		},
		{
			title: 'Easy Setup',
			detail: 'Set up in a few clicks and automate all your future payments',
			iconName: 'phone-with-money'
		},
		{
			title: 'Peace Of Mind',
			detail: 'No need to monitor the markets closely to look for the best time to invest',
			iconName: 'smiley-with-tick'
		}
	];
</script>

<article
	class="flex w-full flex-col rounded-b-none rounded-t-2xl bg-white px-5 pb-4 pt-9 text-black-key shadow-clg md:rounded-lg {$$props?.class}"
>
	<div class="text-center text-2xl font-normal">Invest with SIPs instead of OTI</div>

	<div class="my-6 rounded bg-yellow-background px-2.5 py-2 text-center text-sm font-normal">
		Invest with SIPs instead of a one-time investment
	</div>

	{#each pointsData as point, index (index)}
		<article class="flex items-center justify-start py-4 {index > 0 ? 'border-t' : 'pt-0'}">
			<WMSIcon width={36} height={36} class="mr-4" name={point?.iconName} />
			<section class="flex flex-1 flex-col items-start justify-center text-black-key">
				<div class="text-sm font-normal">
					{point?.title}
				</div>
				<div class="mt-1 text-xs font-normal">
					{point?.detail}
				</div>
			</section>
		</article>
	{/each}

	<Button variant="contained" class="my-2" onClick={primaryCtaClick}>
		START SIP OF ₹{addCommasToAmountString(sipAmount)}/MONTH
	</Button>

	<Button variant="transparent" onClick={secondaryCtaClick}>CONTINUE WITH ONE-TIME PAYMENT</Button>
</article>

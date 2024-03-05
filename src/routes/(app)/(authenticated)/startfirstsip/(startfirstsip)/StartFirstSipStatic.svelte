<script lang="ts">
	import { WMSIcon } from 'svelte-components';

	const description = [
		{
			icon: 'graph-high-return',
			label: 'Higher returns than FDs'
		},
		{
			icon: 'calendar-repeat',
			label: 'Monthly investment plan'
		},
		{
			icon: 'withdraw',
			label: 'Withdraw anytime'
		}
	];
</script>

<article
	class="items-center rounded-lg bg-background-alt p-4 shadow-csm {$$props.class}"
	data-testid="startFirstSipNudge"
>
	<p class="my-3 text-lg font-medium text-title">Mutual Funds offer Multiple Benefits</p>

	<section class="flex">
		{#each description || [] as option, index}
			<article class="flex h-full flex-1 flex-col">
				<div class="mb-2 self-center">
					<WMSIcon height={40} width={40} name={option.icon} fill="var(--BACKGROUND-ALT)" />
				</div>
				<h2 class="px-1 text-center text-sm font-medium text-title">
					{option.label}
				</h2>
			</article>
		{/each}
	</section>
</article>

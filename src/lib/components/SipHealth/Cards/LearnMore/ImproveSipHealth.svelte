<script>
	import { WMSIcon } from 'svelte-components';

	let options = [
		{
			title: 'Enable Autopay',
			description: 'Automate your SIP payments and build investing discipline with autopay'
		},
		{
			title: 'Pay SIP Instalments Consistently',
			description: 'Pay your monthly SIP instalments with zero misses'
		},
		{
			title: 'Keep Your SIPs Active for Longer',
			description:
				'SIPs help you build wealth in the long term. The longer you stay invested, the higher your score'
		}
	];
</script>

<div
	class="flex h-[450px] w-fit flex-col items-start justify-self-center rounded-lg bg-white {$$props.class}"
>
	<p class="mt-6 px-6 text-4xl font-medium text-[#008F75]">02</p>
	<p class="mb-8 px-6 text-2xl font-medium text-black-title">Improve Your SIP Health</p>

	{#each options as option}
		<div class="mb-3 flex flex-row px-6">
			<div class="mr-2 flex-1">
				<WMSIcon name="checkbox-checked-circle" />
			</div>
			<div class="flex flex-col">
				<div class="mb-1 text-sm font-medium text-black-title">
					{option.title}
				</div>
				<div class="text-xs font-normal text-grey-body">
					{option.description}
				</div>
			</div>
		</div>
	{/each}
</div>

<script lang="ts">
	const infoList = [
		{
			details:
				'SIP amount will be debited automatically from your bank account on the monthly SIP date'
		},
		{
			details:
				'This is a one-time setup, and also works for your future SIPs. Never miss another instalment!'
		},
		{ details: 'All your existing SIPs will be linked with the new autopay' }
	];
</script>

<ul class="mt-7 px-2">
	{#each infoList as item, index (index)}
		<li class=" mb-4 flex items-baseline text-sm font-normal text-body last:mb-1">
			<div><div class="mr-3 h-2 w-2 rounded-full bg-body" /></div>
			<div>{item.details}</div>
		</li>
	{/each}
</ul>

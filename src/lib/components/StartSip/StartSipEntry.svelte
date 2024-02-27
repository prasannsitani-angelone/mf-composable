<script lang="ts">
	import { base } from '$app/paths';
	import { startSipEntryClickAnalytics } from '$lib/analytics/startSip/startSip';
	import { versionStore } from '$lib/stores/VersionStore';
	import { modifiedGoto } from '$lib/utils/goto';
	import { WMSIcon } from 'svelte-components';

	const navigate = () => {
		const eventMetaData = {
			text: 'Begin investing with just ₹100'
		};
		startSipEntryClickAnalytics(eventMetaData);

		if (versionStore.getVersion() === 'B') {
			modifiedGoto(`${base}/startSip`);
		} else {
			modifiedGoto(`${base}/startfirstsip`);
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
	class={`my-2 max-w-4xl rounded-lg bg-background-alt px-4 py-3 shadow-csm md:cursor-pointer ${$$props.class}`}
	on:click={navigate}
>
	<article class="flex items-center justify-between" data-testid="start-sip">
		<div>
			<h2 class="mb-1 text-base font-medium text-title">Start SIP</h2>
			<p class="text-xs font-normal text-body">Begin investing with just ₹100</p>
		</div>

		<WMSIcon name="arrow-next-circle-filled" height={24} width={24} />
	</article>
</section>

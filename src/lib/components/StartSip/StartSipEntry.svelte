<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { versionStore } from '$lib/stores/VersionStore';
	import { WMSIcon } from 'svelte-components';

	const navigate = () => {
		if (versionStore.getVersion() === 'B') {
			goto(`${base}/startSip`);
		} else {
			goto(`${base}/startfirstsip`);
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

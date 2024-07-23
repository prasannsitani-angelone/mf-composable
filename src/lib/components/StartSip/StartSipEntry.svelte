<script lang="ts">
	import { goto } from '$app/navigation';
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

		// if (versionStore.getVersion() === 'B') {
		// 	modifiedGoto(`${base}/startSip`);
		// } else {
		// 	modifiedGoto(`${base}/startfirstsip`);
		// }

		// modifiedGoto(`${base}/startfirstsip`);
		goto(`${base}/startfirstsip`);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
	class={`wrapper no-scrollbar relative my-2 max-w-4xl overflow-hidden rounded-lg bg-background-alt px-4 py-3 shadow-csm md:cursor-pointer ${$$props.class}`}
	on:click={navigate}
>
	<div class="sliding-bg z-2 absolute h-8 bg-red-200 opacity-10" />
	<article class="flex items-center justify-between" data-testid="start-sip">
		<div class="z-0">
			<h2 class="mb-1 text-base font-medium text-title">Start SIP</h2>
			<div class="wrapper inline-flex text-xs font-normal text-body">
				<ul class="dynamic-prompts">
					<li><span>Begin investing with just ₹100</span></li>
					<li><span>Edit SIP amount or pause anytime</span></li>
					<li><span>Pay on any date of your choice</span></li>
				</ul>
			</div>
		</div>

		<WMSIcon name="arrow-next-circle-filled" height={24} width={24} />
	</article>
</section>

<style scoped>
	.dynamic-prompts {
		height: 20px;
		line-height: 20px;
		overflow: hidden;
	}

	.dynamic-prompts li {
		position: relative;
		top: 0;
		animation: slide 18s steps(3) infinite;
		-webkit-animation: slide 18s steps(3) infinite;
		-moz-animation: slide 18s steps(3) infinite;
		-o-animation: slide 18s steps(3) infinite;
		-ms-animation: slide 18s steps(3) infinite;
	}

	.dynamic-prompts li span {
		position: relative;
	}

	.dynamic-prompts li span::after {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		animation: slide 18s steps(3) infinite;
		-webkit-animation: slide 18s steps(3) infinite;
		-moz-animation: slide 18s steps(3) infinite;
		-o-animation: slide 18s steps(3) infinite;
		-ms-animation: slide 18s steps(3) infinite;
	}
	.sliding-bg {
		transform: rotate(145deg);
		animation: slider 2s infinite;
	}

	.sliding-bg::after {
		top: 100%;
		left: 100%;
	}

	.wrapper::-webkit-scrollbar {
		display: none;
	}

	/* For IE, Edge and Firefox */
	.wrapper {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	@keyframes slider {
		0% {
			left: 0%;
			width: 200px;
		}
		100% {
			width: 100%;
			left: 100%;
		}
	}

	@-moz-keyframes slider {
		0% {
			left: 0%;
			width: 0px;
		}
		5% {
			left: 0%;
			width: 100%;
		}
		100% {
			width: 100%;
			left: 100%;
		}
	}

	@-webkit-keyframes slider {
		0% {
			left: 0%;
			width: 0px;
		}
		5% {
			left: 0%;
			width: 100%;
		}
		100% {
			width: 100%;
			left: 100%;
		}
	}

	@-o-keyframes slider {
		0% {
			left: 0%;
			width: 0px;
		}
		5% {
			left: 0%;
			width: 100%;
		}
		100% {
			width: 100%;
			left: 100%;
		}
	}

	@-ms-keyframes slider {
		0% {
			left: 0%;
			width: 0px;
		}
		5% {
			left: 0%;
			width: 100%;
		}
		100% {
			width: 100%;
			left: 100%;
		}
	}

	@keyframes slide {
		100% {
			top: -60px;
		}
	}

	@-moz-keyframes slide {
		100% {
			top: -60px;
		}
	}

	@-webkit-keyframes slide {
		100% {
			top: -60px;
		}
	}

	@-o-keyframes slide {
		100% {
			top: -60px;
		}
	}

	@-ms-keyframes slide {
		100% {
			top: -60px;
		}
	}
</style>

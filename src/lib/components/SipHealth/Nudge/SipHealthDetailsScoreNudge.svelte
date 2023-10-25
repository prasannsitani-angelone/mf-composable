<script lang="ts">
	import { page } from '$app/stores';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { WMSIcon } from 'svelte-components';
	import SipHealthScoreComponent from './SipHealthScoreComponent.svelte';
	import { createEventDispatcher } from 'svelte';
	import { SIP_HEALTH_SCORE_LIMIT_AVERAGE, SIP_HEALTH_SCORE_LIMIT_GOOD } from '../constants';

	export let score = 0;
	let scoreClass = 'text-green-buy';
	let firstName = ($page.data?.profile?.clientDetails?.firstName || '')?.toLowerCase() || '';
	$: {
		if (score >= SIP_HEALTH_SCORE_LIMIT_GOOD) {
			scoreClass = 'text-green-amount';
		} else if (score >= SIP_HEALTH_SCORE_LIMIT_AVERAGE) {
			scoreClass = 'text-yellow-primary';
		} else {
			scoreClass = 'text-red-errorDark';
		}
	}

	const dispatch = createEventDispatcher();

	const onLearnMoreClicked = () => {
		dispatch('learnMoreClick');
	};
</script>

<section class="px-4 pb-4 md:px-6 {$$props?.class}">
	<article class="flex items-center justify-between">
		<div>
			<div>
				You are doing great, <span class="font-medium capitalize">{firstName}</span>
			</div>
			<div class="mt-2 text-lg font-medium {scoreClass}">
				SIP Health Score: {score}
			</div>
		</div>

		<SipHealthScoreComponent {score} class="!-m-2 !h-20 !w-20 drop-shadow-xl" />
	</article>

	<p class="mt-2 text-xs font-normal leading-5 text-black-bolder">
		Your SIP health score provides insight in to your investing habits. Use this report to
		understand your investing discipline, consistency, and overall portfolio growth
	</p>

	<ButtonMedium
		onClick={onLearnMoreClicked}
		class="ml-0 mt-2 !h-0 !min-h-0 !w-fit px-0 !text-xs sm:w-[328px]"
		variant="transparent"
	>
		LEARN MORE
		<WMSIcon name="right-arrow" class="h-4 w-4 min-w-[24px]" stroke="#3F5BD9" />
	</ButtonMedium>
</section>

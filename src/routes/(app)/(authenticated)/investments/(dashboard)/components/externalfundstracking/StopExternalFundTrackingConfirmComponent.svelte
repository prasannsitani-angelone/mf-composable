<script lang="ts">
	import { Overlay, WMSIcon } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { createEventDispatcher } from 'svelte';
	import { stopExternalFundTrackingConfirmClickEvent } from './analytics.js';

	const dispatch = createEventDispatcher();
	const onRemoveTrackingClicked = () => {
		stopExternalFundTrackingConfirmClickEvent({ confirm: 'yesremove' });
		dispatch('removeTrackingClicked');
	};

	const onDismissClicked = () => {
		stopExternalFundTrackingConfirmClickEvent({ confirm: 'Nokeepit' });
		dispatch('dismiss');
	};

	const descriptionItems = [
		'Your external investments will no longer be tracked in your portfolio',
		'Removing external investments from Angel One does not affect your invested money in any way'
	];
</script>

<Overlay containerClass="justify-end sm:!justify-center">
	<article
		class="flex w-full flex-col items-center rounded-t-2xl bg-background-alt px-4 pt-6 sm:w-160 sm:rounded-lg sm:p-8"
	>
		<WMSIcon name="alert-triangle" height={64} width={64} class="mb-3" />

		<p class="mb-6 text-lg font-normal text-title">Stop Tracking Funds?</p>

		<ul class="mb-10 px-6 sm:px-14">
			{#each descriptionItems as item, i}
				<li class="mb-1 list-disc text-sm font-normal text-title">
					{item}
				</li>
			{/each}
		</ul>

		<ButtonMedium onClick={onDismissClicked} class=" mb-2 w-full sm:w-5/6"
			>NO, KEEP TRACKING</ButtonMedium
		>

		<ButtonMedium onClick={onRemoveTrackingClicked} variant="transparent" class="mb-2">
			YES, REMOVE
		</ButtonMedium>
	</article>
</Overlay>

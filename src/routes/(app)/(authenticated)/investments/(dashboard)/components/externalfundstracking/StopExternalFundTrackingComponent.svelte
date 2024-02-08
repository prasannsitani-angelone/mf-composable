<script lang="ts">
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { createEventDispatcher } from 'svelte';
	import { stopExternalFundTrackingClickEvent } from './analytics.js';

	const dispatch = createEventDispatcher();
	const onTrackingClicked = () => {
		stopExternalFundTrackingClickEvent();
		dispatch('stopTrackingClicked');
	};
</script>

<div class="flex flex-col items-center {$$props.class} ">
	<p class="text-xs font-normal text-body">No longer want to track?</p>

	<ButtonMedium variant="transparent" size="btn-sm" class="pt-0" onClick={onTrackingClicked}>
		STOP TRACKING
	</ButtonMedium>
</div>

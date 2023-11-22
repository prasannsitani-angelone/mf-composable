<script lang="ts">
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import Button from './Button.svelte';
	import { WMSIcon } from 'svelte-components';
	import { createEventDispatcher } from 'svelte';
	const handleBackArrowClick = () => {
		if (onBackClick && typeof onBackClick === 'function') {
			onBackClick();
		}
	};
	let title = '';
	let source = '';
	type BackFunction = () => void;
	let onBackClick: BackFunction = () => history.back();
	export { title, onBackClick, source };
	const dispatch = createEventDispatcher();
	const onThreeDotsClick = () => {
		dispatch('onHeaderButtonClick');
	};
</script>

<div class={`mt-3 hidden items-center justify-between lg:flex ${$$props.class || ''}`}>
	<div class="flex items-center">
		<Button size="xs" onClick={handleBackArrowClick} variant="transparent" class="!p-0 !pl-4">
			<LeftArrowIcon class="mr-4 cursor-pointer" />
		</Button>

		<div class="text-lg font-normal text-black-title">{title}</div>
	</div>

	{#if source === 'sipBook'}
		<Button class="border-none !bg-white px-6" onClick={() => onThreeDotsClick()}>
			<WMSIcon name="three-vertical-dots-icon" height={15} />
		</Button>
	{/if}
</div>

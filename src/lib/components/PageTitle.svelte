<script lang="ts">
	import LeftArrowIcon from '$lib/images/icons/LeftArrowIcon.svelte';
	import Button from './Button.svelte';
	const handleBackArrowClick = () => {
		if (onBackClick && typeof onBackClick === 'function') {
			onBackClick();
		}
	};
	let title = '';
	type BackFunction = () => void;
	let onBackClick: BackFunction = () => history.back();
	export { title, onBackClick };
</script>

<div class="mt-3 hidden lg:flex">
	<Button onClick={handleBackArrowClick} variant="text" class="!p-0">
		<LeftArrowIcon class="mr-4 cursor-pointer" />
	</Button>

	<div class="text-lg font-medium text-black-title">{title}</div>
</div>

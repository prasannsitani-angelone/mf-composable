<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from './Button.svelte';

	let heading: string;
	let contentLine: string;
	let textForButton: string;
	let redirectUrl: string;

	const navigateToRedirectUrl = async () => {
		await goto(`${base}${redirectUrl}`);
	};
	export { heading, contentLine, textForButton, redirectUrl };
</script>

<section
	class="flex h-[calc(100vh-180px)] flex-col items-center rounded-lg bg-white px-8 pt-12 shadow-csm"
>
	<slot name="icon" />
	<slot name="heading">
		<div class="mt-4 text-center text-lg font-medium text-black-title">
			{heading}
		</div>
	</slot>

	<slot name="content">
		<div class="mt-2 mb-4 text-center text-sm font-normal text-grey-body">
			{contentLine}
		</div>
	</slot>

	<slot name="button">
		<Button onClick={navigateToRedirectUrl} variant="outlined">
			{textForButton}
		</Button>
	</slot>
</section>

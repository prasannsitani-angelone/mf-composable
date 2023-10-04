<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Button from './Button.svelte';

	let heading: string;
	let contentLine: string;
	let textForButton: string;
	let redirectUrl: string;

	const navigateToRedirectUrl = async () => {
		await goto(`${base}${redirectUrl}`, { replaceState: true });
	};
	export { heading, contentLine, textForButton, redirectUrl };
</script>

<section
	class="flex h-[calc(100vh-180px)] flex-col items-center justify-center rounded-lg bg-white px-8 shadow-csm sm:justify-start sm:pt-16 {$$props.class ||
		''}"
>
	<slot name="icon" />
	<slot name="heading">
		<div
			class="mb-3 mt-4 text-center text-2xl font-normal text-black-title sm:mb-6 sm:mt-8 sm:text-4xl lg:mx-40"
		>
			{heading}
		</div>
	</slot>

	<slot name="content">
		<div class="mb-8 mt-2 max-w-md text-center text-sm font-normal text-grey-body sm:text-lg">
			{contentLine}
		</div>
	</slot>

	<slot name="button">
		<Button onClick={navigateToRedirectUrl} variant="outlined">
			{textForButton}
		</Button>
	</slot>
</section>

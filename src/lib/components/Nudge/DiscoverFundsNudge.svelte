<script lang="ts">
	import WarningIcon from '$lib/images/icons/WarningIcon.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { goto } from '$app/navigation';
	import Button from '$components/Button.svelte';
	import type { INudge } from '$lib/types/INudge';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	let nudge: INudge;
	let impressionEvent: () => void;
	let clickEvent: () => void;
	let onAction: (() => void) | null = null;
	onMount(() => {
		impressionEvent?.();
	});
	const navigateToPage = () => {
		clickEvent?.();
		if (onAction) {
			onAction?.();
		} else if (nudge?.link) {
			goto(`${base}${nudge.link}`);
		}
	};
	export { nudge, impressionEvent, clickEvent, onAction };
</script>

<article
	class={`flex flex-col justify-between rounded-lg shadow-csm sm:flex-row sm:px-6 sm:py-5 ${$$props.class}`}
	class:bg-yellow-background={nudge?.type === 'warn'}
	class:bg-red-error={nudge?.type === 'error'}
>
	<div class="flex flex-row items-center p-4 sm:p-0">
		<div
			class="mr-2 flex h-12 w-12 flex-row items-center justify-center rounded-full bg-white p-1 sm:mr-4"
		>
			<WarningIcon fill={nudge?.type === 'warn' ? '#F9BA4D' : '#F65E5A'} />
		</div>
		<div class="flex flex-col">
			<div class="text-lg font-normal text-black-title">
				{nudge?.heading || ''}
			</div>
			<div class="text-sm text-grey-body">
				{nudge?.description || ''}
			</div>
		</div>
	</div>
	<div>
		<Button
			variant="transparent"
			class="flex w-full cursor-pointer flex-row items-center justify-end whitespace-nowrap border-t border-grey-line px-3 py-4 !pr-0 text-sm font-medium text-blue-primary hover:border-grey-line active:opacity-75 sm:border-t-0 sm:px-0 sm:py-0"
			onClick={navigateToPage}
			ariaLabel={nudge?.linkHeading}
		>
			<span class="mr-3 sm:mr-4">{nudge?.linkHeading}</span>
			<RightIcon stroke="#3F5BD9" />
		</Button>
	</div>
</article>

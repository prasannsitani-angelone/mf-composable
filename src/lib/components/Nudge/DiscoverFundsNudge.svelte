<script lang="ts">
	import WarningIcon from '$lib/images/icons/WarningIcon.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { goto } from '$app/navigation';
	import Button from '$components/Button.svelte';
	import type { INudge } from '$lib/types/INudge';
	let nudge: INudge;
	const navigateToPage = () => {
		if (nudge.link) {
			goto(nudge.link);
		}
	};
	export { nudge };
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
			<div class="text-lg font-medium text-black-title">
				{nudge?.heading || ''}
			</div>
			<div class="text-sm text-grey-body">
				{nudge?.description || ''}
			</div>
		</div>
	</div>

	<Button
		variant="transparent"
		class="flex w-full cursor-pointer flex-row items-center justify-end whitespace-nowrap border-t border-grey-line px-3 py-4 !pr-0 text-sm font-semibold text-blue-primary active:opacity-75 sm:border-t-0 sm:px-0 sm:py-0"
		on:click={navigateToPage}
	>
		<span class="mr-3 sm:mr-4">{nudge?.linkHeading}</span>
		<RightIcon stroke="#3F5BD9" />
	</Button>
</article>

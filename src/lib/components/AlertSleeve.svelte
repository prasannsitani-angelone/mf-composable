<script lang="ts">
	import { base } from '$app/paths';
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';

	export let heading = '';
	export let subHeading: string[] = [];
	export let onSubmit = () => undefined;
	export let buttonText = 'OKAY';
	export let link = '';
	export let onBackDropClicked = () => undefined;
</script>

<Modal isModalOpen={true} on:backdropclicked={onBackDropClicked}>
	<div
		class="flex flex-col items-center justify-between overflow-y-auto rounded-t-2xl bg-white pt-4 shadow-clg w-full sm:w-120 sm:rounded-lg sm:px-20 sm:pb-12 sm:pt-16 ${$$props.class}"
	>
		<slot name="header">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src={`${base}/images/AlertSleeve.png`} title="Alert" class="h-40 w-40" />
		</slot>
		<slot name="content">
			<div class="w-full text-center">
				<div class="mb-4 px-4 text-2xl font-medium text-black-title sm:mb-2">
					{heading}
				</div>
				<div class="flex flex-col gap-1 px-4 text-sm text-grey-body">
					{#each subHeading as item, index (index)}
						<div class="text-start {$$props.subHeadingClass}">{item}</div>
					{/each}
				</div>
			</div>
		</slot>
		<slot name="footer" class="w-full">
			<div class="flex w-full flex-col items-center px-4 pt-5">
				{#if link}
					<a href={link} target="_blank" class="my-3 text-sm font-bold text-blue-primary"
						>KNOW MORE</a
					>
				{/if}
				<Button class="my-3 w-full" onClick={onSubmit}>{buttonText}</Button>
			</div>
		</slot>
	</div>
</Modal>

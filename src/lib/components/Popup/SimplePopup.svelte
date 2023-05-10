<script setup lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '../Modal.svelte';
	import Button from '../Button.svelte';

	const dispatch = createEventDispatcher();

	export let heading = '';
	export let subHeading1 = '';
	export let subHeading2 = '';
	export let buttonTitle = '';
	export let headingClass = '';
	export let subHeading1Class = '';
	export let subHeading2Class = '';

	const backdropClick = () => {
		dispatch('backdropClick');
	};
	const onSubmit = () => {
		dispatch('onSubmit');
	};
</script>

<Modal closeModal={backdropClick} isModalOpen>
	<div
		class="sm:flex-column !static w-screen items-stretch rounded-t-2xl rounded-b-none bg-white sm:min-h-[460px] sm:w-120 sm:justify-center sm:rounded-lg sm:px-14 sm:py-[72px]"
	>
		<div class="my-4 flex flex-col items-center justify-between bg-white py-2 px-3 md:px-3.5">
			<slot name="popupIcon" />
			{#if heading}
				<p class={`py-2 text-2xl font-medium text-black-title sm:text-xl ${headingClass || ''}`}>
					{heading}
				</p>
			{/if}
			{#if subHeading1}
				<p
					class={`px-2 pt-2 text-center text-sm font-normal text-grey-body ${
						subHeading1Class || ''
					}`}
				>
					{subHeading1}
				</p>
			{/if}
			{#if subHeading2}
				<p
					class={`px-2 pb-2 text-center text-sm font-normal text-grey-body ${
						subHeading2Class || ''
					}`}
				>
					{subHeading2}
				</p>
			{/if}
		</div>
		{#if buttonTitle}
			<section class="px-4 py-2 md:px-8">
				<article class="flex items-center justify-center">
					<Button class="rounded sm:w-48" onClick={onSubmit}>
						{buttonTitle}
					</Button>
				</article>
			</section>
		{/if}
	</div>
</Modal>

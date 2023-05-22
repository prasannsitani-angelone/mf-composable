<script lang="ts">
	import Button from '../Button.svelte';

	export let rta = '';
	export let textForButton = '';
	export let redirectLink = '';
	export let buttonClass = '';
	const openCamsKarvyLink = () => {
		window.open(redirectLink);
	};
</script>

<section
	class="via-yellow mx-3 mt-2 flex items-center justify-center rounded-lg border-l-2 border-yellow-400 bg-gradient-to-r from-white to-yellow-50 px-4 shadow-csm {$$props.class}"
>
	<slot name="icon" />

	<slot name="content">
		{#if rta === 'CAMS'}
			<div class="mt-2 mb-4 pl-3 text-left text-xs font-normal text-black-title">
				<b>To avoid order failure,</b><br /> please update nominee status for this folio on CAMS. Proceed
				if already updated
			</div>
		{:else if rta === 'KARVY'}
			<div class="mt-2 mb-4 pl-3 text-left text-xs font-normal text-black-title">
				<b>To avoid order failure,</b><br /> please update nominee status for this folio on KFintech.
				Proceed if already updated
			</div>
		{/if}
	</slot>

	<slot name="button">
		<Button
			class="items-center justify-center rounded !border-0 !bg-transparent !p-0 text-center !text-xs !text-blue-primary {buttonClass}"
			onClick={openCamsKarvyLink}
		>
			{textForButton}
		</Button>
	</slot>
</section>

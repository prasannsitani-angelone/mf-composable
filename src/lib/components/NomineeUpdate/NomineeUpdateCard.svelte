<script lang="ts">
	import { page } from '$app/stores';
	import Link from '$components/Link.svelte';
	export let rta = '';
	export let textForButton = '';
	export let redirectLink = '';
	export let buttonClass = '';
	$: os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
</script>

<section
	class="via-yellow mx-3 mt-2 flex items-center justify-center rounded-lg border-l-2 border-yellow-400 bg-gradient-to-r from-white to-yellow-50 px-4 shadow-csm {$$props.class}"
>
	<slot name="icon" />

	<slot name="content">
		{#if rta === 'CAMS'}
			<div class="mb-4 mt-2 pl-3 text-left text-xs font-normal text-black-title">
				<b>To avoid order failure,</b><br /> please update nominee status for this folio on CAMS. Proceed
				if already updated
			</div>
		{:else if rta === 'KARVY'}
			<div class="mb-4 mt-2 pl-3 text-left text-xs font-normal text-black-title">
				<b>To avoid order failure,</b><br /> please update nominee status for this folio on KFintech.
				Proceed if already updated
			</div>
		{/if}
	</slot>

	<slot name="button">
		<Link
			to={os !== 'Android'
				? redirectLink
				: `intent://${redirectLink.split('//', 2)[1]}#Intent;scheme=https;end`}
			class="inline-flex flex-shrink-0 text-xs font-medium text-blue-primary {buttonClass}"
		>
			{textForButton}
		</Link>
	</slot>
</section>

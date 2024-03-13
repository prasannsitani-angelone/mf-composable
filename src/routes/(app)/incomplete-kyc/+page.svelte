<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import KycPending from '$lib/images/kycPending.svelte';
	import { WMSIcon } from 'svelte-components';
</script>

<article>
	<div class="absolute inset-0 flex flex-col items-center justify-center">
		<KycPending />
		<h2 class="mt-6 text-[18px] font-medium text-title">KYC Not Complete</h2>
		<p class="w-3/4 text-center text-[14px] text-body">
			Complete your KYC process to invest in mutual funds
		</p>
	</div>
	<div class="container absolute bottom-0 mb-3 flex flex-col items-center justify-center">
		<Button variant="contained" class="{$$props.class} w-full" ariaLabel="View KYC status">
			VIEW KYC STATUS
			<WMSIcon name="right-arrow" size="xs" class="ml-2" stroke="var(--BACKGROUND-ALT)" />
		</Button>
		<Link to="/discoverfunds">
			<Button variant="transparent" class="{$$props.class} mt-2 w-full" ariaLabel="Go back">
				GO BACK
			</Button>
		</Link>
	</div>
</article>

<style>
	.container {
		width: calc(100% - 16px);
	}
</style>

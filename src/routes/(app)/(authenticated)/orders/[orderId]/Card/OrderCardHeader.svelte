<script lang="ts">
	import type { IOrderDetails } from '$lib/types/IOrderDetails';
	import { SwitchOrderTitleCard } from 'svelte-components';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	let orderDetails: IOrderDetails;

	export { orderDetails };
</script>

{#if orderDetails?.transactionType?.toUpperCase() !== 'SWITCH'}
	<div class="flex items-center pb-3">
		<SchemeLogo src={orderDetails?.logoUrl} alt="logo" />
		<p class="text-sm text-black-title md:text-base">{orderDetails?.schemeName}</p>
	</div>
{:else}
	<SwitchOrderTitleCard
		switchOutLogo={orderDetails?.logoUrl}
		switchOutSchemeName={orderDetails?.schemeName}
		switchInLogo={orderDetails?.toSchemeLogoUrl}
		switchInSchemeName={orderDetails?.toSchemeName}
	/>
{/if}

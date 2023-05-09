<script lang="ts">
	import type { IOrderDetails } from '$lib/types/IOrderDetails';
	import { SwitchOrderTitleCard } from 'wms-ui-component';
	let orderDetails: IOrderDetails;

	export { orderDetails };
</script>

{#if orderDetails?.transactionType?.toUpperCase() !== 'SWITCH'}
	<div class="flex items-center pb-3">
		<div
			class={`mr-3 flex h-12 w-12 shrink-0 items-center rounded-full border border-grey-line shadow-csm group-hover:bg-white ${$$props.class}`}
		>
			<img src={orderDetails?.logoUrl} loading={'lazy'} width="48" height="48" alt="logo" />
		</div>
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

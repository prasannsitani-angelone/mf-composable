<script lang="ts">
	import type { IOrderDetails } from '$lib/types/IOrderDetails';
	import { SwitchOrderTile, SwitchOrderTitleCard } from 'svelte-components';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import WMSIcon from '$components/WMSIcon.svelte';
	let orderDetails: IOrderDetails;

	export { orderDetails };
</script>

{#if orderDetails?.transactionType?.toUpperCase() !== 'SWITCH'}
	<div class="flex items-center pb-3">
		<SchemeLogo src={orderDetails?.logoUrl} alt="logo" />
		<p class="text-sm text-title md:text-base">{orderDetails?.schemeName}</p>
	</div>
{:else}
	<SwitchOrderTitleCard
		class="md:flex-col"
		orderTileClass="md:w-full !bg-background-alt !border-border"
	>
		<svelte:fragment slot="switchOut">
			<SwitchOrderTile
				logoUrl={orderDetails?.logoUrl}
				schemeName={orderDetails?.schemeName}
				orderTypeText="SWITCH OUT"
				orderTypeBgColor="bg-tint12-secondary !text-title"
				schemeNameClass={'!font-normal !text-title'}
			/>
		</svelte:fragment>

		<svelte:fragment slot="switchIn">
			<SwitchOrderTile
				logoUrl={orderDetails?.toSchemeLogoUrl}
				schemeName={orderDetails?.toSchemeName}
				orderTypeText="SWITCH IN"
				orderTypeBgColor="bg-tint12-secondary-alt !text-title"
				schemeNameClass={'!font-normal !text-title'}
			/>
		</svelte:fragment>
		<svelte:fragment slot="switchIcon">
			<div class="z-20 -my-1 flex max-h-0 items-center self-center">
				<WMSIcon
					height={40}
					width={40}
					name="chevron-down"
					background="var(--BACKGROUND-ALT)"
					border="var(--BORDER)"
					storke="var(--PRIMARY)"
				/>
			</div>
		</svelte:fragment>
	</SwitchOrderTitleCard>
{/if}

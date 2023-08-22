<script lang="ts">
	import Button from '$components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { WMSIcon } from 'svelte-components';
	import FooterErrorMessage from '../../components/FooterErrorMessage.svelte';
	import CautionIcon from '$lib/images/icons/CautionIcon.svelte';

	const dispatch = createEventDispatcher();

	export let isMappingSchemeAvailable = true;

	const handleButtonsClick = () => {
		if (isMappingSchemeAvailable) {
			dispatch('investMoreClicked');
		} else {
			dispatch('exploreFundsClicked');
		}
	};
</script>

<article class="bg-white p-3">
	<section class={`flex items-center`}>
		<Button
			class={`!disabled:text-grey-disabled w-full rounded disabled:!bg-grey-line`}
			disabled={false}
			onClick={() => handleButtonsClick()}
		>
			{isMappingSchemeAvailable ? `INVEST MORE` : `EXPLORE OTHER FUNDS`}
		</Button>
	</section>

	{#if isMappingSchemeAvailable}
		<section class="mx-3 flex justify-center text-1xs font-normal text-black-title">
			<article class="flex items-center justify-center px-6 pt-2.5">
				<WMSIcon class="mr-1" width={12} height={12} name="info-in-circle-dark" />
				You will be investing with Angel One
			</article>
		</section>
	{:else}
		<FooterErrorMessage
			errorMessage={'Investing in this scheme is not available. Explore \nalternate funds with Angel One.'}
		>
			<svelte:fragment slot="icon">
				<span class="mr-2"><CautionIcon /></span>
			</svelte:fragment>
		</FooterErrorMessage>
	{/if}
</article>

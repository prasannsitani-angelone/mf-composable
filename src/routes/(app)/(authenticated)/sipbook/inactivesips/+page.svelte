<script lang="ts">
	import Button from '$components/Button.svelte';
	import { profileStore } from '$lib/stores/ProfileStore';
	import type { IInactiveSip } from '$lib/types/ISipType';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import isInvestmentAllowed from '$lib/utils/isInvestmentAllowed';
	import SipCard from '../../orders/orderspage/sipbook/SipCard.svelte';
	import RightIcon from '$lib/images/icons/RightIcon.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import SipCardLoader from './SipCardLoader.svelte';
	import { page } from '$app/stores';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import { encodeObject } from '$lib/utils/helpers/params';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	import { restartSipButtonClickAnalytics } from '$lib/analytics/sipbook/sipbook';

	const userType = profileStore.userType();
	const redirectToOrderPad = (sip: IInactiveSip) => {
		// TODO: To change the navigation after the proper release
		restartSipButtonClickAnalyticsFunc(sip);
		const reRouteUrl = $page?.data?.deviceType?.isBrowser ? 'schemes' : 'schemes/invest';
		const path = `${reRouteUrl}/${normalizeFundName(sip?.schemeName, sip?.Isin, sip?.schemeCode)}`;
		const params = encodeObject({
			investmentType: 'SIP',
			investmentAmount: sip?.installmentAmount
		});
		goto(`${base}/${path}?params=${params}`);
	};

	const restartSipButtonClickAnalyticsFunc = (sip: IInactiveSip) => {
		const eventMetaData = {
			sipId: sip?.sipId,
			schemeName: sip?.schemeName,
			installmentAmount: sip?.installmentAmount,
			cancellationDate: getDateTimeString(sip?.cancelledTs, 'DATE', true)
		};
		restartSipButtonClickAnalytics(eventMetaData);
	};

	export let data: PageData;
</script>

{#await data?.api?.getInactiveSipData}
	<SipCardLoader />
{:then inactiveSips}
	<article>
		{#if inactiveSips?.length}
			<section>
				{#each inactiveSips as sip (sip?.sipId)}
					<article>
						<SipCard {sip} inactiveSip={true}>
							<article class="flex-1 text-right" slot="sipCardDetailsRightSection">
								<div class="text-[11px] font-medium text-red-sell">
									{sip?.isExpiredSip ? 'Expired On' : 'Cancelled On'}
								</div>
								<div class="text-base font-medium text-black-title">
									{getDateTimeString(sip?.cancelledTs, 'DATE', true)}
								</div>
							</article>
							<svelte:fragment slot="cardFooter">
								{#if isInvestmentAllowed(userType, sip?.schemePlan)}
									<section
										class="mx-3 flex items-center justify-end border-t border-grey-line py-2"
									>
										<Button
											variant="transparent"
											class="flex w-full cursor-default justify-end !pr-0"
											onClick={() => redirectToOrderPad(sip)}
										>
											<span class="text-sm font-semibold text-blue-primary"> RESTART SIP </span>
											<RightIcon class="ml-2 mt-0.5" stroke="#3F5BD9" />
										</Button>
									</section>
								{/if}
							</svelte:fragment>
						</SipCard>
					</article>
				{/each}
			</section>
		{/if}
	</article>
{/await}

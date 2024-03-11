<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import { BtnVariant, WMSIcon, addCommasToAmountString } from 'svelte-components';
	import CarouselNative from '$components/Carousel/CarouselNative.svelte';
	import CarouselItem from '$components/Carousel/CarouselItem.svelte';
	import type { Notif } from '$lib/types/INotifications';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { getDateTimeString } from '$lib/utils/helpers/date';
	import { SIP_ORDER_CARD_TYPES } from '$lib/constants/actions';

	let title = '';
	let sipList: Notif[] = [];
	let currentIndex = 0;
	let cardType: string;
	let tagClass =
		'absolute right-0 mr-1 font-normal px-1 py-0.5 text-[10px] text-title bg-tint12-sell rounded-sm z-10 -mt-2';
	let tag = '';

	$: isMobile = $page.data.deviceType.isMobile || false;

	const dispatch = createEventDispatcher();

	const handleButtonClick = (sip: Notif) => {
		dispatch('buttonClick', sip);
	};

	const setTitle = () => {
		if (cardType === SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_DUE) {
			title = `SIP Payment${sipList?.length > 1 ? 's' : ''} Due (${sipList?.length})`;
		} else if (cardType === SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_MISSED) {
			title = `Missed SIP Payment${sipList?.length > 1 ? 's' : ''} (${sipList?.length})`;
		} else if (cardType === SIP_ORDER_CARD_TYPES?.FAILED_ORDER) {
			title = `Recently Failed Order${sipList?.length > 1 ? 's' : ''} (${sipList?.length})`;
		} else {
			title = '';
		}
	};

	const setTag = () => {
		if (cardType === SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_DUE) {
			const today = new Date();
			const inputDate = new Date(sipList[currentIndex]?.orderDate * 1000);
			if (today?.toDateString() === inputDate?.toDateString()) {
				tag = 'Due Today';
			} else {
				tag = `Due on ${getDateTimeString(sipList[currentIndex]?.orderDate * 1000)}`;
			}
		} else if (cardType === SIP_ORDER_CARD_TYPES?.SIP_PAYMENT_MISSED) {
			tag = 'Overdue';
		} else if (cardType === SIP_ORDER_CARD_TYPES?.FAILED_ORDER) {
			tag = '';
		}
	};

	const handleCardVisible = (event: CustomEvent) => {
		currentIndex = event?.detail?.index || 0;
		setTag();
	};

	$: setTitle(), sipList;
	$: setTag(), sipList;

	export { sipList, cardType, tagClass };
</script>

<!-- getDateTimeString(order?.orderDate * 1000) -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if sipList?.length}
	<article class="rounded-lg bg-background-alt p-3 pb-0 shadow-csm {$$props.class}">
		<slot name="header">
			<section class="flex items-center">
				<slot name="titleIcon">
					<WMSIcon name="exclamation-circle-solid" width={28} height={28} stroke="var(--SELL)" />
				</slot>

				<slot name="title">
					<div class="ml-1 text-base font-medium text-title">
						{title}
					</div>
				</slot>
			</section>
		</slot>

		<!-- carousel -->
		<slot name="body">
			<CarouselNative
				navigation={!isMobile && sipList?.length > 0}
				totalElements={sipList?.length}
				on:onIndexChange={handleCardVisible}
				fixedWidth={true}
				slidesPerView={1}
				id={cardType}
			>
				{#each sipList || [] as sip, index}
					<CarouselItem class="max-h-14 max-w-full" {index} id={cardType}>
						<section class="mt-2">
							<slot name="tag">
								<div class={tagClass}>
									{tag}
								</div>
							</slot>
							<section class="flex items-center justify-between rounded border px-3 py-2">
								<slot name="schemeDetails">
									<article class="mr-2 flex items-center">
										<SchemeLogo size="xs" src={sip?.logoUrl} alt="logo" />
										<div class="max-h-10 overflow-y-clip text-sm font-normal text-title">
											{sip?.schemeName}
										</div>
									</article>
								</slot>

								<slot name="cta">
									<Button
										variant={BtnVariant?.Contained}
										size="sm"
										onClick={() => handleButtonClick(sip)}
									>
										<span class="text-xs font-medium">
											PAY ₹{addCommasToAmountString(sip?.amount)}
										</span>
									</Button>
								</slot>
							</section>
						</section>
					</CarouselItem>
				{/each}
			</CarouselNative>
		</slot>

		<slot name="footer" />
	</article>
{/if}

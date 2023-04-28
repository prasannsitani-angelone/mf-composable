<script lang="ts">
	import ResultItem from '$components/Autocomplete/ResultItem.svelte';
	import { goto } from '$app/navigation';
	// import DateFns from '@/utils/asyncDateFns'
	import type { orderItem } from '$lib/types/IOrderItem';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';
	import { base } from '$app/paths';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	import DateFns from '$lib/utils/asyncDateFns';
	import { orderCardClickAnalytics } from '$lib/analytics/orders/orders';
	import { OnNavigation } from '$lib/utils/navigation';
	// import { orderCardClickAnalytics } from '$lib/analytics/orders/orders';

	// await DateFns.init()
	// const { format } = DateFns.DateFns

	export let item: orderItem;
	let investmentTypeText = '';
	let transactionTypeText = '';
	const appContext: AppContext = getContext('app');

	const setInvestmentTypeText = () => {
		if (item?.investmentType === 'LUMPSUM') {
			investmentTypeText = 'ONE-TIME';
		} else if (item?.investmentType === 'REDEEM') {
			investmentTypeText = 'WITHDRAW';
		} else if (item?.investmentType === 'XSIP') {
			investmentTypeText = 'SIP';
		} else {
			investmentTypeText = item?.investmentType;
		}
	};

	const setTransactionTypeText = () => {
		if (item?.transactionType === 'PURCHASE') {
			transactionTypeText = 'Buy';
		} else if (item?.transactionType === 'REDEEM') {
			transactionTypeText = 'Withdraw';
		} else if (item?.transactionType === 'SWITCH') {
			transactionTypeText = 'Switch';
		}
	};

	setInvestmentTypeText();
	setTransactionTypeText();

	const getOrderStatusString = (item: { status: string; paymentStatus: string }) => {
		let orderStatus = 'Created';

		if (
			item?.status?.toUpperCase() === 'ORDER_PROCESSING' ||
			item?.paymentStatus?.toUpperCase() === 'PENDING'
		) {
			orderStatus = 'In Progress';
		} else if (item?.status?.toUpperCase() === 'ORDER_SCHEDULED') {
			orderStatus = 'Upcoming';
		} else if (item?.status?.toUpperCase() === 'ORDER_REJECTED') {
			orderStatus = 'Failed';
		}

		return orderStatus;
	};

	const orderCardAnalytics = () => {
		// TODO: Analytics Code
		const { format } = DateFns.DateFns;
		const eventMetaData = {
			FundName: item?.schemeName,
			Order: item?.investmentType,
			Type: item?.transactionType,
			Amount: item?.amount,
			Date: format(new Date(item?.createdTs), 'dd/MM/yyyy'),
			OrderStatus: getOrderStatusString(item)
		};

		orderCardClickAnalytics(eventMetaData);
	};

	const handleBodyClick = () => {
		if (item?.status !== 'ORDER_SCHEDULED') {
			orderCardAnalytics();
			OnNavigation();
			goto(
				`${getNavigationBaseUrl(base, appContext.scheme, appContext.host)}/orders/${item?.orderId}`
			);
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<section
	class="flex flex-col"
	class:cursor-pointer={item?.status !== 'ORDER_SCHEDULED'}
	on:click={handleBodyClick}
>
	<ResultItem
		class="justify-between p-0"
		data={{
			logoUrl: item?.logoUrl || '',
			categoryName: investmentTypeText,
			schemeName: item?.schemeName || '-'
		}}
		itemStyle="items-start"
		titleStyle="font-medium"
		categoryStyle="font-medium"
	>
		<svelte.fragment slot="returns">
			<section class="flex flex-col items-end font-medium">
				<article
					class="rounded-sm bg-opacity-20 px-1 text-[10px]"
					class:bg-green-buy={item?.transactionType === 'PURCHASE'}
					class:bg-red-400={item?.transactionType === 'REDEEM'}
					class:bg-blue-400={item?.transactionType === 'SWITCH'}
				>
					{item?.transactionType && transactionTypeText
						? transactionTypeText
						: item?.transactionType}
				</article>
				<article class="mt-1 text-base">
					{item?.amount > 0
						? `₹${addCommasToAmountString(item?.amount?.toFixed(0))}`
						: item?.quantity > 0
						? item?.quantity?.toFixed(3)
						: ''}
				</article>
			</section>
		</svelte.fragment>
	</ResultItem>
</section>

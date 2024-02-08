<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$components/Button.svelte';
	import { investmentDetailsFooterEvents } from '../../(authenticated)/investments/[investment]/constants';
	import { page } from '$app/stores';
	import { WMSIcon } from 'svelte-components';

	$: deviceType = $page?.data?.deviceType;
	const dispatch = createEventDispatcher();

	export let orderPadActiveTab: string;

	const onButtonClick = (buttonType: string) => {
		dispatch('onHeaderButtonClick', buttonType);
	};

	const inactiveButtonClass = 'font-normal !bg-background-alt !text-title/80 !border';
</script>

<article
	class="flex justify-center rounded-t-lg border-b bg-background-alt px-3 py-4 {$$props?.class}"
>
	<Button
		class="flex-auto rounded-r-none py-3 {orderPadActiveTab !== 'INVEST'
			? inactiveButtonClass
			: ''}"
		onClick={() => onButtonClick(investmentDetailsFooterEvents?.INVEST)}
	>
		INVEST MORE
	</Button>
	<Button
		class="flex-auto rounded-l-none py-3 {orderPadActiveTab !== 'WITHDRAW'
			? inactiveButtonClass
			: ''}"
		onClick={() => onButtonClick(investmentDetailsFooterEvents?.WITHDRAW)}
	>
		WITHDRAW
	</Button>
	<Button
		class="rounded border-none !bg-background px-6"
		onClick={() => onButtonClick(investmentDetailsFooterEvents?.MORE_OPTIONS)}
	>
		<WMSIcon name="three-vertical-dots-icon" height={15} width={4} />
	</Button>
</article>

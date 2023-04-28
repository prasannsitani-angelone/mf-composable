<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$components/Button.svelte';
	import ThreeVerticalDotsIcon from '$lib/images/icons/ThreeVerticalDotsIcon.svelte';
	import { investmentDetailsFooterEvents } from '../../investments/[investment]/constants';

	const dispatch = createEventDispatcher();

	export let orderPadActiveTab: string;

	const onButtonClick = (buttonType: string) => {
		dispatch('onHeaderButtonClick', buttonType);
	};

	const inactiveButtonClass = 'font-medium !bg-white !text-black-title/80 !border border-grey-line';
</script>

<article class="flex justify-center rounded-t-lg border-b bg-white py-4 px-3">
	<Button
		class={`flex-auto rounded-r-none py-3 ${
			orderPadActiveTab !== 'INVEST' ? inactiveButtonClass : ''
		}`}
		onClick={() => onButtonClick(investmentDetailsFooterEvents?.INVEST)}
	>
		INVEST MORE
	</Button>
	<Button
		class={`flex-auto rounded-l-none py-3 ${
			orderPadActiveTab !== 'WITHDRAW' ? inactiveButtonClass : ''
		}`}
		onClick={() => onButtonClick(investmentDetailsFooterEvents?.WITHDRAW)}
	>
		WITHDRAW
	</Button>
	<Button
		class="rounded border-none !bg-grey px-6"
		onClick={() => onButtonClick(investmentDetailsFooterEvents?.MORE_OPTIONS)}
	>
		<ThreeVerticalDotsIcon />
	</Button>
</article>

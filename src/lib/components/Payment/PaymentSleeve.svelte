<script lang="ts">
	import WmsIcon from '$components/WMSIcon.svelte';
	import { PAYMENT_MODE } from './constants';

	export let selectedMode = '';
	export let bankName = '';
	export let bankAccount = '';
	export let upiId = '';
	export let onPaymentMethodChange = (): void => undefined;

	const truncate = (str: string, size: number) =>
		str.length > size ? `${str.slice(0, size)}...` : str;

	const truncateUPIId = () => {
		const [prefix, suffix] = upiId.split('@');
		return `${truncate(prefix, 9)}@${truncate(suffix, 6)}`;
	};
</script>

<div class="flex w-full flex-row items-center {$$props.class}">
	<div>
		<svelte:component this={PAYMENT_MODE[selectedMode]?.sleeveIcon} />
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="ml-3 flex w-full cursor-pointer flex-col px-2 active:opacity-70"
		role="button"
		tabindex={0}
		on:click={onPaymentMethodChange}
	>
		<div class="flex flex-row items-center text-xs font-normal text-black-title">
			<span>
				{selectedMode === 'UPI'
					? upiId?.length
						? truncateUPIId()
						: 'Your UPI Id'
					: PAYMENT_MODE[selectedMode]?.name}
			</span>
			<WmsIcon
				name="arrow-up-solid"
				width={12}
				height={6}
				stroke="#3F5BD9"
				class="ml-1 min-w-[12px]"
			/>
		</div>
		<div class="text-[10px] font-normal text-black-title">
			{truncate(bankName, 20)}
		</div>
		<div class="flex flex-row items-center text-[10px] font-normal text-black-title">
			<div class="mr-1 h-1 w-1 rounded-full bg-black-title" />
			<div class="mr-1 h-1 w-1 rounded-full bg-black-title" />
			<div class="mr-1 h-1 w-1 rounded-full bg-black-title" />
			<div class="mr-1 h-1 w-1 rounded-full bg-black-title" />
			{bankAccount?.substring(bankAccount.length - 4)}
		</div>
	</div>
</div>

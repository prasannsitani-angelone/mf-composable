<script lang="ts">
	import Card from '$components/Card.svelte';
	import WmsIcon from '$components/WMSIcon.svelte';
	import { Button } from 'wms-ui-component';
	import RadioButton from '$components/RadioButton.svelte';

	export let bankDetail;
	export let intiateAutoPayProcess = () => '';

	let bankLogo = '';
	let bankName = '';
	let bankAccount = '';

	const setupBankDetails = (bank) => {
		bankLogo = bank?.bankLogo;
		bankName = bank?.bankName;
		bankAccount = bank?.accNO;
	};

	$: setupBankDetails(bankDetail);
</script>

<Card class="mt-2 !p-3">
	<div class=" mb-3 text-sm font-medium text-black-title">Set Up Autopay With</div>
	<div class=" border border-grey-line bg-blue-background p-4">
		<div class="mb-2 flex items-center">
			<RadioButton selected={true} />
			<div class="ml-2 flex h-8 w-12 items-center justify-center border border-grey-line bg-white">
				<WmsIcon name="lock-icon" />
			</div>
			<div class="ml-3 text-sm font-medium text-black-title">Debit Card/Net Banking</div>
		</div>
		<div class="flex items-center p-2 pl-9">
			<div class="mr-3 flex h-6 w-16 items-center justify-center bg-white">
				<img src={bankLogo} class="h-5 w-5 object-contain" alt="bank logo" />
			</div>
			<div>
				<div class=" text-sm font-normal text-grey-body">{bankName}- *{bankAccount?.slice(-4)}</div>
				<div class=" text-xs font-normal text-grey-body">
					Registered with Angel One. Please keep your Debit Card/Net Banking credentials handy
				</div>
			</div>
		</div>
		<div class="mt-2 flex justify-center">
			<Button class="w-full" on:click={intiateAutoPayProcess}>PROCEED</Button>
		</div>
	</div>
</Card>

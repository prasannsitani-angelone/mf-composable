<script lang="ts">
	import type { BankDetailsEntity } from '$lib/types/IUserProfile';

	export let bankAccountDetails: BankDetailsEntity;
	export let text = '';

	console.log(bankAccountDetails);

	const { accNO, bankLogo, bankName } = bankAccountDetails || {};
</script>

<section class="mt-5 {$$props?.class}">
	{#if text?.length}
		<div class="mb-3 text-sm font-normal text-grey-body">
			{text || ''}
		</div>
	{/if}

	<article class="flex items-center justify-center">
		<img src={bankLogo} class="mr-2 h-6 w-6" alt="bank logo" />
		<div class="ml-1 text-sm font-normal text-black-title">
			{bankName || ''} - XX{accNO?.slice(-4, accNO?.length) || ''}
		</div>
	</article>
</section>

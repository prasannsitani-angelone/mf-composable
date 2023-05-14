<script lang="ts">
	import Button from '$components/Button.svelte';
	import Modal from '$components/Modal.svelte';
	let isModalOpen = false;
	let toggleSchemeIformationModal: (() => void) | null = null;
	export { isModalOpen, toggleSchemeIformationModal };
</script>

<Modal {isModalOpen} on:backdropclicked={toggleSchemeIformationModal}>
	<article
		class="h-[70vh] overflow-x-scroll rounded-t-2xl bg-white px-6 pt-6 pb-8 md:w-120 md:rounded-lg"
	>
		<header
			class="mb-3 flex justify-center align-middle text-lg font-medium text-black-title md:text-xl"
		>
			<span> Understanding Scheme Terms</span>
			<Button
				class="ml-auto flex h-max !w-3 justify-center
               rounded-full border border-grey-disabled !bg-white
                !pt-0 !pb-0 !pl-[10px] !pr-[10px] align-middle !text-black-title"
				onClick={toggleSchemeIformationModal}
			>
				<span class="text-grey-body">X</span>
			</Button>
		</header>
		<section
			class="mb-3 border-b border-dashed border-b-grey-disabled pb-3 text-sm font-normal text-grey-body"
		>
			<header class="text-sm font-medium text-black-title">Net Asset Value (NAV)</header>
			<div class="text-body-grey mt-2 text-sm font-medium">
				The price at which you can buy one unit of a mutual fund is called the NAV. The entire
				market value of the assets held by the mutual fund (minus liabilities and losses) is divided
				into these units. While the NAV is important, you should also consider factors like
				historical performance, potential for returns and expense ratio while making an investment.
			</div>
		</section>

		<section
			class="mb-3 border-b border-dashed border-b-grey-disabled pb-3 text-sm font-normal text-grey-body"
		>
			<header class="text-sm font-medium text-black-title">Assets Under Management (AUM)</header>
			<div class="text-body-grey mt-2 text-sm font-medium">
				AUM is the total market value of the assets held and managed by the mutual fund. It is an
				important factor to consider while investing. While a higher AUM can indicate more trust in
				the fund, remember that AUM is always relative - it has no direct bearing on the performance
				of a fund. Understand a fund’s relative AUM by doing peer comparisons with similar funds.
			</div>
		</section>

		<section
			class="mb-3 border-b border-dashed border-b-grey-disabled pb-3 text-sm font-normal text-grey-body"
		>
			<header class="text-sm font-medium text-black-title">Exit Load</header>
			<div class="text-body-grey mt-2 text-sm font-medium">
				Some mutual funds may charge a fee if you withdraw your investment before a specific time
				period. This fee is called the Exit Load, and is usually charged to discourage premature
				withdrawals. Exit Load is calculated as a percentage of the NAV at the time of withdrawal.
				It is a vital factor to consider while planning your investments. Study exit loads carefully
				and time your withdrawals to maximise savings.
			</div>
		</section>

		<section
			class="border-b border-dashed border-b-grey-disabled pb-3 text-sm font-normal text-grey-body"
		>
			<header class="text-sm font-medium text-black-title">Expense Ratio</header>
			<div class="text-body-grey mt-2 text-sm font-medium">
				Mutual funds charge an annual fee for managing your funds. This fee is shown as the Expense
				Ratio. It is calculated by dividing the total expenses incurred by the total value of the
				assets held by the mutual fund. The expenses include all the costs of running the mutual
				fund. The Expense Ratio is also a vital factor to consider while investing, as it can have a
				significant impact on your net profits.
			</div>
		</section>
	</article>
</Modal>

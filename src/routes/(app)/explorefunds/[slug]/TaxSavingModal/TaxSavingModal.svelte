<script lang="ts">
	import Modal from '$components/Modal.svelte';
	let isModalOpen = false;
	let toggleTaxSavingModal: (() => void) | null = null;
	export { isModalOpen, toggleTaxSavingModal };
</script>

<Modal {isModalOpen} on:backdropclicked={toggleTaxSavingModal}>
	<article class="rounded-t-2xl bg-white pt-6 pb-8 md:w-120 md:rounded-lg">
		<header class="mb-4 border-b px-8 pb-6 text-lg text-black-title md:text-xl">
			Tax Savings Mutual Fund
		</header>
		<section class="text-sm font-normal text-grey-body">
			<ul class="list-disc px-12">
				<li>Tax saving mutual funds are equity funds suitable for long-term investment goals</li>
				<li>
					Invest in these funds to reduce your taxable income by up to ₹1.5 Lakh per year under
					section 80C of the Income Tax Act of India
				</li>
				<li>
					The maximum tax that you can save is ₹45,000 per year. This is when you fall in the
					highest income category and use the entire exemption
				</li>
				<li>Please note that these funds have a lock-in period of 3 years</li>
			</ul>
		</section>
	</article>
</Modal>

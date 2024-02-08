<script>
	import PortfolioBuilder from '$lib/images/PortfolioBuilder.svg';
	import { WMSIcon } from 'svelte-components';
</script>

<section
	class="light mx-2 mt-2 justify-center rounded-lg border bg-gradient-to-b from-[#F0F2FC] to-[#E7EBFA] p-4"
>
	<article class="flex items-center justify-between">
		<div class="justify-between pr-8 text-title">
			<div class="flex flex-col text-base font-medium">What is a Portfolio?</div>
			<div class="pt-2 text-[11px] text-body">
				<div class="flex items-start">
					<div
						class="mr-2 mt-1 flex items-center justify-center rounded-full border-[2px] border-body"
					>
						<WMSIcon name="eclipse" height={4} width={4} stroke="#E7EBFA" />
					</div>
					<div>Portfolios are a collection of mutual funds based on a theme or idea</div>
				</div>
				<div class="mt-2 flex items-start">
					<div
						class="mr-2 mt-1 flex items-center justify-center rounded-full border-[2px] border-body"
					>
						<WMSIcon name="eclipse" height={4} width={4} stroke="#E7EBFA" />
					</div>
					<div>Select the right portfolio based on your risk appetite</div>
				</div>
			</div>
		</div>
		<div class="">
			<img
				height="140"
				width="161"
				src={PortfolioBuilder}
				loading="lazy"
				alt="Illustration showing portfolio builder"
			/>
		</div>
	</article>
</section>

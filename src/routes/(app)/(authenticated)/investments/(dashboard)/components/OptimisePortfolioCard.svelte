<script>
	import { BtnSize } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { WMSIcon } from 'svelte-components';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { addCommasToAmountString } from '$lib/utils/helpers/formatAmount';

	export let currentSchemeLogo = '';
	export let peopleInvested = 0;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click on:keydown class={$$props.class}>
	<section
		class="flex items-center justify-between rounded-lg bg-white shadow-lg hover:cursor-pointer lg:mx-0"
	>
		<article class="flex flex-col items-start px-4 py-3">
			<div class="text-sm font-medium">
				{addCommasToAmountString(peopleInvested)} other investors started a 2nd SIP to maximise their
				returns
			</div>
			<div class="mt-2 flex text-xs font-normal">
				<div class="flex flex-col items-start justify-center pr-2">
					<p>Explore 2nd SIP based on your 1st investment</p>
					<ButtonMedium
						size={BtnSize.SM}
						class="!bg-background-alt !p-0 !text-xs !font-medium !text-blue-primary"
						on:click>EXPLORE NOW<WMSIcon name="right-arrow" stroke="#3F5BD9" /></ButtonMedium
					>
				</div>
				<div class="flex items-center justify-center">
					<div
						class="flex h-16 w-16 flex-col items-center rounded-sm border border-tint24-primary text-2xs text-black-key"
					>
						<div class="flex h-2/3 items-center justify-center">
							<SchemeLogo
								size="xs2"
								alt="bank logo"
								src={currentSchemeLogo}
								class="!mr-0 !border-none"
							/>
						</div>
						<div class="flex h-1/3 w-full items-center justify-center bg-tint12-buy align-bottom">
							1st SIP
						</div>
					</div>
					<div class="mx-2">
						<WMSIcon name="plus-no-bordericon" stroke="#ACB2BD" height={14} width={14} />
					</div>
					<div
						class="flex h-16 w-16 flex-col items-center rounded-sm border border-tint24-primary text-2xs text-black-key"
					>
						<div class="flex h-2/3 items-center justify-center text-2xl text-blue-primary">?</div>
						<div class="flex h-1/3 w-full items-center justify-center bg-purple-glow align-bottom">
							2nd SIP
						</div>
					</div>
				</div>
			</div>
		</article>
	</section>
</div>

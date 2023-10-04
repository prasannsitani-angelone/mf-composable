<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	interface accordionCardItem {
		title: string;
		body?: string;
		footerText?: string;
		footerRedirectionLink?: string;
	}

	// eslint-disable-next-line

	let disableCollapse = false;
	let hoverTextColor = '';
	let titleFontSize = '';
	let textColor = '';
	let footerFontSize = '';
	let headerClass = '';
	let titleStyle = '';
	let data: accordionCardItem;

	export {
		disableCollapse,
		hoverTextColor,
		titleFontSize,
		textColor,
		footerFontSize,
		headerClass,
		data,
		titleStyle
	};
	$: showBody = disableCollapse;

	/**
	 * toggleAccordionCardContent: Function to toggle Accordion Card body
	 *
	 *
	 */
	const toggleAccordionCardContent = () => {
		if (disableCollapse) {
			return;
		}
		showBody = !showBody;
		dispatch('cardToggled', {
			value: 'test'
		});
	};

	/**
	 * handleFooterCtaClick: This method emits events on footer click
	 * (event to be handled in the parent component)
	 *
	 *
	 */
	const handleFooterCtaClick = () => {
		//   emit('footerCta')
		dispatch('footerCta', {
			value: 'test'
		});
	};
</script>

<article
	class={`${$$props.class} mt-2 max-w-4xl rounded-lg bg-white text-sm text-black-title shadow-csm lg:mt-4`}
>
	<!-- Accordion Card Title -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<header on:click={toggleAccordionCardContent}>
		<slot name="accordionHeader">
			<section
				class={`flex cursor-pointer items-center justify-between p-4 md:px-6 md:py-5 ${
					hoverTextColor || 'hover:text-blue-800'
				} ${titleFontSize || 'text-lg'} ${headerClass}`}
			>
				<section class="flex items-center">
					<slot name="titleIcon" />
					<h2 class={`ml-3 flex items-center text-left font-normal text-black-title ${titleStyle}`}>
						<span> {data.title}</span>
						<slot name="titleUserAction" />
					</h2>
				</section>
				{#if !disableCollapse}
					<svg
						width="16"
						height="16"
						xmlns="http://www.w3.org/2000/svg"
						class={`h-5 w-5 transition duration-200 ${
							showBody ? textColor || 'text-blue-800' : ''
						} ${hoverTextColor || 'hover:text-blue-800'}`}
						class:rotate-180={showBody}
						class:rotate-0={!showBody}
						class:text-gray-400={!showBody}
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</section>
		</slot>
	</header>

	<section
		class="origin-top transition duration-100"
		class:-translate-y-10={!showBody}
		class:max-h-0={!showBody}
		class:overflow-hidden={!showBody}
	>
		<slot name="accordionBody">
			<section>
				<!-- Accordion Card Body -->
				<p
					class="border-t p-5 text-left font-light md:mx-6 md:rounded-lg md:border md:border-gray-200"
					class:border-b={data.footerText}
				>
					{data.body}
				</p>

				<!-- Accordion Card Footer -->
				{#if data.footerText}
					<footer class="py-5 text-center">
						<div
							class={`flex cursor-pointer items-end justify-center uppercase ${
								textColor || 'text-blue-800'
							} ${footerFontSize || 'text-sm'}`}
							on:keydown={handleFooterCtaClick}
						>
							<slot name="footerIcon" />
							{data.footerText}
						</div>
					</footer>
				{/if}
			</section>
		</slot>
	</section>
</article>

<style scoped>
</style>

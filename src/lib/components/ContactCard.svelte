<script lang="ts">
	import { page } from '$app/stores';
	import { contactEmail, contactNumber } from '$lib/constants/contactInfo';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { Button } from 'svelte-components';
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	import type { FAQ } from '../../routes/(app)/faqs/type';
	import { faqCallCtaClick, faqEmailCtaClick } from '$lib/analytics/faqs/faqs';

	$: os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
	$: phoneCall =
		window?.webkit?.messageHandlers?.callBackHandlerMFSupportPhoneCallOption?.postMessage;
	$: emailCall = window?.webkit?.messageHandlers?.callBackHandlerMFSupportMailOption?.postMessage;
	let helpAnalytics: (() => void) | null = null;

	let faq: FAQ;

	let faqsSource = '';

	const setFaqsSource = () => {
		if ($page?.data?.tag === 'investments') {
			faqsSource = 'Investments';
		} else if ($page?.data?.tag === 'sips') {
			faqsSource = 'SIPBook';
		} else if ($page?.data?.tag === 'orders') {
			faqsSource = 'Orders';
		} else if ($page?.data?.tag === 'all') {
			faqsSource = 'All';
		}
	};

	setFaqsSource();

	const onClickTel = () => {
		faqCallCtaClick({
			Source: faqsSource
		});

		helpAnalytics?.();
		if (typeof phoneCall === 'function') {
			const message = {
				phone: contactNumber
			};
			window?.webkit?.messageHandlers?.callBackHandlerMFSupportPhoneCallOption?.postMessage(
				JSON.stringify(message)
			);
		} else {
			document.location.href = `tel:${contactNumber}`;
		}
	};

	const onClickMail = () => {
		faqEmailCtaClick({
			Source: faqsSource
		});

		helpAnalytics?.();
		if (typeof emailCall === 'function') {
			const message = {
				emailId: contactEmail
			};
			window?.webkit?.messageHandlers?.callBackHandlerMFSupportMailOption?.postMessage(
				JSON.stringify(message)
			);
		} else {
			document.location.href = `mailto:${contactEmail}`;
		}
	};

	const shouldDisplay = (type: (() => void) | undefined) => {
		return (
			typeof type === 'function' ||
			os?.toLowerCase() === 'android' ||
			$page?.data?.deviceType?.isBrowser ||
			(os?.toLowerCase() === 'ios' &&
				$page?.data?.sparkHeaders?.platform?.toLowerCase() !== PLATFORM_TYPE.SPARK_IOS &&
				$page?.data?.sparkHeaders?.platform?.toLowerCase() !== PLATFORM_TYPE.ANGELBEE_IOS)
		);
	};

	export { faq, helpAnalytics };
</script>

<section class="rounded-lg bg-white p-4 shadow-csm md:rounded-t-none">
	<h2 class="flex items-center text-left text-sm font-normal text-black-title">
		<span> {faq?.question}</span>
	</h2>
	<section class="details-container ml-1 mt-1 pb-5 text-sm text-grey-body">
		<p class="mt-4">Sorry for the inconvenience caused.</p>
		<p class="mt-4">You can contact our support team by calling or emailing to us:</p>
	</section>
	<section class="mb-2 mt-2 flex items-center gap-4">
		<div>
			<WMSIcon name="message-in-circle" width={36} height={36} />
		</div>
		<div class="text-sm font-normal text-black-title">
			{#if shouldDisplay(phoneCall)}
				<p>
					Call: <Button
						size="xs"
						class="!h-fit !min-h-0 !transform-none !px-0 !font-normal"
						variant="transparent"
						on:click={onClickTel}>{contactNumber}</Button
					>
				</p>
			{/if}
			{#if shouldDisplay(emailCall)}
				<p>
					Email: <Button
						size="xs"
						class="!h-fit !min-h-0 !transform-none !px-0 !font-normal !lowercase"
						variant="transparent"
						on:click={onClickMail}>{contactEmail}</Button
					>
				</p>
			{/if}
		</div>
	</section>
</section>

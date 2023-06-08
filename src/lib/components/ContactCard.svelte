<script lang="ts">
	import { page } from '$app/stores';
	import { contactEmail, contactNumber } from '$lib/constants/contactInfo';
	import { PLATFORM_TYPE } from '$lib/constants/platform';
	import { Button, WMSIcon } from 'wms-ui-component';

	$: os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;
	$: phoneCall =
		window?.webkit?.messageHandlers?.callBackHandlerMFSupportPhoneCallOption?.postMessage;
	$: emailCall = window?.webkit?.messageHandlers?.callBackHandlerMFSupportMailOption?.postMessage;
	let helpAnalytics: (() => void) | null = null;

	let title = '';
	const onClickTel = () => {
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

	export { title, helpAnalytics };
</script>

<section class="mt-2 mb-2 flex items-center gap-4 rounded-lg bg-white p-4 shadow-csm">
	<div>
		<WMSIcon name="message-in-circle" width={36} height={36} />
	</div>
	<div class="text-sm font-medium text-black-title">
		<p>{title}</p>
		{#if shouldDisplay(phoneCall)}
			<p>
				Call: <Button
					size="xs"
					class="!transform-none !px-0 !font-medium"
					variant="transparent"
					on:click={onClickTel}>{contactNumber}</Button
				>
			</p>
		{/if}
		{#if shouldDisplay(emailCall)}
			<p>
				Email: <Button
					size="xs"
					class="!transform-none !px-0 !font-medium !lowercase"
					variant="transparent"
					on:click={onClickMail}>{contactEmail}</Button
				>
			</p>
		{/if}
	</div>
</section>

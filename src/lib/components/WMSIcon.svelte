<script lang="ts">
	import { dev } from '$app/environment';
	import type { SvelteComponent } from 'svelte';
	// import * as Icons from "wms-ui-component/dist/icons"
	let name: string;
	const iconmap: { [key: string]: string } = {
		angelone: 'AngelOneLogo',
		'arrow-collapse': 'ArrowCollapseIcon',
		'arrow-expand': 'ArrowExpandIcon',
		'arrow-next-circle': 'ArrowNextCircle',
		'arrow-previous-circle': 'ArrowPreviousCircle',
		bag: 'BagIcon',
		'announcement-purple': 'AnnouncementPurple',
		'bond-active': 'BondActiveIcon',
		bond: 'BondIcon',
		clock: 'ClockIcon',
		'clock-yellow-circle': 'ClockInYellowCircle',
		'clock-yellow': 'ClockYellowIcon',
		'clock-green': 'ClockGreenIcon',
		'closed-folder': 'ClosedFolderIcon',
		cross: 'CrossIcon',
		'cross-box-circle': 'CrossInBoxInCircle',
		'cross-circle': 'CrossInCricleIcon',
		'cross-red-circle': 'CrossInRedCircleIcon',
		'document-active': 'DocumentActiveIcon',
		document: 'DocumentIcon',
		gpay: 'GpayIcon',
		'green-arrow-up': 'GreenArrowUp',
		'holding-active': 'HoldingActiveIcon',
		holding: 'HoldingIcon',
		'left-arrow': 'LeftArrowIcon',
		'loading-indicator': 'LoadingIndicator',
		message: 'MessageIcon',
		'no-orders': 'NoOrdersIcon',
		'not-found': 'NotFoundIcon',
		'not-circle': 'NotInCircle',
		skip: 'SkipIcon',
		'percentage-in-circle': 'PercentageInCircle',
		'polygon-yellow-charge': 'PolygonYellowChargeIcon',
		'polygon-yellow-warning': 'PolygonYellowWarningIcon',
		'polygon-red-warning': 'PolygonRedWarningIcon',
		'profile-icon': 'ProfileIcon',
		'red-cross-circle': 'RedCrossInCircleIcon',
		'red-down-arrow': 'RedDownArrow',
		'refresh-icon': 'RefreshIcon',
		'search-dark': 'SearchDarkIcon',
		sgb: 'SGBIcon',
		'success-tick-circle': 'SuccessTickInCircleIcon',
		'tick-message-circle': 'TickInMessageInCircleIcon',
		'tick-star': 'TickInStarIcon',
		upi: 'UPILogo',
		globe: 'GlobeIcon',
		'not-allowed': 'NotAllowed',
		'chevron-down': 'ChevronDownArrowIcon',
		'chevron-right': 'ChevronRightArrowIcon',
		copy: 'CopyIcon',
		'info-in-circle': 'InfoTagInCircleIcon',
		'time-pending': 'TimePendingIcon',
		'tick-in-circle': 'TickInCircle',
		status: 'StatusIcon',
		'order-details-error': 'OrderDetailsErrorIcon',
		'red-exclamation': 'RedExclamation',
		'alert-icon': 'AlertIcon',
		'cart-filled': 'CartFilled',
		'cart-outlined': 'CartOutlined',
		'checkbox-checked-circle': 'CheckboxCheckedCircularIcon',
		'checkbox-unchecked-circle': 'CheckboxUncheckedCircularIcon',
		'lock-red': 'LockRedIcon',
		'unlock-green': 'UnlockGreenIcon',
		'not-allowed-icon': 'NotAllowedIcon',
		'clock-yellow-bolder': 'ClockYellowBolderIcon',
		'success-tick-circle-bolder': 'SuccessTickInCircleBolderIcon',
		'checkbox-checked': 'CheckboxCheckedIcon',
		'checkbox-unchecked': 'CheckboxUncheckedIcon',
		'clock-bold': 'ClockBold',
		phonepe: 'PhonepeIcon',
		setting: 'SettingIcon',
		'switch-fund': 'SwitchFundIcon',
		'right-arrow': 'RightIcon',
		'switch-in': 'SwitchInIcon',
		keypad: 'KeypadIcon',
		'rupee-square-blue': 'RupeeInSquareBlue',
		'switch-prompt': 'SwitchPromptIcon',
		'cross-close': 'CrossClose',
		'audio-on': 'AudioOn',
		'audio-off': 'AudioOff',
		'swipe-up': 'SwipeUp',
		sparkles: 'Sparkles',
		bookmark: 'Bookmark',
		'bookmark-filled': 'BookmarkFilled',
		'reports-icon': 'ReportsIcon',
		'logout-icon': 'LogoutIcon',
		'polygon-right-small': 'PolygonRightSmall',
		'polygon-right-medium': 'PolygonRightMedium',
		jar: 'JarIcon',
		'success-tick-sparkle': 'SuccessTickWithSparkleIcon',
		'fund-details-error': 'FundDetailsErrorIcon',
		'import-external-funds': 'ImportExternalFundsIcon',
		'fund-calculator': 'FundCalculator',
		announcement: 'Announcement',
		'nfo-icon': 'NFOIcon',
		'pad-bold': 'PadBolder',
		'pad-active': 'PadActive',
		'compass-bolder': 'CompassBolderIcon',
		'compass-active': 'CompassActiveIcon',
		share: 'ShareIcon',
		'question-mark-circle': 'QuestionMarkCircle',
		'double-tick': 'DoubleTick',
		'graph-down': 'GraphDown',
		'phone-with-money': 'PhoneWithMoney',
		'smiley-with-tick': 'SmileyWithTick',
		'message-in-circle': 'MessageInCircle',
		'question-blue-in-circle': 'QuestionBlueInCircle',
		'info-in-circle-dark': 'InfoInCircleDark',
		'people-icon': 'People',
		'trending-funds': 'TrendingFundsBackground',
		'green-uparrow-trending-fund': 'GreenUpArrowTrendingFund',
		rectangle: 'RectangleIcon',
		eclipse: 'EclipseIcon',
		'raised-hands': 'RaisedHands',
		'lock-icon': 'LockIcon',
		'rupee-circle-bolder': 'RupeeInCircleBolder',
		'rupee-circle-blue': 'RupeeCircleBlue',
		'rupee-circle-blue-filled': 'RupeeCircleBlueFilled'
	};

	const getIcon = async (name: string): Promise<SvelteComponent> => {
		const iconName = iconmap[name] ? `${iconmap[name]}` : '';
		// const iconName = 'ActiveSipIcon';
		let icon;
		try {
			icon = (await import(`$lib/wms_icons/${iconName}.svelte`)).default;
		} catch {
			if (dev) {
				console.error('Invalid font name');
			}
			icon = null;
		}
		return icon;
	};
	let height = 24;
	let width = 24;

	let component: typeof SvelteComponent;

	(async function () {
		component = await getIcon(name);
	})();

	export { name, height, width };
</script>

{#if !component}
	<div
		style="width: {width}px;height:{height}px"
		class={`${$$props?.class || ''}`}
		data-name={name}
	/>
{:else}
	<svelte:component
		this={component}
		{height}
		{width}
		on:click
		on:keydown
		class={`${$$props?.class || ''}`}
		{...$$props}
	/>
{/if}

<!-- </div> -->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from 'svelte-components';
	import type { ComponentType } from 'svelte';

	const BUTTONS = new Map([
		[
			'contained',
			new Map([
				['primary', 'bg-blue-primary hover:bg-blue-primary text-white'],
				['secondary', 'bg-cyan-500 hover:bg-cyan-500 text-white'],
				['success', 'bg-green-buy hover:bg-green-buy text-white'],
				['white', 'bg-white hover:bg-white text-black-title disabled:bg-opacity-50']
			])
		],
		[
			'outlined',
			new Map([
				[
					'primary',
					'bg-white hover:bg-white !border border-blue-primary hover:border-blue-primary text-blue-primary'
				],
				[
					'secondary',
					'bg-white hover:bg-white !border border-cyan-500 hover:border-cyan-500 text-cyan-500'
				],
				[
					'success',
					'bg-white hover:bg-white !border border-green-buy hover:border-green-buy text-green-buy'
				],
				['white', 'bg-white hover:bg-white text-black-title disabled:bg-opacity-50']
			])
		],
		[
			'transparent',
			new Map([
				['primary', 'bg-transparent hover:bg-transparent text-sm text-blue-primary'],
				['secondary', 'bg-transparent hover:bg-transparent text-sm text-cyan-500'],
				['success', 'bg-transparent hover:bg-transparent text-sm text-green-buy'],
				['white', 'bg-transparent hover:bg-transparent text-sm text-black-title'],
				['error', 'bg-transparent hover:bg-transparent text-sm text-red-errorDark']
			])
		]
	]);

	enum BtnVariant {
		Contained = 'contained',
		Outlined = 'outlined',
		Transparent = 'transparent'
	}

	enum BtnColor {
		Primary = 'primary',
		Secondary = 'secondary',
		Success = 'success',
		White = 'white',
		Error = 'error'
	}

	enum BtnType {
		Button = 'button',
		Submit = 'submit',
		Reset = 'reset'
	}

	enum BtnSize {
		LG = 'btn-lg',
		MD = 'btn-md',
		SM = 'btn-sm',
		XS = 'btn-xs'
	}

	interface IText {
		label: string;
		tag?: string;
		truncate?: boolean;
		color?: string;
		typography?: string;
		customClass?: string;
		noOfLines?: number;
	}

	interface IButton {
		text?: IText | ComponentType | string;
		variant?: BtnVariant;
		color?: BtnColor;
		style?: string;
		class?: string;
		startAdornment?: ComponentType | IIcon;
		endAdornment?: ComponentType | IIcon;
		disabled?: boolean;
		type?: BtnType;
		size?: BtnSize;
		onClick?: (e: Event) => void;
	}

	interface IIcon {
		width?: number; // predefined list of widths
		height?: number; // predefined list of heights
		iconComp: ComponentType;
		customClass?: string;
		stroke?: string; //  list of available icon colors in enum form
	}

	let variant: IButton['variant'] = BtnVariant.Contained;
	let color: IButton['color'] = BtnColor.Primary;
	let text: IButton['text'] = '';
	let style = '';
	let clazz = '';
	let size: IButton['size'] = BtnSize.MD;
	let disabled: IButton['disabled'] = false;
	let type: IButton['type'] = BtnType.Button;
	let startAdornment: IButton['startAdornment'] = undefined;
	let endAdornment: IButton['endAdornment'] = undefined;

	const dispatch = createEventDispatcher();
	function onClickHandler(event: Event) {
		dispatch('click', {});
		$$props?.onClick?.(event);
	}

	export {
		text,
		clazz as class,
		variant,
		color,
		style,
		startAdornment,
		endAdornment,
		disabled,
		type,
		size
	};
</script>

<Button
	{type}
	class={`bgv btn border-0 text-sm !font-medium disabled:bg-opacity-50 ${BUTTONS?.get(variant)?.get(
		color
	)} uppercase ${clazz} ${size} rounded `}
	{style}
	{disabled}
	on:click={onClickHandler}
>
	<slot />
</Button>

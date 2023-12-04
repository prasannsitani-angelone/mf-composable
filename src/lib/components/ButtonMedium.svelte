<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from 'svelte-components';
	import type { ComponentType } from 'svelte';

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
	{variant}
	{color}
	class={`${clazz} !font-medium`}
	{size}
	{style}
	{disabled}
	{text}
	{startAdornment}
	{endAdornment}
	on:click={onClickHandler}
>
	<svelte:fragment>
		<slot />
	</svelte:fragment>
</Button>

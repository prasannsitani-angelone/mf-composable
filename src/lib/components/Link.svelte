<script lang="ts">
	import { base } from '$app/paths';
	import { appStore } from '$lib/stores/SparkStore';
	import { modifiedGoto } from '$lib/utils/goto';
	import { isAbsoluteUrl } from '$lib/utils/helpers/url';
	import { createEventDispatcher } from 'svelte';
	let to: string;
	let clazz = '';
	let disableRedirect = false;
	let replaceState = false;
	let ariaLabel = '';
	let pathConversion = true;
	const dispatch = createEventDispatcher();
	let preloadData: true | '' | 'hover' | 'tap' | 'off' | null | undefined = 'hover';
	export {
		to,
		clazz as class,
		disableRedirect,
		replaceState,
		ariaLabel,
		preloadData,
		pathConversion
	};
	function onLinkClick(e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
		if (disableRedirect) {
			e.preventDefault();
		} else if (appStore.isTabview()) {
			e.preventDefault();
			modifiedGoto(pathConversion ? (isAbsoluteUrl(to) ? to : `${base}${to}`) : to);
		}

		dispatch('linkClicked');
	}
</script>

<a
	on:click={(e) => onLinkClick(e)}
	href={pathConversion ? (isAbsoluteUrl(to) ? to : `${base}${to}`) : to}
	class={`${clazz}`}
	aria-label={ariaLabel}
	data-sveltekit-preload-data={preloadData}
	data-sveltekit-replacestate={replaceState ? '' : 'off'}
	id={$$props.id}
>
	<slot />
</a>

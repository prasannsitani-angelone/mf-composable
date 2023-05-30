<script lang="ts">
	import { base } from '$app/paths';
	import { isAbsoluteUrl } from '$lib/utils/helpers/url';
	import { createEventDispatcher } from 'svelte';
	let to: string;
	let clazz = '';
	let disableRedirect = false;
	let replaceState = false;
	let ariaLabel = '';
	const dispatch = createEventDispatcher();
	let preloadData: true | '' | 'hover' | 'tap' | 'off' | null | undefined = 'hover';
	export { to, clazz as class, disableRedirect, replaceState, ariaLabel, preloadData };
	function onLinkClick(e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
		if (disableRedirect) {
			e.preventDefault();
		}

		dispatch('linkClicked');
	}
</script>

<a
	on:click={(e) => onLinkClick(e)}
	href={isAbsoluteUrl(to) ? to : `${base}${to}`}
	class={`${clazz}`}
	aria-label={ariaLabel}
	data-sveltekit-preload-data={preloadData}
	data-sveltekit-replacestate={replaceState ? '' : 'off'}
	id={$$props.id}
>
	<slot />
</a>

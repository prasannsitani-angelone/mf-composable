<script lang="ts">
	import { base } from '$app/paths';
	import { isAbsoluteUrl } from '$lib/utils/helpers/url';
	import { createEventDispatcher } from 'svelte';
	let to: string;
	let clazz = '';
	let disableRedirect = false;
	let replaceState = false;
	const dispatch = createEventDispatcher();
	export { to, clazz as class, disableRedirect, replaceState };
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
	data-sveltekit-replacestate={replaceState ? '' : 'off'}
	id={$$props.id}
>
	<slot />
</a>

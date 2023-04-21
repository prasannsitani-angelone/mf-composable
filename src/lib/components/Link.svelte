<script lang="ts">
	import { base } from '$app/paths';
	import { isAbsoluteUrl } from '$lib/utils/helpers/url';
	let to: string;
	let clazz = '';
	let disableRedirect = false;
	export { to, clazz as class, disableRedirect };
	function onLinkClick(e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
		if (disableRedirect) {
			e.preventDefault();
		}
	}
</script>

<a
	on:click={(e) => onLinkClick(e)}
	href={isAbsoluteUrl(to) ? to : `${base}${to}`}
	class={`${clazz}`}
>
	<slot />
</a>

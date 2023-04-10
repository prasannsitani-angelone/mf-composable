<script lang="ts">
	import { base } from '$app/paths';
	import { isAbsoluteUrl } from '$lib/utils/helpers/url';
	let to: string;
	let clazz = '';
	export { to, clazz as class };
</script>

<a href={isAbsoluteUrl(to) ? to : `${base}${to}`} class={`${clazz}`}>
	<slot />
</a>

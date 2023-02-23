<script lang="ts">
	import { base } from '$app/paths';
	let to: string;
	let clazz = '';
	export { to, clazz as class };
</script>

<a href={`${base}${to}`} class={`${clazz}`}>
	<slot />
</a>

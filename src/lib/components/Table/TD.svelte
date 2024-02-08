<script lang="ts">
	let clazz = '';

	export { clazz as class };
</script>

<td class={`border-none bg-background-alt py-4 pb-4 pl-5 pr-6 pt-4  text-body ${clazz}`}>
	<slot />
</td>

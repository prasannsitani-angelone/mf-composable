<script lang="ts">
	let clazz = '';

	export { clazz as class };
</script>

<td class={` bg-white py-4 pb-4 pl-5 pr-6 pt-4  text-grey-body ${clazz}`}>
	<slot />
</td>

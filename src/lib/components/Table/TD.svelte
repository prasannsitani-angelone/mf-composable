<script lang="ts">
	let clazz = '';

	export { clazz as class };
</script>

<td class={` bg-white py-4 pl-5 pt-4 pb-4 pr-6  text-grey-body ${clazz}`}>
	<slot />
</td>

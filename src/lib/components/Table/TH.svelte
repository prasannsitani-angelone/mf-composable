<script lang="ts">
	let clazz = '';

	export { clazz as class };
</script>

<th
	class={`border-b border-grey-line bg-white pl-5 pt-4 pb-4 pr-6 font-medium text-grey-body  ${clazz}`}
>
	<slot />
</th>

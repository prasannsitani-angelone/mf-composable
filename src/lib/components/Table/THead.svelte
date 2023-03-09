<script lang="ts">
	let clazz = '';

	export { clazz as class };
</script>

<thead class={`${clazz}`}>
	<tr>
		<slot />
	</tr>
</thead>

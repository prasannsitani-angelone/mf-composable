<script lang="ts">
	import TBody from './TBody.svelte';
	import Th from './TH.svelte';
	import THead from './THead.svelte';

	let clazz = '';

	export { clazz as class };
</script>

<div class="overflow-x-auto">
	<table class={`hover table w-full ${clazz}`}>
		<!-- head -->
		<slot name="thead">
			<THead>
				<Th>default</Th>
				<Th>default</Th>
			</THead>
		</slot>
		<slot name="tbody">
			<TBody>
				<Th />
			</TBody>
		</slot>
	</table>
</div>

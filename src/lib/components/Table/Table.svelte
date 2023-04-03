<script lang="ts">
	import TBody from './TBody.svelte';
	import Th from './TH.svelte';
	import THead from './THead.svelte';

	let clazz = '';

	export { clazz as class };
</script>

<div class="overflow-x-hidden">
	<table class={`table w-full table-fixed border-collapse text-sm [&_th]:first:relative ${clazz}`}>
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

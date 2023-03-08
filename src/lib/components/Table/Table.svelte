<script lang="ts">
	import TBody from './TBody.svelte';
	import Th from './TH.svelte';
	import THead from './THead.svelte';
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
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

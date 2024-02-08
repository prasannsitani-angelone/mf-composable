<script lang="ts">
	let title: string;
	let value: string;

	export { title, value };
</script>

<div class="flex flex-grow basis-0 items-start sm:items-center">
	<slot name="icon" />
	<div class="ml-1 flex w-full flex-col sm:flex-row">
		<span class="text-body">{title}</span>
		<span class="text-title sm:ml-auto">{value}</span>
	</div>
</div>

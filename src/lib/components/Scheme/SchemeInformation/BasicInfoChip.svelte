<script lang="ts">
	let title: string;
	let value: string;

	export { title, value };
</script>

<div class="flex w-full flex-grow basis-0 items-start sm:items-center">
	<slot name="icon" />
	<div class="ml-1 flex flex-col text-xs font-normal sm:flex-row">
		<span class="mb-1 text-body">{title}</span>
		<span class="text-title sm:ml-auto">{value}</span>
	</div>
	<slot name="right" />
</div>

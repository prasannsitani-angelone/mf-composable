<script lang="ts">
	import Button from '$components/Button.svelte';
	export let clazz = '';
	export let onSubmit: () => void = () => undefined;
</script>

<div
	class={`flex flex-col items-center bg-white px-4 py-2 sm:flex-row sm:items-center sm:justify-between ${clazz}`}
>
	<div class="mb-3 text-sm text-black-title sm:mb-0">
		Make SIP payments automatically with Autopay
	</div>
	<Button class="w-full sm:w-80" onClick={onSubmit}>SET UP AUTOPAY</Button>
</div>

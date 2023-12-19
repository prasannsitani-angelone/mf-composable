<script lang="ts">
	export let text: string;
	export let dotColor: string;
</script>

<div class="flex flex-row items-center">
	<span class="mr-3 h-2 w-2 rounded-full" style:background-color={dotColor} />
	<span class="text-xs text-black-key sm:text-sm">{text}</span>
</div>

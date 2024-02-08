<script lang="ts">
	export let text: string;
	export let dotColor: string;
</script>

<div class="flex flex-row items-center">
	<span class="mr-1 h-2 w-2 rounded-full sm:mr-3" style:background-color={dotColor} />
	<span class="text-xs text-title sm:text-sm">{text}</span>
</div>

<script lang="ts">
	export let isHorizontalSort: boolean;
</script>

{#if !isHorizontalSort}
	<div class="ml-2 flex cursor-pointer flex-col gap-[2px]">
		<span class="cm-table-icon cm-table-up-icon" />
		<span class="cm-table-icon cm-table-down-icon" />
	</div>
{:else}
	<div class="ml-2 flex cursor-pointer flex-row gap-[2px]">
		<span class="cm-table-icon cm-table-left-icon" />
		<span class="cm-table-icon cm-table-right-icon" />
	</div>
{/if}

<style>
	.cm-table-icon {
		display: inline-block;
		vertical-align: middle;
		width: 0;
		height: 0;
	}
	.cm-table-up-icon {
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-bottom: 4px solid #2a394e;
	}

	.cm-table-down-icon {
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-top: 4px solid #2a394e;
	}

	.cm-table-left-icon {
		border-top: 4px solid transparent;
		border-bottom: 4px solid transparent;
		border-right: 4px solid #2a394e;
	}

	.cm-table-right-icon {
		border-top: 4px solid transparent;
		border-bottom: 4px solid transparent;
		border-left: 4px solid #2a394e;
	}
</style>

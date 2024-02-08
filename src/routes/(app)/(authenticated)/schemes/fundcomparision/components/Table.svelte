<script>
	export let data = [[]];
</script>

<table class="w-full border-t">
	<slot name="header" />
	<tbody class="w-full">
		{#each data as row, rindex (rindex)}
			<tr class="flex w-full flex-row odd:bg-background-alt even:bg-background">
				{#each row as column, cindex (`${rindex}-${cindex}`)}
					<td
						class="flex flex-[5] border-r p-3 font-normal first:flex-[4] first:font-medium last:border-0 sm:first:flex-[5]"
					>
						{#if column?.type === 'component'}
							<svelte:component this={column.component} {...column.props} />
						{:else}
							<span class="text-xs text-title sm:text-sm"
								>{column || column === 0 ? column : '-'}</span
							>
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
	<slot name="footer" />
</table>

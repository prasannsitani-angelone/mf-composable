<script lang="ts">
	export let title = '';
	export let defaultHeaderClass = '';
</script>

<article class={`rounded-lg bg-background-alt p-4 text-sm shadow-csm ${$$props.class || ''}`}>
	<slot name="header">
		{#if title}
			<header class={`flex flex-col p-6 ${defaultHeaderClass}`}>
				<h2 class="text-lg font-normal text-title">{title}</h2>
			</header>
		{/if}
	</slot>
	<slot />
	<slot name="footer" />
</article>

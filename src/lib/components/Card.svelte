<script lang="ts">
	export let title = '';
	export let defaultHeaderClass = '';
</script>

<article class={`rounded-lg bg-white p-4 text-sm shadow-csm ${$$props.class || ''}`}>
	<slot name="header">
		{#if title}
			<header class={`flex flex-col p-6 ${defaultHeaderClass}`}>
				<h2 class="text-lg font-medium text-black-title">{title}</h2>
			</header>
		{/if}
	</slot>
	<slot />
	<slot name="footer" />
</article>

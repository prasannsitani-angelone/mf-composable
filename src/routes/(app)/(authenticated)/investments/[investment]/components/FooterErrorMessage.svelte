<script lang="ts">
	export let errorMessage: string;
</script>

<section
	class="mx-3 mb-1 mt-3 flex justify-center rounded bg-red-error text-xs font-medium text-grey-dark"
>
	<article class="flex items-center justify-center px-6 py-2.5">
		<slot name="icon" />
		<span>
			{errorMessage}
		</span>
	</article>
</section>

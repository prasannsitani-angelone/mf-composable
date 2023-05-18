<script lang="ts">
	export let errorMessage: string;
</script>

<section
	class="mx-3 mt-3 mb-1 flex justify-center rounded bg-red-error text-xs font-medium text-grey-dark"
>
	<article class="flex items-center justify-center py-2.5 px-6">
		<slot name="icon" />
		<span>
			{errorMessage}
		</span>
	</article>
</section>

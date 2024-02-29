<script lang="ts">
	export let errorMessage: string;
</script>

<section
	class="mx-3 mb-1 mt-3 flex justify-center rounded bg-tint12-sell text-xs font-normal text-body"
>
	<article class="flex items-center justify-center p-2.5">
		<slot name="icon" />
		<span>
			{errorMessage}
		</span>
	</article>
</section>

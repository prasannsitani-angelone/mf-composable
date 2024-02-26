<script lang="ts">
	let title = '';
	let description = '';

	export { title, description };
</script>

<article class="flex items-center justify-between pb-3 {$$props?.class}">
	<section>
		<slot name="tag" />
		<slot name="title">
			<div class="mt-2 text-sm font-medium text-title">
				{title}
			</div>
		</slot>
		<slot name="description">
			<div class="mt-1 text-xs font-normal text-body">
				{@html description}
			</div>
		</slot>
	</section>
</article>

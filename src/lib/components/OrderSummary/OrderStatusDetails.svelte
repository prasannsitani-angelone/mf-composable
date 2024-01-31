<script lang="ts">
	let schemeName = '';
	let title = '';
	let amount = '';

	export { schemeName, title, amount };
</script>

<article class="mt-2 flex items-center justify-between {$$props?.class}">
	<div class="w-60 text-sm font-normal text-black-key md:w-auto">
		{schemeName}
	</div>
	<section class="flex flex-col items-end justify-center text-sm font-normal text-black-key">
		<div class="text-[11px] font-normal text-black-bolder">{title}</div>
		<div class="text-sm font-normal">{amount}</div>
	</section>
</article>

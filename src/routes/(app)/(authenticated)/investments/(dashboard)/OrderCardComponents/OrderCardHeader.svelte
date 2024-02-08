<script lang="ts">
	export let textString: string;
	export let status = '';
	export let orderType: string;
</script>

<section class="flex items-center justify-between border-b px-4 py-2 text-xs text-body">
	<div>
		{textString}
	</div>
	<div class:text-sell={orderType === 'FAILED'} class:font-normal={orderType === 'FAILED'}>
		{status}
	</div>
</section>

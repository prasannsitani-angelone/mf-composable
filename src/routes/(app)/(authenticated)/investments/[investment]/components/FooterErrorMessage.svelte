<script lang="ts">
	import { getRGBACssVar } from '$lib/utils/colors';

	export let errorMessage: string;
</script>

<section
	style="background-color: {getRGBACssVar('--SELL', 0.1)}"
	class="mx-3 mb-1 mt-3 flex justify-center rounded bg-sell text-xs font-normal text-body"
>
	<article class="flex items-center justify-center p-2.5">
		<slot name="icon" />
		<span>
			{errorMessage}
		</span>
	</article>
</section>

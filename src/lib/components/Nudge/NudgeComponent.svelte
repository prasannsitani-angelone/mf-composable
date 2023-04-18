<script lang="ts">
	let nudgeClasses = '';
	let textClasses = '';
	let nudgeText = '';
	export { nudgeClasses, textClasses, nudgeText };
</script>

<article
	class={`flex items-center justify-center rounded bg-yellow-background p-3 ${nudgeClasses}`}
>
	<slot name="nudgeIcon" />

	<slot name="nudgeDetail">
		<div class={`text-xs font-normal text-black-title ${textClasses}`}>
			{nudgeText || ''}
		</div>
	</slot>
</article>

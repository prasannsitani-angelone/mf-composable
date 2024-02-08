<script lang="ts">
	let nudgeClasses = '';
	let textClasses = '';
	let nudgeText = '';
	export { nudgeClasses, textClasses, nudgeText };
</script>

<article class={`flex items-center justify-center rounded bg-tint12-secondary p-3 ${nudgeClasses}`}>
	<slot name="nudgeIcon" />

	<slot name="nudgeDetail">
		<div class={`text-xs font-normal text-title ${textClasses}`}>
			{nudgeText || ''}
		</div>
	</slot>
</article>

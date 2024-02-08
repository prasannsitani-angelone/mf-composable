<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
	let heading = '';
	let subHeading = '';
	export { heading, subHeading };
</script>

<div>
	<div class="mx-0 mt-2 bg-background-alt px-4 py-4 shadow-csm md:mt-0 md:rounded-lg md:px-2">
		<div class="flex flex-col">
			<div class="flex flex-row items-center justify-center text-lg font-normal text-title">
				<div class="flex justify-center">
					<WMSIcon name="tick-star" class="mr-2" />
					{heading}
				</div>
			</div>
			<div class="mt-2 flex justify-center rounded-lg bg-green py-2 text-sm text-body">
				{subHeading}
			</div>
		</div>
	</div>
</div>

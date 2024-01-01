<script lang="ts">
	import ErrorView from '$components/ErrorView.svelte';
	import SomethingWentWrongIllustration from '$lib/images/SomethingWentWrongIllustration.svelte';
	import { BtnVariant, Button } from 'svelte-components';

	const handleRetryClick = () => {
		window?.location?.reload();
	};
</script>

<ErrorView Icon={SomethingWentWrongIllustration} heading="Something Went Wrong" class="!mt-0">
	<svelte:fragment slot="heading">
		<div class="text-normal mt-4 font-medium text-black-key">Something Went Wrong</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="mt-2 text-center text-sm font-normal text-black-bolder">
			Please try again in some time
		</div>
	</svelte:fragment>
	<svelte:fragment slot="button">
		<Button
			class="mt-4 !h-fit !min-h-0 px-4 py-3 text-xs font-medium"
			onClick={handleRetryClick}
			variant={BtnVariant?.Contained}
		>
			Retry
		</Button>
	</svelte:fragment>
</ErrorView>

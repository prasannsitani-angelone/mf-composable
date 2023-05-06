<script lang="ts">
	import ErrorView from '$components/ErrorView.svelte';
	import { goto } from '$app/navigation';
	import UrlExpiredIcon from '$lib/images/icons/UrlExpiredIcon.svelte';
	import type { AppContext } from '$lib/types/IAppContext';
	import { getContext } from 'svelte';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { OnNavigation } from '$lib/utils/navigation';
	const appContext: AppContext = getContext('app');
	const navigateToDiscoverFunds = () => {
		OnNavigation();
		goto(`${getNavigationBaseUrl('', appContext.scheme, appContext.host)}/discoverfunds`);
	};
</script>

<ErrorView
	Icon={UrlExpiredIcon}
	heading="Something Went Wrong"
	textForButton="EXPLORE MUTUAL FUNDS"
	handleCTAClick={navigateToDiscoverFunds}
>
	<div slot="content">
		<div class="mt-2 text-center text-sm font-normal text-grey-body">
			The link you are trying to reach is not valid.
		</div>
		<div class="mb-4 text-center text-sm font-normal text-grey-body">
			Explore mutual funds to continue investing
		</div>
	</div>
</ErrorView>

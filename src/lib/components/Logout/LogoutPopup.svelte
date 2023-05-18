<script lang="ts">
	import { page } from '$app/stores';
	import Modal from '../Modal.svelte';
	import Button from '$components/Button.svelte';
	import { getNavigationBaseUrl } from '$lib/utils/helpers/navigation';
	import { getContext } from 'svelte';
	import type { AppContext } from '$lib/types/IAppContext';
	import { logout } from '$lib/utils/helpers/logout';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';
	import { goto } from '$app/navigation';
	import { OnNavigation } from '$lib/utils/navigation';

	const appContext: AppContext = getContext('app');

	const navigateToLoginPage = () => {
		logout();
		OnNavigation();
		goto(
			`${getNavigationBaseUrl('', appContext.scheme, appContext.host)}/login?redirect=${
				$page.url?.href
			}`
		);
	};
	const hideAttemptLogoutConfirmationPopup = () => {
		logoutAttemptStore.hideLogoutConfirmationPopup();
	};

	const onAttemptLogoutPopupConfirmation = () => {
		hideAttemptLogoutConfirmationPopup();
		navigateToLoginPage();
	};
</script>

<Modal closeModal={hideAttemptLogoutConfirmationPopup} isModalOpen>
	<div
		class="animate-bottomTransition flex w-full flex-col items-center justify-between overflow-y-auto rounded-t-2xl rounded-b-none bg-white shadow-clg sm:w-120 sm:animate-none sm:rounded-lg md:rounded-lg"
	>
		<div class="w-full">
			<div
				class="px-4 pt-6 pb-2 text-lg font-medium text-black-title sm:border-b sm:py-6 sm:px-8 sm:text-xl"
			>
				Log out from Angel One?
			</div>

			<div
				class="px-4 text-sm text-grey-body sm:px-8 sm:py-8 sm:text-base sm:font-medium sm:text-black-title"
			>
				Do you want to log out from the app?
			</div>
		</div>

		<section class="flex w-full flex-row gap-4 bg-white px-4 py-6 sm:px-8 sm:pb-8 sm:pt-3">
			<Button
				variant="outlined"
				class="flex-1 rounded max-sm:w-full"
				onClick={onAttemptLogoutPopupConfirmation}
			>
				YES
			</Button>
			<Button
				variant="contained"
				class="flex-1 rounded max-sm:w-full"
				onClick={hideAttemptLogoutConfirmationPopup}
			>
				NO
			</Button>
		</section>
	</div>
</Modal>

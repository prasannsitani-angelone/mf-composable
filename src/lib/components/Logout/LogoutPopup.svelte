<script lang="ts">
	import { page } from '$app/stores';
	import Modal from '../Modal.svelte';
	import Button from '$components/Button.svelte';
	import { logout } from '$lib/utils/helpers/logout';
	import { logoutAttemptStore } from '$lib/stores/LogoutAttemptStore';

	const navigateToLoginPage = async () => {
		await logout($page.url.href, $page.url.origin);
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
		class="flex w-full flex-col items-center justify-between overflow-y-auto rounded-b-none rounded-t-2xl bg-white shadow-clg sm:w-120 sm:rounded-lg md:rounded-lg"
	>
		<div class="w-full">
			<div
				class="px-4 pb-2 pt-6 text-lg font-normal text-black-title sm:border-b sm:px-8 sm:py-6 sm:text-xl"
			>
				Log out from Angel One?
			</div>

			<div
				class="px-4 text-sm text-grey-body sm:px-8 sm:py-8 sm:text-base sm:font-normal sm:text-black-title"
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

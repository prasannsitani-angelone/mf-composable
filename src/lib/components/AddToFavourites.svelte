<script lang="ts">
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import { WMSIcon } from 'wms-ui-component';

	let isin: string;
	let schemeCode: string;
	let isFavourite: boolean;
	const dispatch = createEventDispatcher();

	let showDeleteConfirmationPopup = false;
	const baseUrl = PUBLIC_MF_CORE_BASE_URL;
	const favouritesUrl = '/user/favourites';
	const addToFavourites = async () => {
		const url = `${baseUrl}${favouritesUrl}`;
		const body = JSON.stringify({ isin, schemeCode });

		const res = await useFetch(url, {
			method: 'POST',
			body
		});

		if (res.ok) {
			isFavourite = true;
		}
	};

	const removeFromFavourites = async (event: Event) => {
		event.stopPropagation();
		const url = `${baseUrl}${favouritesUrl}/${isin}_${schemeCode}`;

		const res = await useFetch(url, {
			method: 'DELETE'
		});

		if (res.ok) {
			isFavourite = false;
		}
		dispatch('toggleFavourites', { isFavourite });
		showDeleteConfirmationPopup = false;
	};
	const toggleFavourites = async (event: Event) => {
		event.stopPropagation();

		if (isFavourite) {
			showDeleteConfirmationPopup = true;
			// await removeFromFavourites();
		} else {
			await addToFavourites();
		}
	};

	export { isin, schemeCode, isFavourite };
</script>

<Button
	variant="transparent"
	class="{$$props.class} items-start"
	onClick={async (e) => {
		await toggleFavourites(e);
	}}
>
	{#if isFavourite}
		<WMSIcon name="bookmark-filled" size="xs" mode="tulip" />
	{:else}
		<WMSIcon name="bookmark" size="xs" mode="tulip" />
	{/if}
</Button>
{#if showDeleteConfirmationPopup}
	<Modal
		isModalOpen={true}
		on:backdropclicked={() => {
			showDeleteConfirmationPopup = false;
		}}
	>
		<article class="w-full rounded-t-2xl bg-white pt-6 pb-8 md:w-120 md:rounded-lg">
			<header
				class="pb-4 pl-4 text-lg font-medium text-black-title sm:mb-4 sm:border-b md:text-xl lg:px-8 lg:pb-6"
			>
				Remove from Favourites?
			</header>
			<div class="flex flex-col px-4">
				<span class="text-grey-body">Do want to remove this fund from your favourites?</span>

				<div class="mt-9 flex w-full flex-1 gap-4">
					<Button
						class="flex-1"
						variant="outlined"
						onClick={(e) => {
							e.stopPropagation();
							showDeleteConfirmationPopup = false;
						}}>No</Button
					>
					<Button class="flex-1" onClick={removeFromFavourites}>Yes</Button>
				</div>
			</div>
		</article>
	</Modal>
{/if}

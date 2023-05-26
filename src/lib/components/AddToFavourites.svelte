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
	let diasbaled = false;
	let entryModeCarousel = false;
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
		dispatch('toggle-initiated', { enabled: false });
	};
	const toggleFavourites = async (event: Event) => {
		event.stopPropagation();
		dispatch('toggle-initiated', { enabled: isFavourite });
		if (isFavourite) {
			// showDeleteConfirmationPopup = true;
			if (entryModeCarousel) {
				setTimeout(() => {
					showDeleteConfirmationPopup = true;
				}, 500);
			} else {
				showDeleteConfirmationPopup = true;
			}

			// await removeFromFavourites();
		} else {
			await addToFavourites();
		}
	};

	export { isin, schemeCode, isFavourite, entryModeCarousel };
</script>

<Button
	variant="transparent"
	class="{$$props.class} items-start"
	onClick={async (e) => {
		if (diasbaled) return;
		diasbaled = true;
		await toggleFavourites(e);
		diasbaled = false;
	}}
	ariaLabel="bookmark"
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
			dispatch('toggle-initiated', { enabled: false });
		}}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<article
			class="w-full cursor-default rounded-t-2xl bg-white pt-6 pb-8 md:w-120 md:rounded-lg"
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
			<header
				class="pb-4 pl-4 text-lg font-medium text-black-title sm:mb-4 sm:border-b md:text-xl lg:px-8 lg:pb-6"
			>
				Remove from Favourites?
			</header>
			<div class="flex flex-col px-4">
				<span class="text-grey-body">Do you want to remove this fund from your favourites?</span>

				<div class="mt-9 flex w-full flex-1 gap-4">
					<Button
						class="flex-1"
						variant="outlined"
						ariaLabel="no"
						onClick={(e) => {
							e.stopPropagation();
							showDeleteConfirmationPopup = false;
							dispatch('toggle-initiated', { enabled: false });
						}}>No</Button
					>
					<Button class="flex-1" ariaLabel="yes" onClick={removeFromFavourites}>Yes</Button>
				</div>
			</div>
		</article>
	</Modal>
{/if}

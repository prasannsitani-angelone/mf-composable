<script>
	import ErrorPage from '$components/ErrorPage.svelte';
	import NoFavouritesFunds from '$lib/images/icons/NoFavouritesFunds.svelte';
	import { SEO } from 'svelte-components';
</script>

<SEO seoTitle="No Favourites Funds Added | Angelone" seoDescription="No Favourites Funds Added " />

<ErrorPage
	heading="No Favourites Added"
	contentLine="Favourites section is your space.Mark mutual funds as favourite to store,  track compare or analyse them at one place "
	redirectUrl="/categories?id=101"
	textForButton="EXPLORE MUTUAL FUNDS"
>
	<div slot="icon">
		<NoFavouritesFunds />
	</div>
</ErrorPage>

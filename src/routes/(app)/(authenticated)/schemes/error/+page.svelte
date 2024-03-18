<script>
	import ErrorPage from '$components/ErrorPage.svelte';
	import FundDetailsErrorIcon from '$lib/images/icons/FundDetailsErrorIcon.svelte';
</script>

<ErrorPage
	heading="Fund Not Available"
	contentLine="Please explore other mutual funds on Angel One to continue investing"
	redirectUrl="/categories?id=101"
	textForButton="EXPLORE MUTUAL FUNDS"
>
	<div slot="icon">
		<FundDetailsErrorIcon />
	</div>
</ErrorPage>

<script>
	import ErrorPage from '$components/ErrorPage.svelte';
	import FundDetailsErrorIcon from '$lib/images/icons/FundDetailsErrorIcon.svelte';
</script>

<ErrorPage
	heading="Fund Not Available"
	contentLine="Please explore other mutual funds on Angel one to continue investing"
	redirectUrl="/explorefunds/sip-with-100?id=101"
	textForButton="EXPLORE MUTUAL FUNDS"
>
	<div slot="icon">
		<FundDetailsErrorIcon />
	</div>
</ErrorPage>

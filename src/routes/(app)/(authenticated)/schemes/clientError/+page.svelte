<script>
	import ErrorPage from '$components/ErrorPage.svelte';
	import FundDetailsErrorIcon from '$lib/images/icons/FundDetailsErrorIcon.svelte';
</script>

<ErrorPage
	heading="You have already logged in as different user, please logout and open the link again"
	contentLine="Please explore other mutual funds on Angel one to continue investing"
	redirectUrl="/categories?id=101"
	textForButton="EXPLORE MUTUAL FUNDS"
>
	<div slot="icon">
		<FundDetailsErrorIcon />
	</div>
</ErrorPage>

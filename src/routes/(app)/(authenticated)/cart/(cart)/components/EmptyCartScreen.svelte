<script>
	import ErrorPage from '$components/ErrorPage.svelte';
	import EmptyCartIllustration from '$lib/images/EmptyCartIllustration.svelte';
	import { SEO } from 'svelte-components';
</script>

<SEO
	seoTitle="This Cart is empty | Angelone"
	seoDescription="No Cart Items Found. This Cart is empty "
/>

<ErrorPage
	heading="Your cart is empty"
	contentLine="Add funds to your cart to invest in multiple funds at the same time"
	redirectUrl="/explorefunds/sip-with-100?id=101"
	textForButton="EXPLORE MUTUAL FUNDS"
	class=" !h-[calc(100vh-122px)] !justify-center !p-8 max-sm:-mt-4 max-sm:-mb-8 max-sm:rounded-none sm:h-[calc(100vh-260px)]"
>
	<div slot="icon">
		<EmptyCartIllustration />
	</div>
</ErrorPage>

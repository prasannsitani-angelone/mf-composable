<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	const os = $page?.data?.deviceType?.osName || $page?.data?.deviceType?.os;

	function isAndroid() {
		return os === 'Android';
	}

	function getRedirectUrl() {
		return isAndroid()
			? 'intent://angel-one.onelink.me/z3E1/WebSignUp#Intent;scheme=https;end'
			: 'https://angel-one.onelink.me/z3E1/WebSignUp';
	}
</script>

<div
	class="fixed inset-0 z-60 flex w-full flex-col items-center !justify-around bg-background-alt px-6 sm:justify-center"
>
	<div class="px-1 py-4 text-center text-xl font-bold text-title">
		Explore the new Angel One app: a faster, better mutual fund experience
	</div>
	<div class="my-0">
		<img src={`${base}/images/AngelOneBannerIcon.webp`} alt="Explore Mutual Funds" />
	</div>
	<div>
		<div class="text-medium px-1 pb-3 text-center font-normal text-title">
			Simply log in with your <b>Angel One registered mobile number</b> to access all existing holdings
		</div>
		<a href={getRedirectUrl()}>
			<div class="text-medium mt-4 rounded bg-primary px-4 py-4 text-center text-background-alt">
				EXPLORE NOW
			</div>
		</a>
	</div>
</div>

<script>
	let imageUrl = '/images/livesgb.webp';
	let title = 'New SGB is now LIVE!';
	let description = 'Invest in high performing traded SGB at discounted price with equal benefits.';
	export { imageUrl, title, description };
</script>

<div class="relative">
	<img src={imageUrl} class="w-full" alt="Live SGB" />
	<div class="absolute left-5 top-6 w-6/12">
		<h5 class="text-sm font-bold text-background-alt">{title}</h5>
		<p class="mt-2 text-xs text-background-alt">{description}</p>
	</div>
</div>

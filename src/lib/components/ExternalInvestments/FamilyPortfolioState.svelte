<script lang="ts">
	import FamilyPortfolioExternalIllustration from '$lib/images/FamilyPortfolioExternalIllustration.svelte';
</script>

<section class="cardHeight mx-6 flex flex-col items-center justify-center">
	<FamilyPortfolioExternalIllustration />
	<div class="mt-4 text-center text-base font-normal text-body">
		External investment tracking is not available for family members. Please select 'YOU' to track
		external investments
	</div>
</section>

<style>
	.cardHeight {
		height: calc(100vh - 240px);
	}
</style>

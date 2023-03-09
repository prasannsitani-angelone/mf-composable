<script>
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
</script>

{#if browser}
	<Carousel
		arrows={false}
		autoplay={true}
		pauseOnFocus={true}
		autoplayDuration={2000}
		let:currentPageIndex
		let:pagesCount
		let:showPage
	>
		<div slot="dots" class="swiper-pagination">
			{#each Array(pagesCount) as _, index (index)}
				<div
					class={`swiper-pagination-bullet swiper-bullet ${
						index === currentPageIndex ? 'swiper-active' : ''
					}`}
					on:click={() => showPage(index)}
				/>
			{/each}
		</div>
		<slot />
	</Carousel>
{:else}
	<slot />
{/if}

<style>
	.swiper-pagination {
		text-align: center;
		display: flex;
		flex-direction: row;
	}
	.swiper-pagination-bullet {
		border-radius: 50%;
		background: #ccc;
		cursor: pointer;
	}
	.swiper-bullet {
		height: 4px !important;
		width: 4px !important;
		margin-right: 2px;
		margin-left: 2px;
	}
	.swiper-active {
		background: #3f5bd9 !important;
		border-radius: 100px !important;
		opacity: 1 !important;
		width: 16px !important;
	}
</style>

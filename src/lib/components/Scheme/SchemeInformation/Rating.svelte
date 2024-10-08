<script lang="ts">
	import { base } from '$app/paths';
	import ChipArqRating from '$components/ChipArqRating.svelte';

	import RatingIcon from '$lib/images/icons/RatingIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';

	let schemeDetails: SchemeDetails;

	export { schemeDetails };
</script>

<section class="border-b p-4">
	<header class="mb-5 flex items-center">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-background">
			<RatingIcon />
		</div>

		<h3 class="ml-4 text-lg font-normal text-title">Ratings</h3>
	</header>
	<article class="mt-5 flex flex-col justify-center gap-6 lg:flex-row">
		<section class="w-full border-y px-6 py-8 lg:border">
			<div class="relative">
				<img
					src={`${base}/images/arq_background.webp`}
					width="275"
					height="130"
					loading="lazy"
					alt="arq rating background"
				/>
				<img
					src={`${base}/images/arq_circle.webp`}
					width="96"
					height="96"
					alt="arq rating icon"
					class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
					loading="lazy"
				/>

				<div
					class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center text-xl font-bold text-title"
				>
					{schemeDetails?.arqRating}
					<div class="rating gap-1">
						<input type="radio" name="rating-3" class="mask mask-star h-5 w-5 bg-secondary" />
					</div>
				</div>
			</div>
		</section>
		<section class="w-full">
			<h4
				class="rounded px-4 py-2 text-center text-xs font-normal text-body lg:bg-background lg:text-left"
			>
				Ratings By Other Agencies
			</h4>
			<div class="mt-2 flex items-center justify-center py-4 lg:border-b">
				<div class="rounded border p-[5px] shadow-fab">
					<img
						src={`${base}/images/value_research.png`}
						alt="Value Research"
						loading="lazy"
						width="38"
						height="11"
					/>
				</div>
				<h5 class="ml-4 text-sm font-normal text-title">Value Research</h5>
				<h6 class="m-auto mr-1 flex w-11 items-center justify-end rounded-sm">
					<ChipArqRating arqRating={schemeDetails?.valueResearchRating} />
				</h6>
			</div>

			<div class="mt-2 flex items-center justify-center py-4 lg:border-b">
				<div class="rounded border p-[5px] shadow-fab">
					<img
						src={`${base}/images/crisil_rating.png`}
						alt="Crisil"
						loading="lazy"
						width="38"
						height="11"
					/>
				</div>
				<h5 class="ml-4 text-sm font-normal text-title">Crisil</h5>
				<h6 class="m-auto mr-1 flex w-11 items-center justify-end rounded-sm">
					<ChipArqRating arqRating={schemeDetails?.crisilRating} />
				</h6>
			</div>

			<div class="mt-2 flex items-center justify-center py-4 lg:border-b">
				<div class="rounded border p-[5px] shadow-fab">
					<img
						src={`${base}/images/morningstar_rating.png`}
						alt="Morningstar"
						loading="lazy"
						width="38"
						height="11"
					/>
				</div>
				<h5 class="ml-4 text-sm font-normal text-title">Morningstar</h5>
				<h6 class="m-auto mr-1 flex w-11 items-center justify-end rounded-sm">
					<ChipArqRating arqRating={schemeDetails?.morningstarRating} />
				</h6>
			</div>
		</section>
	</article>
</section>

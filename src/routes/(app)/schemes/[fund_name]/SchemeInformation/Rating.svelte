<script lang="ts">
	import { base } from '$app/paths';
	import ChipArqRating from '$components/ChipArqRating.svelte';

	import RatingIcon from '$lib/images/icons/RatingIcon.svelte';
	import type { SchemeDetails, SchemeDetailsContext } from '$lib/types/ISchemeDetails';
	import { getContext } from 'svelte';
	import { SCHEME_DETAILS_KEY } from '../constants';
	let { getSchemeDetails } = getContext<SchemeDetailsContext>(SCHEME_DETAILS_KEY);
</script>

{#await getSchemeDetails() then schemeDetails}
	<section class="border-b p-4">
		<header class="mb-5 flex items-center">
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
				<RatingIcon />
			</div>

			<h3 class="ml-4 text-lg font-medium text-black-title">Ratings</h3>
		</header>
		<article class="mt-5 flex flex-col justify-center gap-6 lg:flex-row">
			<section class="w-full border-y border-grey-line px-6 py-8 lg:border">
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
						class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
						loading="lazy"
					/>

					<div
						class="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center text-xl font-bold text-black-title"
					>
						{schemeDetails?.arqRating}
						<div class="rating gap-1">
							<input
								type="radio"
								name="rating-3"
								class="mask mask-star h-5 w-5 bg-yellow-secondary"
							/>
						</div>
					</div>
				</div>
			</section>
			<section class="w-full">
				<h4
					class="rounded py-2 px-4 text-center text-xs font-medium text-grey-body lg:bg-grey lg:text-left"
				>
					Ratings By Other Agencies
				</h4>
				<div class="mt-2 flex items-center justify-center border-grey-line py-4 lg:border-b">
					<div class="rounded border border-grey-line p-[5px] shadow-fab">
						<img
							src={`${base}/images/value_research.png`}
							alt="Value Research"
							loading="lazy"
							width="38"
							height="11"
						/>
					</div>
					<h5 class="ml-4 text-sm font-medium text-black-title">Value Research</h5>
					<h6 class="m-auto mr-1 flex w-11 items-center justify-end rounded-sm">
						<ChipArqRating arqRating={schemeDetails?.valueResearchRating} />
					</h6>
				</div>

				<div class="mt-2 flex items-center justify-center border-grey-line py-4 lg:border-b">
					<div class="rounded border border-grey-line p-[5px] shadow-fab">
						<img
							src={`${base}/images/crisil_rating.png`}
							alt="Crisil"
							loading="lazy"
							width="38"
							height="11"
						/>
					</div>
					<h5 class="ml-4 text-sm font-medium text-black-title">Crisil</h5>
					<h6 class="m-auto mr-1 flex w-11 items-center justify-end rounded-sm">
						<ChipArqRating arqRating={schemeDetails?.crisilRating} />
					</h6>
				</div>

				<div class="mt-2 flex items-center justify-center border-grey-line py-4 lg:border-b">
					<div class="rounded border border-grey-line p-[5px] shadow-fab">
						<img
							src={`${base}/images/morningstar_rating.png`}
							alt="Morning Star"
							loading="lazy"
							width="38"
							height="11"
						/>
					</div>
					<h5 class="ml-4 text-sm font-medium text-black-title">Morning Star</h5>
					<h6 class="m-auto mr-1 flex w-11 items-center justify-end rounded-sm">
						<ChipArqRating arqRating={schemeDetails?.morningstarRating} />
					</h6>
				</div>
			</section>
		</article>
	</section>
{/await}

<script lang="ts">
	import DotIcon from '$lib/images/icons/DotIcon.svelte';
	import StarIcon from '$lib/images/icons/StarIcon.svelte';

	interface dataObj {
		logoUrl: string;
		categoryName?: string;
		subcategoryName?: string;
		schemeName?: string;
		arqRating?: number;
		reInvestmentPlan?: string;
		returns3yr?: number;
	}

	export let data: dataObj;
	export let schemeName = '';
	export let logoUrl = '';
	export let categoryName = '';
	export let subcategoryName = '';
	export let itemStyle = '';
	export let titleStyle = '';
	export let categoryStyle = '';
	export let subCategoryStyle = '';
	export let logoStyle = '';
</script>

<article
	class={`flex p-3 lg:p-4 ${
		itemStyle ? itemStyle : 'items-center justify-between border-b lg:border-none'
	} ${$$props.class || ''}`}
>
	<section class={`flex pr-8 ${itemStyle ? itemStyle : 'items-center'}`}>
		<slot name="schemeLogo">
			<img
				src={data?.logoUrl || logoUrl}
				alt="logo"
				class={`mr-3 h-12 w-12 rounded-full border object-cover p-2 shadow-csm group-hover:bg-white ${
					logoStyle || ''
				}`}
				loading="lazy"
			/>
		</slot>
		<div>
			<div class="flex items-center text-xs text-gray-500">
				{#if categoryName || data?.categoryName}
					<span class={`${categoryStyle || ''}`}>
						{categoryName || data?.categoryName}
					</span>
				{/if}
				{#if (categoryName && subcategoryName) || (data?.categoryName && data?.subcategoryName)}
					<DotIcon class="mx-1" />
				{/if}
				{#if subcategoryName || data?.subcategoryName}
					<span class={`h-4 w-36 truncate md:w-56 ${subCategoryStyle || ''}`}>
						{subcategoryName || data?.subcategoryName}
					</span>
				{/if}
			</div>
			<div class={`text-sm font-medium text-black-title lg:text-base ${titleStyle || ''}`}>
				{data?.schemeName || schemeName || '-'}
			</div>
			<slot name="ratingSection">
				<div class="flex pt-1 text-xs text-gray-500">
					{#if !!data?.arqRating}
						<div
							class="py-1/2 mr-1 flex max-w-fit items-center rounded-sm border border-white bg-gray-100 px-1 group-hover:border group-hover:border-gray-200 group-hover:bg-white"
						>
							<span class="mr-1">
								{data?.arqRating}
							</span>
							<StarIcon width="11" height="11" class="ml-1/2" />
						</div>
					{/if}
					{#if data?.reInvestmentPlan}
						<div
							class="py-1/2 rounded-sm border border-white bg-gray-100 px-1 group-hover:border group-hover:border-gray-200 group-hover:bg-white"
						>
							{data?.reInvestmentPlan}
						</div>
					{/if}
				</div>
			</slot>
		</div>
	</section>
	<slot name="returns">
		<section>
			{data?.returns3yr ? data?.returns3yr.toFixed(1) + '%' : '-'}
		</section>
	</slot>
</article>

<!-- <script setup lang="ts">
import DotIcon from '@/assets/images/icons/DotIcon.vue'
import StarIcon from '@/assets/images/icons/StarIcon.vue'

interface dataObj {
  logoUrl: string
  categoryName: string
  subcategoryName?: string
  schemeName?: string
  arqRating?: number
  reInvestmentPlan?: string
  returns3yr?: number
}

interface ResultItemProps {
  data: dataObj
  schemeName?: string
  logoUrl?: string
  categoryName?: string
  subcategoryName?: string
  itemStyle?: string
  titleStyle?: string
  categoryStyle?: string
  subCategoryStyle?: string
  logoStyle?: string
}

// eslint-disable-next-line
const props = defineProps<ResultItemProps>()
</script> -->

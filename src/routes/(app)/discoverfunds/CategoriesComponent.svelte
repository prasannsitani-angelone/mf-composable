<script lang="ts">
	// import type { DashboardCategoryEntity } from '$lib/types/IDiscoverFunds';
	import CollectionsCategoryComponent from '$components/LMSICollections/CollectionsCategoryComponent.svelte';

	// export let categories: DashboardCategoryEntity[];

	let _categories = [
		{
			type: 'click',
			name: 'Top Picks',
			data: [
				{
					id: '105',
					name: 'SIP With ₹100',
					iconUrl: 'https://dm11ybwptwy0u.cloudfront.net/icons/sip_with_100_0.svg',
					shortDescription: '',
					detailedDescription: [''],
					data: []
				},
				{
					id: '106',
					name: 'SIP With ₹500',
					iconUrl: 'https://dm11ybwptwy0u.cloudfront.net/icons/sip_with_500_0.svg',
					shortDescription: '',
					detailedDescription: [''],
					data: []
				},
				{
					id: '112',
					name: 'Tax Savings',
					iconUrl: 'https://d3usff6y6s0r8b.cloudfront.net/uat/index_funds_0.svg',
					shortDescription: '',
					detailedDescription: [''],
					data: []
				}
			]
		}
	];
</script>

{#each _categories || [] as category}
	<article
		class="max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm last:mb-0 ${$$props.class}"
	>
		{#if category.type === 'click'}
			<CollectionsCategoryComponent {category} />
		{/if}
	</article>
{/each}

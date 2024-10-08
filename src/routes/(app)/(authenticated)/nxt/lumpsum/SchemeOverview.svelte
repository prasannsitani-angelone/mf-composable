<script lang="ts">
	import { format, differenceInYears, differenceInDays } from 'date-fns';
	import { base } from '$app/paths';
	import AmountText from '$components/AmountText.svelte';
	import Button from '$components/Button.svelte';
	import SchemeInformationModal from '$components/Scheme/SchemeInformation/SchemeInformationModal.svelte';
	import TaxImplications from '$components/Scheme/SchemeInformation/TaxImplications.svelte';
	import ExitLoadIcon from '$lib/images/icons/ExitLoadIcon.svelte';
	import RocketIcon from '$lib/images/icons/RocketIcon.svelte';
	import SchemeInformationIcon from '$lib/images/icons/SchemeInformationIcon.svelte';
	import type { SchemeDetails } from '$lib/types/ISchemeDetails';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import { WMSIcon } from 'svelte-components';

	export let schemeDetails: SchemeDetails;
	let showSchemeInfoModal = false;

	$: launchDate = new Date(schemeDetails?.launchDate);
	$: navDate = new Date(schemeDetails?.navDate);

	const nullDate = new Date('1900-01-01T00:00:00Z');

	const toggleSchemeInfoModal = () => {
		showSchemeInfoModal = !showSchemeInfoModal;
	};

	const toFixed = (num: number, fixed: number) => {
		const splittedValues = String(num.toString()).split('.');
		let decimalValue = splittedValues.length > 1 ? splittedValues[1] : '';
		decimalValue = decimalValue.concat('00').substring(0, fixed);
		return `${splittedValues[0]}.${decimalValue}`;
	};

	const getDiffPercentage = (prevValue: number, currValue: number) =>
		toFixed(((currValue - prevValue) / prevValue) * 100, 2);
</script>

<div class="max-h-full">
	<div class="border-b px-4 py-4 text-base text-title">Mutual Fund Details</div>
	{#if schemeDetails?.noOfClientInvested !== 0}
		<div class="flex border-b p-4">
			<WMSIcon
				fill="var(--BODY)"
				name="people-icon"
				class="mr-2 p-1"
				decoding="async"
				alt="Number of people invested"
				width={24}
				height={24}
			/>
			<div class="text-sm text-body">
				Over
				<strong>{schemeDetails?.noOfClientInvested}+</strong> users have invested in this fund
			</div>
		</div>
	{/if}
	<div class="flex items-center justify-between">
		<div class="flex items-center p-6 pb-0">
			<SchemeLogo src={schemeDetails?.logoUrl} alt={schemeDetails?.schemeName} />
			<div class="mx-3">
				<div class="text-sm uppercase text-body">
					{schemeDetails?.categoryName} • {schemeDetails?.reInvestmentPlan}
				</div>
				<div class="text-lg font-normal text-title">{schemeDetails?.schemeName}</div>
			</div>
		</div>

		{#if schemeDetails?.arqRating !== 0}
			<div class="mr-4 h-16 w-16">
				<div class="relative mt-10">
					<img
						src={`${base}/images/arq_circle.webp`}
						width="120"
						height="120"
						alt="arq rating icon"
						class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
						loading="lazy"
					/>
					<div
						class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center text-sm font-bold text-title"
					>
						{schemeDetails?.arqRating}
						<div class="rating gap-1">
							<input type="radio" name="rating-3" class="mask mask-star h-4 w-4 bg-secondary" />
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div>
				<div class="mr-4 text-sm font-normal text-title">
					Nav
					<span class="text-lg font-normal text-title">
						₹{schemeDetails?.navValue && toFixed(schemeDetails?.navValue, 2)}
					</span>
				</div>
			</div>
		{/if}
	</div>

	<div class="flex justify-between border-b p-4 px-6">
		{#if schemeDetails?.arqRating !== 0}
			<div class="text-sm font-normal text-body">
				Nav
				<span class="text-lg font-normal text-title"
					>₹{schemeDetails?.navValue && toFixed(schemeDetails?.navValue, 2)}</span
				>
				{#if navDate > nullDate}
					<span>
						as of
						{format(navDate, 'dd MMM yyyy')}
					</span>
				{/if}
			</div>
		{/if}
		{#if navDate > nullDate}
			<div class="flex items-center justify-end">
				<span
					class="diff-percentage"
					style:color={getDiffPercentage(
						schemeDetails?.previousNavValue,
						schemeDetails?.navValue
					) === '0.00'
						? '#000'
						: Number(getDiffPercentage(schemeDetails?.previousNavValue, schemeDetails?.navValue)) >
						  0
						? '#1ec7b6'
						: '#F65E5A'}
					>{schemeDetails?.previousNavValue &&
						schemeDetails?.navValue &&
						getDiffPercentage(schemeDetails?.previousNavValue, schemeDetails?.navValue)}%</span
				>
				<span class="diff-duration text-title"
					>{differenceInDays(navDate, new Date(schemeDetails?.previousNavDate))}
					Day</span
				>
			</div>
		{/if}
	</div>
	{#if schemeDetails?.aum !== 0 || schemeDetails?.expenseRatio !== 0 || schemeDetails?.exitLoadFlag === 'Y' || schemeDetails?.taxImplications}
		<div
			class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
		>
			<div class="flex items-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-background">
					<SchemeInformationIcon />
				</div>
				<h2 class="ml-3 flex items-center text-left font-normal text-title">
					<span class="mr-2">Scheme Information</span>

					<Button
						class="w-[22px] rounded-full !border-border !p-0 !lowercase"
						variant="outlined"
						size="xs"
						onClick={toggleSchemeInfoModal}>i</Button
					>
				</h2>
			</div>
		</div>
		<SchemeInformationModal
			isModalOpen={showSchemeInfoModal}
			toggleSchemeIformationModal={toggleSchemeInfoModal}
		/>
	{/if}

	{#if schemeDetails?.aum !== 0 || schemeDetails?.expenseRatio !== 0 || schemeDetails?.exitLoadFlag === 'Y'}
		<section
			class="mx-4 flex flex-col justify-between divide-y-2 border-b lg:mx-0 lg:flex-row lg:divide-none"
		>
			<!-- AUM -->
			{#if schemeDetails?.aum !== 0}
				<section class="flex flex-col gap-4 p-4 pt-0 lg:w-1/3 lg:flex-row">
					<article
						class="flex-grow basis-0 rounded py-4 sm:bg-background-alt lg:border lg:bg-background lg:px-3"
					>
						<div
							class="mb-3 flex h-6 w-6 justify-center rounded-full bg-primary align-middle leading-6 text-background-alt"
						>
							₹
						</div>
						<h3 class="mb-1 text-xs font-normal text-body">Asset Under Management</h3>
						<h4 class="text-title"><AmountText amount={schemeDetails?.aum} /> <span>Cr.</span></h4>
					</article>
				</section>
			{/if}
			<!-- Expense Ratio  -->
			{#if schemeDetails?.expenseRatio !== 0}
				<section class="flex flex-col gap-4 p-4 pt-0 lg:w-1/3 lg:flex-row">
					<article
						class="flex-grow basis-0 rounded bg-background-alt py-4 lg:border lg:bg-background lg:px-3"
					>
						<div
							class="mb-3 flex h-6 w-6 justify-center rounded-full bg-primary align-middle leading-6 text-background-alt"
						>
							%
						</div>
						<h3 class="mb-1 text-xs font-normal text-body">Expense Ratio</h3>
						<h4 class="text-title">
							<span>{schemeDetails?.expenseRatio}%</span>
							<span> (inclusive of GST)</span>
						</h4>
					</article>
				</section>
			{/if}
			<!-- Exit Load -->
			{#if schemeDetails?.exitLoadFlag === 'Y'}
				<section class="flex flex-col gap-4 p-4 pt-0 lg:w-1/3 lg:flex-row">
					<article
						class="flex-grow basis-0 rounded bg-background-alt py-4 lg:border lg:bg-background lg:px-3"
					>
						<ExitLoadIcon />
						<h3 class="mb-1 mt-3 text-xs font-normal text-body">Exit Load</h3>
						<h4 class="text-title">{schemeDetails?.exitLoadValue}</h4>
					</article>
				</section>
			{/if}
		</section>
	{/if}

	<TaxImplications {schemeDetails} />

	{#if launchDate > nullDate}
		<section class="p-3">
			<div class="pa-5 flex items-center justify-center">
				<RocketIcon />
				<div class="launch-text ml-2 text-title">
					Launched on
					{format(launchDate, 'MMM yyyy')}
					<span class="launch-sub-text">
						({differenceInYears(new Date(), launchDate)}
						years)
					</span>
				</div>
			</div>
		</section>
	{/if}
</div>

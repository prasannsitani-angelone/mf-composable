<script lang="ts">
	import MobileHeader from '$components/Headers/MobileHeader.svelte';
	import { WMSIcon } from 'svelte-components';
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onMount } from 'svelte';
	import { page } from '$app/stores';
	import Prompt from './Prompt.svelte';
	import type {
		ChatItem,
		ChoiceItem,
		ContextItem,
		PromptContext,
		PromptEvaluateData,
		PromptResData,
		PromptSchemeDetails,
		TextTypes
	} from '$lib/types/IAskAngel';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { useFetch } from '$lib/utils/useFetch';
	import { base } from '$app/paths';
	import { encodeObject } from '$lib/utils/helpers/params';
	import { normalizeFundName } from '$lib/utils/helpers/normalizeFundName';
	import DotLoader from '$components/Loader/DotLoader.svelte';
	import {
		askAngelChoiceClickAnalytics,
		askAngelCrossClickAnalytics,
		askAngelEntryClickAnalytics,
		askAngelRetryClickAnalytics,
		askAngelStartAgainIconClickAnalytics
	} from '$lib/analytics/askangel/askangel';

	const dispatch = createEventDispatcher();

	$: isMobile = $page?.data?.deviceType?.isMobile;
	$: isTablet = $page?.data?.deviceType?.isTablet;

	const redirectToHomepage = () => {
		askAngelCrossClickAnalytics();

		if (isMobile || isTablet) {
			history?.back();
		} else {
			dispatch('closeAskAngel');
		}
	};

	let showLoader = false;
	let promptContext: PromptContext;

	let contextCounter = 0;

	let showError = false;

	const resetToDefaultState = () => {
		getInitialData();

		if (promptContext !== undefined) {
			promptContext.rootPromptId = '';
			promptContext.context = [];
			contextCounter = 0;
		}

		showError = false;
	};

	const handleRefreshButtonClick = () => {
		resetToDefaultState();

		askAngelStartAgainIconClickAnalytics();
	};

	const defaultMessagesList = [
		{
			type: 'emoji',
			displayText: ''
		},
		{
			type: 'message',
			displayText: `Hi ${
				$page.data?.profile?.clientDetails?.firstName || ''
			}. Not sure where to invest your money? We are here to help!`
		},
		{
			type: 'message',
			displayText: 'We will match you with the right investments based on your goals'
		}
	];

	let chatData: ChatItem[] = [];
	let rootPromptsList: PromptResData[] = [];

	let loaderTimeout;

	const setLoaderTimeout = () => {
		loaderTimeout = setTimeout(() => {
			if (chatData?.length > 1) {
				chatData[chatData?.length - 2].latest = false;
				chatData[chatData?.length - 1].latest = false;
			}
		}, 1000);
	};

	const resetChatDataLatestTag = () => {
		if (chatData?.length > 1) {
			chatData[chatData?.length - 2].latest = false;
			chatData[chatData?.length - 1].latest = true;
		}

		setLoaderTimeout();
	};

	const addDefaultChatData = () => {
		let newChatItem: ChatItem = {
			isDefault: true,
			isRoot: false,
			isFinal: false,
			owner: 'angel',
			type: 'message',
			texts: [],
			question: '',
			id: '',
			nextId: '',
			data: {}
		};

		defaultMessagesList?.forEach((messageObj) => {
			newChatItem?.texts?.push(messageObj);
		});

		chatData = [];
		chatData?.push(newChatItem);
		resetChatDataLatestTag();
	};

	const addRootPromptsInChat = () => {
		let newChatItem: ChatItem = {
			isDefault: false,
			isRoot: true,
			isFinal: false,
			owner: 'angel',
			type: 'choices',
			texts: [],
			question: 'What do you need help with today?',
			id: '',
			nextId: '',
			data: {}
		};

		let choiceList: ChoiceItem[] = [];

		rootPromptsList?.forEach((rootPrompt) => {
			let choiceItem: ChoiceItem = {
				id: rootPrompt?.prompt?.id,
				label: rootPrompt?.prompt?.question,
				nextId: rootPrompt?.nextId,
				isRoot: true
			};

			choiceList.push(choiceItem);
		});

		newChatItem.data.choices = choiceList;

		chatData?.push(newChatItem);
		resetChatDataLatestTag();
	};

	const getRootPromptData = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/prompts`;

		showLoader = true;
		const res = await useFetch(url, {}, fetch);

		if (res?.data?.status === 'success') {
			rootPromptsList = res?.data?.prompt || [];
		} else {
			showError = true;
		}

		showLoader = false;
		addRootPromptsInChat();
	};

	const getInitialData = () => {
		addDefaultChatData();
		getRootPromptData();
	};

	onMount(() => {
		getInitialData();

		askAngelEntryClickAnalytics();
	});

	const convertLastChoiceToMessage = () => {
		let lastChatPrompt = chatData[chatData?.length - 1];
		lastChatPrompt.type = 'message';
		lastChatPrompt.texts.push({ type: 'message', displayText: lastChatPrompt?.question || '' });
		lastChatPrompt.question = '';
		lastChatPrompt.data = {};

		chatData[chatData?.length - 1] = lastChatPrompt;
	};

	const addNextPromptsInChat = (nextPromptData: PromptResData) => {
		let promptTexts: TextTypes[] = [];
		(nextPromptData?.prompt?.texts || [])?.forEach((text) => {
			promptTexts?.push({
				type: 'message',
				displayText: text
			});
		});

		let newChatItem: ChatItem = {
			isDefault: false,
			isRoot: false,
			isFinal: false,
			owner: 'angel',
			type: 'choices',
			texts: promptTexts,
			question: nextPromptData?.prompt?.question,
			id: nextPromptData?.prompt?.id,
			nextId: nextPromptData?.nextId,
			parentId: nextPromptData?.parentId,
			data: {}
		};

		let choiceList: ChoiceItem[] = [];

		nextPromptData?.prompt?.data?.forEach((promptChoice) => {
			let choiceItem: ChoiceItem = {
				id: nextPromptData?.prompt?.id,
				choiceId: promptChoice?.id,
				nextId: promptChoice?.nextId,
				label: promptChoice?.label,
				description: promptChoice?.description,
				mostChosen: promptChoice?.mostChosen
			};

			choiceList.push(choiceItem);
		});

		newChatItem.data.choices = choiceList;

		chatData?.push(newChatItem);
		resetChatDataLatestTag();
	};

	const getDataOnUserSelection = async (choice: ChoiceItem) => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/prompts/${choice?.nextId}`;

		showLoader = true;

		const res = await useFetch(url, {}, fetch);

		if (res?.data?.status === 'success') {
			addNextPromptsInChat(res?.data?.data);
		} else {
			showError = true;
		}

		showLoader = false;
	};

	const updateChatDataOnUserSelection = (choice: ChoiceItem) => {
		let newChatItem: ChatItem = {
			isDefault: false,
			isRoot: false,
			isFinal: false,
			owner: 'user',
			type: 'message',
			texts: [
				{
					type: 'message',
					displayText: choice?.label || ''
				}
			],
			question: '',
			id: '',
			nextId: '',
			data: {}
		};

		chatData?.push(newChatItem);
	};

	const setPromptContext = (selectedChoice: ChoiceItem) => {
		if (promptContext === undefined) {
			promptContext = {
				rootPromptId: '',
				context: []
			};
		}

		if (selectedChoice?.isRoot) {
			promptContext.rootPromptId = selectedChoice?.id;
		} else {
			contextCounter++;

			let newContextItem: ContextItem = {
				choiceId: selectedChoice?.choiceId || '',
				choiceValue: selectedChoice?.label,
				id: selectedChoice?.id,
				order: contextCounter
			};

			promptContext.context?.push(newContextItem);
		}
	};

	const addEvaluateDataInChat = (evaluateData: PromptEvaluateData) => {
		let promptTexts: TextTypes[] = [];
		(evaluateData?.texts || [])?.forEach((text) => {
			promptTexts?.push({
				type: 'message',
				displayText: text
			});
		});

		let newChatItem: ChatItem = {
			isDefault: false,
			isRoot: false,
			isFinal: false,
			owner: 'angel',
			type: 'schemes',
			texts: promptTexts,
			question: '',
			id: evaluateData?.id,
			nextId: '',
			parentId: '',
			data: {}
		};

		if (evaluateData?.type === 'schemes') {
			newChatItem.data.schemes = evaluateData?.data?.schemes || [];
		} else if (evaluateData?.type === 'nudge') {
			newChatItem.data.nudges = evaluateData?.data;
			newChatItem.type = 'nudges';
		}

		chatData?.push(newChatItem);
		resetChatDataLatestTag();
	};

	const getPromptsEvaluation = async () => {
		const url = `${PUBLIC_MF_CORE_BASE_URL}/prompts/evaluate`;
		const body = JSON.stringify(promptContext);

		showLoader = true;

		const res = await useFetch(url, {
			method: 'POST',
			body
		});

		if (res?.data?.status === 'success') {
			addEvaluateDataInChat(res?.data?.data);
		} else {
			showError = true;
		}

		showLoader = false;
	};

	const handlePromptChoiceClick = (e: CustomEvent) => {
		let selectedChoice = e?.detail;

		setPromptContext(selectedChoice);

		askAngelChoiceClickAnalytics(promptContext);

		convertLastChoiceToMessage();
		updateChatDataOnUserSelection(selectedChoice);

		if (selectedChoice?.nextId?.length) {
			getDataOnUserSelection(selectedChoice);
		} else {
			getPromptsEvaluation();
		}
	};

	const handleSchemeCardClick = (scheme: PromptSchemeDetails) => {
		const schemeDetailsPath = `${base}/schemes/${normalizeFundName(
			scheme?.schemeName,
			scheme?.isin,
			scheme?.schemeCode
		)}?orderpad=INVEST&params=${encodeObject({
			investmentType: 'SIP',
			paymentMandatory: true
		})}`;
		goto(schemeDetailsPath);
	};

	const handleRetryButtonClick = () => {
		askAngelRetryClickAnalytics(promptContext);

		resetToDefaultState();
	};
</script>

<section>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- Header -->
	<article>
		<MobileHeader
			title="Ask Angel"
			class="fixed left-0 right-0 top-0 z-10 bg-blue-primary lg:inset-auto lg:!h-14 lg:w-[360px] lg:rounded-t-lg"
			class2="md:!block md:-mt-3 !cursor-default"
			titleClass="text-base text-white"
			showRightIcon={true}
		>
			<svelte:fragment slot="icon">
				<WMSIcon
					name="cross-close"
					width={16}
					height={16}
					stroke="#ffffff"
					class="mr-3 mt-1 block cursor-pointer lg:hidden"
					on:click={redirectToHomepage}
				/>
			</svelte:fragment>
			<svelte:fragment slot="rightIcon">
				<article class="-ml-4 flex items-center">
					<article on:click={handleRefreshButtonClick}>
						<WMSIcon name="reset" class="cursor-pointer" />
					</article>

					<WMSIcon
						name="cross-close"
						width={16}
						height={16}
						stroke="#ffffff"
						class="ml-3 mt-1 hidden cursor-pointer lg:block"
						on:click={redirectToHomepage}
					/>
				</article>
			</svelte:fragment>
		</MobileHeader>
	</article>

	<!-- Chat Body -->
	<article
		class="mt-14 overflow-y-auto bg-white px-4 py-2 lg:mt-0 lg:h-120 lg:w-[360px] lg:px-5 {showError
			? 'pb-20'
			: ''}"
	>
		<div class="hidden h-14 lg:block" />

		{#each chatData || [] as chatItem, index (index)}
			{#if chatItem?.latest && !showLoader}
				<DotLoader class="mt-1" />
			{:else}
				<Prompt
					class={index > 0 && chatData[index - 1]?.owner !== chatItem?.owner ? 'mt-5' : ''}
					{chatItem}
					on:promptChoiceSelect={handlePromptChoiceClick}
					on:schemeCardClick={(e) => handleSchemeCardClick(e.detail)}
					isMobileOrTablet={isMobile || isTablet || false}
				/>
			{/if}
		{/each}

		{#if showLoader}
			<DotLoader class="mt-1" />
		{/if}

		<!-- Footer (Error Message) -->
	</article>

	{#if showError}
		<article
			class="fixed inset-0 top-auto z-10 mx-2 mb-3 flex !h-16 items-center justify-between rounded bg-red-errorDark p-4 text-white lg:left-auto lg:top-auto lg:w-[344px]"
		>
			<div class="text-sm font-normal">Something went wrong. Please try again</div>

			<ButtonMedium
				variant="transparent"
				class="text-sm font-normal text-white"
				size="xs"
				onClick={handleRetryButtonClick}>Retry</ButtonMedium
			>
		</article>
	{/if}
</section>

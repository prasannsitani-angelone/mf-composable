<script setup lang="ts">
	import BaseInput from '$components/BaseInput.svelte';
	import Button from '$components/Button.svelte';
	import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
	import { filterNumber } from '$lib/utils/helpers/filters';
	import { useFetch } from '$lib/utils/useFetch';
	import { createEventDispatcher } from 'svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	export let token: string;

	const dispatch = createEventDispatcher();

	let error = '';
	let mpin = '';
	let reMpin = '';
	let reMpinVisible = false;

	const onMpinFillComplete = () => {
		reMpinVisible = true;
	};

	const onMpinChange = (value: string) => {
		mpin = value;
		error = '';
		if (mpin.trim().length === 4) {
			onMpinFillComplete();
		}
	};

	const onReMpinFillComplete = () => {
		if (mpin !== reMpin) {
			error = 'PIN did’t match';
		}
	};

	const onReMpinChange = (value: string) => {
		reMpin = value;
		error = '';
		if (reMpin.trim().length === 4) {
			onReMpinFillComplete();
		}
	};

	const callMpinApi = async () => {
		const baseUrl = PUBLIC_MF_CORE_BASE_URL;
		const url = `${baseUrl}/mpin`;

		return useFetch(url, {
			method: 'POST',
			body: JSON.stringify({
				action: 'CREATE',
				mpin: reMpin
			}),
			headers: {
				'X-Source': 'mutualfund',
				authorization: `Bearer ${token}`
			}
		});
	};

	const onReMpinSubmit = async () => {
		error = '';
		const mpinData = await callMpinApi();

		if (mpinData?.status === 200 && mpinData?.data?.status?.toUpperCase() === 'SUCCESS') {
			dispatch('onSuccess');
		} else if (mpinData?.data?.message?.length) {
			error = mpinData?.data?.message;
		} else {
			error = 'Unknown Error. Please Contact Field Support';
		}
	};

	$: buttonDisabled = mpin.trim().length !== 4 || mpin !== reMpin;

	const onClick = () => {
		if (buttonDisabled) {
			return;
		}
		onReMpinSubmit();
	};
</script>

<section class="w-full" data-testid="mpin-setup">
	<div class="flex w-full flex-col items-center lg:w-120">
		<div class="mb-6 w-full text-xl font-normal text-title md:mb-12">Set Up PIN</div>
		<div class="flex w-full flex-col items-center">
			<BaseInput
				id="mpin"
				placeholder="Set a 4 Digit PIN"
				type="password"
				maxLength={4}
				value={mpin}
				heading={mpin ? 'Set a 4 Digit PIN' : ''}
				onChange={onMpinChange}
				classes={{
					input: 'text-base text-start placeholder:text-sm',
					container: 'border shadow-none h-16 py-0',
					label: 'text-body text-xs mb-0 font-normal',
					parent: 'w-full'
				}}
				filterChar={filterNumber}
				autofocus={true}
			>
				<svelte:fragment slot="preinput">
					<div class="mr-4 flex flex-col justify-center">
						<WMSIcon name="lock-icon" width={24} height={24} />
					</div>
				</svelte:fragment>
			</BaseInput>

			{#if reMpinVisible}
				<BaseInput
					id="reMpinVisible"
					placeholder="Confirm PIN"
					type="password"
					maxLength={4}
					value={reMpin}
					heading={reMpin ? 'Confirm PIN' : ''}
					onChange={onReMpinChange}
					classes={{
						input: 'text-base text-start placeholder:text-sm',
						container: 'border shadow-none h-16 py-0',
						label: 'text-body text-xs mb-0 font-normal',
						parent: 'mt-10 w-full',
						error: ''
					}}
					class="mt-10 w-full"
					filterChar={filterNumber}
					error={Boolean(error)}
					onSubmit={onClick}
				>
					<svelte:fragment slot="preinput">
						<div class="mr-4 flex flex-col justify-center">
							<WMSIcon name="lock-icon" width={24} height={24} />
						</div>
					</svelte:fragment>
				</BaseInput>

				{#if error?.length}
					<div class="mt-2 text-center text-xs text-red-500">
						{error}
					</div>
				{/if}
			{/if}
		</div>
		<Button
			class="mt-6 w-full rounded-lg !py-3 md:mt-12 {buttonDisabled
				? '!bg-background !text-disabled'
				: ''}"
			disabled={buttonDisabled}
			{onClick}
		>
			PROCEED
		</Button>
	</div>
</section>

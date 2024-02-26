<script lang="ts">
	import ButtonMedium from '$components/ButtonMedium.svelte';
	import WMSIcon from '$lib/components/WMSIcon.svelte';

	let toggleSwitchCue: () => void;
	let toggleModal: () => void;
	export { toggleSwitchCue, toggleModal };
</script>

<section
	class="mx-3 mt-2 flex flex-col items-center justify-center rounded-lg bg-background-alt px-8 pb-4"
>
	<div class="pb-4 pt-8">
		<WMSIcon height={184} width={160} name="switch-in" fill="var(--BACKGROUND-ALT)" />
	</div>

	<div class="flex items-center justify-center">
		<div class="text-medium flex items-center font-normal text-title">
			<p>Switch In Fund</p>
			<WMSIcon
				height={16}
				width={16}
				fill="var(--BODY)"
				stroke="var(--BODY)"
				class="ml-1 cursor-pointer"
				name="info-in-circle"
				on:click={toggleSwitchCue}
			/>
		</div>
	</div>
	<div class="mb-2 mt-2 text-center text-sm font-normal text-title">
		Select a Switch In Fund. Your investment will be <b>transferred to</b> this mutual fund
	</div>

	<ButtonMedium variant="outlined" class="mb-4 mt-2" on:click={toggleModal}
		>SELECT SWITCH IN FUND</ButtonMedium
	>
</section>

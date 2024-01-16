<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Checkbox } from 'svelte-components';
	import type { FamilyMemberTypes } from '$lib/types/IFamilyPortfolio';
	import { getNameInitials } from '$lib/utils/helpers/text';

	const dispatch = createEventDispatcher();

	let familyMember: FamilyMemberTypes;
	let clientName = '';

	let memberNameInitials = getNameInitials(familyMember?.nickname || '');

	const onOptionClick = () => {
		dispatch('memberClick');
	};

	export { familyMember, clientName };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
	class="flex items-start justify-between rounded-lg border border-grey-line bg-white p-3 md:cursor-pointer {$$props?.class ||
		''}"
	on:click={onOptionClick}
>
	<section class="flex items-center">
		<article
			class="flex h-9 w-9 items-center justify-center rounded-full bg-purple-background p-2 text-sm font-normal text-black"
		>
			<div class="flex">
				{memberNameInitials}
			</div>
		</article>
		<article class="ml-2 font-normal text-black-key">
			<article class="flex items-center">
				<div class="flex flex-1 items-center justify-between text-sm">
					{familyMember?.nickname === clientName ? 'You' : familyMember?.nickname}
				</div>
				{#if familyMember?.relation?.toLowerCase() !== 'self'}
					<div class="ml-1 rounded-sm bg-grey px-1 py-0.5 text-[10px] uppercase">
						{familyMember?.relation}
					</div>
				{/if}
			</article>
			<div class="text-xs capitalize text-black-bolder">
				{familyMember?.party_code}
			</div>
		</article>
	</section>

	<Checkbox class="ml-[-4px]" checked={familyMember?.selected} label="" />
</section>

<script lang="ts">
	import { profileStore } from '$lib/stores/ProfileStore';

	export let userName: string;
	export let partnerName: string;
	export let partnerId: string = $profileStore?.clientDetails?.subBroker || '';
</script>

<div class="bg-grey">
	<div class="my-2 rounded-lg bg-white">
		<p class="p-4 text-base font-normal text-black-neutral">
			Good evening, <span class="text-blue-primary">{userName}</span>! Your Authorised Partner,
			<span class="text-blue-primary"
				>{partnerName}
				{#if partnerId?.length} ({partnerId}) {/if}</span
			> have placed a one-time mutual fund order. Please verify the details and complete OTP verification
			at the earliest.
		</p>
	</div>
</div>

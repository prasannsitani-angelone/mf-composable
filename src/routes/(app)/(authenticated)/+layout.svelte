<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getPaymentModeStatus,
		paymentMethodStatusStore
	} from '$lib/stores/PaymentMethodStatusStore.js';

	onMount(async () => {
		if (!paymentMethodStatusStore.isSet()) {
			paymentMethodStatusStore.updateStore(await getPaymentModeStatus());
		} else {
			await paymentMethodStatusStore.getData();
		}
	});
</script>

<slot />

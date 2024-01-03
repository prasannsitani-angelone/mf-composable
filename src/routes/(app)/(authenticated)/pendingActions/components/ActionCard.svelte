<script lang="ts">
	import Button from '$components/Button.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { Notif } from '$lib/types/INotifications';
	import { WMSIcon } from 'svelte-components';

	let order: Notif;
	let message = '';
	let buttonText = '';
	let icon = '';
	let onButtonClick: (order: Notif) => void;

	export { order, message, buttonText, icon, onButtonClick };
</script>

<div
	class="my-2 flex flex-col rounded-lg border-[1px] border-grey-line bg-white p-3 text-xs text-black-key shadow-sm {$$props.class}"
>
	<div class="flex items-center justify-between pb-2">
		<div class="flex items-center pr-3">
			<div><SchemeLogo size="xs" src={order?.logoUrl} alt={order?.schemeName} /></div>
			<div>{order?.schemeName}</div>
		</div>
		<div>
			<Button class="!whitespace-nowrap" size="sm" onClick={() => onButtonClick(order)}
				><span class="text-xs">{buttonText}</span></Button
			>
		</div>
	</div>
	<hr />
	<div class="flex items-center justify-between pt-2 text-black-bolder">
		<div class="flex">
			<div class="pr-1"><WMSIcon name={icon} height={16} width={16} stroke="#425061" /></div>
			<div>{message}</div>
		</div>
		<div>
			₹{order?.amount}
		</div>
	</div>
</div>

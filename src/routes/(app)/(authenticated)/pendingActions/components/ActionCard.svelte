<script lang="ts">
	import AmountText from '$components/AmountText.svelte';
	import Button from '$components/Button.svelte';
	import SchemeLogo from '$components/SchemeLogo.svelte';
	import type { Notif } from '$lib/types/INotifications';
	import { WMSIcon } from 'svelte-components';

	let order: Notif;
	let message = '';
	let buttonText = '';
	let icon = '';
	let messageStyle = '';
	let onButtonClick: (order: Notif) => void;

	export { order, message, buttonText, icon, onButtonClick, messageStyle };
</script>

<div
	class="my-2 flex flex-col rounded-lg border-[1px] bg-background-alt p-3 text-xs text-title shadow-sm {$$props.class}"
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
	<div class="flex items-center justify-between pt-2 text-body">
		<div class="flex">
			<div class="pr-1"><WMSIcon name={icon} height={16} width={16} stroke="var(--BODY)" /></div>
			<div class={messageStyle}>{message}</div>
		</div>
		<div>
			<AmountText amount={order?.amount || 0} />
		</div>
	</div>
</div>

<script lang="ts">
	import { Checkbox } from 'svelte-components';
	import Link from '$components/Link.svelte';
	import { clickManageCartAnalytics } from '../../analytics/cart';

	export let isSelectAllChecked = false;
	export let handleCheckboxChange = () => '';
</script>

<section class="flex justify-between rounded-t-xl bg-border px-3 py-4">
	<div class=" flex items-center text-xs font-normal">
		<Checkbox
			checked={isSelectAllChecked}
			on:click={handleCheckboxChange}
			label="Select All"
			labelCls="text-title"
		/>
	</div>
	<Link
		to="/cart/manage"
		on:linkClicked={clickManageCartAnalytics}
		class=" text-sm font-medium text-primary">Manage Cart</Link
	>
</section>

<script lang="ts">
	import { Checkbox } from 'wms-ui-component';
	import Link from '$components/Link.svelte';
	import { clickManageCartAnalytics } from '../../analytics/cart';

	export let isSelectAllChecked = false;
	export let handleCheckboxChange = () => '';
</script>

<section class="!mt-[-1rem] flex justify-between bg-grey-line px-3 py-4">
	<div class=" flex items-center text-xs font-medium">
		<Checkbox checked={isSelectAllChecked} on:click={handleCheckboxChange} label="Select All" />
	</div>
	<Link
		to="/cart/manage"
		on:linkClicked={clickManageCartAnalytics}
		class=" text-sm font-semibold text-blue-primary">Manage Cart</Link
	>
</section>

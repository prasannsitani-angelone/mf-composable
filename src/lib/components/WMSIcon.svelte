<script lang="ts">
	import { WMSIcon } from 'svelte-components';
	// import * as Icons from "wms-ui-component/dist/icons"
	export let name: string;
</script>

<WMSIcon {name} on:click on:keydown class={`${$$props?.class || ''}`} {...$$props} />

<!-- </div> -->

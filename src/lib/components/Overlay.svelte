<script lang="ts">
	import { Overlay } from 'svelte-components';
</script>

<Overlay {...$$props}>
	<slot />
</Overlay>

<script lang="ts">
	let height = '48';
	let width = '48';
	export let fill = 'var(--BACKGROUND)';
	export let stroke = 'var(--PRIMARY)';
</script>

<svg
	{width}
	{height}
	viewBox="0 0 48 48"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={$$props.class}
>
	<circle cx="24" cy="24" r="24" {fill} />
	<path
		d="M34.6667 24.0007C34.6667 26.1103 34.0411 28.1726 32.8691 29.9267C31.697 31.6809 30.0311 33.048 28.082 33.8554C26.1329 34.6627 23.9882 34.8739 21.9191 34.4624C19.8499 34.0508 17.9493 33.0349 16.4576 31.5431C14.9658 30.0514 13.9499 28.1507 13.5383 26.0816C13.1268 24.0125 13.338 21.8678 14.1453 19.9187C14.9527 17.9696 16.3198 16.3037 18.074 15.1316C19.8281 13.9596 21.8904 13.334 24 13.334L24 24.0007H34.6667Z"
		{stroke}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M34.6667 20.4451C34.6667 19.5113 34.4827 18.5866 34.1254 17.7238C33.768 16.861 33.2442 16.0771 32.5839 15.4168C31.9236 14.7565 31.1396 14.2327 30.2769 13.8753C29.4141 13.5179 28.4894 13.334 27.5556 13.334L27.5556 20.4451H34.6667Z"
		{stroke}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

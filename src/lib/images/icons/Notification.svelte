<script>
	let width = 24;
	let height = 24;
	let stroke = '#3F5BD9';
	export { width, height, stroke };
</script>

<section
	class="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--B-100)] p-1.5 {$$props?.class}"
>
	<svg {width} {height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M18.4 15.8571H20V17.5714H4V15.8571H5.6V9.85715C5.6 6.07005 8.46538 3 12 3C15.5346 3 18.4 6.07005 18.4 9.85715V15.8571ZM16.8 15.8572V9.85715C16.8 7.01683 14.6509 4.7143 12 4.7143C9.34898 4.7143 7.19995 7.01683 7.19995 9.85715V15.8572H16.8ZM14.4001 19.2857H9.6001V21H14.4001V19.2857Z"
			fill={stroke}
		/>
	</svg>
</section>

<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import './DatePicker.css';
	let clazz: string;
	let fp;
	let date = null;

	const flatpickrOptions = {
		element: '#my-picker',
		altInput: true,
		wrap: true,
		altFormat: 'F j, Y',
		dateFormat: 'dd-mmm-yyyy',
		minDate: Date.now(),
		monthSelectorType: 'static',
		onClose: function (selectedDates, dateStr, instance) {
			console.log('n');
		},
		onOpen: function () {
			console.log('opened');
		}
	};

	export { clazz as class };
</script>

<Flatpickr options={flatpickrOptions} bind:value={date} element="#my-picker" bind:fp>
	<div class={`border-CFD3D4 mb-5 w-64 rounded border  bg-white ${clazz}`}>
		<label for="datepicker" class="text-5E6366 text-xs font-normal"> SIP start date </label>
		<div class="flatpickr relative" id="my-picker">
			<input
				type="text"
				placeholder="Select Date.."
				data-input
				class="w-full rounded-lg py-3 pl-4 pr-10 font-medium
        leading-none  focus:outline-none"
			/>

			<div class="absolute top-0 right-0 px-3 py-2">
				<svg
					on:click={() => {
						if (fp) {
							fp.open();
						}
					}}
					class="h-6 w-6 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0
            00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
		</div>
	</div>
</Flatpickr>

<style>
</style>

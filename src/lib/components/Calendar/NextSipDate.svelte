<script lang="ts">
	import CalendarIcon from '$lib/images/icons/CalendarIcon.svelte';

	export let calendarDate: number;
	export let calendarMonth: string;
	export let calendarYear: number;
</script>

<section class="flex items-center justify-start border-y bg-grey px-4 py-1 text-xs">
	<CalendarIcon />
	<p class="ml-3">
		<span class="font-medium text-grey-body"> First SIP payment will be on </span>
		<span class="font-medium text-black-title">
			{calendarDate}
			{calendarMonth}
			{calendarYear}
		</span>
	</p>
</section>

<script lang="ts">
	import CalendarIcon from '$lib/images/icons/CalendarIcon.svelte';

	export let calendarDate: number;
	export let calendarMonth: string;
	export let calendarYear: number;
</script>

<section class="flex items-center justify-start border-y bg-background px-4 py-1 text-xs">
	<CalendarIcon />
	<p class="ml-3">
		<slot name="content">
			<span class="font-normal text-body">First SIP payment will be on</span>
		</slot>
		<span class="font-normal text-title">
			{calendarDate}
			{calendarMonth}
			{calendarYear}
		</span>
	</p>
</section>

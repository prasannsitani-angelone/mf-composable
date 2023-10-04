<script lang="ts">
	import WMSIcon from '$lib/components/WMSIcon.svelte';
</script>

<section
	class="z-[70] flex flex-col justify-center rounded-lg !bg-yellow-primary !bg-opacity-30 text-black-title shadow-csm"
>
	<div class="px-6 pt-6">
		<div class="pb-2 text-2xl font-normal">Switch Funds</div>
		<div class="pb-4 text-sm">
			Switch helps you transfer your investment (partial or full) to another mutual fund from the
			same AMC
		</div>
		<div class="ml-4 text-sm">
			<ul style="list-style-type:disc">
				<li class="pb-2">
					<b>Step 1: </b>Select Switch In fund. Your investment will be <b>transferred to</b> this mutual
					fund
				</li>
				<li class="pb-2">
					<b>Step 2: </b>Enter the amount to switch
				</li>
				<li>
					<b>Step 3: </b>Authorise your order with OTP
				</li>
			</ul>
		</div>
	</div>
	<div>
		<WMSIcon width={320} height={208} name="switch-prompt" />
	</div>
</section>

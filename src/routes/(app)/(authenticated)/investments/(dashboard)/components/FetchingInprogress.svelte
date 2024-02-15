<script lang="ts">
	import Folder from '$lib/images/Folder.svg';
</script>

<section class="rounded-lg bg-background-alt px-4 py-6 text-center max-sm:shadow-csm sm:py-7">
	<div class="m-auto max-w-[500px] text-center">
		<img
			src={Folder}
			class="inline-block"
			loading="lazy"
			alt="Illustration shoeing first time import"
		/>
		<div class="mb-3 mt-5 text-base font-normal text-title">Fetching Your Investments...</div>

		<ul
			class="list-disc rounded bg-background p-3 pl-7 text-left text-sm font-normal leading-[18px] text-body"
		>
			<li class="mb-1">Fetching information about your investments can take some time.</li>
			<li>We will notify you once your portfolio has been updated.</li>
		</ul>
	</div>
</section>

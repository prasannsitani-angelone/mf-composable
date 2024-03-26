<article class="mt-2 max-w-4xl rounded-lg bg-background-alt text-sm shadow-csm sm:pb-4">
	<header>
		<section class="flex cursor-pointer justify-between p-4 !pb-0 pt-3 text-lg">
			<section class=" w-full items-center">
				<h2 class="flex items-start text-left text-base font-medium text-title">
					<slot name="left" />
					<slot name="heading" />
					<slot name="right" />
				</h2>
			</section>
		</section>
	</header>
	<section class="mt-2 w-full overflow-x-auto rounded-lg bg-background-alt px-4 md:px-6">
		<slot name="content" />
	</section>
</article>

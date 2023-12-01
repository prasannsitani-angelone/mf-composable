<article class="mt-4 max-w-4xl rounded-lg bg-white text-sm shadow-csm sm:pb-4">
	<header>
		<section class="flex cursor-pointer justify-between p-4 !pb-0 pt-3 text-lg md:px-6 md:py-5">
			<section class=" w-full items-center">
				<h2 class="flex items-center text-left text-lg font-medium text-black-title">
					<slot name="left" />
					<slot name="heading" />
					<slot name="right" />
				</h2>
			</section>
		</section>
	</header>
	<section class="mt-3 w-full overflow-x-auto rounded-lg bg-white px-4 md:px-6">
		<slot name="content" />
	</section>
</article>

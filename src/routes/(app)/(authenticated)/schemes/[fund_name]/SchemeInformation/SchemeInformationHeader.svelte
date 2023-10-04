<script>
	import Button from '$components/Button.svelte';
	import SchemeInformationIcon from '$lib/images/icons/SchemeInformationIcon.svelte';
	import SchemeInformationModal from './SchemeInformationModal.svelte';

	$: isModalOpen = false;

	const toggleSchemeIformationModal = () => {
		isModalOpen = isModalOpen ? false : true;
	};
</script>

<header
	class="flex cursor-pointer items-center justify-between p-4 text-lg hover:text-blue-800 md:px-6 md:py-5"
>
	<div class="flex items-center">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-grey">
			<SchemeInformationIcon />
		</div>
		<h2 class="ml-3 flex items-center text-left font-medium text-black-title">
			<span class="mr-2">Basic Information</span>

			<Button
				class="w-[22px] rounded-full !border-grey-line !p-0 !lowercase"
				variant="outlined"
				size="xs"
				onClick={toggleSchemeIformationModal}>i</Button
			>
		</h2>
	</div>
</header>
<SchemeInformationModal {isModalOpen} {toggleSchemeIformationModal} />

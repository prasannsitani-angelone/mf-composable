<script lang="ts">
	export let heading = 'Enter';
	export let type = 'text';
	export let id: string;
	export let placeholder = '';
	export let maxLength = 40;
	export let pattern = /.*/;
	export let autocomplete = 'off';
	export let classes = {
		label: '',
		input: '',
		error: 'border-red-500',
		container: '',
		parent: ''
	};
	export let value: string;
	export let error = false;
	export let filterChar = (event: InputEvent) => undefined;
	export let onChange: (data: string) => void = () => undefined;
	export let onSubmit = () => undefined;
	export let onClick = () => undefined;

	const onInput = (event: InputEvent) => {
		filterChar(event);
		onChange(event.target.value);
	};

	const handleEnter = (event) => {
		if (event.keyCode === '13') {
			onSubmit();
		}
	};
</script>

<div class={classes.parent}>
	<div
		class={`flex w-full flex-row rounded border-2 border-grey-line px-4 py-3 shadow-csm focus-within:border-blue-primary ${
			classes.container
		} ${!pattern.test(value.toString()) || error ? classes.error : ''}`}
	>
		<slot name="preinput" />
		<div class="flex w-full flex-col justify-center">
			<label class={`mb-0.5 text-sm font-medium text-black-title ${classes.label}`} for={id}
				>{heading}
			</label>
			<input
				{id}
				{value}
				{autocomplete}
				{placeholder}
				{type}
				maxlength={maxLength}
				class={`w-full border-0 text-center text-base font-medium text-black-title outline-none outline ${classes.input}`}
				on:input={onInput}
				on:keyup={handleEnter}
				on:click={onClick}
			/>
		</div>
		<slot name="posticon" />
	</div>
	{#if error}
		<slot name="error" />
	{/if}
</div>

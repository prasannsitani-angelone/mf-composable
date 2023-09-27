<script lang="ts">
	export let owner: 'angel' | 'user';

	const handleChoiceClick = (e) => {
		console.log(e?.target?.textContent);
	};
</script>

<section
	class="mt-1 w-[84%] rounded-lg p-2 text-sm font-normal
    {owner === 'user'
		? 'rounded-br-none bg-blue-primary text-white'
		: 'rounded-bl-none bg-purple-background text-black-title'}
    {$$props?.class}"
>
	<slot name="messageData" />
</section>

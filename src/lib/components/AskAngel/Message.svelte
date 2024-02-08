<script lang="ts">
	export let owner: 'angel' | 'user';
</script>

<section
	class="mt-1 w-[84%] rounded-lg p-2 text-sm font-normal
    {owner === 'user'
		? 'rounded-br-none bg-primary text-background-alt'
		: 'rounded-bl-none bg-tint12-primary text-title'}
    {$$props?.class}"
>
	<slot name="messageData" />
</section>

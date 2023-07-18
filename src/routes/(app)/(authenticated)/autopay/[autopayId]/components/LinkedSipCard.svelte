<script lang="ts">
	import RightArrowDarkIcon from "$lib/images/icons/RightArrowDarkIcon.svelte";

  export let name = '';
  export let subtext = '';
  export let logoUrl = '';
</script>

<section class="{$$props.class}">
	<article class="flex items-center">
    <slot name="leftSection">
      <section class="flex items-center justify-between">
        <div class="flex-1 border border-grey rounded-full">
          <img src={logoUrl} alt="logo" class="h-9 w-9" />
        </div>

        <article class="flex flex-col items-start ml-2">
          <div class="w-52 text-sm font-medium">
            {name}
          </div>
          <div class="mt-1 text-xs font-medium text-grey-body">
            {subtext}
          </div>
        </article>
      </section>
    </slot>

    <slot name="rightSection">
      <RightArrowDarkIcon class="ml-auto mr-3" />
    </slot>
  </article>
</section>

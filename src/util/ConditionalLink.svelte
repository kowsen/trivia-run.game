<script lang="ts">
  import { Link } from "svelte-routing";

  export let to: string;
  export let enabled: boolean;
</script>

{#if enabled}
  <Link {to}>
    <slot />
  </Link>
{:else}
  <slot />
{/if}

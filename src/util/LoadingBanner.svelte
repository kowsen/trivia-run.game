<script>
  import { onDestroy, onMount } from "svelte";
  import Spinner from "./Spinner.svelte";

  onMount(() => {
    document.body.classList.add("force-disable-scroll");
  });

  onDestroy(() => {
    document.body.classList.remove("force-disable-scroll");
  });
</script>

<div class="loading-banner-curtain">
  <div class="loading-banner">
    <Spinner />
  </div>
</div>

<style>
  .loading-banner-curtain {
    position: absolute;
    z-index: 100001;
    display: flex;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100% * 1 / var(--scale));
    background-color: rgba(0, 0, 0, 0.5);
  }

  .loading-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto 32px;
    width: 100%;
    height: 64px;
    background-color: #666;
  }
</style>

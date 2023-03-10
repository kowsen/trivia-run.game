<script lang="ts">
  import { Link } from "svelte-routing";
  import { derived } from "svelte/store";
  import { gameLoaded, token } from "./client";

  export let onlyShowRanking: boolean;

  const gameLink = derived(token, (token) => `/game?team=${token}`);
  const bonusLink = derived(token, (token) => `/bonus?team=${token}`);
  const rankingLink = derived(token, (token) => `/ranking?team=${token}`);
  
</script>

<nav>
  {#if !onlyShowRanking}
  <Link to={$gameLink} class="nav-item">
    <div class="nav-item-content">Challenge</div>
  </Link>

  <Link to={$bonusLink} class="nav-item">
    <div class="nav-item-content">Bonus</div>
  </Link>

  <Link to={$rankingLink} class="nav-item ">
    <div class="nav-item-content">Ranking</div>
  </Link>
  {:else}
  

  <div class="nav-item nav-item-item-forced">
    <div class="nav-item-content">Ranking</div>
  </div>
  {/if}
</nav>

<style lang="scss">
  @import "./styles/constants";

  nav {
    display: flex;
    background-color: $dark-background-color;
    user-select: none;
    margin: 18px 0;
    width: 100%;
    margin-bottom: 28px;
  }

  .nav-item-content {
    display: flex;
    text-align: center;
    height: 28px;
    align-items: center;
    justify-content: center;
  }

  :global(.nav-item) {
    position: relative;
    z-index: 0;
    text-decoration: none;
    font-weight: normal;
    flex: 1;
  }

  :global(.nav-item:focus) {
    z-index: 1;
  }

  .nav-item-content:hover,
  :global(.nav-item:focus .nav-item-content),
  :global(.nav-item[aria-current="page"] .nav-item-content),
  .nav-item-item-forced {
    background-color: $darker-background-color;
  }
</style>

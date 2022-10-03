<script lang="ts">
  import "./styles/global.scss";
  import "./styles/scale.scss";
  import "./styles/scroll.scss";

  import { Router, Route } from "svelte-routing";

  import Home from "./Home.svelte";
  import { client, gameLoaded, token } from "./client";
  import Game from "./Game.svelte";
  import Dialog from "./Dialog.svelte";
  import Logo from "./Logo.svelte";
  import Nav from "./Nav.svelte";
  import Spinner from "./util/Spinner.svelte";
  import LoadingBanner from "./util/LoadingBanner.svelte";
  import { derived } from "svelte/store";
  import BonusList from "./BonusList.svelte";
  import Ranking from "./Ranking.svelte";
  import Bonus from "./Bonus.svelte";

  export let url;

  new ResizeObserver(([event]) => {
    document.documentElement.style.setProperty(
      "--page-width",
      `${event.contentRect.width}`
    );
  }).observe(document.documentElement);

  const isLoading = derived(
    [client.connected, token, gameLoaded],
    ([connected, token, gameLoaded]) => {
      if (!connected) {
        return true;
      }

      if (token && !gameLoaded) {
        return true;
      }

      return false;
    }
  );
</script>

{#if $isLoading}
  <LoadingBanner />
{:else}
  <div class="content">
    <Router {url}>
      <Logo />

      {#if $gameLoaded}
        <Nav />
        <Dialog />
      {/if}

      <main>
        <Route path="/" component={Home} />

        <Route path="/game" component={Game} />
        <Route path="/bonus" component={BonusList} />
        <Route path="/bonus/:index" let:params>
          <Bonus index={parseInt(params.index)} />
        </Route>
        <Route path="/ranking" component={Ranking} />

        <Route>
          <p>PAGE NOT FOUND</p>
        </Route>
      </main>
    </Router>
  </div>
{/if}

<style>
  .content {
    padding: 24px;
  }
</style>

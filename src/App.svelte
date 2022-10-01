<script lang="ts">
  import "./styles/global.scss";

  import { Router, Route } from "svelte-routing";

  import Home from "./Home.svelte";
  import { client, trySetTeamToken } from "./client";
  import Game from "./Game.svelte";

  export let url;

  $: connected = client.connected;

  trySetTeamToken();
</script>

{#if $connected}
  <div class="content">
    <Router {url}>
      <main>
        <Route path="/" component={Home} />

        <Route path="/game" component={Game} />

        <Route>
          <p>PAGE NOT FOUND</p>
        </Route>
      </main>
    </Router>
  </div>
{:else}
  <p>Connecting...</p>
{/if}

<style>
  .content {
    padding: 24px;
  }
</style>

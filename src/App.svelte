<script lang="ts">
  import "./styles/global.scss";

  import { Router, Route } from "svelte-routing";

  import Home from "./Home.svelte";
  import { client } from "./client";

  export let url;

  $: connected = client.connected;
</script>

{#if $connected}
  <div class="content">
    <Router {url}>
      <main>
        <Route path="/" component={Home} />

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

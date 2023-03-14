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
  import { compute_rest_props } from "svelte/internal";
  import Cookies from "js-cookie";

  export let url;

  new ResizeObserver(([event]) => {
    document.documentElement.style.setProperty(
      "--page-width",
      `${event.contentRect.width}`
    );
  }).observe(document.documentElement);

  export const DEFAULT_GAME_SETTINGS = {
    _id: "MAIN",
    state: "notActive",
    refreshToken: "A",
  };

  let isSetup = false;
  const result = derived(
    [client, client.connected, token, gameLoaded],
    ([{ gameSettings }, connected, token, gameLoaded]) => {
      if (!connected || (token && !gameLoaded)){ 
        return {
          isLoading: true, 
          gameSettings: DEFAULT_GAME_SETTINGS,
        };}

      const mainGameSettings = gameSettings?.entities[DEFAULT_GAME_SETTINGS._id];
      
      if (!isSetup) {
        if (!!mainGameSettings){
          Cookies.set("session-refresh", mainGameSettings.refreshToken, {
            secure: true,
            expires: 365,
            path: "/",
            sameSite: "Lax",
          });
          isSetup = true;
        }
      } else {
        const currentCookie = Cookies.get("session-refresh") || DEFAULT_GAME_SETTINGS.refreshToken;
        if (currentCookie !== mainGameSettings.refreshToken){
          location.reload(); 
        }
      }

      return {
        isLoading: false, 
        gameSettings: mainGameSettings};
    }
  );

</script>

{#if $result.isLoading}
  <LoadingBanner />
{:else}
  {#if $result.gameSettings?.state === "notActive"}
  <div class="content">Cool stuff coming soon</div>
  {:else if $result.gameSettings?.state === "completed"}
  <div class="content">
    <Router {url}>
      <Logo />
      <div class="description">
        <h3>Thank you for taking part in this Elegant Skeleton Public Aptitude Study</h3>
        <div class="question-text-container">
          We appreciate your contributions to the field of collective neurocapability. We anticipate that the results from this study will provide ample opportunity for future expansion and research.
        <p/>
        The Elegant Skeleton Research Institute cordially invites willing participants to provide any feedback either via <a class="blue" target="_blank" href="https://discord.gg/g5Yhybq6G9">Discord</a>, <a  class="blue" target="_blank" href="mailto:elegantskeleton@outlook.com">email (elegantskeleton@outlook.com)</a>, or the <a  class="feedback" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfbULS0ansRvAoukMHpgs0Wdv3kFTYzkE4ybdzkPBF56g7HqA/viewform">feedback form</a>.
        </div>
      </div>
      <Nav onlyShowRanking={true}/>
      <Dialog />
      <main>
        <Route component={Ranking} />
      </main>
    </Router>
  </div>
  {:else}
  <div class="content">
    <Router {url}>
      <Logo />
      {#if $gameLoaded}
        <Nav onlyShowRanking={false}/>
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
{/if}

<style lang="scss">
  @import './styles/constants';
  .content {
    padding: 24px;
  }
  .description {
    text-align: center;
  }
  .blue {
    color:$dark-accent-color;
  }
  .feedback {
    color: #b28f3c;
  }
</style>

<script lang="ts">
  import { Link } from "svelte-routing";
  import { onMount } from "svelte";
  import { client, team } from "./client";
  import { getRanking, type GameRankingTeam } from "./socket/trivia/game_rpcs";

  const TEAMS_PER_PAGE = 10;

  let isLoading = true;

  let teams: GameRankingTeam[] = [];

  let pageIndex: number = 0;
  $: displayPageIndex = pageIndex + 1;

  $: teamPage = teams.slice(
    pageIndex * TEAMS_PER_PAGE,
    (pageIndex + 1) * TEAMS_PER_PAGE
  );

  $: maxPageIndex = Math.floor(teams.length / TEAMS_PER_PAGE);

  $: showControls = maxPageIndex > 0;

  function firstPage() {
    pageIndex = 0;
  }

  function previousPage() {
    pageIndex -= 1;
  }

  function nextPage() {
    pageIndex += 1;
  }

  function lastPage() {
    pageIndex = maxPageIndex;
  }

  onMount(async () => {
    const response = await client.call(getRanking, { teamId: $team._id });
    console.log(response);
    teams = response.ranking;
    isLoading = false;
  });
</script>

{#each teamPage as team}
  <p class:is-you={team.isYou} class:finished={team.isWinner}>
    {team.isYou ? "-- " : ""}{team.name}{team.isYou ? " --" : ""}
  </p>
{/each}

{#if showControls}
  <div class="controls">
    <span
      class="page-control"
      tabindex={pageIndex === 0 ? -1 : 0}
      on:click={firstPage}
      class:disabled={pageIndex === 0}>&lt;&lt;</span
    >
    <span
      class="page-control"
      tabindex={pageIndex === 0 ? -1 : 0}
      on:click={previousPage}
      class:disabled={pageIndex === 0}>&lt;</span
    >
    <span class="current-page">{displayPageIndex}</span>
    <span
      class="page-control"
      tabindex={pageIndex === maxPageIndex ? -1 : 0}
      on:click={nextPage}
      class:disabled={pageIndex === maxPageIndex}>&gt;</span
    >
    <span
      class="page-control"
      tabindex={pageIndex === maxPageIndex ? -1 : 0}
      on:click={lastPage}
      class:disabled={pageIndex === maxPageIndex}>&gt;&gt;</span
    >
  </div>
{/if}

<style lang="scss">
  @import "./styles/constants";

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .current-page {
    margin: 0 8px;
    font-size: 28px;
  }

  span {
    margin: 0 8px;
  }

  .is-you {
    font-weight: bolder;
    font-style: italic;
  }

  p {
    background-color: $dark-background-color;
    margin: 8px 0;
    padding: 8px;
  }

  span,
  p {
    font-size: 20px;
  }

  .finished {
    background-color: #027944;
  }

  .page-control {
    text-decoration: underline;
    cursor: pointer;

    &.disabled {
      pointer-events: none;
      text-decoration: none;
      cursor: none;
    }
  }
</style>

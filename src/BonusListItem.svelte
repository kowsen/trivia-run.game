<script lang="ts">
  import { onDestroy } from "svelte";
  import { Link } from "svelte-routing";
  import Countdown from "./Countdown.svelte";
  import type { GameQuestion, GameTeam } from "./socket/trivia/game_state";
  import ConditionalLink from "./util/ConditionalLink.svelte";

  export let team: GameTeam;
  export let question: GameQuestion;
  export let token: string;

  let isLocked: boolean;
  let timerStr: string;

  $: isSolvedByYou = team.completedBonusQuestions.includes(question._id);
</script>

<Countdown unlockTime={question.unlockTime} bind:isLocked bind:timerStr />

<ConditionalLink
  enabled={!isLocked}
  to={`/bonus/${question.bonusIndex}?team=${token}`}
>
  <div class="bonus" class:solved={isSolvedByYou}>
    <div class="bonus-index-group">
      {#if question.bonusIndex == 1}
        <h3 class="bonus-index short-number">{question.bonusIndex}</h3>
      {:else}
        <h3 class="bonus-index">{question.bonusIndex}</h3>
      {/if}
      <h3>.</h3>
    </div>

    <div class="bonus-text-container">
      <div class="bonus-text-line">
        {#if isLocked}
          <p class="bonus-text">????????</p>
          <p class="bonus-countdown">Unlocks in {timerStr}</p>
        {:else}
          <p class="bonus-text">
            {question.title ?? `Bonus ${question.bonusIndex}`}
          </p>
        {/if}
      </div>
      {#if question.bonusWinner}
        <p class="solver-text">
          <span class="solver-header">First solved by:</span>
          <span class="accent-color">{question.bonusWinner}</span>
        </p>
      {/if}
    </div>
  </div>
</ConditionalLink>

<style lang="scss">
  @import "./styles/constants";

  .bonus-text-container {
    width: 100%;
  }

  .bonus-text-line {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .bonus-countdown {
    margin-left: auto;
    font-size: 16px;
    color: $light-text-color;
    font-style: italic;
    margin-right: 12px;
  }

  .bonus {
    user-select: none;
    width: 100%;
    box-sizing: border-box;
    font-size: 24px;
    padding: 12px;
    background-color: $dark-background-color;
    align-items: center;
    display: grid;
    grid-template-columns: 2.5em 1fr;
  }

  .bonus-text,
  .solver-text {
    margin: 0;
  }
  .bonus-index-group {
    margin-right: 20px;
    display: flex;
  }
  .bonus-index {
    text-align: right;
    flex-grow: 1;
    margin-right: 2px;
    &.short-number {
      // hack to make number 1 look a bit wider
      padding-right: 4px;
      transform: scaleX(1.3);
    }
  }

  h3,
  p {
    margin: 0;
  }

  :global(.bonus-container a) {
    text-decoration: none;
    font-weight: normal;
    width: 100%;
  }

  :global(a .bonus:hover),
  :global(.bonus-link:focus .bonus) {
    background-color: $darker-background-color;
  }

  .solved {
    background-color: #027944;
  }

  .solver-text {
    font-size: 16px;
    margin-top: 12px;
    margin-left: 16px;
  }

  .solver-header {
    color: $light-text-color;
    font-style: italic;
  }
</style>

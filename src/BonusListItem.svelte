<script lang="ts">
  import { onDestroy } from "svelte";
  import { Link } from "svelte-routing";
  import type { GameQuestion, GameTeam } from "./socket/trivia/game_state";
  import ConditionalLink from "./util/ConditionalLink.svelte";

  export let team: GameTeam;
  export let question: GameQuestion;
  export let token: string;

  function getTimeLeft() {
    return question.unlockTime
      ? new Date(question.unlockTime).getTime() - Date.now()
      : 0;
  }

  let minutesLeft = 0;

  function updateMinutesLeft() {
    minutesLeft = Math.ceil(getTimeLeft() / 60000);
  }

  let refreshTimeout: ReturnType<typeof setTimeout>;

  $: hoursLeft = `${Math.floor(minutesLeft / 60)}`.padStart(2, "0");
  $: minutesRemainder = `${minutesLeft % 60}`.padStart(2, "0");

  $: timerStr = `${hoursLeft}:${minutesRemainder}`;

  function countdown() {
    updateMinutesLeft();
    if (minutesLeft > 0) {
      refreshTimeout = setTimeout(() => {
        countdown();
      }, 2500);
    }
  }

  if (getTimeLeft() > 0) {
    countdown();
  }

  onDestroy(() => {
    clearTimeout(refreshTimeout);
  });

  $: isSolvedByYou = team.completedBonusQuestions.includes(question._id);
</script>

<ConditionalLink
  enabled={!minutesLeft}
  to={`/bonus/${question.bonusIndex}?team=${token}`}
>
  <div class="bonus" class:solved={isSolvedByYou}>
    <h3 class="bonus-index">{question.bonusIndex}.</h3>
    <div class="bonus-text-container">
      <div class="bonus-text-line">
        {#if minutesLeft}
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
    display: flex;
    font-size: 24px;
    padding: 12px;
    background-color: $dark-background-color;
    align-items: center;
  }

  .bonus-text,
  .solver-text {
    margin: 0;
  }

  .bonus-index {
    margin: 0 24px 0 12px;
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

<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { client, currentMainQuestion, team, gameLoaded } from "./client";
  import Countdown from "./Countdown.svelte";
  import { IS_ENDING } from "./ending";
  import EndOfDay from "./EndOfDay.svelte";
  import EndOfGame from "./EndOfGame.svelte";
  import GuessFeed from "./GuessFeed.svelte";
  import GuessField from "./GuessField.svelte";
  import Question from "./Question.svelte";
  import { createTeam, guess } from "./socket/trivia/game_rpcs";
  import type { GameGuess } from "./socket/trivia/game_state";
  import { buildEnterHandler } from "./util";

  let isLocked = false;
  let timerStr = "";

  const guessFilter = (guess: GameGuess) =>
    !($client.questions.entities[guess.questionId]?.bonusIndex > -1);

  $: question = $currentMainQuestion;
</script>

<Countdown unlockTime={question.unlockTime} bind:isLocked bind:timerStr />

<div class="game">
  {#if isLocked}
    {#if IS_ENDING}
      <EndOfGame />
    {:else}
      <EndOfDay {timerStr} />
    {/if}
  {:else}
    <Question {question} team={$team} />
    <GuessField {question} team={$team} />
    <GuessFeed {question} {guessFilter} />
  {/if}
</div>

<style>
  .game {
    display: flex;
    flex-direction: column;
  }
</style>

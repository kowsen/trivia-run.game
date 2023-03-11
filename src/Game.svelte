<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { client, currentMainQuestion, team, gameLoaded } from "./client";
  import Countdown from "./Countdown.svelte";
  import EndOfDay from "./EndOfDay.svelte";
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

<h4><span style="color:#ccc">Participants should remember to save their unique URL to retain access to their team. Share this URL to add new team members</span></h4>
<div class="game">
  {#if isLocked}
    <EndOfDay {timerStr} />
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

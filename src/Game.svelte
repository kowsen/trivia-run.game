<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import {
    client,
    currentMainQuestion,
    team,
    gameLoaded,
    currentMainQuestionGuesses,
    trySetTeamToken,
  } from "./client";
  import GuessFeed from "./GuessFeed.svelte";
  import GuessField from "./GuessField.svelte";
  import Question from "./Question.svelte";
  import { createTeam, guess } from "./socket/trivia/game_rpcs";
  import type { GameGuess } from "./socket/trivia/game_state";
  import { buildEnterHandler } from "./util";

  const STATIC_URL = import.meta.env.VITE_STATIC;

  trySetTeamToken();

  const guessFilter = (guess: GameGuess) =>
    !($client.questions.entities[guess.questionId]?.bonusIndex > -1);

  $: question = $currentMainQuestion;
</script>

<div class="game">
  {#if $gameLoaded}
    <Question {question} />
    <GuessField {question} team={$team} />
    <GuessFeed {guessFilter} />
  {/if}
</div>

<style>
  .game {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
</style>

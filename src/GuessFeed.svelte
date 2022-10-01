<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { derived } from "svelte/store";
  import {
    client,
    currentMainQuestion,
    team,
    gameLoaded,
    currentMainQuestionGuesses,
    trySetTeamToken,
  } from "./client";
  import { createTeam, guess } from "./socket/trivia/game_rpcs";
  import type { GameGuess } from "./socket/trivia/game_state";
  import { buildEnterHandler } from "./util";

  const MAX_GUESSES_TO_SHOW = 5;

  export let guessFilter: (guess: GameGuess) => boolean;

  function baseGuessFilter(guess: GameGuess) {
    return !guess._deleted;
  }

  $: guesses = Object.values($client.guesses.entities)
    .filter(guessFilter)
    .filter(baseGuessFilter)
    .sort((a, b) => b._modified - a._modified)
    .slice(0, MAX_GUESSES_TO_SHOW);
</script>

<div class="guess-feed">
  {#each guesses as guess}
    <p class="guess" class:correct={guess.isCorrect}>{guess.text}</p>
  {/each}
</div>

<style>
  .guess-feed {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .guess {
    font-size: 16px;
  }

  .correct {
    color: green;
  }
</style>

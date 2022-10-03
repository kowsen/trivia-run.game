<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { derived } from "svelte/store";
  import { client } from "./client";
  import Question from "./Question.svelte";
  import { createTeam, guess } from "./socket/trivia/game_rpcs";
  import type { GameGuess, GameQuestion } from "./socket/trivia/game_state";
  import { buildEnterHandler } from "./util";

  const MAX_GUESSES_TO_SHOW = 5;

  export let question: GameQuestion;
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

{#if !question.hideAnswer && guesses.length > 0}
  <hr class="log-divider" />
  <h3 class="guess-header">Guess Log:</h3>
  {#each guesses as guess (guess)}
    <div class="guess-container">
      <p class="guess" class:correct={guess.isCorrect}>
        {guess.text}
      </p>
    </div>
  {/each}
{/if}

<style lang="scss">
  .log-divider {
    margin: 24px 0;
  }

  h3 {
    margin: 0;
    font-size: 20px;
  }

  p {
    margin: 0;
    font-size: 20px;
  }

  .correct {
    font-weight: bolder;
    // font-style: italic;
    color: #01ff70;
  }

  .guess {
    // margin-left: 8px;
    margin: 4px 0 4px 8px;
  }

  .guess-header {
    margin: 8px 0;
  }

  .guess-container {
    display: flex;
    align-items: center;
  }
</style>

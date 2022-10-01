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
  import { createTeam, guess } from "./socket/trivia/game_rpcs";

  const STATIC_URL = import.meta.env.VITE_STATIC;

  trySetTeamToken();

  let guessText: string = "";
  let isGuessDisabled = false;

  function onInputKeydown(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      sendGuess();
    }
  }

  async function sendGuess() {
    isGuessDisabled = true;
    await client.call(guess, {
      text: guessText,
      teamId: $team._id,
      questionId: $currentMainQuestion._id,
    });
    isGuessDisabled = false;
    guessText = "";
  }
</script>

<div class="main-links">
  {#if $gameLoaded}
    <p>
      {$currentMainQuestion.title ??
        `Level ${$currentMainQuestion.mainIndex + 1}`}
    </p>
    {#if $currentMainQuestion.text}
      <p>{$currentMainQuestion.text}</p>
    {/if}
    {#if $currentMainQuestion.image}
      <img src={`${STATIC_URL}/${$currentMainQuestion.image}`} alt="img" />
    {/if}
    {#if !$currentMainQuestion.hideAnswer}
      <input
        type="text"
        bind:value={guessText}
        maxlength={32}
        on:keydown={onInputKeydown}
      /><button disabled={isGuessDisabled} on:click={sendGuess}>Submit</button>
    {/if}
    <div>
      {#each $currentMainQuestionGuesses as guess}
        <p class="guess" class:correct={guess.isCorrect}>{guess.text}</p>
      {/each}
    </div>
  {/if}
</div>

<style>
  .main-links {
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-size: 32px;
  }

  .guess {
    font-size: 16px;
  }

  .correct {
    color: green;
  }
</style>

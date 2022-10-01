<script lang="ts">
  import { client } from "./client";
  import { guess } from "./socket/trivia/game_rpcs";
  import type {
    GameGuess,
    GameQuestion,
    GameTeam,
  } from "./socket/trivia/game_state";
  import { buildEnterHandler } from "./util";

  export let question: GameQuestion;
  export let team: GameTeam;

  let guessText: string = "";
  let isGuessDisabled = false;

  const onGuessKeydown = buildEnterHandler(sendGuess);

  async function sendGuess() {
    isGuessDisabled = true;
    await client.call(guess, {
      text: guessText,
      teamId: team._id,
      questionId: question._id,
    });
    isGuessDisabled = false;
    guessText = "";
  }
</script>

<div class="guess-field">
  {#if !question.hideAnswer}
    <input
      type="text"
      bind:value={guessText}
      maxlength={32}
      on:keydown={onGuessKeydown}
    /><button disabled={isGuessDisabled} on:click={sendGuess}>Submit</button>
  {/if}
</div>

<style>
  .guess-field {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>

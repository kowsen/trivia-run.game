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
  let isLoading = false;

  const onGuessKeydown = buildEnterHandler(sendGuess);

  async function sendGuess() {
    isLoading = true;
    await client.call(guess, {
      text: guessText,
      teamId: team._id,
      questionId: question.bonusIndex !== undefined ? question._id : undefined,
    });
    isLoading = false;
    guessText = "";
  }

  $: placeholderText = isLoading ? "..." : "Answer";

  $: hideAnswer =
    question.hideAnswer || team.completedBonusQuestions.includes(question._id);
</script>

{#if !hideAnswer}
  <div class="input-area">
    <input
      disabled={isLoading}
      type="text"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      maxlength="64"
      placeholder={placeholderText}
      bind:value={guessText}
      on:keyup={onGuessKeydown}
    />
  </div>
{/if}

<style lang="scss">
  @import "./styles/constants";

  .input-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    margin-top: 16px;
  }

  input {
    width: 90%;
    margin: 12px 0;
    padding: 8px;
    font-size: 28px;
    box-sizing: border-box;
  }
</style>

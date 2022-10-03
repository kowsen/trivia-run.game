<script lang="ts">
  import { client } from "./client";
  import EndOfDay from "./EndOfDay.svelte";
  import Frame from "./Frame.svelte";
  import { guess } from "./socket/trivia/game_rpcs";
  import type {
    GameGuess,
    GameQuestion,
    GameTeam,
  } from "./socket/trivia/game_state";
  import { buildEnterHandler } from "./util";

  const STATIC_URL = import.meta.env.VITE_STATIC;

  export let question: GameQuestion;
  export let team: GameTeam;

  let frame: Frame;

  async function onFrameGuess(text: string) {
    const { isCorrect } = await client.call(guess, {
      text,
      teamId: team._id,
      questionId: question.bonusIndex !== undefined ? question._id : undefined,
    });
    if (frame) {
      frame.notifySent(isCorrect);
    }
  }

  $: title =
    question.title ??
    (question.mainIndex > -1 ? `Level ${question.mainIndex + 1}` : null) ??
    (question.bonusIndex > -1 ? `Bonus ${question.bonusIndex + 1}` : null) ??
    "Question";

  $: splitQuestionText = question.text?.split("|");

  $: imagePath = question.image ? `${STATIC_URL}/${question.image}` : undefined;

  $: framePath = question.frame
    ? `${STATIC_URL}/${question.frame}/index.html`
    : undefined;
</script>

<div class="question-container" class:full-height={question.hideAnswer}>
  <div class="title">
    <h3>{title}</h3>
  </div>

  {#if framePath}
    <Frame
      path={framePath}
      bigFrame={!!question.hideAnswer}
      on:guess={(event) => onFrameGuess(event.detail.text)}
      bind:this={frame}
    />
  {/if}

  {#if imagePath}
    <div class="img-container">
      <img class:extra-pad={!question.text} src={imagePath} alt="Question" />
    </div>
  {/if}

  {#if splitQuestionText}
    <div class="question-text-container">
      {#each splitQuestionText as questionChunk}
        <p class="question-text">{questionChunk}</p>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @import "./styles/constants";

  :global(.give-up-button-link) {
    text-decoration: none;
  }

  h3 {
    font-size: 28px;
    margin: 0;
  }

  .question-text {
    margin: 0;
    font-size: 24px;
  }

  .question-text-container {
    margin: 12px 0;
  }

  .question-text:not(:first-child) {
    margin-top: 28px;
    font-size: 20px;
  }

  p {
    font-size: 20px;
  }

  img {
    margin-top: 16px;
    max-width: 100%;
  }

  .img-container {
    display: flex;
    justify-content: center;
  }

  .extra-pad {
    margin-bottom: 16px;
  }

  .full-height {
    height: 100%;
  }

  .title {
    display: flex;
    align-items: center;
    padding-top: 12px;
  }
</style>

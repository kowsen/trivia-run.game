<script lang="ts">
  import type { GameGuess, GameQuestion } from "./socket/trivia/game_state";
  import { buildEnterHandler } from "./util";

  const STATIC_URL = import.meta.env.VITE_STATIC;

  export let question: GameQuestion;

  $: console.log(question);

  $: title =
    question.title ??
    (question.mainIndex > -1 ? `Level ${question.mainIndex + 1}` : null) ??
    (question.bonusIndex > -1 ? `Bonus ${question.bonusIndex + 1}` : null) ??
    "Question";
</script>

<div class="question-display">
  <p>
    {title}
  </p>
  {#if question.text}
    <p>{question.text}</p>
  {/if}
  {#if question.image}
    <img src={`${STATIC_URL}/${question.image}`} alt="img" />
  {/if}
</div>

<style>
  .question-display {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 32px;
  }
</style>

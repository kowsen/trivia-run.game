<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { derived, writable } from "svelte/store";
  import { client, currentMainQuestion, team, gameLoaded } from "./client";
  import GuessFeed from "./GuessFeed.svelte";
  import GuessField from "./GuessField.svelte";
  import Question from "./Question.svelte";
  import { createTeam, guess } from "./socket/trivia/game_rpcs";
  import type { GameGuess } from "./socket/trivia/game_state";
  import { buildEnterHandler } from "./util";

  export let index: number;
  const indexStore = writable(-1);
  $: {
    indexStore.set(index);
  }

  const bonusQuestion = derived(
    [client, indexStore],
    ([{ questions }, index]) => {
      return Object.values(questions.entities).find(
        (question) => question.bonusIndex === index
      );
    }
  );

  const guessFilter = derived(bonusQuestion, (bonusQuestion) => {
    return (guess: GameGuess) => guess.questionId === bonusQuestion._id;
  });
</script>

<div class="bonus">
  <Question question={$bonusQuestion} team={$team} />
  <GuessField question={$bonusQuestion} team={$team} />
  <GuessFeed question={$bonusQuestion} guessFilter={$guessFilter} />
</div>

<style>
  .bonus {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
</style>

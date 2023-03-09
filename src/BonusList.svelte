<script lang="ts">
  import { Link } from "svelte-routing";
  import { derived } from "svelte/store";
  import BonusListItem from "./BonusListItem.svelte";
  import { client, team, token } from "./client";

  const bonusQuestions = derived(client, ({ questions }) => {
    return Object.values(questions.entities)
      .filter((question) => question.bonusIndex > -1)
      .sort((a, b) => a.bonusIndex - b.bonusIndex);
  });
</script>

<p class="description">
  Bonus Levels are supplementary challenges intended to assess participants' <span class="accent-color">spatial awareness</span>, 
  <span class="accent-color">memory</span>, and <span class="accent-color">logical problem solving</span> skills. 
  Participating teams are encouraged to <span class="accent-color">work together</span> to solve these advanced challenges.
</p>

<hr />

{#each $bonusQuestions as question (question)}
  <div class="bonus-container">
    <BonusListItem {question} team={$team} token={$token} />
  </div>
{/each}

<style lang="scss">
  @import "./styles/constants";

  .bonus-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    margin: 16px 0;
    align-items: center;
  }

  p {
    margin: 0;
  }

  .description {
    font-size: 20px;
  }

  hr {
    margin: 24px 0;
  }
</style>

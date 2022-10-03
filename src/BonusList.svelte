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
  These are <span class="accent-color">extra hard</span> bonus questions. Feel
  free to <span class="accent-color">work together</span> with other teams on them
  - they're just for bragging rights! (and you might need the help, some are pretty
  tough)
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

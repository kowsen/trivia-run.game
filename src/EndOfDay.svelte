<script lang="ts">
  import { onMount } from "svelte";
  import type { GameQuestion } from "./socket/trivia/game_state";
</script>

<h3>Outdated Client</h3>
<div class="question-text-container">
  <p class="question-text">Please refresh the page.</p>
</div>

<style lang="scss">
  @import "./styles/constants";

  h3 {
    font-size: 28px;
    margin: 0;
  }

  .question-text {
    margin: 0;
    font-size: 24px;
  }

  .question-text-container {
    margin: 16px 0;
  }

  .question-text:not(:first-child) {
    margin-top: 28px;
    font-size: 20px;
  }

  p {
    font-size: 20px;
  }
</style>

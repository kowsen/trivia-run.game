<script lang="ts">
  import type { GameQuestion } from "./socket/trivia/game_state";

  export let timerStr: string;
</script>

<h3>Well Done!</h3>
<div class="question-text-container">
  <p class="question-text">You made it to the end of the day!</p>
  <p class="question-text">
    Participants are advised to rest and refresh. Additional challenges await tomorrow.
  </p>
  <p class="countdown accent-color">{timerStr}</p>
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

  .countdown {
    width: 100%;
    font-size: 32px;
    text-align: center;
  }
</style>

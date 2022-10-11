<script>
  import Countdown from "./Countdown.svelte";
  import { END_TIME, IS_ENDING } from "./ending";

  let timerStr;
  let isLocked;

  $: endText = IS_ENDING && isLocked ? ` Ends In ${timerStr}` : "";
</script>

<div class="logo-container">
  <h1>Elegant Skeleton</h1>
  <h2>Public Aptitude Challenge{endText}</h2>
  <h4>
    <a href="https://discord.gg/g5Yhybq6G9">join the discord</a>
  </h4>

  <Countdown unlockTime={END_TIME} bind:isLocked bind:timerStr />
</div>

<style lang="scss">
  h1,
  h2 {
    text-align: center;
    margin: 0;
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 18px;
  }

  h4 {
    font-size: 15px;
    text-align: center;
    margin: 2;
  }
</style>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { upgrade } from "./client";

  export let unlockTime: number;
  export let isLocked: boolean;
  export let timerStr: string;

  function getTimeLeft() {
    return unlockTime ? unlockTime - Date.now() : 0;
  }

  function updateTimerStr() {
    const minutesLeft = Math.ceil(getTimeLeft() / 60000);
    const hoursLeft = `${Math.floor(minutesLeft / 60)}`.padStart(2, "0");
    const minutesRemainder = `${minutesLeft % 60}`.padStart(2, "0");
    timerStr = `${hoursLeft}:${minutesRemainder}`;
  }

  let refreshTimeout: ReturnType<typeof setTimeout>;

  function countdown() {
    updateTimerStr();
    if (unlockTime > Date.now()) {
      refreshTimeout = setTimeout(() => {
        countdown();
      }, 2500);
    } else {
      void upgrade();
      isLocked = false;
    }
  }

  $: {
    if (unlockTime > Date.now()) {
      clearTimeout(refreshTimeout);
      isLocked = true;
      countdown();
    } else {
      isLocked = false;
    }
  }

  onDestroy(() => {
    clearTimeout(refreshTimeout);
  });
</script>

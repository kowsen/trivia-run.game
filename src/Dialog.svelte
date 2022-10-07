<script context="module" lang="ts">
  export const textQueue: Writable<Array<string | string[]>> = writable([]);

  export function pushDialogMessages(newMessages: Array<string | string[]>) {
    textQueue.update((old) => [...old, ...newMessages]);
  }

  const INTRO_TEXT: Array<string | string[]> = [
    [
      `Thank you for taking part in the ES Public Aptitude Challenge Pilot Study...`,
      `(Please ensure you save the link to this page, failure to do so will result in permanent loss of access to this team)`,
    ],
    [
      `This challenge is intended to assess interpersonal cooperation as well as inteligence, therefore, participants should feel encouraged to seek input from others in attendance or online.`,
      `However, given current global considerations, some attendees may be uncomfortable being approached by a stranger.`, 
      `Participants should refrain from doing anything to make others uncomfortable. Previous research has shown it is possible to converse while maintaing a distance of 1.5m.`,
    ],
    [
      `Should participants' encounter or contact another person willing to take part in the challenge, they should feel free to invite new willing subjects to join a team or form their own.`,
      `Studies indicate increased competition correlates with increased enjoyment`,
      `Additionally, some questions are expected to require cooperation between teams to solve, due to the high degree of difficuty.`,
    ],
    [
      `Disclaimer: This challenge is an independent study and has no affiliation with Dr. Exoskeleton (though the Dr. has been informed).`,
      `This pilot study is also intended to assess the efficacy of current methods of administering particular challenges, and is not intended to promote any products, nor generate any profit. `,
      `Participants are encouraged to experience maximum enjoyment during the challenge...`,
    ],
  ];

  const INTRO_KEY = "intro-seen";

  export function startDialog() {
    const showIntro = localStorage ? !localStorage.getItem(INTRO_KEY) : true;
    if (showIntro) {
      textQueue.set([...INTRO_TEXT]);
    }
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { derived, writable, type Writable } from "svelte/store";

  import { fade } from "svelte/transition";

  let isVisible = localStorage ? !localStorage.getItem(INTRO_KEY) : false;

  const displayText = derived(textQueue, (text) => {
    if (text[0] instanceof Array) {
      return text[0];
    }
    if (typeof text[0] === "string") {
      return [text[0]];
    }
    return [];
  });

  $: isVisible = $textQueue.length > 0;

  $: {
    if (isVisible) {
      document.body.classList.add("force-disable-scroll");
    } else {
      document.body.classList.remove("force-disable-scroll");
    }
  }

  function nextTextStep() {
    textQueue.update((old) => {
      const newQueue = old.slice(1);
      if (newQueue.length === 0) {
        dismissDialog();
      }
      return newQueue;
    });
  }

  function dismissDialog() {
    if (localStorage) {
      isVisible = false;
      localStorage.setItem(INTRO_KEY, "done");
    }
  }

  startDialog();
</script>

<div class="dialog-root" class:ignore-input={!isVisible}>
  {#if isVisible}
    <div
      class="dialog-container"
      transition:fade
      on:click={() => nextTextStep()}
    >
      <h2>Welcome to the Organisation</h2>

      {#key $displayText}
        <div class="text-container" in:fade>
          {#each $displayText as line}
            <p class="display-text">{line}</p>
          {/each}
        </div>
      {/key}

      <p class="instructions">Tap anywhere to continue...</p>
    </div>
  {/if}
</div>

<style lang="scss">
  @import "./styles/constants";

  :global(.force-disable-scroll) {
    overflow-y: hidden !important;
  }

  .ignore-input {
    pointer-events: none;
  }

  .dialog-root {
    position: absolute;
    z-index: 100000;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100% * 1 / var(--scale));
    padding: 24px;
    box-sizing: border-box;
  }

  .dialog-container {
    width: 100%;
    height: 100%;
    background-color: $dark-background-color;
    overflow-y: auto;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  p {
    font-size: 20px;
    user-select: none;
  }

  .instructions {
    font-style: italic;
    color: $light-text-color;
    margin-left: 8px;
    margin-top: auto;
    padding-top: 24px;
  }

  h2 {
    margin-bottom: 0;
  }
</style>

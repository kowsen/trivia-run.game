<script context="module" lang="ts">
  export const textQueue: Writable<Array<string | string[]>> = writable([]);

  export function pushDialogMessages(newMessages: Array<string | string[]>) {
    textQueue.update((old) => [...old, ...newMessages]);
  }

  const INTRO_TEXT: Array<string | string[]> = [
    [
      `Just a few things I'd like to chat about before you start the trivia challenge...`,
      `(Oh, and save a link to this page really quick, if you lose it you'll lose access to your team permanently.)`,
    ],
    [
      `One of the best resources you have to answer these questions are other folks at the con, but please be mindful that in the current world situation, people may not be comfortable with you coming up to ask them a question.`,
      `Please don't do anything to make anyone else uncomfortable. It's easy to ask a question from six feet away!`,
    ],
    [
      `Also, don't be shy about using the`,
      `[[GET_HELP]]`,
      `button to invite other folks to create a team. The more competition we have, the more fun it'll be!`,
      `And you'll need plenty of teams working together if you want to solve the BONUS questions (which you should go check out)`,
    ],
    [
      `Finally, this game has no affiliation with Dr. Exoskeleton (but don't worry, they've been informed of us). It's just a game made by fans for other fans to fill our time while the Doctor's indisposed.`,
      `Oh, and have fun!`,
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
      <h2>Welcome to the Clubhouse!</h2>

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

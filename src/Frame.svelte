<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { derived, writable } from "svelte/store";
  import { navigate } from "svelte-routing";

  const dispatch = createEventDispatcher();

  export let path: string;
  export let bigFrame: boolean;

  const isFullscreen = writable(false);

  let iframeElement: HTMLIFrameElement;

  let allowFullscreenManual = false;
  $: allowFullscreen = allowFullscreenManual && !iOS();

  function iOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  }

  $: fullscreenImage = $isFullscreen
    ? "/assets/fullscreen-exit.svg"
    : "/assets/fullscreen.svg";

  function setFullscreen(val: boolean) {
    if (val === $isFullscreen) {
      return;
    }

    isFullscreen.set(val);
  }

  function onMessage({ data }: MessageEvent) {
    if (
      typeof data === "object" &&
      data.kind === "answer" &&
      typeof data.text === "string"
    ) {
      dispatch("guess", {
        text: data.text,
      });
    }

    if (typeof data === "object" && data.kind === "fullscreen") {
      allowFullscreenManual = true;
    }

    if (
      typeof data === "object" &&
      data.kind === "fullscreen-enter" &&
      allowFullscreen
    ) {
      setFullscreen(true);
    }

    if (typeof data === "object" && data.kind === "fullscreen-exit") {
      setFullscreen(false);
    }
  }

  export function notifySent(isCorrect: boolean) {
    iframeElement.contentWindow.postMessage(
      {
        kind: "guess-sent",
        isCorrect,
      },
      "*"
    );
  }

  onMount(() => {
    window.addEventListener("message", onMessage, false);
  });

  onDestroy(() => {
    window.removeEventListener("message", onMessage, false);
  });
</script>

{#if path}
  <div
    class="frame-container"
    class:fullscreen={$isFullscreen && allowFullscreen}
  >
    <iframe
      title="Embedded content"
      src={path}
      class:big-frame={bigFrame}
      bind:this={iframeElement}
    />
    {#if allowFullscreen}
      <button
        class="fullscreen-button"
        on:click={() => setFullscreen(!$isFullscreen)}
      >
        {#key $isFullscreen}
          <img src={fullscreenImage} alt="fullscreen toggle" in:fade />
        {/key}
      </button>
    {/if}
  </div>
{/if}

<style lang="scss">
  .frame-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .fullscreen {
    position: absolute;
    left: 8px;
    width: calc(100% - 16px);
    top: 0;
  }

  .fullscreen-button {
    position: absolute;
    right: 16px;
    bottom: 24px;
    border: 0px solid #000;
    border-radius: 18px;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    min-height: 460px;
  }

  iframe.big-frame {
    min-height: 540px;
  }

  img {
    display: block;
    width: 28px;
    height: 28px;
    padding: 4px;
  }

  button {
    padding: 0;
    opacity: 0.5;
  }
</style>

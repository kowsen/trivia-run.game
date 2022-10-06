<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { client } from "./client";
  import { startDialog } from "./Dialog.svelte";
  import { createTeam } from "./socket/trivia/game_rpcs";
  import { buildEnterHandler } from "./util";

  let teamName: string = "";
  let isJoinDisabled = false;
  let errorText = "";

  $: placeholderText = isJoinDisabled ? "..." : "Team Name";

  const onCreateKeydown = buildEnterHandler(startCreateTeam);

  async function startCreateTeam() {
    isJoinDisabled = true;
    const result = await client.call(createTeam, {
      inviteCode: "",
      name: teamName,
    });
    if (result.failureReason) {
      errorText = result.failureReason;
      isJoinDisabled = false;
      teamName = "";
    } else {
      // Do a full reload here so we can pick up the team token.
      window.location.href = `/game?team=${result.teamToken.toLowerCase()}`;
    }
  }
</script>

<hr />

<p>Use the form below to create a team and see how far you can get!</p>

<div class="input-area">
  <input
    disabled={isJoinDisabled}
    type="text"
    maxlength="24"
    placeholder={placeholderText}
    bind:value={teamName}
    on:keydown={onCreateKeydown}
  />
  <button disabled={isJoinDisabled} on:click={startCreateTeam}
    >Create Team</button
  >
</div>

{#if errorText}
  <p class="error">{errorText}</p>
{/if}

<style lang="scss">
  @import "./styles/constants";

  .input-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
  }

  input {
    width: 80%;
    margin: 12px 0;
    padding: 8px;
    font-size: 28px;
    box-sizing: border-box;
  }

  button {
    width: 70%;
    font-size: 22px;
    margin: 8px 0 0 0;
    padding: 8px;
    box-sizing: border-box;
  }

  button:hover,
  button:focus {
    background-color: $darker-background-color;
  }

  hr {
    margin-top: 24px;
  }

  p {
    font-size: 20px;
  }

  .error {
    width: 100%;
    text-align: center;
    color: #ff4136;
  }
</style>

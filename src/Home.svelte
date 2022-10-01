<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { client, trySetTeamToken } from "./client";
  import { createTeam } from "./socket/trivia/game_rpcs";
  import { buildEnterHandler } from "./util";

  let teamName: string = "";
  let isJoinDisabled = false;

  const onCreateKeydown = buildEnterHandler(startCreateTeam);

  async function startCreateTeam() {
    isJoinDisabled = true;
    const result = await client.call(createTeam, {
      inviteCode: "",
      name: teamName,
    });
    if (result.failureReason) {
      alert(result.failureReason);
      teamName = "";
    } else {
      trySetTeamToken();
      navigate(`/game?team=${result.teamToken.toLowerCase()}`);
    }
  }
</script>

<div class="main-links">
  <input
    type="text"
    bind:value={teamName}
    maxlength={16}
    on:keydown={onCreateKeydown}
  /><button disabled={isJoinDisabled} on:click={startCreateTeam}
    >Create Team</button
  >
</div>

<style>
  .main-links {
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-size: 32px;
  }
</style>

import { GameClient } from './socket/lib/client.js';
import { gameReducer, type GameTeam } from './socket/trivia/game_state';
import { derived, get, writable, type Readable } from 'svelte/store';
import { upgradeToGame } from './socket/trivia/game_rpcs.js';

export const token = writable("");

export const client = new GameClient(import.meta.env.VITE_BACKEND, gameReducer, upgrade);

// Returns whether token is populated
function updateAndGetToken(): string {
  const currentToken = get(token);
  if (!currentToken) {
    const urlToken = new URLSearchParams(window.location.search).get("team") ?? "";
    if (urlToken) {
      token.set(urlToken);
    }
    return urlToken;
  }
  return currentToken;
}

export async function upgrade() {
  const currentToken = updateAndGetToken();
  if (currentToken) {
    await client.call(upgradeToGame, { token: currentToken.toUpperCase() });
  }
}

export const team: Readable<GameTeam> = derived([client, token], ([{teams}, token]) => Object.values(teams.entities).find(team => team.token === token.toUpperCase()));

export const gameLoaded = derived(team, team => !!team);

export const currentMainQuestion = derived([client, team], ([{questions}, team]) => {
  return team ? questions.entities[team.mainQuestionId] : undefined;
});

import { GameClient } from './socket/lib/client.js';
import { gameReducer, type GameTeam } from './socket/trivia/game_state';
import { derived, type Readable } from 'svelte/store';
import { upgradeToGame } from './socket/trivia/game_rpcs.js';

let token: string = "";

export const client = new GameClient(import.meta.env.VITE_BACKEND, gameReducer, upgrade);

export function trySetTeamToken() {
  const urlToken = new URLSearchParams(window.location.search).get("team")?.toUpperCase();
  if (urlToken && !token) {
    void setTeamToken(urlToken);
  }
}

export async function setTeamToken(newToken: string) {
  token = newToken;
  await upgrade();
}

export async function upgrade() {
  if (token) {
    await client.call(upgradeToGame, { token });
  }
}

export const team: Readable<GameTeam> = derived(client, ({teams}) => teams.entities[teams.ids[0]]);

export const gameLoaded = derived(team, team => !!team);

export const currentMainQuestion = derived([client, team], ([{questions}, team]) => {
  return team ? questions.entities[team.mainQuestionId] : undefined;
});

export const currentMainQuestionGuesses = derived([client], ([{guesses, questions}]) => {
  return Object.values(guesses.entities).filter(guess => !questions[guess._id]?.bonusIndex).sort((a, b) => b._modified - a._modified).slice(0, 5);
});

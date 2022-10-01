import { GameClient } from './socket/lib/client.js';
import { gameReducer } from './socket/trivia/game_state';
import type { RequestDoc, StatusResponse } from './socket/trivia/base';
import { navigate } from 'svelte-routing';
import { derived } from 'svelte/store';
import { upgradeToGame } from './socket/trivia/game_rpcs.js';

let token: string = "";

export const client = new GameClient(import.meta.env.VITE_BACKEND, gameReducer, upgrade);

export async function setTeamToken(newToken: string) {
  token = newToken;
  await upgrade();
}

export async function upgrade() {
  if (token) {
    await client.call(upgradeToGame, { token });
  }
}

import { RPC } from '../lib/rpc.js';
import { stringField, booleanField, numberField, arrayOf, validate, optional } from '../lib/validator';
import type { StatusResponse } from './base';

export interface GameRankingTeam {
  name: string;
  isYou?: boolean;
  isSecretTeam?: boolean;
}

export interface GameUpgradeRequest {
  token: string;
}

export interface GameUpgradeResponse {
  teamId: string;
}

export interface GuessRequest {
  teamId: string;
  questionId: string;
  text: string;
}

export interface RankingRequest {
  teamId: string;
}

export interface RankingResponse {
  ranking: GameRankingTeam[];
}

export interface GetInviteRequest {
  teamId: string;
}

export interface GetInviteResponse {
  inviteCode: string;
}

export interface CreateTeamRequest {
  inviteCode: string;
  name: string;
}

export interface CreateTeamResponse {
  teamToken?: string;
  failureReason?: string;
}

export const upgradeToGame = new RPC<GameUpgradeRequest, GameUpgradeResponse>(
  'upgradeToGame',
  {
    token: stringField,
  },
  {
    teamId: stringField,
  },
);

export const guess = new RPC<GuessRequest, StatusResponse>(
  'guess',
  {
    teamId: stringField,
    questionId: stringField,
    text: stringField,
  },
  {
    success: booleanField,
  },
);

export const getRanking = new RPC<RankingRequest, RankingResponse>(
  'getRanking',
  {
    teamId: stringField,
  },
  {
    ranking: arrayOf((value: unknown) => {
      if (
        !validate(value, {
          name: stringField,
          isYou: optional(booleanField),
          isSecretTeam: optional(booleanField),
        })
      ) {
        throw new Error('Unable to parse rankings');
      }
      return value;
    }),
  },
);

export const createTeam = new RPC<CreateTeamRequest, CreateTeamResponse>(
  'createTeam',
  {
    inviteCode: stringField,
    name: stringField,
  },
  {
    failureReason: optional(stringField),
    teamToken: optional(stringField),
  },
);

export const getInvite = new RPC<GetInviteRequest, GetInviteResponse>(
  'getInvite',
  {
    teamId: stringField,
  },
  {
    inviteCode: stringField,
  },
);

import type { ActionReducerMapBuilder, EntityState, EntityAdapter } from '@reduxjs/toolkit';
import * as toolkitRaw from '@reduxjs/toolkit';
const { combineReducers, createAction, createEntityAdapter, createReducer } = ((toolkitRaw as any).default ??
  toolkitRaw) as typeof toolkitRaw;
import type { BaseQuestion, Doc, RequestDoc } from './base';

type OmitExtended<T, TChild extends T> = T & Record<keyof Omit<TChild, keyof T>, undefined>;

function getMetadata(doc: Doc): Doc {
  return {
    _id: doc._id,
    _modified: doc._modified,
    _deleted: doc._deleted,
  };
}

export interface GameQuestion extends BaseQuestion {
  title?: string;
  text?: string;
  image?: string;
  frame?: string;
  hideAnswer?: boolean;
  unlockTime?: number;
  bonusWinner?: string;
  mainIndex: number;
  bonusIndex: number;
}

const DUMMY_GAME_QUESTION: RequestDoc<GameQuestion> = {
  title: 'DUMMY',
  mainIndex: -1,
  bonusIndex: -1,
};

const LOCKED_QUESTION_PATCH: Partial<GameQuestion> = {
  title: '',
  text: '',
  image: '',
  frame: '',
  hideAnswer: true,
};

export interface GameTeam extends Doc {
  name: string;
  token: string;
  completedBonusQuestions: string[];
  mainQuestionId: string;
  lastAnswerTime?: number;
  isSecretTeam?: boolean;
}

const DUMMY_GAME_TEAM: RequestDoc<GameTeam> = {
  name: 'DUMMY',
  token: 'DUMMY',
  completedBonusQuestions: [],
  mainQuestionId: 'DUMMY',
};

export interface GameGuess extends Doc {
  questionId: string;
  text: string;
  isCorrect: boolean;
}

export interface GameSettings extends Doc {
  state: GameState;
  refreshToken: string;
}
export type GameState = 'notActive' | 'active' | 'completed';

const DUMMY_GAME_GUESS: RequestDoc<GameGuess> = {
  questionId: 'DUMMY',
  text: 'DUMMY',
  isCorrect: false,
};

export interface GameStateUpdate {
  questions?: GameQuestion[];
  teams?: GameTeam[];
  guesses?: GameGuess[];
  gameSettings?: GameSettings[];
}

export const updateGameState = createAction('game/update', (payload: GameStateUpdate) => ({ payload }));

function handleUpdateGameState<TDoc extends Doc>(
  builder: ActionReducerMapBuilder<EntityState<TDoc>>,
  adapter: EntityAdapter<TDoc>,
  getDocs: (update: GameStateUpdate) => TDoc[] | undefined,
) {
  builder.addCase(updateGameState, (state, action) => {
    const docsToUpsert = getDocs(action.payload)?.filter(doc => {
      const existing = state.entities[doc._id];
      return !existing || existing._modified <= doc._modified;
    });

    if (docsToUpsert?.length) {
      adapter.setMany(state as EntityState<TDoc>, docsToUpsert);
    }
  });
}

const questionsAdapter = createEntityAdapter<GameQuestion>({
  selectId: model => model._id,
});

const questionsSlice = createReducer(questionsAdapter.getInitialState(), builder => {
  handleUpdateGameState(builder, questionsAdapter, ({ questions }) => questions);
});

const teamAdapter = createEntityAdapter<GameTeam>({
  selectId: model => model._id,
});

const teamSlice = createReducer(teamAdapter.getInitialState(), builder => {
  handleUpdateGameState(builder, teamAdapter, ({ teams }) => teams);
});

const guessAdapter = createEntityAdapter<GameGuess>({
  selectId: model => model._id,
});

const guessSlice = createReducer(guessAdapter.getInitialState(), builder => {
  handleUpdateGameState(builder, guessAdapter, ({ guesses }) => guesses);
});

const gameSetingsAdapter = createEntityAdapter<GameSettings>({
  selectId: model => model._id,

});
const gameSetingsSlice = createReducer(gameSetingsAdapter.getInitialState(), builder => {
  handleUpdateGameState(builder, gameSetingsAdapter, ({ gameSettings }) => gameSettings);
});

export const gameReducer = combineReducers({
  questions: questionsSlice,
  teams: teamSlice,
  guesses: guessSlice,
  gameSettings: gameSetingsSlice,
});

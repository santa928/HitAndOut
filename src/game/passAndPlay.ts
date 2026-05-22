import { advanceRunners } from "./rules";
import type {
  HitLocation,
  InningScores,
  MatchState,
  PlayerIndex,
} from "./types";

const EMPTY_BASES = { first: false, second: false, third: false };

/**
 * Create the first top-half pitcher selection state.
 */
export function createMatch(
  names: [string, string] = ["PLAYER 1", "PLAYER 2"],
): MatchState {
  return {
    players: [
      { id: 0, name: names[0] },
      { id: 1, name: names[1] },
    ],
    inning: 1,
    half: "top",
    offense: 0,
    defense: 1,
    scores: [0, 0],
    inningScores: createEmptyInningScores(),
    outs: 0,
    bases: EMPTY_BASES,
    phase: "pitcher-select",
    secretHitLocation: null,
    revealedOutLocations: [],
    lastPlay: null,
    winner: null,
  };
}

/**
 * Store the pitcher's hidden hit location before the phone handoff.
 */
export function selectHitLocation(
  state: MatchState,
  location: HitLocation,
): MatchState {
  return {
    ...state,
    phase: "handoff-to-batter",
    secretHitLocation: location,
    revealedOutLocations: [],
    lastPlay: null,
  };
}

/**
 * Move from a protected handoff screen to the batter guess screen.
 */
export function revealBatterTurn(state: MatchState): MatchState {
  return { ...state, phase: "batter-guess" };
}

/**
 * Resolve the batter guess without exposing the secret before the result.
 */
export function submitGuess(
  state: MatchState,
  guess: HitLocation,
): MatchState {
  if (!state.secretHitLocation) {
    throw new Error("A hidden hit location is required before a guess.");
  }

  if (guess !== state.secretHitLocation) {
    return {
      ...state,
      outs: state.outs + 1,
      phase: "result",
      revealedOutLocations: [...state.revealedOutLocations, guess],
      lastPlay: { kind: "out", guess, hidden: state.secretHitLocation },
    };
  }

  const hit = advanceRunners(state.bases, guess);
  const scores: [number, number] = [...state.scores];
  scores[state.offense] += hit.runs;
  const inningScores = addRunsToCurrentInning(state, hit.runs);

  return {
    ...state,
    bases: hit.bases,
    scores,
    inningScores,
    phase: "result",
    lastPlay: {
      kind: "hit",
      guess,
      hidden: state.secretHitLocation,
      distance: hit.distance,
      runs: hit.runs,
    },
  };
}

/**
 * Continue from result feedback into the next pitcher or half-inning state.
 */
export function continueAfterResult(state: MatchState): MatchState {
  if (state.outs < 3) {
    if (state.lastPlay?.kind === "out") {
      return {
        ...state,
        phase: "batter-guess",
        lastPlay: null,
      };
    }

    return {
      ...state,
      phase: "pitcher-select",
      secretHitLocation: null,
      revealedOutLocations: [],
      lastPlay: null,
    };
  }

  const inningScores = finalizeCurrentInningScore(state);

  if (state.inning === 3 && state.half === "bottom") {
    return {
      ...state,
      phase: "game-over",
      inningScores,
      bases: EMPTY_BASES,
      secretHitLocation: null,
      revealedOutLocations: [],
      winner: resolveWinner(state.scores),
    };
  }

  const nextHalf = state.half === "top" ? "bottom" : "top";
  const nextInning =
    state.half === "bottom" ? ((state.inning + 1) as 2 | 3) : state.inning;
  const offense = otherPlayer(state.offense);

  return {
    ...state,
    inning: nextInning,
    half: nextHalf,
    offense,
    defense: otherPlayer(offense),
    outs: 0,
    bases: EMPTY_BASES,
    phase: "side-change",
    inningScores,
    secretHitLocation: null,
    revealedOutLocations: [],
    lastPlay: null,
  };
}

function otherPlayer(player: PlayerIndex): PlayerIndex {
  return player === 0 ? 1 : 0;
}

function resolveWinner(scores: [number, number]): PlayerIndex | "draw" {
  if (scores[0] === scores[1]) {
    return "draw";
  }

  return scores[0] > scores[1] ? 0 : 1;
}

/**
 * Keep unplayed innings distinct from scoreless completed innings.
 */
function createEmptyInningScores(): InningScores {
  return [
    [null, null, null],
    [null, null, null],
  ];
}

/**
 * Add runs to the offense row without mutating prior match history.
 */
function addRunsToCurrentInning(state: MatchState, runs: number): InningScores {
  if (runs === 0) {
    return state.inningScores;
  }

  const inningScores = cloneInningScores(state.inningScores);
  const inningIndex = state.inning - 1;
  const currentRuns = inningScores[state.offense][inningIndex] ?? 0;
  inningScores[state.offense][inningIndex] = currentRuns + runs;

  return inningScores;
}

/**
 * Turn an empty active cell into a completed scoreless inning at side change.
 */
function finalizeCurrentInningScore(state: MatchState): InningScores {
  const inningScores = cloneInningScores(state.inningScores);
  const inningIndex = state.inning - 1;

  inningScores[state.offense][inningIndex] ??= 0;

  return inningScores;
}

/**
 * Copy both player rows before a score cell is updated.
 */
function cloneInningScores(inningScores: InningScores): InningScores {
  return [
    [...inningScores[0]],
    [...inningScores[1]],
  ];
}

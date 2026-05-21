export type HitLocation = "home" | "first" | "second" | "third";
export type HitDistance = 1 | 2 | 3 | 4;
export type HalfInning = "top" | "bottom";
export type PlayerIndex = 0 | 1;

export interface Bases {
  first: boolean;
  second: boolean;
  third: boolean;
}

export interface AdvanceResult {
  bases: Bases;
  runs: number;
  distance: HitDistance;
}

export type MatchPhase =
  | "pitcher-select"
  | "handoff-to-batter"
  | "batter-guess"
  | "result"
  | "side-change"
  | "game-over";

export interface Player {
  id: PlayerIndex;
  name: string;
}

export type PlayResult =
  | { kind: "out"; guess: HitLocation; hidden: HitLocation }
  | {
      kind: "hit";
      guess: HitLocation;
      hidden: HitLocation;
      distance: HitDistance;
      runs: number;
    };

export interface MatchState {
  players: [Player, Player];
  inning: 1 | 2 | 3;
  half: HalfInning;
  offense: PlayerIndex;
  defense: PlayerIndex;
  scores: [number, number];
  outs: number;
  bases: Bases;
  phase: MatchPhase;
  secretHitLocation: HitLocation | null;
  lastPlay: PlayResult | null;
  winner: PlayerIndex | "draw" | null;
}

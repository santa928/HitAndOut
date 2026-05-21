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

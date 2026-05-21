import type { AdvanceResult, Bases, HitDistance, HitLocation } from "./types";

const DISTANCE_BY_LOCATION: Record<HitLocation, HitDistance> = {
  first: 1,
  second: 2,
  third: 3,
  home: 4,
};

const BASE_ORDER = ["first", "second", "third"] as const;

/**
 * Advance every occupied base and the batter by the hit distance.
 */
export function advanceRunners(
  currentBases: Bases,
  hitLocation: HitLocation,
): AdvanceResult {
  const distance = DISTANCE_BY_LOCATION[hitLocation];
  const nextBases: Bases = { first: false, second: false, third: false };
  let runs = distance === 4 ? 1 : 0;

  if (distance < 4) {
    nextBases[BASE_ORDER[distance - 1]] = true;
  }

  BASE_ORDER.forEach((base, index) => {
    if (!currentBases[base]) {
      return;
    }

    const destination = index + distance;
    if (destination >= BASE_ORDER.length) {
      runs += 1;
      return;
    }

    nextBases[BASE_ORDER[destination]] = true;
  });

  return { bases: nextBases, runs, distance };
}

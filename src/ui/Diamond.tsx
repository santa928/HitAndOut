import type { ReactElement } from "react";
import type { Bases, HitLocation } from "../game/types";

interface DiamondProps {
  mode: "pitcher" | "batter" | "read-only";
  bases: Bases;
  onPick?: (location: HitLocation) => void;
}

const LOCATIONS: Array<{
  key: HitLocation;
  label: string;
  pitcher: string;
  batter: string;
}> = [
  {
    key: "home",
    label: "HOME",
    pitcher: "ホームに隠す",
    batter: "ホームをねらう",
  },
  { key: "first", label: "1B", pitcher: "1塁に隠す", batter: "1塁をねらう" },
  { key: "second", label: "2B", pitcher: "2塁に隠す", batter: "2塁をねらう" },
  { key: "third", label: "3B", pitcher: "3塁に隠す", batter: "3塁をねらう" },
];

/**
 * Render the four target locations and occupied bases on the stadium diamond.
 */
export function Diamond({ mode, bases, onPick }: DiamondProps): ReactElement {
  return (
    <section className={`diamond diamond--${mode}`} aria-label="球場盤面">
      {LOCATIONS.map((location) => {
        const label = mode === "pitcher" ? location.pitcher : location.batter;
        const isOccupied = location.key !== "home" && bases[location.key];

        return (
          <button
            aria-label={label}
            className={`base base--${location.key}`}
            disabled={mode === "read-only"}
            key={location.key}
            onClick={() => onPick?.(location.key)}
            type="button"
          >
            <span>{location.label}</span>
            {isOccupied ? <i aria-label={`${location.label}の走者`} /> : null}
          </button>
        );
      })}
    </section>
  );
}

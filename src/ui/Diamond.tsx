import type { ReactElement } from "react";
import nightStadiumField from "../assets/night-stadium-field.png";
import type { Bases, HitLocation } from "../game/types";

interface DiamondProps {
  mode: "pitcher" | "batter" | "read-only";
  bases: Bases;
  revealedOutLocations?: HitLocation[];
  onPick?: (location: HitLocation) => void;
}

const LOCATIONS: Array<{
  key: HitLocation;
  label: string;
  pitcher: string;
  batter: string;
  out: string;
}> = [
  {
    key: "home",
    label: "HOME",
    pitcher: "ホームに隠す",
    batter: "ホームをねらう",
    out: "ホームはアウト",
  },
  {
    key: "first",
    label: "1B",
    pitcher: "1塁に隠す",
    batter: "1塁をねらう",
    out: "1塁はアウト",
  },
  {
    key: "second",
    label: "2B",
    pitcher: "2塁に隠す",
    batter: "2塁をねらう",
    out: "2塁はアウト",
  },
  {
    key: "third",
    label: "3B",
    pitcher: "3塁に隠す",
    batter: "3塁をねらう",
    out: "3塁はアウト",
  },
];

/**
 * Render the four target locations and occupied bases on the stadium diamond.
 */
export function Diamond({
  mode,
  bases,
  revealedOutLocations = [],
  onPick,
}: DiamondProps): ReactElement {
  return (
    <section className={`diamond diamond--${mode}`} aria-label="球場盤面">
      <img alt="" className="diamond__stadium" src={nightStadiumField} />
      {LOCATIONS.map((location) => {
        const isRevealedOut = revealedOutLocations.includes(location.key);
        const label =
          mode === "pitcher"
            ? location.pitcher
            : isRevealedOut
              ? location.out
              : location.batter;
        const isOccupied = location.key !== "home" && bases[location.key];

        return (
          <button
            aria-label={label}
            className={`base base--${location.key}`}
            disabled={mode === "read-only" || isRevealedOut}
            key={location.key}
            onClick={() => onPick?.(location.key)}
            type="button"
          >
            <span>{location.label}</span>
            {isRevealedOut ? <em className="base__out">OUT</em> : null}
            {isOccupied ? (
              <i className="runner" aria-label={`${location.label}の走者`} />
            ) : null}
          </button>
        );
      })}
    </section>
  );
}

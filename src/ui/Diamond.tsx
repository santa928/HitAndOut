import type { ReactElement, ReactNode } from "react";
import baseTargetFrame from "../assets/base-target-frame.png";
import nightStadiumField from "../assets/night-stadium-field.png";
import runnerSprite from "../assets/runner-sprite.png";
import type { Bases, HitLocation } from "../game/types";

interface DiamondProps {
  mode: "pitcher" | "batter" | "read-only";
  bases: Bases;
  revealedOutLocations?: HitLocation[];
  children?: ReactNode;
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
  children,
  onPick,
}: DiamondProps): ReactElement {
  return (
    <section className={`diamond diamond--${mode}`} aria-label="球場盤面">
      <img alt="" className="diamond__stadium" src={nightStadiumField} />
      {children}
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
            <img alt="" className="base__frame" src={baseTargetFrame} />
            <span className="base__label">{location.label}</span>
            <i aria-hidden="true" className="base__plate" />
            {isRevealedOut ? <em className="base__out">OUT</em> : null}
            {isOccupied ? (
              <img
                alt={`${location.label}の走者`}
                className="runner"
                src={runnerSprite}
              />
            ) : null}
          </button>
        );
      })}
    </section>
  );
}

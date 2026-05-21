import type { ReactElement } from "react";
import type { MatchState } from "../game/types";

interface ResultBannerProps {
  match: MatchState;
  onContinue: () => void;
}

/**
 * Show the short play result before the next pitcher selection or side change.
 */
export function ResultBanner({
  match,
  onContinue,
}: ResultBannerProps): ReactElement {
  const label = match.lastPlay?.kind === "hit" ? "HIT!" : "OUT!";
  const continueLabel =
    match.lastPlay?.kind === "out" && match.outs < 3
      ? "残りを読む"
      : "次の勝負へ";

  return (
    <section className="result-banner" aria-live="polite">
      <p className={`result-word result-word--${match.lastPlay?.kind}`}>{label}</p>
      <button onClick={onContinue} type="button">
        {continueLabel}
      </button>
    </section>
  );
}

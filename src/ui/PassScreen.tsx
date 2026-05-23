import type { ReactElement } from "react";

interface PassScreenProps {
  batterIndex: number;
  batterName: string;
  defenderIndex: number;
  defenderName: string;
  onContinue: () => void;
}

/**
 * Hide the pitcher's secret before the batter receives the phone.
 */
export function PassScreen({
  batterIndex,
  batterName,
  defenderIndex,
  defenderName,
  onContinue,
}: PassScreenProps): ReactElement {
  return (
    <section className="pass-screen" aria-live="polite">
      <p className={`pass-screen__eyebrow player-color--${defenderIndex}`}>
        {defenderName} SET COMPLETE
      </p>
      <h2 className={`player-color--${batterIndex}`}>{batterName} に端末を渡す</h2>
      <p>{defenderName} の守備セットは隠したまま、攻撃画面へ切り替える。</p>
      <button onClick={onContinue} type="button">
        {batterName} の攻撃へ
      </button>
    </section>
  );
}

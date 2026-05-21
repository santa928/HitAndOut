import type { ReactElement } from "react";

interface PassScreenProps {
  onContinue: () => void;
}

/**
 * Hide the pitcher's secret before the batter receives the phone.
 */
export function PassScreen({ onContinue }: PassScreenProps): ReactElement {
  return (
    <section className="pass-screen" aria-live="polite">
      <p className="eyebrow">PITCHER READY</p>
      <h2>打者に端末をわたす</h2>
      <p>ヒットの場所が見えないように画面を切り替えてから渡してね。</p>
      <button onClick={onContinue} type="button">
        打者の画面へ
      </button>
    </section>
  );
}

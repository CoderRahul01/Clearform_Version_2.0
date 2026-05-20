import { useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

const LEVEL_STYLES = {
  red: {
    dot: '#c94040',
    boxBg: '#fdf0f0',
    boxBorder: '#f5d0d0',
    text: '#8b3a3a',
    dotInBox: '#c94040',
  },
  amber: {
    dot: '#d4850a',
    boxBg: '#fdf6ec',
    boxBorder: '#f5e0c0',
    text: '#7a5a20',
    dotInBox: '#d4850a',
  },
  green: {
    dot: '#3d9b4f',
    boxBg: '#f0fdf4',
    boxBorder: '#d1e7d7',
    text: '#2d5c3a',
    dotInBox: '#3d9b4f',
  },
};

const DOT_ORDER = ['red', 'amber', 'green'];

export function ResponseQualityIndicator({ level }) {
  if (!level) return null;
  return (
    <div className="flex items-center gap-[6px]" aria-label={`Response quality: ${level}`}>
      {DOT_ORDER.map((key) => (
        <span
          key={key}
          className="w-2 h-2 rounded-full shrink-0 transition-colors"
          style={{ backgroundColor: key === level ? LEVEL_STYLES[key].dot : '#e4e2dc' }}
        />
      ))}
    </div>
  );
}

export function ResponseQualityMessage({ level, message, onDismiss }) {
  if (!level || !message) return null;
  const s = LEVEL_STYLES[level] || LEVEL_STYLES.amber;

  return (
    <div
      className="relative flex gap-2 items-start px-3 py-3 rounded-[8px] border mt-2"
      style={{ backgroundColor: s.boxBg, borderColor: s.boxBorder }}
      role="status"
    >
      <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: s.dotInBox }} />
      <p className="flex-1 text-[13px] leading-[19px] pr-5" style={{ color: s.text, fontFamily: "'DM Sans', sans-serif" }}>
        {message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss feedback"
        className="absolute top-2 right-2 p-0 border-0 bg-transparent cursor-pointer text-[#b4b2ac] hover:text-[#666]"
      >
        <RiCloseLine size={14} />
      </button>
    </div>
  );
}

/** Indicator row + optional dismissible message; resets dismiss when `text` changes. */
export default function ResponseQualityFeedback({ evaluation, charCount, maxChars }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [evaluation?.level, evaluation?.message]);

  if (!evaluation) {
    return (
      <div className="flex justify-between items-center pt-[11px] pb-[9px]">
        <p className="text-[#bbb] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Long answer
        </p>
        <p className="text-[#bbb] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {charCount} / {maxChars}
        </p>
      </div>
    );
  }

  const showMessage = evaluation.message && !dismissed;

  return (
    <>
      <div className="flex justify-between items-center pt-[11px] pb-[9px]">
        <ResponseQualityIndicator level={evaluation.level} />
        <p className="text-[#bbb] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {charCount} / {maxChars}
        </p>
      </div>
      {showMessage && (
        <ResponseQualityMessage
          level={evaluation.level}
          message={evaluation.message}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </>
  );
}

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RiRobot2Line, RiInformationLine, RiArrowDownSLine, RiCheckLine } from 'react-icons/ri';

const MAX_CRITERIA = 2;
const FONT = { fontFamily: "'DM Sans', sans-serif" };

export const DEFAULT_RESPONSE_QUALITY_OPTIONS = {
  length: { enabled: false, expanded: true, minWords: 10 },
  specificity: {
    enabled: false,
    expanded: true,
    sensitivity: 'Medium',
    vagueWords: 'good, nice, okay, fine, great, bad',
  },
  relevance: { enabled: false, expanded: true, keywords: '', matchThreshold: 2 },
  completeness: { enabled: false, expanded: true, detectTrailing: true, requiredSentences: 1 },
};

const CRITERIA_META = [
  {
    id: 'length',
    title: 'Length',
    description: 'Flags answers that are too short',
    bullets: [
      {
        prefix: 'For respondents:',
        text: 'Encourages them to elaborate. Short answers often miss the real insight.',
      },
      {
        prefix: 'For your data:',
        text: 'Submissions below your word count get flagged Red — you skip the noise instantly.',
      },
    ],
  },
  {
    id: 'specificity',
    title: 'Specificity',
    description: 'Detects vague or generic language',
    bullets: [
      {
        prefix: 'For respondents:',
        text: 'Surfaces when someone writes "good" or "fine" with nothing behind it — pushing for real reasons.',
      },
      {
        prefix: 'For your data:',
        text: 'Vague submissions are Amber-flagged so you review meaningful feedback first.',
      },
    ],
  },
  {
    id: 'relevance',
    title: 'Relevance',
    description: 'Identifies off-topic answers',
    bullets: [
      {
        prefix: 'For respondents:',
        text: 'Catches answers that drift away from your question topic entirely.',
      },
      {
        prefix: 'For your data:',
        text: 'Off-topic responses get flagged Red so you only act on answers that match your topic.',
      },
    ],
  },
  {
    id: 'completeness',
    title: 'Completeness',
    description: 'Catches partial or trailing answers',
    bullets: [
      {
        prefix: 'For respondents:',
        text: 'Detects "I think that…" with no follow-through — answers that trail off mid-thought.',
      },
      {
        prefix: 'For your data:',
        text: 'Incomplete submissions are Amber-flagged so you can follow up before acting on them.',
      },
    ],
  },
];

const BADGE_LOGIC = [
  { color: '#3d9b4f', label: 'All active criteria pass →', badge: 'Green' },
  { color: '#d4850a', label: '1 active criterion fails →', badge: 'Amber' },
  { color: '#c94040', label: '2+ active criteria fail →', badge: 'Red' },
];

function MainToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Enable response quality scoring"
      onClick={() => onChange(!checked)}
      className={`relative w-[30px] h-[17px] rounded-[99px] transition-colors cursor-pointer shrink-0 appearance-none border-0 p-0 ${
        checked ? 'bg-[#1a1a18]' : 'bg-[#e4e2dc]'
      }`}
    >
      <span
        className={`absolute top-[3px] w-[11px] h-[11px] bg-white rounded-[5.5px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.18)] transition-all duration-200 ${
          checked ? 'left-[16px]' : 'left-[3px]'
        }`}
      />
    </button>
  );
}

function CriterionToggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative shrink-0 w-[36px] h-[20px] rounded-[20px] transition-colors border-0 p-0 flex items-center ${
        checked ? 'bg-[#1a1a18] justify-end pr-[3px]' : 'bg-[#d0cec8] justify-start pl-[3px]'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="w-[14px] h-[14px] bg-white rounded-[7px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.15)] shrink-0" />
    </button>
  );
}

function InfoBullets({ bullets }) {
  return (
    <div className="bg-[#f7f5f0] rounded-[6px] px-3 py-[10px] flex flex-col gap-[6px]">
      {bullets.map(({ prefix, text }) => (
        <div key={prefix} className="flex gap-[7px] items-start">
          <RiCheckLine size={13} className="text-[#3d9b4f] shrink-0 mt-0.5" />
          <p className="text-[11.5px] leading-[17.25px]" style={FONT}>
            <span className="font-semibold text-[#1a1a18]">{prefix} </span>
            <span className="text-[#8a8880]">{text}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ children, optional }) {
  return (
    <div className="flex items-end gap-1">
      <span className="text-[11px] font-medium text-[#8a8880] tracking-[0.11px]" style={FONT}>
        {children}
      </span>
      {optional && (
        <span className="text-[10px] text-[#b4b2ac]" style={FONT}>
          optional
        </span>
      )}
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex w-full border border-[#e4e2dc] rounded-[6px] overflow-hidden">
      {options.map((opt, i) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 min-w-0 px-2 py-[7px] text-[11px] font-medium transition-colors ${
            value === opt.value ? 'bg-[#1a1a18] text-white' : 'bg-white text-[#8a8880] hover:text-[#555]'
          } ${i < options.length - 1 ? 'border-r border-[#e4e2dc]' : ''}`}
          style={FONT}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function NumberWithUnit({ value, onChange, unit, min = 0 }) {
  return (
    <div className="flex w-full border border-[#e4e2dc] rounded-[6px] overflow-hidden">
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 px-2 py-[7px] text-[14px] font-medium text-[#1a1a18] text-center bg-white outline-none"
        style={FONT}
      />
      <span className="border-l border-[#e4e2dc] px-2.5 py-[7px] text-[12px] text-[#8a8880] bg-white shrink-0" style={FONT}>
        {unit}
      </span>
    </div>
  );
}

function CriterionOptions({ id, options, onUpdate }) {
  switch (id) {
    case 'length':
      return (
        <div className="flex flex-col gap-[6px]">
          <FieldLabel>Minimum word count</FieldLabel>
          <NumberWithUnit
            value={options.minWords}
            onChange={(v) => onUpdate({ minWords: v })}
            unit="words"
            min={1}
          />
        </div>
      );
    case 'specificity':
      return (
        <>
          <div className="flex flex-col gap-[6px]">
            <FieldLabel>Sensitivity</FieldLabel>
            <SegmentedControl
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ]}
              value={options.sensitivity}
              onChange={(v) => onUpdate({ sensitivity: v })}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <FieldLabel optional>Vague words to watch</FieldLabel>
            <textarea
              value={options.vagueWords}
              onChange={(e) => onUpdate({ vagueWords: e.target.value })}
              rows={2}
              className="w-full bg-[#f2f0eb] border border-[#e4e2dc] rounded-[6px] px-3 py-2 text-[13px] text-[#1a1a18] outline-none focus:border-[#999] resize-none leading-[19.5px]"
              style={FONT}
            />
            <span className="text-[11px] text-[#b4b2ac]" style={FONT}>
              Comma-separated. Leave blank to use defaults.
            </span>
          </div>
        </>
      );
    case 'relevance':
      return (
        <>
          <div className="flex flex-col gap-[6px]">
            <FieldLabel optional>Expected topic keywords</FieldLabel>
            <textarea
              value={options.keywords}
              onChange={(e) => onUpdate({ keywords: e.target.value })}
              placeholder="experience, product, feedback…"
              rows={2}
              className="w-full bg-[#f2f0eb] border border-[#e4e2dc] rounded-[6px] px-3 py-2 text-[12.5px] text-[#1a1a18] placeholder:text-[#b4b2ac] outline-none focus:border-[#999] resize-none leading-[18.75px]"
              style={FONT}
            />
            <span className="text-[11px] text-[#b4b2ac]" style={FONT}>
              Comma-separated. Leave blank to skip keyword matching.
            </span>
          </div>
          <div className="flex flex-col gap-[6px]">
            <FieldLabel>Match threshold</FieldLabel>
            <NumberWithUnit
              value={options.matchThreshold}
              onChange={(v) => onUpdate({ matchThreshold: v })}
              unit="keywords"
              min={1}
            />
          </div>
        </>
      );
    case 'completeness':
      return (
        <>
          <div className="flex flex-col gap-[6px]">
            <FieldLabel>Detect trailing sentences</FieldLabel>
            <SegmentedControl
              options={[
                { value: true, label: 'Yes — flag unfinished' },
                { value: false, label: 'No' },
              ]}
              value={options.detectTrailing}
              onChange={(v) => onUpdate({ detectTrailing: v })}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <FieldLabel>Required sentence count</FieldLabel>
            <NumberWithUnit
              value={options.requiredSentences}
              onChange={(v) => onUpdate({ requiredSentences: v })}
              unit="sentences"
              min={1}
            />
          </div>
        </>
      );
    default:
      return null;
  }
}

function CriterionCard({ meta, options, atLimit, onToggleEnabled, onToggleExpanded, onUpdate }) {
  const { id, title, description, bullets } = meta;
  const isOn = options.enabled;
  const isExpanded = options.expanded;

  return (
    <div className="w-full bg-white border-b border-[#e4e2dc] overflow-hidden">
      <div className="flex items-center gap-[10px] px-4 py-[13px]">
        <CriterionToggle
          checked={isOn}
          disabled={atLimit && !isOn}
          onChange={onToggleEnabled}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold text-[#1a1a18] leading-[16.2px]" style={FONT}>
            {title}
          </p>
          <p className="text-[11.5px] text-[#8a8880] leading-[16.1px]" style={FONT}>
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} options`}
          className="shrink-0 p-0 border-0 bg-transparent cursor-pointer"
        >
          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <RiArrowDownSLine size={16} className="text-[#8a8880]" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#e4e2dc] px-4 pt-[13px] pb-[26px] flex flex-col gap-3">
              <InfoBullets bullets={bullets} />
              <CriterionOptions id={id} options={options} onUpdate={onUpdate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResponseQualityScoringCard({
  enabled,
  onEnabledChange,
  options,
  onOptionsChange,
  onSave,
}) {
  const activeCount = Object.values(options).filter((o) => o.enabled).length;

  const updateCriterion = useCallback(
    (id, patch) => {
      onOptionsChange((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...patch },
      }));
    },
    [onOptionsChange]
  );

  const toggleCriterionEnabled = useCallback(
    (id) => {
      onOptionsChange((prev) => {
        const turningOn = !prev[id].enabled;
        const count = Object.values(prev).filter((o) => o.enabled).length;
        if (turningOn && count >= MAX_CRITERIA) return prev;
        return { ...prev, [id]: { ...prev[id], enabled: turningOn } };
      });
    },
    [onOptionsChange]
  );

  return (
    <div className="w-full bg-[#f2f0eb] overflow-hidden">
      <div className={`bg-white flex items-center justify-between px-4 py-[12px] w-full ${enabled ? 'border-b border-[#e4e3de]' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="w-[28px] h-[28px] bg-[#1a1a18] rounded-[7px] flex items-center justify-center shrink-0">
            <RiRobot2Line size={14} className="text-white" />
          </div>
          <div className="flex flex-col gap-px min-w-0">
            <span className="text-[13px] font-semibold text-[#1a1a18] leading-normal" style={FONT}>
              Response quality
            </span>
            <span className="text-[11px] text-[#717171] font-normal leading-tight" style={FONT}>
              AI scores answers before you open them
            </span>
          </div>
        </div>
        <MainToggle checked={enabled} onChange={onEnabledChange} />
      </div>

      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            key="criteria"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="w-full bg-[#f2f0eb] pt-[10px] pb-4 flex flex-col">
              <div className="w-full bg-[#edeae3] flex gap-[6px] items-start px-4 py-[7px] mb-3">
                <RiInformationLine size={14} className="text-[#8a8880] shrink-0 mt-px" />
                <p className="text-[11.5px] text-[#8a8880] leading-[17.25px]" style={FONT}>
                  Select up to <span className="font-semibold">2 criteria</span> to focus your scoring.
                  <br />
                  More criteria = more selective filtering.
                </p>
              </div>

              <span className="text-[9.5px] font-semibold tracking-[0.95px] uppercase text-[#b4b2ac] mb-[10px] px-4" style={FONT}>
                SCORING CRITERIA
              </span>

              <div className="w-full flex flex-col border-t border-[#e4e2dc] mb-3">
                {CRITERIA_META.map((meta) => (
                  <CriterionCard
                    key={meta.id}
                    meta={meta}
                    options={options[meta.id]}
                    atLimit={activeCount >= MAX_CRITERIA}
                    onToggleEnabled={() => toggleCriterionEnabled(meta.id)}
                    onToggleExpanded={() => updateCriterion(meta.id, { expanded: !options[meta.id].expanded })}
                    onUpdate={(patch) => updateCriterion(meta.id, patch)}
                  />
                ))}
              </div>

              <div className="w-full bg-white border-y border-[#e4e2dc] p-4 flex flex-col gap-[7px] mb-3">
                <span className="text-[9.5px] font-semibold tracking-[0.95px] uppercase text-[#b4b2ac]" style={FONT}>
                  BADGE LOGIC PREVIEW
                </span>
                {BADGE_LOGIC.map(({ color, label, badge }) => (
                  <div key={badge} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-[4px] shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-[12px] text-[#8a8880] leading-[16.8px] flex-1" style={FONT}>
                      {label}
                    </span>
                    <span className="text-[12px] font-semibold text-[#1a1a18] leading-[16.8px]" style={FONT}>
                      {badge}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onSave}
                className="w-full bg-[#1a1a18] text-white text-[14px] font-semibold tracking-[-0.1px] py-3 cursor-pointer hover:bg-[#2c2c2c] transition-colors"
                style={FONT}
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

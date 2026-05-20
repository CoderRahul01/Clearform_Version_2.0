import { Fragment, useState, useRef, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import ToggleSwitch, { TOGGLE_TRACK_OFF, TOGGLE_TRACK_ON, toggleTrackClassName } from '@/components/ui/ToggleSwitch';
import ResponseQualityScoringCard, {
  DEFAULT_RESPONSE_QUALITY_OPTIONS,
} from '@/features/forms/components/ResponseQualityScoringCard';
import ResponseQualityFeedback from '@/features/forms/components/ResponseQualityFeedback';
import { evaluateResponseQuality } from '@/features/forms/utils/responseQualityScoring';
import { useNavigate, useLocation } from 'react-router-dom';
import { buildFormFromTemplate } from '@/features/templates/utils/buildFormFromTemplate';
import {
  applyScreenConfig,
  extractScreenConfig,
  getScreenPreviewText,
} from '@/features/forms/utils/screenConfigSync';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import {
  RiAddLine,
  RiFileTextLine,
  RiPaintBrushLine,
  RiGitBranchLine,
  RiSettings3Line,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiImageLine,
  RiRobot2Line,
  RiArrowDownSLine,
  RiIdCardLine,
  RiMapPinLine,
  RiBriefcaseLine,
  RiRadioButtonLine,
  RiCheckboxLine,
  RiCompassLine,
  RiFileUploadLine,
  RiStarLine,
  RiStarFill,
  RiHeartLine,
  RiHeartFill,
  RiTimeLine,
  RiCalendarLine,
  RiDeleteBin6Line,
  RiPencilLine,
  RiCheckLine,
  RiLinkedinBoxLine,
  RiInformationLine,
  RiArrowRightLine,
  RiComputerLine,
  RiSmartphoneLine,
  RiEyeLine,
  RiMailLine,
  RiLockLine,
  RiGlobeLine,
  RiArrowLeftLine,
  RiExternalLinkLine,
  RiSubtractLine,
  RiSkipForwardLine,
  RiStopCircleLine,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
} from 'react-icons/ri';
import { PiCaretCircleUp } from 'react-icons/pi';
import clearformLogo from '@/assets/clearform-high-resolution-logo-transparent.png';
import Sidebar from '@/components/layout/Sidebar';
import IfThenLogicPanel, { createEmptyRule } from '@/features/forms/components/IfThenLogicPanel';
import FormPublishView from '@/features/forms/components/FormPublishView';
import DeleteScreenModal from '@/features/forms/components/DeleteScreenModal';
import PublishFormModal from '@/features/forms/components/PublishFormModal';
import MapLocationPicker from '@/features/forms/components/MapLocationPicker';
import MapConfigurePanel from '@/features/forms/components/MapConfigurePanel';
import TimeConfigurePanel from '@/features/forms/components/TimeConfigurePanel';
import {
  applySecondsToSelection,
  clampSeconds,
  isTimeWithinBounds,
  selectionToSeconds,
  to24Hour,
  from24Hour,
} from '@/features/forms/utils/timeFieldUtils';
import { DEFAULT_MAP_CENTER } from '@/features/forms/utils/mapGeocoding';
import {
  formatFileSizeCompact,
  formatMaxSizeLabel,
  parseMaxFileSizeBytes,
} from '@/features/forms/utils/fileSizeLimits';
import {
  getLogicFieldsForScreenLabel,
  LOGIC_FIELD_CATALOG,
  getLogicFieldById,
} from '@/features/forms/constants/logicFieldCatalog';
import {
  buildLogicAnswersFromScreen,
  logicEdgeKey,
  resolveNextScreenId,
} from '@/features/forms/utils/logicEngine';

const LOGIC_STORAGE_KEY = 'clearform-builder-logic-v1';

/** Migrate legacy per-screen rules into per-connection keys. */
const migrateLogicIfRulesToEdges = (byScreen = {}) => {
  const byEdge = {};
  const elseByScreen = {};
  for (const [fromKey, data] of Object.entries(byScreen)) {
    const from = Number(fromKey);
    if (!Number.isFinite(from)) continue;
    if (data.elseScreenId != null) elseByScreen[from] = data.elseScreenId;
    for (const rule of data.rules ?? []) {
      if (rule.thenScreenId == null) continue;
      const key = logicEdgeKey(from, rule.thenScreenId);
      if (!byEdge[key]) byEdge[key] = { rules: [] };
      byEdge[key].rules.push({
        ...rule,
        thenScreenId: rule.thenScreenId,
        conditions: (rule.conditions ?? []).map((c) => ({ ...c })),
      });
    }
  }
  return { byEdge, elseByScreen };
};
import cardTheme1 from '@/assets/Card_Themes/Theme-1.jpeg';
import cardTheme2 from '@/assets/Card_Themes/Theme-2.jpeg';
import cardTheme3 from '@/assets/Card_Themes/Theme-3.jpeg';
import cardTheme4 from '@/assets/Card_Themes/Theme-4.jpeg';

/* â”€â”€ Boxes icon (CTA) â”€â”€ */
const BoxesIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3.5 2H6.5C7.32787 2 8 2.67213 8 3.5V6.5C8 7.32787 7.32787 8 6.5 8H3.5C2.67213 8 2 7.32787 2 6.5V3.5C2 2.67213 2.67213 2 3.5 2V2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M11.5 2H14.5C15.3279 2 16 2.67213 16 3.5V6.5C16 7.32787 15.3279 8 14.5 8H11.5C10.6721 8 10 7.32787 10 6.5V3.5C10 2.67213 10.6721 2 11.5 2V2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3.5 10H6.5C7.32787 10 8 10.6721 8 11.5V14.5C8 15.3279 7.32787 16 6.5 16H3.5C2.67213 16 2 15.3279 2 14.5V11.5C2 10.6721 2.67213 10 3.5 10V10" stroke="currentColor" strokeWidth="1.8"/>
    <path opacity="0.4" d="M11.5 10H14.5C15.3279 10 16 10.6721 16 11.5V14.5C16 15.3279 15.3279 16 14.5 16H11.5C10.6721 16 10 15.3279 10 14.5V11.5C10 10.6721 10.6721 10 11.5 10V10" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

/* â”€â”€ Heading icon (Text H) â”€â”€ */
const TextHIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M13 3.5V12.5C13 12.6326 12.9473 12.7598 12.8536 12.8536C12.7598 12.9473 12.6326 13 12.5 13C12.3674 13 12.2402 12.9473 12.1464 12.8536C12.0527 12.7598 12 12.6326 12 12.5V8.5H4V12.5C4 12.6326 3.94732 12.7598 3.85355 12.8536C3.75979 12.9473 3.63261 13 3.5 13C3.36739 13 3.24021 12.9473 3.14645 12.8536C3.05268 12.7598 3 12.6326 3 12.5V3.5C3 3.36739 3.05268 3.24021 3.14645 3.14645C3.24021 3.05268 3.36739 3 3.5 3C3.63261 3 3.75979 3.05268 3.85355 3.14645C3.94732 3.24021 4 3.36739 4 3.5V7.5H12V3.5C12 3.36739 12.0527 3.24021 12.1464 3.14645C12.2402 3.05268 12.3674 3 12.5 3C12.6326 3 12.7598 3.05268 12.8536 3.14645C12.9473 3.24021 13 3.36739 13 3.5Z"
      fill="currentColor"
    />
  </svg>
);

/* â”€â”€ Description icon (text align left) â”€â”€ */
const TextAlignLeftIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M2 4C2 3.86739 2.05268 3.74021 2.14645 3.64645C2.24021 3.55268 2.36739 3.5 2.5 3.5H13.5C13.6326 3.5 13.7598 3.55268 13.8536 3.64645C13.9473 3.74021 14 3.86739 14 4C14 4.13261 13.9473 4.25979 13.8536 4.35355C13.7598 4.44732 13.6326 4.5 13.5 4.5H2.5C2.36739 4.5 2.24021 4.44732 2.14645 4.35355C2.05268 4.25979 2 4.13261 2 4ZM2.5 7H10.5C10.6326 7 10.7598 6.94732 10.8536 6.85355C10.9473 6.75979 11 6.63261 11 6.5C11 6.36739 10.9473 6.24021 10.8536 6.14645C10.7598 6.05268 10.6326 6 10.5 6H2.5C2.36739 6 2.24021 6.05268 2.14645 6.14645C2.05268 6.24021 2 6.36739 2 6.5C2 6.63261 2.05268 6.75979 2.14645 6.85355C2.24021 6.94732 2.36739 7 2.5 7ZM13.5 8.5H2.5C2.36739 8.5 2.24021 8.55268 2.14645 8.64645C2.05268 8.74021 2 8.86739 2 9C2 9.13261 2.05268 9.25979 2.14645 9.35355C2.24021 9.44732 2.36739 9.5 2.5 9.5H13.5C13.6326 9.5 13.7598 9.44732 13.8536 9.35355C13.9473 9.25979 14 9.13261 14 9C14 8.86739 13.9473 8.74021 13.8536 8.64645C13.7598 8.55268 13.6326 8.5 13.5 8.5ZM10.5 11H2.5C2.36739 11 2.24021 11.0527 2.14645 11.1464C2.05268 11.2402 2 11.3674 2 11.5C2 11.6326 2.05268 11.7598 2.14645 11.8536C2.24021 11.9473 2.36739 12 2.5 12H10.5C10.6326 12 10.7598 11.9473 10.8536 11.8536C10.9473 11.7598 11 11.6326 11 11.5C11 11.3674 10.9473 11.2402 10.8536 11.1464C10.7598 11.0527 10.6326 11 10.5 11Z"
      fill="currentColor"
    />
  </svg>
);

/* â”€â”€ Images / Video building block icons â”€â”€ */
const ImagesCardIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M13.5 2.5H4.5C4.23478 2.5 3.98043 2.60536 3.79289 2.79289C3.60536 2.98043 3.5 3.23478 3.5 3.5V4.5H2.5C2.23478 4.5 1.98043 4.60536 1.79289 4.79289C1.60536 4.98043 1.5 5.23478 1.5 5.5V12.5C1.5 12.7652 1.60536 13.0196 1.79289 13.2071C1.98043 13.3946 2.23478 13.5 2.5 13.5H11.5C11.7652 13.5 12.0196 13.3946 12.2071 13.2071C12.3946 13.0196 12.5 12.7652 12.5 12.5V11.5H13.5C13.7652 11.5 14.0196 11.3946 14.2071 11.2071C14.3946 11.0196 14.5 10.7652 14.5 10.5V3.5C14.5 3.23478 14.3946 2.98043 14.2071 2.79289C14.0196 2.60536 13.7652 2.5 13.5 2.5ZM4.5 3.5H13.5V7.42188L12.8706 6.79313C12.7778 6.70024 12.6675 6.62656 12.5462 6.57629C12.4248 6.52602 12.2948 6.50015 12.1634 6.50015C12.0321 6.50015 11.902 6.52602 11.7807 6.57629C11.6594 6.62656 11.5491 6.70024 11.4563 6.79313L10.2063 8.04313L7.45625 5.29313C7.26873 5.10573 7.01448 5.00046 6.74937 5.00046C6.48427 5.00046 6.23002 5.10573 6.0425 5.29313L4.5 6.83563V3.5ZM11.5 12.5H2.5V5.5H3.5V10.5C3.5 10.7652 3.60536 11.0196 3.79289 11.2071C3.98043 11.3946 4.23478 11.5 4.5 11.5H11.5V12.5ZM13.5 10.5H4.5V8.25L6.75 6L9.85375 9.10375C9.94751 9.19745 10.0746 9.25008 10.2072 9.25008C10.3397 9.25008 10.4669 9.19745 10.5606 9.10375L12.1644 7.5L13.5 8.83625V10.5ZM10 5.25C10 5.10166 10.044 4.95666 10.1264 4.83332C10.2088 4.70999 10.3259 4.61386 10.463 4.55709C10.6 4.50032 10.7508 4.48547 10.8963 4.51441C11.0418 4.54335 11.1754 4.61478 11.2803 4.71967C11.3852 4.82456 11.4566 4.9582 11.4856 5.10368C11.5145 5.24917 11.4997 5.39997 11.4429 5.53701C11.3861 5.67406 11.29 5.79119 11.1667 5.8736C11.0433 5.95601 10.8983 6 10.75 6C10.5511 6 10.3603 5.92098 10.2197 5.78033C10.079 5.63968 10 5.44891 10 5.25Z"
      fill="currentColor"
    />
  </svg>
);

const VideoCardIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10.2775 6.58375L7.2775 4.58375C7.20218 4.5335 7.11463 4.50464 7.0242 4.50026C6.93376 4.49588 6.84383 4.51614 6.76401 4.55887C6.68418 4.60161 6.61746 4.66521 6.57097 4.74291C6.52447 4.8206 6.49994 4.90946 6.5 5V9C6.49994 9.09054 6.52447 9.1794 6.57097 9.25709C6.61746 9.33478 6.68418 9.39839 6.76401 9.44113C6.84383 9.48386 6.93376 9.50412 7.0242 9.49974C7.11463 9.49536 7.20218 9.4665 7.2775 9.41625L10.2775 7.41625C10.3461 7.37061 10.4023 7.30873 10.4412 7.23611C10.4801 7.16349 10.5005 7.08238 10.5005 7C10.5005 6.91762 10.4801 6.83651 10.4412 6.76389C10.4023 6.69127 10.3461 6.62939 10.2775 6.58375ZM7.5 8.06563V5.9375L9.09875 7L7.5 8.06563ZM13.5 2.5H2.5C2.23478 2.5 1.98043 2.60536 1.79289 2.79289C1.60536 2.98043 1.5 3.23478 1.5 3.5V10.5C1.5 10.7652 1.60536 11.0196 1.79289 11.2071C1.98043 11.3946 2.23478 11.5 2.5 11.5H13.5C13.7652 11.5 14.0196 11.3946 14.2071 11.2071C14.3946 11.0196 14.5 10.7652 14.5 10.5V3.5C14.5 3.23478 14.3946 2.98043 14.2071 2.79289C14.0196 2.60536 13.7652 2.5 13.5 2.5ZM13.5 10.5H2.5V3.5H13.5V10.5ZM14.5 13C14.5 13.1326 14.4473 13.2598 14.3536 13.3536C14.2598 13.4473 14.1326 13.5 14 13.5H2C1.86739 13.5 1.74021 13.4473 1.64645 13.3536C1.55268 13.2598 1.5 13.1326 1.5 13C1.5 12.8674 1.55268 12.7402 1.64645 12.6464C1.74021 12.5527 1.86739 12.5 2 12.5H14C14.1326 12.5 14.2598 12.5527 14.3536 12.6464C14.4473 12.7402 14.5 12.8674 14.5 13Z"
      fill="currentColor"
    />
  </svg>
);

/* â”€â”€ Short / Long text field icons â”€â”€ */
const ShortTextIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M2 5.33398H15.5M2 8.33398H9.5"
      stroke="currentColor"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LongTextIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M2 4H15.5M2 7H15.5M2 10H15.5M2 13H11"
      stroke="currentColor"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* â”€â”€ Left panel: Start / End screen (src/assets/Icons/Pages_Start.svg, Pages_End.svg) â”€â”€ */
const PagesStartIcon = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.88138 0.913549C6.33219 0.800404 6.80999 0.901428 7.17642 1.18737C7.54285 1.4733 7.75699 1.91222 7.75682 2.37701V11.4233C7.75699 11.888 7.54285 12.327 7.17642 12.6129C6.80999 12.8988 6.33219 12.9999 5.88138 12.8867L2.00294 11.9137C1.33227 11.7453 0.861958 11.1425 0.861816 10.4511V3.34921C0.861958 2.65774 1.33227 2.05493 2.00294 1.88661L5.88138 0.913549ZM6.464 2.37701C6.46409 2.31071 6.43364 2.24807 6.38146 2.20717C6.32929 2.16627 6.26118 2.15167 6.19682 2.16758L2.31839 3.14063C2.22242 3.16436 2.1549 3.25035 2.15463 3.34921V10.4511C2.1549 10.5499 2.22242 10.6359 2.31839 10.6596L6.19682 11.6327C6.26118 11.6486 6.32929 11.634 6.38146 11.5931C6.43364 11.5522 6.46409 11.4895 6.464 11.4233V2.37701ZM9.69604 1.72888C10.0528 1.72888 10.3424 2.01853 10.3424 2.37529V11.425C10.3424 11.7817 10.0528 12.0714 9.69604 12.0714C9.33927 12.0714 9.04963 11.7817 9.04963 11.425V2.37529C9.04963 2.01853 9.33927 1.72888 9.69604 1.72888ZM12.2817 2.59076C12.6384 2.59076 12.9281 2.8804 12.9281 3.23716V10.5631C12.9281 10.9199 12.6384 11.2095 12.2817 11.2095C11.9249 11.2095 11.6353 10.9199 11.6353 10.5631V3.23716C11.6353 2.8804 11.9249 2.59076 12.2817 2.59076Z"
      fill="currentColor"
    />
  </svg>
);

const PagesEndIcon = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.90866 0.913549C7.45785 0.800404 6.98005 0.901428 6.61362 1.18737C6.24719 1.4733 6.03305 1.91222 6.03322 2.37701V11.4233C6.03305 11.888 6.24719 12.327 6.61362 12.6129C6.98005 12.8988 7.45785 12.9999 7.90866 12.8867L11.7871 11.9137C12.4578 11.7453 12.9281 11.1425 12.9282 10.4511V3.34921C12.9281 2.65774 12.4578 2.05493 11.7871 1.88661L7.90866 0.913549ZM7.32604 2.37701C7.32595 2.31071 7.3564 2.24807 7.40858 2.20717C7.46075 2.16627 7.52886 2.15167 7.59322 2.16758L11.4717 3.14063C11.5676 3.16436 11.6351 3.25035 11.6354 3.34921V10.4511C11.6351 10.5499 11.5676 10.6359 11.4717 10.6596L7.59322 11.6327C7.52886 11.6486 7.46075 11.634 7.40858 11.5931C7.3564 11.5522 7.32595 11.4895 7.32604 11.4233V2.37701ZM4.094 1.72888C3.73724 1.72888 3.4476 2.01853 3.4476 2.37529V11.425C3.4476 11.7817 3.73724 12.0714 4.094 12.0714C4.45077 12.0714 4.74041 11.7817 4.74041 11.425V2.37529C4.74041 2.01853 4.45077 1.72888 4.094 1.72888ZM1.50838 2.59076C1.15162 2.59076 0.861973 2.8804 0.861973 3.23716V10.5631C0.861973 10.9199 1.15162 11.2095 1.50838 11.2095C1.86514 11.2095 2.15479 10.9199 2.15479 10.5631V3.23716C2.15479 2.8804 1.86514 2.59076 1.50838 2.59076Z"
      fill="currentColor"
    />
  </svg>
);

/* â”€â”€ Step bar â”€â”€ */
const STEPS = [
  { id: 1, label: 'Choose use case' },
  { id: 2, label: 'Template preview' },
  { id: 3, label: 'Form builder' },
  { id: 4, label: 'Publish' },
];

const StepBar = ({ activeStep = 3 }) => (
  <div className="flex items-center">
    {STEPS.map((step, i) => (
      <div key={step.id} className="flex items-center">
        <div className="flex items-center gap-2 px-5">
          <div
            className={`w-5 h-5 rounded-[10px] flex items-center justify-center border text-[10px] font-medium leading-none shrink-0 ${
              step.id === activeStep
                ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                : 'border-[#e4e2dc] text-[#7a7a72]'
            }`}
          >
            {step.id}
          </div>
          <span
            className={`text-[12px] font-medium whitespace-nowrap ${
              step.id === activeStep ? 'text-[#1a1a1a]' : 'text-[#7a7a72]'
            }`}
          >
            {step.label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <RiArrowRightSLine size={16} className="text-[#e4e2dc] shrink-0" aria-hidden />
        )}
      </div>
    ))}
  </div>
);

/* â”€â”€ Tab bar â”€â”€ */
const TABS = [
  { id: 'content', label: 'Content', icon: RiFileTextLine },
  { id: 'design', label: 'Design', icon: RiPaintBrushLine },
  { id: 'logic', label: 'Logic', icon: RiGitBranchLine },
  { id: 'settings', label: 'Settings', icon: RiSettings3Line },
];

/* Logic canvas: default horizontal flow + free positioning offsets (board space, unscaled) */
const LOGIC_FLOW_CARD_W = 168;
const LOGIC_FLOW_GAP = 24;
const LOGIC_FLOW_CARD_H_EST = 280;
/** Padding on logic board wrapper (Tailwind px-8 py-10) */
const LOGIC_BOARD_PAD_X = 32;
const LOGIC_BOARD_PAD_Y = 40;
/** Connector anchor offset: dot is `w-2` (8px); half-width places curve endpoints outside the card edge */
const LOGIC_CONNECTOR_DOT_R = 4;
/** Horizontal offset when placing the logic menu to the left of a port */
const LOGIC_CONNECTOR_MENU_W = 148;
/** Rendered dropdown width (Tailwind `w-[125px]`) â€” used for viewport clamping */
const LOGIC_CONNECTOR_MENU_BOX_W = 125;
/** Approximate menu height (4 items) for clamping inside the logic viewport */
const LOGIC_CONNECTOR_MENU_BOX_H = 188;

const clampLogicMenuViewportPos = (vx, vy, vr) => {
  const maxX = Math.max(8, vr.width - LOGIC_CONNECTOR_MENU_BOX_W - 8);
  const maxY = Math.max(8, vr.height - LOGIC_CONNECTOR_MENU_BOX_H - 8);
  return {
    vx: Math.min(Math.max(8, vx), maxX),
    vy: Math.min(Math.max(8, vy), maxY),
  };
};

const logicBezierConnectionPath = (x0, y0, x1, y1) => {
  const dx = Math.max(48, Math.abs(x1 - x0) * 0.45);
  return `M ${x0} ${y0} C ${x0 + dx} ${y0}, ${x1 - dx} ${y1}, ${x1} ${y1}`;
};

/** Point at parameter t along the same cubic used by `logicBezierConnectionPath`, in board space */
const logicBezierPointAt = (x0, y0, x1, y1, t) => {
  const dx = Math.max(48, Math.abs(x1 - x0) * 0.45);
  const p0 = { x: x0, y: y0 };
  const p1 = { x: x0 + dx, y: y0 };
  const p2 = { x: x1 - dx, y: y1 };
  const p3 = { x: x1, y: y1 };
  const s = 1 - t;
  return {
    x: s ** 3 * p0.x + 3 * s ** 2 * t * p1.x + 3 * s * t ** 2 * p2.x + t ** 3 * p3.x,
    y: s ** 3 * p0.y + 3 * s ** 2 * t * p1.y + 3 * s * t ** 2 * p2.y + t ** 3 * p3.y,
  };
};

const logicBezierMidpoint = (x0, y0, x1, y1) => logicBezierPointAt(x0, y0, x1, y1, 0.5);

/** Edge kinds chosen from the connector dot menu */
const LOGIC_EDGE_KIND = {
  next: 'next',
  if: 'if',
  skip: 'skip',
  end: 'end',
};

/** Replace same fromâ†’to if present; `kind: null` = pending until user picks from logic menu */
const upsertLogicConnection = (prev, from, to, kind) => {
  const tail = prev.filter((c) => !(c.from === from && c.to === to));
  return [...tail, { from, to, kind: kind === undefined ? null : kind }];
};

/** Label + leading icon per edge kind â€” matches logic connector menu semantics (Figma pill uses same iconography). */
const logicEdgeKindControlMeta = (kind) => {
  const k = kind ?? LOGIC_EDGE_KIND.next;
  if (k === LOGIC_EDGE_KIND.if) return { label: 'If', Icon: RiGitBranchLine };
  if (k === LOGIC_EDGE_KIND.skip) return { label: 'Skip', Icon: RiSkipForwardLine };
  if (k === LOGIC_EDGE_KIND.end) return { label: 'End', Icon: RiStopCircleLine };
  return { label: 'Next', Icon: RiArrowRightLine };
};

const getLogicEdgePathProps = (kind) => {
  if (kind == null) {
    return {
      fill: 'none',
      stroke: '#8a8880',
      strokeWidth: 1.5,
      strokeDasharray: '5 4',
      markerEnd: 'url(#logicFlowArrowHeadMuted)',
    };
  }
  const k = kind;
  const base = {
    fill: 'none',
    stroke: '#1a1a1a',
    strokeWidth: 1.5,
    markerEnd: 'url(#logicFlowArrowHead)',
  };
  if (k === LOGIC_EDGE_KIND.if) return { ...base, strokeDasharray: '6 5' };
  if (k === LOGIC_EDGE_KIND.skip) return { ...base, stroke: '#5c5c58', strokeDasharray: '5 4' };
  if (k === LOGIC_EDGE_KIND.end) return { ...base, strokeWidth: 2.2 };
  return base;
};

const LOGIC_EDGE_HOVER_STROKE = '#dc2626';
const LOGIC_EDGE_KIND_HOVER_STROKE = '#16a34a';

const getLogicEdgePathPropsHovered = (kind) => {
  const base = getLogicEdgePathProps(kind);
  return {
    ...base,
    stroke: LOGIC_EDGE_HOVER_STROKE,
    markerEnd: 'url(#logicFlowArrowHeadRed)',
  };
};

const getLogicEdgePathPropsKindHovered = (kind) => {
  const base = getLogicEdgePathProps(kind);
  return {
    ...base,
    stroke: LOGIC_EDGE_KIND_HOVER_STROKE,
    markerEnd: 'url(#logicFlowArrowHeadGreen)',
  };
};

const LOGIC_EDGE_HIT_STROKE_WIDTH = 18;

const resolveLogicEdgeStrokeProps = (edgeKey, kind, disconnectHoveredKey, kindHoveredKey) => {
  if (disconnectHoveredKey === edgeKey) return getLogicEdgePathPropsHovered(kind);
  if (kindHoveredKey === edgeKey) return getLogicEdgePathPropsKindHovered(kind);
  return getLogicEdgePathProps(kind);
};

/** Visible edge + wide transparent hit stroke (hover line â†’ green, click â†’ logic options) */
const LogicEdgePathGroup = ({
  d,
  edgeKey,
  kind,
  connection,
  disconnectHoveredKey,
  kindHoveredKey,
  onKindEnter,
  onKindLeave,
  onEdgeClick,
}) => {
  const strokeProps = resolveLogicEdgeStrokeProps(
    edgeKey,
    kind,
    disconnectHoveredKey,
    kindHoveredKey
  );
  return (
    <g data-logic-edge={edgeKey}>
      <path d={d} pointerEvents="none" {...strokeProps} />
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={LOGIC_EDGE_HIT_STROKE_WIDTH}
        pointerEvents="stroke"
        className="cursor-pointer"
        aria-label="Open logic options for this connection"
        onPointerEnter={() => onKindEnter(edgeKey)}
        onPointerLeave={onKindLeave}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onEdgeClick(connection, e.clientX, e.clientY);
        }}
      />
    </g>
  );
};

/** Ã— on the connection line â€” removes the wire only */
const LogicEdgeLineDisconnectButton = ({
  x,
  y,
  onDisconnect,
  onPointerEnter,
  onPointerLeave,
}) => (
  <div
    className="absolute z-[11] flex items-center justify-center pointer-events-auto"
    style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    onPointerDown={(e) => e.stopPropagation()}
  >
    <button
      type="button"
      aria-label="Disconnect connection"
      title="Disconnect connection"
      className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#e6e4e0] bg-white p-0 text-[#5c5c58] hover:bg-[#fafaf9] hover:text-[#1a1a1a] cursor-pointer touch-none outline-none appearance-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]/35 focus-visible:ring-offset-1 [&::-moz-focus-inner]:border-0"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={(e) => {
        e.stopPropagation();
        onDisconnect();
      }}
    >
      <RiCloseLine size={11} aria-hidden className="shrink-0 pointer-events-none" />
    </button>
  </div>
);

/** Edge pill: kind label + optional Ã— to clear if-logic (wire stays) */
const LogicEdgeControlPill = ({
  pillX,
  pillY,
  meta,
  showClearLogic,
  onClearLogic,
}) => (
  <div
    role="group"
    aria-label={`Connection ${meta.label}`}
    className="absolute z-[12] pointer-events-none"
    style={{
      left: pillX,
      top: pillY,
      transform: 'translate(-50%, -50%)',
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    <div className="inline-flex flex-nowrap items-center gap-1.5 rounded-[10px] border border-solid border-[#cacaca] bg-[#e8ddfa] pl-2 pr-1.5 py-1">
      <span className="inline-flex flex-nowrap items-center gap-1 shrink-0">
        <meta.Icon size={13} className="shrink-0 text-[#636363]" aria-hidden />
        <span className="text-[11px] font-medium leading-normal text-[#636363] whitespace-nowrap select-none">
          {meta.label}
        </span>
      </span>
      {showClearLogic ? (
        <button
          type="button"
          aria-label="Remove logic"
          title="Remove logic"
          className="flex size-[20px] shrink-0 items-center justify-center rounded-full border border-[#636363]/35 bg-transparent p-0 text-[#636363] hover:bg-white/45 cursor-pointer touch-none pointer-events-auto outline-none appearance-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]/35 focus-visible:ring-offset-1 [&::-moz-focus-inner]:border-0"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClearLogic();
          }}
        >
          <RiCloseLine size={11} aria-hidden className="shrink-0 pointer-events-none" />
        </button>
      ) : null}
    </div>
  </div>
);

/** Rebuild [intro, ...content, end] by following logic edges from intro; unreachable content keeps prior relative order. */
const reorderScreensFromLogicConnections = (screens, connections) => {
  const intro = screens.find((s) => s.type === 'intro');
  const end = screens.find((s) => s.type === 'end');
  const content = screens.filter((s) => s.type === 'content');
  if (!intro || !end) return screens;

  const outgoing = new Map();
  for (const e of connections) {
    if (!outgoing.has(e.from)) outgoing.set(e.from, []);
    outgoing.get(e.from).push(e);
  }
  for (const edges of outgoing.values()) {
    edges.sort((a, b) => a.to - b.to || String(a.kind ?? '').localeCompare(String(b.kind ?? '')));
  }

  const pickPrimaryTo = (fromId) => {
    const resolved = (outgoing.get(fromId) ?? []).filter((e) => e.kind != null);
    if (!resolved.length) return null;
    const nextEdge = resolved.find((e) => e.kind === LOGIC_EDGE_KIND.next);
    return (nextEdge ?? resolved[0]).to;
  };

  const chainIds = [];
  let cur = intro.id;
  const visited = new Set();
  while (true) {
    const to = pickPrimaryTo(cur);
    if (to == null) break;
    if (to === end.id) break;
    if (visited.has(to)) break;
    visited.add(to);
    const s = screens.find((x) => x.id === to);
    if (!s || s.type !== 'content') break;
    chainIds.push(to);
    cur = to;
  }

  const inChain = new Set(chainIds);
  const contentIdOrder = content.map((s) => s.id);
  const orphanIds = contentIdOrder.filter((id) => !inChain.has(id));
  const newContentIds = [...chainIds, ...orphanIds];
  const byId = new Map(screens.map((s) => [s.id, s]));
  const newContent = newContentIds.map((id) => byId.get(id)).filter(Boolean);

  return [intro, ...newContent, end];
};

/** Group edges for fanning multiple connectors from/to the same node (stable sort). */
const groupLogicConnectionsByFrom = (connections) => {
  const m = new Map();
  for (const c of connections) {
    if (!m.has(c.from)) m.set(c.from, []);
    m.get(c.from).push(c);
  }
  for (const arr of m.values()) {
    arr.sort((a, b) => a.to - b.to || String(a.kind ?? '').localeCompare(String(b.kind ?? '')));
  }
  return m;
};

const groupLogicConnectionsByTo = (connections) => {
  const m = new Map();
  for (const c of connections) {
    if (!m.has(c.to)) m.set(c.to, []);
    m.get(c.to).push(c);
  }
  for (const arr of m.values()) {
    arr.sort((a, b) => a.from - b.from || String(a.kind ?? '').localeCompare(String(b.kind ?? '')));
  }
  return m;
};

const LOGIC_EDGE_FAN_PX = 10;
/** Shared horizontal trunk before if/then branches fan to multiple destinations */
const LOGIC_IF_TRUNK_PX = 52;

const logicConnectionEndpoints = (c, byFrom, byTo, a, b) => {
  const fromArr = byFrom.get(c.from) ?? [c];
  const fi = Math.max(0, fromArr.indexOf(c));
  const nF = fromArr.length;
  const dy0 = nF <= 1 ? 0 : (fi - (nF - 1) / 2) * LOGIC_EDGE_FAN_PX;

  const toArr = byTo.get(c.to) ?? [c];
  const fj = Math.max(0, toArr.indexOf(c));
  const nT = toArr.length;
  const dy1 = nT <= 1 ? 0 : (fj - (nT - 1) / 2) * LOGIC_EDGE_FAN_PX;

  return { x0: a.outX, y0: a.portY + dy0, x1: b.inX, y1: b.portY + dy1 };
};

/* â”€â”€ Configure panel: essentials grid items â”€â”€ */
const ESSENTIALS = [
  { label: 'CTA', Icon: BoxesIcon },
  { label: 'Heading', Icon: TextHIcon },
  { label: 'Description', Icon: TextAlignLeftIcon },
  { label: 'Text Box', Icon: ShortTextIcon },
  { label: 'Images', Icon: ImagesCardIcon },
  { label: 'Video', Icon: VideoCardIcon },
  { label: 'Captcha', Icon: RiRobot2Line },
];

/* â”€â”€ Configure panel: collapsible sections â”€â”€ */
const ACCORDION_SECTIONS = [
  { key: 'questionTemplates', label: 'Question Templates' },
  { key: 'fieldSettings', label: 'Field Settings' },
  { key: 'appearance', label: 'Appearance' },
];

/* â”€â”€ Question template categories â”€â”€ */
const QUESTION_TEMPLATE_CATEGORIES = [
  {
    label: 'Building Blocks',
    items: [
      { label: 'CTA', Icon: BoxesIcon },
      { label: 'Heading', Icon: TextHIcon },
      { label: 'Description', Icon: TextAlignLeftIcon },
      { label: 'Images', Icon: ImagesCardIcon },
      { label: 'Video', Icon: VideoCardIcon },
    ],
  },
  {
    label: 'Basic Information',
    items: [
      { label: 'Contact', Icon: RiIdCardLine },
      { label: 'Address', Icon: RiMapPinLine },
      { label: 'Work Info', Icon: RiBriefcaseLine },
    ],
  },
  {
    label: 'Qualitative Inputs',
    items: [
      { label: 'Short text', Icon: ShortTextIcon },
      { label: 'Long text', Icon: LongTextIcon },
    ],
  },
  {
    label: 'Choice Based',
    items: [
      { label: 'Single', Icon: RiRadioButtonLine },
      { label: 'Multiple', Icon: RiCheckboxLine },
      { label: 'Media', Icon: RiImageLine },
    ],
  },
  {
    label: 'Interactive',
    items: [
      { label: 'Maps', Icon: RiCompassLine },
      { label: 'Upload', Icon: RiFileUploadLine },
      { label: 'Multi-image upload', Icon: RiImageLine },
      { label: 'Captcha', Icon: RiRobot2Line },
    ],
  },
  {
    label: 'Numeric Inputs',
    items: [
      { label: 'Rating', Icon: RiStarLine },
      { label: 'Time', Icon: RiTimeLine },
      { label: 'Date', Icon: RiCalendarLine },
    ],
  },
];

/* â”€â”€ Content panel sections (shown when Add Screen is clicked after intro) â”€â”€ */
const CONTENT_SECTIONS = [
  {
    key: 'buildingBlocks',
    label: 'Building Blocks',
    items: [
      { label: 'CTA', Icon: BoxesIcon },
      { label: 'Heading', Icon: TextHIcon },
      { label: 'Description', Icon: TextAlignLeftIcon },
      { label: 'Images', Icon: ImagesCardIcon },
      { label: 'Video', Icon: VideoCardIcon },
    ],
  },
  {
    key: 'basicInfo',
    label: 'Basic Information',
    items: [
      { label: 'Contact', Icon: RiIdCardLine },
      { label: 'Address', Icon: RiMapPinLine },
      { label: 'Work Info', Icon: RiLinkedinBoxLine },
    ],
  },
  {
    key: 'qualitative',
    label: 'Qualitative Inputs',
    items: [
      { label: 'Short text', Icon: ShortTextIcon },
      { label: 'Long text', Icon: LongTextIcon },
    ],
  },
  {
    key: 'choiceBased',
    label: 'Choice Based',
    items: [
      { label: 'Single', Icon: RiRadioButtonLine },
      { label: 'Multiple', Icon: RiCheckboxLine },
      { label: 'Media', Icon: RiImageLine },
    ],
  },
  {
    key: 'interactive',
    label: 'Interactive',
    items: [
      { label: 'Maps', Icon: RiCompassLine },
      { label: 'Upload', Icon: RiFileUploadLine },
      { label: 'Multi-image upload', Icon: RiImageLine },
      { label: 'Captcha', Icon: RiRobot2Line },
    ],
  },
  {
    key: 'numeric',
    label: 'Numeric Inputs',
    items: [
      { label: 'Rating', Icon: RiStarLine },
      { label: 'Time', Icon: RiTimeLine },
      { label: 'Date', Icon: RiCalendarLine },
    ],
  },
];

/* â”€â”€ Design themes â”€â”€ */
const THEMES = [
  {
    id: 'sage',
    name: 'Sage â€” Organic',
    cardBg: '#b8cfc6',
    previewType: 'image',
    previewImg: cardTheme1,
  },
  {
    id: 'earth',
    name: 'Earth â€” Warm',
    cardBg: '#f0e6d3',
    previewType: 'image',
    previewImg: cardTheme2,
  },
  {
    id: 'terra',
    name: 'Terra â€” Bold',
    cardBg: '#e06b55',
    previewType: 'image',
    previewImg: cardTheme3,
  },
  {
    id: 'azure',
    name: 'Azure â€” Minimal',
    cardBg: '#b5cedf',
    previewType: 'image',
    previewImg: cardTheme4,
  },
];

/* â”€â”€ Typography font map â”€â”€ */
const TYPOGRAPHY_FONTS = {
  default:   "'DM Sans', sans-serif",
  serif:     "Georgia, 'Times New Roman', serif",
  monospace: "'Consolas', 'Courier New', monospace",
};

/* â”€â”€ Hex â†’ rgba helper â”€â”€ */
const hexToRgba = (hex, opacity) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
};

/* â”€â”€ CTA configure panel â€“ text-color palette (6 rows Ã— 8 cols) â”€â”€ */
const CTA_COLOR_PALETTE = [
  ['#ffffff', '#ffffff', '#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#111827'],
  ['#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#7f1d1d'],
  ['#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#713f12'],
  ['#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d'],
  ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e3a8a'],
  ['#fae8ff', '#f5d0fe', '#e879f9', '#d946ef', '#a855f7', '#9333ea', '#7e22ce', '#581c87'],
];

/* â”€â”€ Content card helpers â”€â”€ */

const CardShell = ({ children, fullCanvas = false, cardColor = '#f7f6f4', cardImage = null, scrollable = false, footer = null }) => {
  const borderAndRadius = fullCanvas ? '' : 'border border-[rgba(0,0,0,0.07)] rounded-[20px]';
  const shellStyle = fullCanvas ? {} : {
    ...(cardImage
      ? { backgroundImage: `url(${cardImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: cardColor }),
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.05), 0px 8px 32px 0px rgba(0,0,0,0.07)',
  };

  if (footer) {
    return (
      <div
        className={`flex-1 flex flex-col min-h-0 transition-colors duration-300 ${borderAndRadius}`}
        style={shellStyle}
      >
        <div
          className={`flex-1 flex flex-col min-h-0 ${
            scrollable ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden justify-between'
          }`}
        >
          {children}
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div
      className={`${scrollable ? 'overflow-y-auto min-h-0' : 'overflow-hidden'} flex-1 flex flex-col justify-between transition-colors duration-300 ${borderAndRadius}`}
      style={shellStyle}
    >
      {children}
    </div>
  );
};

/** Back / Continue â€” matches Figma (Clearform-Changes 2521:7135) */
const PreviewCardStepNav = ({ prevScreen, nextScreen, onGoPrev, onGoContinue }) => (
  <div className="border-t border-[#cfcecd] flex items-center justify-between shrink-0 px-14 pt-[15px] pb-[18px]">
    <button
      type="button"
      onClick={() => onGoPrev?.()}
      disabled={!prevScreen}
      className={`inline-flex items-center justify-center gap-[6px] h-[38px] rounded-[6px] border border-solid px-[15px] text-[13px] font-normal transition-colors ${
        prevScreen
          ? 'border-[#e2e0dc] bg-white text-[#8a8880] hover:bg-[#f7f6f4] cursor-pointer'
          : 'border-[#e8e6e2] bg-[#fafaf9] text-[#c4c2bc] cursor-not-allowed'
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
    >
      <RiArrowLeftLine size={13} className={`shrink-0 ${prevScreen ? 'text-[#8a8880]' : 'text-[#c4c2bc]'}`} aria-hidden />
      Back
    </button>
    <button
      type="button"
      onClick={() => onGoContinue?.()}
      disabled={!nextScreen}
      className={`inline-flex items-center justify-center gap-2 h-[38px] rounded-[10px] px-6 text-[14px] font-medium transition-colors ${
        nextScreen
          ? 'bg-[#1a1a18] text-white hover:bg-[#2a2a26] cursor-pointer'
          : 'bg-[#d4d2cc] text-[#a8a6a0] cursor-not-allowed'
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
    >
      Continue
      <RiArrowRightLine size={14} className={`shrink-0 ${nextScreen ? 'text-white' : 'text-[#a8a6a0]'}`} aria-hidden />
    </button>
  </div>
);

/** Shown beside the question title line when Continue is tapped but required preview fields are incomplete. */
const PreviewRequiredInline = ({ show }) =>
  show ? (
    <span
      className="text-[10px] font-semibold uppercase tracking-[0.06em] text-red-600 shrink-0"
      aria-live="polite"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      Required
    </span>
  ) : null;

const SectionBadge = ({ num, label }) => (
  <div className="flex gap-[8px] items-center">
    <div className="bg-[#111] w-[26px] h-[26px] rounded-[6px] flex items-center justify-center shrink-0">
      <span className="text-white text-[13px] font-semibold leading-none">{num}</span>
    </div>
    <span className="text-[#888] text-[15px] tracking-[0.42px]">{label}</span>
  </div>
);

const FormField = ({ label, value }) => (
  <div className="flex flex-col w-full">
    <p className="text-[#888] text-[10.5px] font-medium tracking-[0.42px] uppercase pb-[6px]">{label}</p>
    <div className="border-b border-[rgba(0,0,0,0.16)] pb-[9px] pt-[8px]">
      <p className="text-[14px] text-black font-light">{value}</p>
    </div>
  </div>
);

/** Editable text field for preview/fill mode (replaces static {@link FormField} samples). */
const PreviewLabeledInput = ({ label, value, onChange, placeholder = '', type = 'text' }) => (
  <div className="flex flex-col w-full">
    <label className="text-[#888] text-[10.5px] font-medium tracking-[0.42px] uppercase pb-[6px]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      className="w-full border-b border-[rgba(0,0,0,0.16)] pb-[9px] pt-[8px] text-[14px] text-black font-light bg-transparent outline-none focus:border-[#111] placeholder:text-[#bbb]"
    />
  </div>
);

const ContentCardFooter = ({ onDelete, variant = 'default' }) => (
  <div className="border-t border-[rgba(0,0,0,0.1)] flex gap-2 items-center px-14 py-[19px]">
    {variant === 'field' && (
      <button className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap">
        <RiInformationLine size={12} className="shrink-0" />
        Make required
      </button>
    )}
    {variant === 'content' && (
      <button className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap">
        <RiPencilLine size={12} className="shrink-0" />
        Edit content
      </button>
    )}
    <button
      onClick={onDelete}
      className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,245,245,0.7)] border border-[rgba(200,50,50,0.2)] text-[#d63030] text-[12px] cursor-pointer hover:bg-[rgba(255,235,235,0.9)] transition-colors whitespace-nowrap"
    >
      <RiDeleteBin6Line size={12} className="shrink-0" />
      Delete
    </button>
    <div className="flex-1" />
    <button className="flex items-center gap-[5px] px-[16px] py-[8px] rounded-[8px] bg-[#111] text-white text-[12px] font-medium cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap">
      <RiCheckLine size={11} className="shrink-0" />
      Save
    </button>
  </div>
);

const FileUploadCard = ({ blockNum, onDelete, config, isPreviewMode = false }) => {
  const question = config?.question || 'Attach supporting documents';
  const helperText = config?.helperText || 'Attach any files that help us understand your request better.';
  const maxFileSizeLabel = config?.maxFileSize || '25 MB';
  const maxBytes = parseMaxFileSizeBytes(maxFileSizeLabel);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sizeError, setSizeError] = useState(null);
  const fileInputRef = useRef(null);

  const startUploadProgress = (fileIds) => {
    fileIds.forEach((fileId) => {
      let prog = 0;
      const tick = () => {
        prog = Math.min(100, prog + Math.random() * 18 + 6);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: Math.round(prog) } : f))
        );
        if (prog < 100) setTimeout(tick, 80);
      };
      setTimeout(tick, 80);
    });
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const oversized = selected.find((f) => f.size > maxBytes);
    if (oversized) {
      setSizeError({ name: oversized.name, size: oversized.size });
      e.target.value = '';
      return;
    }

    setSizeError(null);

    const newFiles = selected.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    startUploadProgress(newFiles.map((f) => f.id));
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (dt?.files) {
      handleFileSelect({ target: { files: dt.files } });
    }
  };

  const handleRemove = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleTryAnother = () => {
    setSizeError(null);
    fileInputRef.current?.click();
  };

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const maxSizeHint = maxFileSizeLabel === 'No limit'
    ? 'No size limit'
    : `Max ${maxFileSizeLabel} per file`;

  return (
    <>
      <div className="flex flex-col px-14 pt-11 pb-5">
        <SectionBadge num={blockNum} label="File upload" />
        <div className="pt-[9px]">
          <p className="font-medium text-[#111] tracking-[-0.52px] leading-tight" style={{ fontSize: '26px' }}>{question}</p>
        </div>
        <p className="text-[#888] text-[15px] font-light mt-[2px] mb-5 leading-[1.6]">{helperText}</p>

        {uploadedFiles.length > 0 && (
          <div className="flex flex-col gap-[5px] mb-[5px]">
            {uploadedFiles.map(file => (
              <div key={file.id} className="bg-[rgba(255,255,255,0.6)] border border-[rgba(0,0,0,0.1)] rounded-[9px] flex gap-[10px] items-center px-[15px] py-[11px]">
                <div className="bg-[rgba(0,0,0,0.06)] rounded-[7px] w-[32px] h-[32px] shrink-0 flex items-center justify-center">
                  <RiFileTextLine size={16} className="text-[#666]" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-[5px]">
                  <span className="font-medium text-[#111] text-[13px] leading-none truncate">{file.name}</span>
                  {file.progress < 100 ? (
                    <div className="bg-[rgba(0,0,0,0.1)] h-[2px] rounded-[2px] w-full overflow-hidden">
                      <div className="bg-[#111] h-full rounded-[2px] transition-[width] duration-75" style={{ width: `${file.progress}%` }} />
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#888]">Upload complete</span>
                  )}
                </div>
                <span className="text-[11px] text-black shrink-0">{formatSize(file.size)}</span>
                <button
                  onClick={() => handleRemove(file.id)}
                  className="shrink-0 w-[22px] h-[22px] rounded-[5px] flex items-center justify-center hover:bg-[rgba(0,0,0,0.06)] transition-colors cursor-pointer"
                >
                  <RiDeleteBin6Line size={12} className="text-[#999]" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
        />

        {sizeError ? (
          <div className="flex flex-col gap-[6px] mt-[5px] mb-5">
            <div className="bg-[#fef2f2] border border-dashed border-[#e8271c] rounded-[8px] flex flex-col items-center gap-[2px] px-[25px] py-[33px]">
              <p className="text-[24px] leading-[36px] opacity-50 text-[#141412]">&#9888;</p>
              <p className="text-[#e8271c] text-[13px] font-medium leading-[19.5px] pt-[6px]">File too large</p>
              <p className="text-[#9a9a94] text-[11.5px] text-center leading-[17.25px]">
                {sizeError.name} is {formatFileSizeCompact(sizeError.size)} — max allowed is{' '}
                {formatMaxSizeLabel(maxFileSizeLabel)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTryAnother}
              className="w-full bg-[#f7f7f5] border border-dashed border-[#e2e2de] rounded-[8px] py-[15px] px-[13px] text-[#5c5c56] text-[12px] text-center cursor-pointer hover:bg-[#f0f0ed] transition-colors"
            >
              + Try another file
            </button>
          </div>
        ) : (
          <div
            className="bg-[rgba(255,255,255,0.4)] border border-dashed border-[rgba(0,0,0,0.16)] rounded-[12px] flex flex-col items-center gap-[10px] pt-[34px] pb-[50px] px-[25px] mt-[5px] mb-5 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="bg-[rgba(0,0,0,0.06)] rounded-[10px] w-[40px] h-[40px] shrink-0 flex items-center justify-center pointer-events-none">
              <RiFileUploadLine size={20} className="text-[#666]" />
            </div>
            <span className="font-medium text-[#111] text-[14px] text-center pointer-events-none">
              {uploadedFiles.length > 0 ? 'Add another file' : 'Drop your files here'}
            </span>
            <div className="flex items-center gap-[10px] w-full pointer-events-none">
              <div className="bg-[rgba(0,0,0,0.1)] h-px flex-1" />
              <span className="text-[11px] text-black">or</span>
              <div className="bg-[rgba(0,0,0,0.1)] h-px flex-1" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="bg-[rgba(255,255,255,0.8)] border border-[rgba(0,0,0,0.16)] rounded-[8px] flex items-center gap-[6px] px-[19px] py-[9px] cursor-pointer hover:bg-white transition-colors"
            >
              <RiAddLine size={13} className="text-[#444] shrink-0" />
              <span className="font-medium text-[#444] text-[12.5px]">Browse files</span>
            </button>
            <span className="text-[11px] text-black text-center pointer-events-none">
              PDF, DOCX, PNG, JPG &middot; {maxSizeHint}
            </span>
          </div>
        )}
      </div>
      {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
    </>
  );
};

const TimePickerStepBtn = ({ onClick, direction, ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="bg-[rgba(255,255,255,0.6)] border border-[rgba(0,0,0,0.1)] h-[24px] w-[32px] rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer hover:bg-white/90 transition-colors"
  >
    {direction === 'up'
      ? <RiArrowUpSLine size={12} className="text-[#888]" />
      : <RiArrowDownSLine size={12} className="text-[#888]" />}
  </button>
);

const TimePickerColumn = ({ value, label, isActive, onActivate, onIncrement, onDecrement }) => (
  <div className="flex flex-col gap-[4px] items-center shrink-0">
    <TimePickerStepBtn direction="up" onClick={onIncrement} ariaLabel={`Increase ${label.toLowerCase()}`} />
    <button
      type="button"
      onClick={onActivate}
      className={`h-[44px] w-[64px] rounded-[10px] flex items-center justify-center shrink-0 border p-px cursor-pointer transition-colors ${
        isActive
          ? 'bg-[#111] border-[#111] text-white'
          : 'bg-[rgba(255,255,255,0.7)] border-[rgba(0,0,0,0.16)] text-[#111]'
      }`}
    >
      <span className="font-medium text-[22px] tracking-[0.44px] leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
    </button>
    <TimePickerStepBtn direction="down" onClick={onDecrement} ariaLabel={`Decrease ${label.toLowerCase()}`} />
    <span className="text-[10px] text-[#bbb] tracking-[0.6px] uppercase leading-none">{label}</span>
  </div>
);

const TimePickerCard = ({
  blockNum,
  onDelete,
  config,
  isPreviewMode = false,
  previewRequiredHint = false,
  onTimeChange,
}) => {
  const question = config?.timeQuestion || 'What time works best for you?';
  const helperText = config?.timeHelperText || 'Select your preferred time slot.';
  const required = !!config?.timeRequired;
  const use12h = config?.timeUse12h ?? false;
  const showSeconds = !!config?.timeShowSeconds;
  const minTime = config?.timeMinTime ?? '';
  const maxTime = config?.timeMaxTime ?? '';

  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(30);
  const [second, setSecond] = useState(0);
  const [period, setPeriod] = useState('AM');
  const [activeColumn, setActiveColumn] = useState('hour');
  const [rangeError, setRangeError] = useState(null);

  const wrapHour12 = (n) => (n > 12 ? 1 : n < 1 ? 12 : n);
  const wrapHour24 = (n) => (n > 23 ? 0 : n < 0 ? 23 : n);
  const wrapMinute = (n) => (n > 59 ? 0 : n < 0 ? 59 : n);
  const wrapSecond = (n) => (n > 59 ? 0 : n < 0 ? 59 : n);

  const applyBounds = useCallback(
    (h, m, s, p) => {
      let secs = selectionToSeconds({ hour: h, minute: m, second: s, period: p, use12h });
      if (!isTimeWithinBounds(secs, minTime, maxTime, { showSeconds })) {
        secs = clampSeconds(secs, minTime, maxTime, { showSeconds });
        return applySecondsToSelection(secs, { use12h, showSeconds });
      }
      return { hour: h, minute: m, second: s, period: p };
    },
    [use12h, showSeconds, minTime, maxTime],
  );

  const commitTime = useCallback(
    (h, m, s, p) => {
      const bounded = applyBounds(h, m, s, p);
      setHour(bounded.hour);
      setMinute(bounded.minute);
      setSecond(bounded.second);
      setPeriod(bounded.period);
      const secs = selectionToSeconds({ ...bounded, use12h });
      setRangeError(
        isTimeWithinBounds(secs, minTime, maxTime, { showSeconds })
          ? null
          : 'Selected time is outside the allowed range.',
      );
      onTimeChange?.(bounded);
    },
    [applyBounds, use12h, minTime, maxTime, showSeconds, onTimeChange],
  );

  useEffect(() => {
    if (!showSeconds) setSecond(0);
  }, [showSeconds]);

  useEffect(() => {
    commitTime(hour, minute, second, period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minTime, maxTime]);

  const prevUse12h = useRef(use12h);
  useEffect(() => {
    if (prevUse12h.current === use12h) return;
    prevUse12h.current = use12h;
    if (use12h) {
      const { hour12, period: p } = from24Hour(to24Hour(hour, period));
      commitTime(hour12, minute, second, p);
    } else {
      commitTime(to24Hour(hour, period), minute, second, period);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [use12h]);

  return (
    <>
      <div className="flex flex-col px-14 pt-11 pb-5">
        <SectionBadge num={blockNum} label="Time picker" />
        <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="font-medium text-[#111] tracking-[-0.52px] leading-[32.5px] flex-1 min-w-0" style={{ fontSize: '26px' }}>
            {question}
            {required && <span className="text-red-600 ml-1">*</span>}
          </p>
          <PreviewRequiredInline show={previewRequiredHint} />
        </div>
        {helperText && (
          <p className="text-[#888] text-[13px] font-light leading-[20.8px]">{helperText}</p>
        )}
        <div className="flex gap-[8px] items-center justify-center pb-[17px] pt-[19px] w-full">
          <TimePickerColumn
            value={hour}
            label="Hour"
            isActive={activeColumn === 'hour'}
            onActivate={() => setActiveColumn('hour')}
            onIncrement={() =>
              commitTime(
                use12h ? wrapHour12(hour + 1) : wrapHour24(hour + 1),
                minute,
                second,
                period,
              )
            }
            onDecrement={() =>
              commitTime(
                use12h ? wrapHour12(hour - 1) : wrapHour24(hour - 1),
                minute,
                second,
                period,
              )
            }
          />
          <span className="text-[#888] text-[22px] font-light leading-none pb-[18px] shrink-0">:</span>
          <TimePickerColumn
            value={minute}
            label="Minute"
            isActive={activeColumn === 'minute'}
            onActivate={() => setActiveColumn('minute')}
            onIncrement={() => commitTime(hour, wrapMinute(minute + 1), second, period)}
            onDecrement={() => commitTime(hour, wrapMinute(minute - 1), second, period)}
          />
          {showSeconds && (
            <>
              <span className="text-[#888] text-[22px] font-light leading-none pb-[18px] shrink-0">:</span>
              <TimePickerColumn
                value={second}
                label="Second"
                isActive={activeColumn === 'second'}
                onActivate={() => setActiveColumn('second')}
                onIncrement={() => commitTime(hour, minute, wrapSecond(second + 1), period)}
                onDecrement={() => commitTime(hour, minute, wrapSecond(second - 1), period)}
              />
            </>
          )}
          {use12h && (
            <div className="flex flex-col gap-[4px] pl-[4px] shrink-0">
              {(['AM', 'PM']).map((p) => {
                const selected = period === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => commitTime(hour, minute, second, p)}
                    className={`rounded-[7px] px-[15px] py-[9px] text-[12px] cursor-pointer transition-colors border ${
                      selected
                        ? 'bg-[#111] border-[#111] text-white font-medium'
                        : 'border-[rgba(0,0,0,0.16)] text-[#888] font-normal hover:bg-[rgba(0,0,0,0.03)]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {rangeError && (
          <p className="text-center text-[11px] text-[#d63030] pb-2 -mt-2">{rangeError}</p>
        )}
      </div>
      {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
    </>
  );
};

const MultiImageUploadCard = ({ blockNum, onDelete, config, fullCanvas = false, cardColor = '#f7f6f4', cardImage = null, isPreviewMode = false, previewStepNav = null, previewScreenValidatorRef }) => {
  const question   = config?.question   || 'Upload photos of the issue';
  const helperText = config?.helperText || 'Add up to 9 images. Drag to reorder.';
  const maxImages  = config?.maxFiles   || 9;
  const maxFileSizeLabel = config?.maxFileSize || '25 MB';
  const maxBytes = parseMaxFileSizeBytes(maxFileSizeLabel);
  const required   = !!config?.required;

  const [images, setImages]       = useState([]);
  const [sizeError, setSizeError] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOver, setDragOver]   = useState(null);
  const [addHovered, setAddHovered] = useState(false);
  const [previewRequiredHint, setPreviewRequiredHint] = useState(false);
  const fileInputRef = useRef(null);

  const snapRef = useRef({});
  snapRef.current = { required, imageCount: images.length };

  useEffect(() => {
    setPreviewRequiredHint(false);
  }, [images]);

  useEffect(() => {
    if (!previewScreenValidatorRef) return undefined;
    if (!isPreviewMode) {
      previewScreenValidatorRef.current = null;
      return undefined;
    }

    previewScreenValidatorRef.current = () => {
      const { required: rq, imageCount } = snapRef.current;
      if (!rq) {
        setPreviewRequiredHint(false);
        return true;
      }
      const ok = imageCount > 0;
      setPreviewRequiredHint(!ok);
      return ok;
    };
    return () => {
      previewScreenValidatorRef.current = null;
    };
  }, [isPreviewMode, previewScreenValidatorRef, required]);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const oversized = files.find((f) => f.size > maxBytes);
    if (oversized) {
      setSizeError({ name: oversized.name, size: oversized.size });
      e.target.value = '';
      return;
    }

    setSizeError(null);
    const remaining = maxImages - images.length;
    const toAdd = files.slice(0, remaining).map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const handleTryAnother = () => {
    setSizeError(null);
    fileInputRef.current?.click();
  };

  const handleRemove = (id) => {
    setImages(prev => {
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter(img => img.id !== id);
    });
  };

  /* â”€â”€ Drag-to-reorder handlers â”€â”€ */
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    setDragOver(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setImages(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOver(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOver(null);
  };

  const isAtMax = images.length >= maxImages;

  return (
    <CardShell fullCanvas={fullCanvas} cardColor={cardColor} cardImage={cardImage} footer={isPreviewMode && previewStepNav ? previewStepNav : null}>
      <div className="flex flex-col px-14 pt-11 pb-4">
        <SectionBadge num={blockNum} label="Multi-image upload" />
        <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="font-medium text-[#111] tracking-[-0.52px] leading-tight flex-1 min-w-0" style={{ fontSize: '26px' }}>
            {question}
          </p>
          <PreviewRequiredInline show={previewRequiredHint} />
        </div>
        <p className="text-[#888] text-[15px] font-light mt-[2px] leading-[1.6]">{helperText}</p>

        {sizeError && (
          <div className="flex flex-col gap-[6px] mt-[14px]">
            <div className="bg-[#fef2f2] border border-dashed border-[#e8271c] rounded-[8px] flex flex-col items-center gap-[2px] px-[25px] py-[33px]">
              <p className="text-[24px] leading-[36px] opacity-50 text-[#141412]">&#9888;</p>
              <p className="text-[#e8271c] text-[13px] font-medium leading-[19.5px] pt-[6px]">File too large</p>
              <p className="text-[#9a9a94] text-[11.5px] text-center leading-[17.25px]">
                {sizeError.name} is {formatFileSizeCompact(sizeError.size)} — max allowed is{' '}
                {formatMaxSizeLabel(maxFileSizeLabel)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTryAnother}
              className="w-full bg-[#f7f7f5] border border-dashed border-[#e2e2de] rounded-[8px] py-[15px] px-[13px] text-[#5c5c56] text-[12px] text-center cursor-pointer hover:bg-[#f0f0ed] transition-colors"
            >
              + Try another file
            </button>
          </div>
        )}

        {/* Counter + drag hint â€” only show once images exist */}
        {images.length > 0 && (
          <div className="flex items-center justify-between mt-[14px]">
            <span className="text-[#888] text-[11.5px]">{images.length} of {maxImages} uploaded</span>
            <div className="flex items-center gap-[4px]">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="1"    width="11" height="1.5" rx="0.75" fill="#111" />
                <rect x="0" y="4.75" width="11" height="1.5" rx="0.75" fill="#111" />
                <rect x="0" y="8.5"  width="11" height="1.5" rx="0.75" fill="#111" />
              </svg>
              <span className="text-[11px] text-[#111]">Drag to reorder</span>
            </div>
          </div>
        )}

        {/* Image grid â€” 4 per row, scrollable so card never expands */}
        <div className="mt-[10px] mb-[4px] overflow-y-auto" style={{ maxHeight: '250px' }}>
          <div className="grid grid-cols-4 gap-[6px]">
            {images.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative rounded-[8px] overflow-hidden aspect-square border transition-all cursor-grab active:cursor-grabbing select-none ${
                  dragOver === index
                    ? 'border-[#111] scale-[0.96] opacity-70'
                    : dragIndex === index
                    ? 'border-[rgba(0,0,0,0.1)] opacity-40'
                    : 'border-[rgba(0,0,0,0.1)]'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover pointer-events-none" />
                <button
                  onClick={() => handleRemove(img.id)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute top-[4px] right-[4px] w-[16px] h-[16px] rounded-full flex items-center justify-center backdrop-blur-[2px] bg-[rgba(0,0,0,0.5)] cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition-colors"
                >
                  <span className="text-white text-[9px] leading-none">Ã—</span>
                </button>
              </div>
            ))}

            {/* Add photo slot â€” always visible; disabled + tooltip when at max */}
            <div className="relative aspect-square">
              {addHovered && (
                <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] px-[8px] py-[4px] rounded-[5px] whitespace-nowrap z-10 pointer-events-none">
                  {isAtMax ? 'Max 9 reached' : 'Add photo'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111]" />
                </div>
              )}
              <button
                onClick={() => !isAtMax && fileInputRef.current?.click()}
                onMouseEnter={() => setAddHovered(true)}
                onMouseLeave={() => setAddHovered(false)}
                disabled={isAtMax}
                className={`w-full h-full border border-dashed rounded-[8px] flex flex-col items-center justify-center gap-[4px] transition-colors ${
                  isAtMax
                    ? 'border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] cursor-not-allowed opacity-40'
                    : 'border-[rgba(0,0,0,0.16)] bg-[rgba(255,255,255,0.4)] cursor-pointer hover:bg-[rgba(255,255,255,0.7)]'
                }`}
              >
                <RiAddLine size={16} className={isAtMax ? 'text-[#bbb]' : 'text-[#555]'} />
                <span className={`text-[10px] ${isAtMax ? 'text-[#bbb]' : 'text-[#555]'}`}>Add photo</span>
              </button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleSelect}
        />
      </div>
      {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
    </CardShell>
  );
};

const CTA_CONTENT_WIDTH_MAP = { Narrow: '280px', Default: '320px', Wide: '480px' };
const HEADING_FONT_WEIGHT_MAP = { Light: '300', Regular: '500', Bold: '700' };
const VIDEO_WIDTH_STYLES = {
  Full: { width: '100%' },
  Wide: { width: '90%', maxWidth: '90%', marginLeft: 'auto', marginRight: 'auto' },
  Medium: { width: '75%', maxWidth: '75%', marginLeft: 'auto', marginRight: 'auto' },
  Small: { width: '55%', maxWidth: '55%', marginLeft: 'auto', marginRight: 'auto' },
};
const VIDEO_ASPECT_RATIO_MAP = { '16:9': '16 / 9', '4:3': '4 / 3', '1:1': '1 / 1' };

/** Parse YouTube/Vimeo URL respecting the selected video source in configure */
function parseVideoEmbed(url, preferredSource = 'youtube') {
  if (!url?.trim()) return null;
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');

  if (preferredSource === 'vimeo' && !isVimeo) return null;
  if (preferredSource === 'youtube' && !isYoutube) return null;

  if (isYoutube) {
    const videoId = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1];
    return videoId
      ? { type: 'youtube', embedBase: `https://www.youtube.com/embed/${videoId}`, videoId }
      : null;
  }
  if (isVimeo) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return videoId
      ? { type: 'vimeo', embedBase: `https://player.vimeo.com/video/${videoId}`, videoId }
      : null;
  }
  return null;
}

function buildVideoEmbedUrl(parsed, { autoplay = false, loop = false, showControls = true } = {}) {
  if (!parsed) return null;
  const params = new URLSearchParams();
  if (parsed.type === 'youtube') {
    if (autoplay) {
      params.set('autoplay', '1');
      params.set('mute', '1');
    }
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', parsed.videoId);
    }
    if (!showControls) params.set('controls', '0');
    params.set('rel', '0');
  } else {
    if (autoplay) params.set('autoplay', '1');
    if (loop) params.set('loop', '1');
    if (!showControls) params.set('controls', '0');
  }
  const qs = params.toString();
  return qs ? `${parsed.embedBase}?${qs}` : parsed.embedBase;
}

const TEXT_VALIDATION_INPUT_TYPE = {
  None: 'text',
  Email: 'email',
  URL: 'url',
  Number: 'number',
  Phone: 'tel',
};

function validateTextValue(value, validation) {
  const v = String(value ?? '').trim();
  if (!v || !validation || validation === 'None') return true;
  switch (validation) {
    case 'Email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    case 'URL': {
      try {
        const u = v.startsWith('http://') || v.startsWith('https://') ? v : `https://${v}`;
        new URL(u);
        return true;
      } catch {
        return false;
      }
    }
    case 'Number':
      return v !== '' && !Number.isNaN(Number(v));
    case 'Phone':
      return /^[\d\s\-+().]{7,}$/.test(v);
    default:
      return true;
  }
}

/** Block-level or per-field required flag for contact/address/work composite fields */
function isCompositeFieldRequired(blockRequired, field) {
  return !!(blockRequired || field?.required);
}

function shuffleArray(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getChoicePickCount(picks) {
  return (picks || []).filter((p) => p !== 'Other').length;
}

/** Validates min/max/required for single, multiple, and media choice fields */
function validateChoicePicks({ required, multipleSelect, minChoices, maxChoices, picks, optionCount }) {
  const count = getChoicePickCount(picks);
  if (!required && count === 0) return true;
  const min = multipleSelect
    ? Math.max(required ? 1 : 0, Number(minChoices) || (required ? 1 : 0))
    : required ? 1 : 0;
  const max = multipleSelect
    ? (maxChoices == null ? optionCount + 1 : Number(maxChoices))
    : 1;
  if (count < min) return false;
  if (count > max) return false;
  return true;
}

const CHOICE_KEYBOARD_HINT = (i) => String.fromCharCode(65 + (i % 26));

/** Renders description instruction copy with list/link formatting from the configure panel */
function renderDescriptionContent(content, formatting, textAlignClass, contentStyle) {
  const linkStyle = formatting.link ? { color: '#2563eb', textDecoration: 'underline' } : {};
  const mergedStyle = { ...contentStyle, fontFamily: "'Geist', sans-serif", ...linkStyle };
  const lines = String(content || '').split('\n').filter((line) => line.length > 0);

  if (formatting.list) {
    const items = lines.length > 0 ? lines : [content];
    return (
      <ul className={`list-disc pl-5 space-y-1 text-[#6b6860] leading-[23px] ${textAlignClass}`} style={mergedStyle}>
        {items.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    );
  }

  return (
    <p className={`text-[#6b6860] leading-[23px] ${textAlignClass}`} style={mergedStyle}>
      {content}
    </p>
  );
}

/** Builder overlay when a field is marked hidden in configure */
const HiddenFieldOverlay = ({ show }) =>
  show ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] pointer-events-none"
      style={{ background: 'rgba(255,255,255,0.55)' }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#888] px-3 py-1 rounded-full border border-[rgba(0,0,0,0.12)] bg-white/90"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Hidden from respondents
      </span>
    </motion.div>
  ) : null;

/** Validates preview Continue when configured fields are marked required */
function isPreviewAdvanceAllowed(snap) {
  const g = (k) => String(snap.previewFields[k] ?? '').trim();
  const { cardKey, shortTextDraft, longTextDraft, previewPicks = [], captchaChecked, ratingValue } = snap;
  const realPicks = () => getChoicePickCount(previewPicks);

  switch (cardKey) {
    case 'buildingBlocks:CTA':
      return true;
    case 'buildingBlocks:Heading':
      if (snap.headingConfig?.headingHidden) return true;
      return !snap.headingConfig?.headingRequired || g('headingAns').length > 0;
    case 'buildingBlocks:Description':
      if (snap.descriptionConfig?.descriptionHidden) return true;
      return true;
    case 'buildingBlocks:Images':
      if (snap.imageConfig?.imageHidden) return true;
      return true;
    case 'buildingBlocks:Video':
      if (snap.videoConfig?.videoHidden) return true;
      return !snap.videoConfig?.videoRequired || g('videoAns').length > 0;
    case 'basicInfo:Contact': {
      const cc = snap.contactConfig || {};
      const br = !!cc.contactRequired;
      const cf = cc.contactFields || {};
      const need = (fld) => !!(fld?.visible !== false && (br || fld?.required === true));
      if (need(cf.firstName) && !g('c.fn')) return false;
      if (need(cf.lastName) && !g('c.ln')) return false;
      if (need(cf.email) && !g('c.em')) return false;
      if (need(cf.phone) && !g('c.ph')) return false;
      if (need(cf.company) && !g('c.co')) return false;
      return true;
    }
    case 'basicInfo:Address': {
      const ac = snap.addressConfig || {};
      const br = !!ac.addressRequired;
      const af = ac.addressFields || {};
      const need = (fld) => !!(fld?.visible !== false && (br || fld?.required === true));
      if (need(af.street) && !g('a.st')) return false;
      if (need(af.city) && !g('a.ci')) return false;
      if (need(af.state) && !g('a.ste')) return false;
      if (need(af.postal) && !g('a.po')) return false;
      if (need(af.country) && !g('a.ct')) return false;
      return true;
    }
    case 'basicInfo:Work Info': {
      const wc = snap.workConfig || {};
      const br = !!wc.workRequired;
      const wf = wc.workFields || {};
      const need = (fld) => !!(fld?.visible !== false && (br || fld?.required === true));
      if (need(wf.company) && !g('w.co')) return false;
      if (need(wf.title) && !g('w.ti')) return false;
      if (need(wf.industry) && !g('w.ind')) return false;
      if (need(wf.teamSize) && !g('w.ts')) return false;
      return true;
    }
    case 'qualitative:Short text': {
      const st = snap.shortTextConfig || {};
      if (st.shortTextHidden) return true;
      const val = String(shortTextDraft ?? '').trim();
      if (st.shortTextRequired && !val) return false;
      const min = Math.max(0, Number(st.shortTextMinChars) || 0);
      if (val && min > 0 && val.length < min) return false;
      if (val && !validateTextValue(val, st.shortTextValidation)) return false;
      return true;
    }
    case 'qualitative:Long text': {
      const lt = snap.longTextConfig || {};
      if (lt.longTextHidden) return true;
      const val = String(longTextDraft ?? '').trim();
      if (lt.longTextRequired && !val) return false;
      const min = Math.max(0, Number(lt.longTextMinChars) || 0);
      if (val && min > 0 && val.length < min) return false;
      if (val && !validateTextValue(val, lt.longTextValidation)) return false;
      return true;
    }
    case 'choiceBased:Single': {
      const sc = snap.singleConfig || {};
      const opts = sc.singleOptions || [];
      return validateChoicePicks({
        required: !!sc.singleRequired,
        multipleSelect: !!sc.singleMultipleSelect,
        minChoices: sc.singleMinChoices,
        maxChoices: sc.singleMaxChoices,
        picks: previewPicks,
        optionCount: opts.length,
      });
    }
    case 'choiceBased:Multiple': {
      const mc = snap.multipleConfig || {};
      const opts = mc.multipleOptions || [];
      return validateChoicePicks({
        required: !!mc.multipleRequired,
        multipleSelect: !!mc.multipleMultipleSelect,
        minChoices: mc.multipleMinChoices,
        maxChoices: mc.multipleMaxChoices,
        picks: previewPicks,
        optionCount: opts.length,
      });
    }
    case 'choiceBased:Media': {
      const me = snap.mediaConfig || {};
      const opts = me.mediaOptions || [];
      return validateChoicePicks({
        required: !!me.mediaRequired,
        multipleSelect: !!me.mediaAllowMultiple,
        minChoices: me.mediaMinChoices,
        maxChoices: me.mediaMaxChoices,
        picks: previewPicks,
        optionCount: opts.length,
      });
    }
    case 'interactive:Maps': {
      const mapc = snap.mapConfig || {};
      if (!mapc.mapRequired) return true;
      const sel = snap.mapSelection;
      return !!(sel?.lat != null && sel?.lng != null && (sel?.address || '').trim());
    }
    case 'interactive:Captcha': {
      const cap = snap.captchaConfig || {};
      if (cap.captchaEnabled === false) return true;
      return !!captchaChecked;
    }
    case 'numeric:Rating':
      return !snap.ratingConfig?.ratingRequired || (ratingValue ?? 0) > 0;
    case 'numeric:Time': {
      const tc = snap.timeConfig || {};
      const sel = snap.timeSelection;
      if (!sel) return !tc.timeRequired;
      const secs = selectionToSeconds({
        hour: sel.hour,
        minute: sel.minute,
        second: sel.second ?? 0,
        period: sel.period,
        use12h: !!tc.timeUse12h,
      });
      return isTimeWithinBounds(secs, tc.timeMinTime, tc.timeMaxTime, {
        showSeconds: !!tc.timeShowSeconds,
      });
    }
    default:
      return true;
  }
}

const ContentCard = ({
  block,
  blockNum,
  onDelete,
  ctaConfig,
  headingConfig,
  descriptionConfig,
  imageConfig,
  imageFileInputRef,
  videoConfig,
  contactConfig,
  addressConfig,
  workConfig,
  shortTextConfig,
  longTextConfig,
  responseQualityConfig,
  singleConfig,
  multipleConfig,
  mediaConfig,
  mapConfig,
  captchaConfig,
  multiImageConfig,
  uploadConfig,
  ratingConfig,
  dateConfig,
  timeConfig,
  fullCanvas = false,
  cardColor = '#f7f6f4',
  cardImage = null,
  isPreviewMode = false,
  onPreviewAdvance,
  previewStepNav = null,
  previewScreenValidatorRef,
  onPreviewSnapChange,
  previewScreenId,
}) => {
  const { section, label } = block;
  const cardKey = `${section}:${label}`;

  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [shortTextDraft, setShortTextDraft] = useState('');
  const [previewFields, setPreviewFields] = useState({});
  const [previewPicks, setPreviewPicks] = useState([]);
  const [longTextDraft, setLongTextDraft] = useState('');
  const [previewRequiredHint, setPreviewRequiredHint] = useState(false);
  const [mapSelection, setMapSelection] = useState(null);
  const [timeSelection, setTimeSelection] = useState(null);

  const shortTextMaxCap = shortTextConfig?.shortTextMaxChars ?? 100;
  const shortTextCapRef = useRef(shortTextMaxCap);
  if (shortTextCapRef.current !== shortTextMaxCap) {
    shortTextCapRef.current = shortTextMaxCap;
    setShortTextDraft((d) => (d.length > shortTextMaxCap ? d.slice(0, shortTextMaxCap) : d));
  }

  const pf = (key, def = '') => previewFields[key] ?? def;
  const setPf = (key, val) => setPreviewFields((prev) => ({ ...prev, [key]: val }));

  const togglePreviewPick = (optLabel, allowMultiple, maxChoices = null) => {
    setPreviewPicks((prev) => {
      if (allowMultiple) {
        if (prev.includes(optLabel)) return prev.filter((x) => x !== optLabel);
        const max = maxChoices == null ? Infinity : Number(maxChoices);
        if (getChoicePickCount(prev) >= max) return prev;
        return [...prev, optLabel];
      }
      return prev.includes(optLabel) ? [] : [optLabel];
    });
  };

  const singleOptsKey = (singleConfig?.singleOptions || []).join('\x1e');
  const singleDisplayOpts = useMemo(() => {
    const sc = singleConfig || {};
    const opts = sc.singleOptions || ['Social media', 'Search engine', 'Friend / colleague', 'Advertisement'];
    const allowOther = sc.singleAllowOther ?? true;
    const base = allowOther ? [...opts, 'Other'] : [...opts];
    return sc.singleRandomize ? shuffleArray(base) : base;
  }, [singleOptsKey, singleConfig?.singleAllowOther, singleConfig?.singleRandomize]);

  const multipleOptsKey = (multipleConfig?.multipleOptions || []).join('\x1e');
  const multipleDisplayOpts = useMemo(() => {
    const mc = multipleConfig || {};
    const opts = mc.multipleOptions || ['Dashboard', 'Reports', 'Integrations', 'Analytics'];
    const allowOther = mc.multipleAllowOther ?? false;
    const base = allowOther ? [...opts, 'Other'] : [...opts];
    return mc.multipleRandomize ? shuffleArray(base) : base;
  }, [multipleOptsKey, multipleConfig?.multipleAllowOther, multipleConfig?.multipleRandomize]);

  const mediaOptsKey = (mediaConfig?.mediaOptions || []).map((o) => o?.label ?? '').join('\x1e');
  const mediaDisplayOpts = useMemo(() => {
    const opts = mediaConfig?.mediaOptions || [];
    return mediaConfig?.mediaRandomiseOrder ? shuffleArray([...opts]) : opts;
  }, [mediaOptsKey, mediaConfig?.mediaRandomiseOrder]);

  const responseQualityEvaluation = useMemo(() => {
    if (!isPreviewMode || cardKey !== 'qualitative:Long text' || !responseQualityConfig?.enabled) {
      return null;
    }
    return evaluateResponseQuality(longTextDraft, responseQualityConfig);
  }, [isPreviewMode, cardKey, responseQualityConfig, longTextDraft]);

  const snapRef = useRef({});
  snapRef.current = {
    cardKey,
    previewFields,
    shortTextDraft,
    longTextDraft,
    previewPicks,
    captchaChecked,
    ratingValue,
    headingConfig,
    videoConfig,
    contactConfig,
    addressConfig,
    workConfig,
    shortTextConfig,
    longTextConfig,
    singleConfig,
    multipleConfig,
    mediaConfig,
    mapConfig,
    mapSelection,
    captchaConfig,
    ratingConfig,
    dateConfig,
    timeConfig,
    timeSelection,
  };

  useEffect(() => {
    setPreviewRequiredHint(false);
  }, [previewFields, shortTextDraft, longTextDraft, previewPicks, captchaChecked, ratingValue]);

  useEffect(() => {
    if (!isPreviewMode || !onPreviewSnapChange || previewScreenId == null) return;
    onPreviewSnapChange(previewScreenId, snapRef.current);
  }, [
    isPreviewMode,
    onPreviewSnapChange,
    previewScreenId,
    previewFields,
    shortTextDraft,
    longTextDraft,
    previewPicks,
    captchaChecked,
    ratingValue,
    mapSelection,
    timeSelection,
  ]);

  useEffect(() => {
    if (!previewScreenValidatorRef) return undefined;

    if (!isPreviewMode) {
      previewScreenValidatorRef.current = null;
      return undefined;
    }

    previewScreenValidatorRef.current = null;
    if (cardKey === 'interactive:Multi-image upload') {
      return () => {
        previewScreenValidatorRef.current = null;
      };
    }

    previewScreenValidatorRef.current = () => {
      const ok = isPreviewAdvanceAllowed(snapRef.current);
      setPreviewRequiredHint(!ok);
      return ok;
    };
    return () => {
      previewScreenValidatorRef.current = null;
    };
  }, [isPreviewMode, cardKey, previewScreenValidatorRef]);

  let content;

  if (cardKey === 'buildingBlocks:CTA') {
    const cc = ctaConfig || {};
    const btnLabel     = cc.ctaButtonLabel  ?? 'Get started';
    const btnSize      = cc.ctaButtonSize   ?? 'M';
    const btnStyle     = cc.ctaButtonStyle  ?? 'Filled';
    const btnRadius    = cc.ctaCornerRadius ?? 10;
    const showIcon     = cc.ctaShowIcon     ?? true;
    const headingSize  = cc.ctaHeadingSize  ?? 32;
    const bodySize     = cc.ctaBodySize     ?? 15;
    const fontWeight   = cc.ctaFontWeight   ?? 'Regular';
    const textAlign    = cc.ctaTextAlign    ?? 'center';
    const padding      = cc.ctaPadding      ?? 44;

    const btnSizePxMap  = { S: { px: '14px', py: '8px', text: '14px' }, M: { px: '28px', py: '12px', text: '15px' }, L: { px: '36px', py: '14px', text: '16px' }, XL: { px: '44px', py: '16px', text: '18px' } };
    const { px: bPx, py: bPy, text: bText } = btnSizePxMap[btnSize] || btnSizePxMap['M'];
    const fontWeightMap = { Light: '300', Regular: '500', Bold: '700' };
    const textAlignClass = textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left';

    const isFilled  = btnStyle === 'Filled';
    const isOutline = btnStyle === 'Outline';
    const isGhost   = btnStyle === 'Ghost';
    const accent    = cc.ctaBtnColor ?? '#111';
    const btnBg     = isFilled ? accent : 'transparent';
    const btnColor  = cc.ctaTextColor
      ?? (cc.ctaLabelColor === 'black' ? '#111' : '#fff');
    const btnBorder = isOutline || isGhost ? `1.5px solid ${accent}` : 'none';
    const effectiveBtnColor = isGhost ? accent : btnColor;
    const contentMaxWidth = CTA_CONTENT_WIDTH_MAP[cc.ctaContentWidth] || CTA_CONTENT_WIDTH_MAP.Default;

    content = (
      <>
        <div
          className={`flex-1 flex flex-col items-center justify-center gap-[9px] px-14 ${textAlignClass}`}
          style={{ paddingTop: padding, paddingBottom: padding }}
        >
          <div className="bg-[#111] w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0">
            <BoxesIcon size={18} className="text-white" />
          </div>
          <div className="pt-[11px] w-full mx-auto" style={{ maxWidth: contentMaxWidth }}>
            <p
              className={`text-[#111] tracking-[-0.56px] leading-[1.3] ${textAlignClass}`}
              style={{ fontSize: headingSize, fontWeight: fontWeightMap[fontWeight] }}
            >
              Welcome to our survey
            </p>
          </div>
          <div className={`w-full mx-auto ${textAlignClass}`} style={{ maxWidth: contentMaxWidth }}>
            <p className={`text-[#888] font-light leading-[1.6] ${textAlignClass}`} style={{ fontSize: bodySize }}>
              Please fill out this form to help us improve. It only takes a couple of minutes and your feedback matters.
            </p>
          </div>
          {isPreviewMode ? (
            <button
              type="button"
              onClick={() => onPreviewAdvance?.()}
              className="flex gap-[7px] items-center justify-center mt-2 cursor-pointer"
              style={{
                background: btnBg,
                color: effectiveBtnColor,
                border: btnBorder,
                borderRadius: `${btnRadius}px`,
                paddingLeft: bPx,
                paddingRight: bPx,
                paddingTop: bPy,
                paddingBottom: bPy,
              }}
            >
              <span style={{ fontSize: bText, fontWeight: '500' }}>{btnLabel}</span>
              {showIcon && <RiArrowRightLine size={12} style={{ color: effectiveBtnColor }} />}
            </button>
          ) : (
            <div
              className="flex gap-[7px] items-center mt-2"
              style={{
                background: btnBg,
                color: effectiveBtnColor,
                border: btnBorder,
                borderRadius: `${btnRadius}px`,
                paddingLeft: bPx,
                paddingRight: bPx,
                paddingTop: bPy,
                paddingBottom: bPy,
              }}
            >
              <span style={{ fontSize: bText, fontWeight: '500' }}>{btnLabel}</span>
              {showIcon && <RiArrowRightLine size={12} style={{ color: effectiveBtnColor }} />}
            </div>
          )}
          <div className="flex gap-[5px] items-center justify-center pt-[5px]">
            <RiTimeLine size={12} className="text-black" />
            <span className="text-[12px] text-black">Takes ~3 minutes</span>
          </div>
        </div>
        {!isPreviewMode && (
        <div className="border-t border-[rgba(0,0,0,0.1)] flex gap-2 items-center px-14 py-[19px]">
          <button
            onClick={onDelete}
            className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,245,245,0.7)] border border-[rgba(200,50,50,0.2)] text-[#d63030] text-[12px] cursor-pointer hover:bg-[rgba(255,235,235,0.9)] transition-colors whitespace-nowrap"
          >
            <RiDeleteBin6Line size={12} className="shrink-0" />
            Delete
          </button>
          <button className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap">
            <RiPencilLine size={12} className="shrink-0" />
            Edit content
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-[5px] px-[16px] py-[8px] rounded-[8px] bg-[#111] text-white text-[12px] font-medium cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap">
            <RiCheckLine size={11} className="shrink-0" />
            Save
          </button>
        </div>
        )}
      </>
    );
  } else if (cardKey === 'buildingBlocks:Heading') {
    const hc = headingConfig || {};
    const hText = hc.headingText || 'Tell us about yourself';
    const hLevel = hc.headingLevel || 'H2';
    const hSize = hc.headingTextSize || 'M';
    const hAlign = hc.headingAlignment || 'left';
    const hHidden = !!hc.headingHidden;
    const hRequired = !!hc.headingRequired;
    const isEditingHeading = hc.isEditingCard || false;
    const textAlignClass = hAlign === 'center' ? 'text-center' : hAlign === 'right' ? 'text-right' : 'text-left';
    // Heading level controls the heading title size
    const headingLevelSizeMap = { H1: '40px', H2: '32px', H3: '26px', H4: '20px' };
    const headingLevelWeightMap = { H1: '700', H2: '600', H3: '600', H4: '500' };
    const hTitleWeight = HEADING_FONT_WEIGHT_MAP[hc.headingFontWeight] ?? headingLevelWeightMap[hLevel];
    // Text size controls the answer textarea font size
    const answerTextSizeMap = { S: '15px', M: '17px', L: '20px', XL: '24px' };
    content = (
      <>
        <div className={`relative flex-1 flex flex-col px-14 pt-11 pb-5 gap-3 ${hHidden && !isPreviewMode ? 'opacity-40' : ''} ${hHidden && isPreviewMode ? 'hidden' : ''}`}>
          <HiddenFieldOverlay show={hHidden && !isPreviewMode} />
          {/* Badge label â€” driven by Sub-heading field in Configure panel */}
          <p className={`text-[#888] text-[15px] tracking-[0.42px] uppercase ${textAlignClass}`}>
            {hc.subHeading || 'SECTION HEADING'}
          </p>

          {/* Heading title â€” size driven by Heading Level; editable in edit mode */}
          {isPreviewMode ? (
            <div
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 w-full ${
                hAlign === 'center' ? 'justify-center' : 'justify-between'
              }`}
            >
              <p
                className={`text-[#111] tracking-[-0.52px] leading-[1.3] ${hAlign === 'center' ? '' : 'flex-1'} min-w-0 ${textAlignClass}`}
                style={{ fontSize: headingLevelSizeMap[hLevel], fontWeight: hTitleWeight }}
              >
                {hText}
                {hRequired && <span className="text-red-600 ml-1">*</span>}
              </p>
              <PreviewRequiredInline show={previewRequiredHint} />
            </div>
          ) : isEditingHeading ? (
            <input
              type="text"
              value={hc.headingText || ''}
              onChange={(e) => hc.setHeadingText?.(e.target.value)}
              className={`text-[#111] tracking-[-0.52px] leading-[1.3] bg-transparent border-b border-[#c8c6c0] outline-none w-full focus:border-[#111] transition-colors pb-1 ${textAlignClass}`}
              style={{ fontSize: headingLevelSizeMap[hLevel], fontWeight: hTitleWeight }}
              placeholder="Tell us about yourself"
            />
          ) : (
            <p
              className={`text-[#111] tracking-[-0.52px] leading-[1.3] ${textAlignClass}`}
              style={{ fontSize: headingLevelSizeMap[hLevel], fontWeight: hTitleWeight }}
            >
              {hText}
              {hRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
          )}

          {/* Answer area â€” size driven by Text Size; pinned to bottom, grows upward as content fills */}
          <div className={`flex-1 flex flex-col justify-end pb-2 pt-4 ${hHidden && isPreviewMode ? 'hidden' : ''}`}>
            {isPreviewMode ? (
              <textarea
                value={pf('headingAns')}
                onChange={(e) => setPf('headingAns', e.target.value)}
                rows={1}
                className={`text-[#333] font-light leading-[1.6] bg-transparent border-b border-[#111] outline-none w-full resize-none transition-colors pb-[11px] pt-[10px] ${textAlignClass}`}
                style={{ fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', fontSize: answerTextSizeMap[hSize] }}
                placeholder="Type your answer hereâ€¦"
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
            ) : isEditingHeading ? (
              <textarea
                value={hc.headingAnswerText || ''}
                onChange={(e) => hc.setHeadingAnswerText?.(e.target.value)}
                rows={1}
                className={`text-[#555] font-light leading-[1.6] bg-transparent border-b border-[#111] outline-none w-full resize-none transition-colors pb-[11px] pt-[10px] ${textAlignClass}`}
                style={{ fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', fontSize: answerTextSizeMap[hSize] }}
                placeholder="Type your answer hereâ€¦"
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
            ) : (
              <div className="border-b border-[#111] pb-[11px] pt-[10px]">
                <p
                  className={`font-light ${hc.headingAnswerText ? 'text-[#333]' : 'text-[#aaa]'}`}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: answerTextSizeMap[hSize] }}
                >
                  {hc.headingAnswerText || 'Type your answer hereâ€¦'}
                </p>
              </div>
            )}
          </div>
        </div>
        {!isPreviewMode && (
        <div className="border-t border-[rgba(0,0,0,0.1)] flex items-center gap-2 px-14 py-[19px]">
          {isEditingHeading ? (
            <button
              onClick={hc.onEditToggle}
              className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
            >
              <RiArrowLeftLine size={12} className="shrink-0" aria-hidden />
              Back
            </button>
          ) : (
            <button
              onClick={hc.onEditToggle}
              className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
            >
              <RiPencilLine size={12} className="shrink-0" />
              Edit content
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,245,245,0.7)] border border-[rgba(200,50,50,0.2)] text-[#d63030] text-[12px] cursor-pointer hover:bg-[rgba(255,235,235,0.9)] transition-colors whitespace-nowrap"
          >
            <RiDeleteBin6Line size={12} className="shrink-0" />
            Delete
          </button>
          <div className="flex-1" />
          <button
            className="flex items-center gap-[5px] px-[16px] py-[8px] rounded-[8px] bg-[#111] text-white text-[12px] font-medium cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap"
            onClick={isEditingHeading ? hc.onEditToggle : undefined}
          >
            <RiCheckLine size={11} className="shrink-0" />
            Save
          </button>
        </div>
        )}
      </>
    );
  } else if (cardKey === 'buildingBlocks:Description') {
    const dc = descriptionConfig || {};
    const dcContent = dc.descriptionContent || 'This field is required only if you are currently employed full time. If not, you can skip ahead to the next section.';
    const dcSize = dc.descriptionTextSize || 'M';
    const dcAlign = dc.descriptionAlignment || 'left';
    const dcFormatting = dc.descriptionFormatting || {};
    const dcHidden = !!dc.descriptionHidden;
    const dcShowCharCount = dc.descriptionShowCharCount || false;
    const dcCharLimit = dc.descriptionCharLimit || '';
    const fontSizeMap = { S: '16px', M: '18px', L: '20px' };
    const textAlignClass = dcAlign === 'center' ? 'text-center' : dcAlign === 'right' ? 'text-right' : 'text-left';
    const contentStyle = {
      fontSize: fontSizeMap[dcSize],
      fontWeight: dcFormatting.bold ? '600' : '400',
      fontStyle: dcFormatting.italic ? 'italic' : 'normal',
      textDecoration: dcFormatting.underline ? 'underline' : 'none',
    };
    content = (
      <div className={`relative flex-1 flex flex-col ${dcHidden && !isPreviewMode ? 'opacity-40' : ''} ${dcHidden && isPreviewMode ? 'hidden' : ''}`}>
        <HiddenFieldOverlay show={dcHidden && !isPreviewMode} />
        <div className="flex-1 flex flex-col px-[28px] pt-[32px] pb-[20px] gap-[8px]">
          {/* Block type label */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 w-full">
            <span
              className="text-[13px] font-semibold tracking-[1.4px] uppercase text-black"
              style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
            >
              Description
            </span>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {/* Instruction sub-label */}
          <div className="pt-[2px]">
            <span
              className="text-[#6b6860] text-[12px] font-semibold tracking-[0.66px] uppercase"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              INSTRUCTION
            </span>
          </div>
          {/* Description content in vertical border */}
          <div className="border-l-2 border-[#e4e2dc] pl-[14px] py-[2px]">
            {renderDescriptionContent(dcContent, dcFormatting, textAlignClass, contentStyle)}
          </div>
        </div>
        {/* Input area + gray line just above footer */}
        <div className={`px-[28px] pt-[4px] pb-[0px] ${dcHidden && isPreviewMode ? 'hidden' : ''}`}>
          <div className="border-b border-[#111] pb-[11px]">
            {isPreviewMode ? (
              <textarea
                value={pf('descAns')}
                onChange={(e) => setPf('descAns', dcCharLimit ? e.target.value.slice(0, Number(dcCharLimit) || 5000) : e.target.value)}
                rows={2}
                placeholder="Type your answer hereâ€¦"
                className={`w-full text-black text-[17px] font-light bg-transparent outline-none border-0 resize-none placeholder:text-[#bbb] ${textAlignClass}`}
                style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
              />
            ) : (
              <p
                className={`text-black text-[17px] font-light ${textAlignClass}`}
                style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
              >
                Type your answer hereâ€¦
              </p>
            )}
          </div>
          {dcShowCharCount && (
            <div className="flex justify-end mt-[4px]">
              <span className="text-[#bbb] text-[11px]">
                {(isPreviewMode ? pf('descAns').length : 0)}{dcCharLimit ? ` / ${dcCharLimit}` : ''}
              </span>
            </div>
          )}
          <div className="h-px bg-[#e4e2dc] mt-[14px]" />
        </div>
        {/* Footer */}
        {!isPreviewMode && (
        <div className="flex items-center justify-between px-[28px] py-[16px]">
          <div className="flex gap-2">
            <button
              onClick={onDelete}
              className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[12px] cursor-pointer hover:bg-[#fee2e2] transition-colors whitespace-nowrap"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <RiDeleteBin6Line size={12} className="shrink-0" />
              Delete
            </button>
            <button
              className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[8px] bg-white border border-[#e4e2dc] text-[#1a1a1a] text-[12px] cursor-pointer hover:bg-[#f4f3ef] transition-colors whitespace-nowrap"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <RiPencilLine size={12} className="shrink-0" />
              Edit
            </button>
          </div>
          <button
            className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#1a1a1a] text-white text-[12px] font-medium cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap"
            style={{ fontFamily: "'Geist', sans-serif" }}
          >
            <RiCheckLine size={11} className="shrink-0" />
            Save
          </button>
        </div>
        )}
      </div>
    );
  } else if (cardKey === 'buildingBlocks:Images') {
    const ic = imageConfig || {};
    const imgPreview = ic.imagePreview || null;
    const imgAltText = ic.imageAltText || '';
    const imgCaption = ic.imageCaption || '';
    const imgAlignment = ic.imageAlignment || 'left';
    const imgWidth = ic.imageWidth || 'Full';
    const imgCornerRadius = ic.imageCornerRadius ?? 8;
    const imgQuestion = ic.imageQuestion || 'What do you see in this image?';
    const imgDescription = ic.imageDescription || "Describe what's happening in the photo above.";
    const imgLinkOnClick = ic.imageLinkOnClick || false;
    const imgLinkUrl = ic.imageLinkUrl || '';
    const imgOpenInNewTab = ic.imageOpenInNewTab || false;
    const imgAnswerText = ic.imageAnswerText || '';
    const imgHidden = !!ic.imageHidden;

    const alignClass = imgAlignment === 'center' ? 'items-center' : imgAlignment === 'right' ? 'items-end' : 'items-start';
    const imgWidthStyle = imgWidth === 'Fit' ? { width: 'auto', maxWidth: '100%' } : imgWidth === 'Custom' ? { width: '60%' } : { width: '100%' };

    const imageArea = imgPreview ? (
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: imgCornerRadius, ...imgWidthStyle }}
      >
        {imgLinkOnClick && imgLinkUrl ? (
          <a href={imgLinkUrl} target={imgOpenInNewTab ? '_blank' : '_self'} rel="noreferrer">
            <img
              src={imgPreview}
              alt={imgAltText || 'Uploaded image'}
              className="w-full object-cover"
              style={{ borderRadius: imgCornerRadius }}
            />
          </a>
        ) : (
          <img
            src={imgPreview}
            alt={imgAltText || 'Uploaded image'}
            className="w-full object-cover"
            style={{ borderRadius: imgCornerRadius }}
          />
        )}
        {/* Replace / Remove overlay buttons */}
        {!isPreviewMode && (
        <div className="absolute top-[10px] right-[10px] flex gap-[6px]">
          <button
            onClick={() => imageFileInputRef && imageFileInputRef.current && imageFileInputRef.current.click()}
            className="flex gap-[5px] items-center px-[11px] py-[6px] rounded-[20px] bg-white/88 border border-[rgba(0,0,0,0.1)] text-[#444] text-[11px] font-medium backdrop-blur-sm cursor-pointer hover:bg-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.88)' }}
          >
            <RiPencilLine size={11} className="shrink-0" />
            Replace
          </button>
          <button
            onClick={() => ic.onRemoveImage && ic.onRemoveImage()}
            className="flex gap-[5px] items-center px-[11px] py-[6px] rounded-[20px] border border-[rgba(0,0,0,0.1)] text-[#d63030] text-[11px] font-medium backdrop-blur-sm cursor-pointer hover:bg-red-50 transition-colors"
            style={{ background: 'rgba(255,255,255,0.88)' }}
          >
            <RiDeleteBin6Line size={11} className="shrink-0" />
            Remove
          </button>
        </div>
        )}
        {/* File info bar */}
        <div className="bg-[rgba(0,0,0,0.03)] border-t border-[rgba(0,0,0,0.1)] px-[12px] py-[8px]">
          <p className="text-[11px] text-black font-light">
            {imgCaption || 'image.jpg Â· uploaded'}
          </p>
        </div>
      </div>
    ) : isPreviewMode ? (
      <div
        className={`bg-[#eceae6] overflow-hidden`}
        style={{ borderRadius: imgCornerRadius, ...imgWidthStyle }}
      >
        <div className="flex flex-col items-center justify-center py-[90px] gap-[10px]">
          <ImagesCardIcon size={32} className="text-[#aaa]" />
          <p className="text-[12px] text-black font-light">No image (builder preview)</p>
        </div>
        <div className="bg-[rgba(0,0,0,0.03)] border-t border-[rgba(0,0,0,0.1)] px-[12px] py-[8px]">
          <p className="text-[11px] text-black font-light">The author will add an image here</p>
        </div>
      </div>
    ) : (
      <button
        onClick={() => imageFileInputRef && imageFileInputRef.current && imageFileInputRef.current.click()}
        className={`bg-[#eceae6] overflow-hidden cursor-pointer hover:bg-[#e4e2de] transition-colors`}
        style={{ borderRadius: imgCornerRadius, ...imgWidthStyle }}
      >
        <div className="flex flex-col items-center justify-center py-[90px] gap-[10px]">
          <ImagesCardIcon size={32} className="text-[#aaa]" />
          <p className="text-[12px] text-black font-light">Image preview</p>
        </div>
        <div className="bg-[rgba(0,0,0,0.03)] border-t border-[rgba(0,0,0,0.1)] px-[12px] py-[8px]">
          <p className="text-[11px] text-black font-light">Click to upload an image</p>
        </div>
      </button>
    );

    content = (
      <div
        className={`relative flex flex-col shrink-0 px-14 pt-11 pb-5 ${imgHidden && !isPreviewMode ? 'opacity-40' : ''} ${imgHidden && isPreviewMode ? 'hidden' : ''}`}
      >
        <HiddenFieldOverlay show={imgHidden && !isPreviewMode} />
        <SectionBadge num={blockNum} label="Short text + Image" />
        <div className={`flex flex-col pt-[10px] ${alignClass}`}>
          {imageArea}
        </div>
        <div className="pt-[15px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
            {imgQuestion}
          </p>
          <PreviewRequiredInline show={previewRequiredHint} />
        </div>
        <p className="text-[#888] text-[15px] font-light mt-[1px] mb-[19.8px] leading-[20.8px]">{imgDescription}</p>
        <div className="border-b border-[rgba(0,0,0,0.16)] pb-[11px] pt-[10px]">
          {isPreviewMode ? (
            <textarea
              value={pf('imgAns')}
              onChange={(e) => setPf('imgAns', e.target.value.slice(0, 200))}
              rows={2}
              placeholder="Type your answer hereâ€¦"
              className="w-full text-black text-[15px] font-light bg-transparent outline-none border-0 resize-none placeholder:text-[#aaa]"
            />
          ) : (
            <p className="text-black text-[15px] font-light">{imgAnswerText || 'Type your answer hereâ€¦'}</p>
          )}
        </div>
        <div className="flex items-center justify-between pt-[4px] pb-[18px]">
          <span className="text-[11px] text-black font-light">Press Enter â†µ to continue</span>
          <span className="text-[11px] text-black">{isPreviewMode ? `${pf('imgAns').length}` : '0'} / 200</span>
        </div>
        {!isPreviewMode && (
        <div className="border-t border-[rgba(0,0,0,0.1)] flex gap-[7px] items-center pt-[19px]">
          <button
            onClick={() => imageFileInputRef && imageFileInputRef.current && imageFileInputRef.current.click()}
            className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
          >
            <ImagesCardIcon size={12} className="shrink-0" />
            Change image
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,245,245,0.7)] border border-[rgba(200,50,50,0.2)] text-[#d63030] text-[12px] cursor-pointer hover:bg-[rgba(255,235,235,0.9)] transition-colors whitespace-nowrap"
          >
            <RiDeleteBin6Line size={12} className="shrink-0" />
            Delete
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-[5px] px-[16px] py-[8px] rounded-[8px] bg-[#111] text-white text-[12px] font-medium cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap">
            <RiCheckLine size={11} className="shrink-0" />
            Save
          </button>
        </div>
        )}
      </div>
    );
  } else if (cardKey === 'buildingBlocks:Video') {
    const vc = videoConfig || {};
    const vUrl = vc.videoUrl || '';
    const vQuestion = vc.videoQuestion || 'After watching the video, what are your thoughts?';
    const vDescription = vc.videoDescription || 'Share your honest feedback about the product demo.';
    const vCaption = vc.videoCaption || '';
    const vCornerRadius = vc.videoCornerRadius ?? 8;
    const vHidden = !!vc.videoHidden;
    const vRequired = !!vc.videoRequired;
    const vSource = vc.videoSource || 'youtube';
    const vWidth = vc.videoWidth || 'Full';
    const vAspectRatio = vc.videoAspectRatio || '16:9';
    const vAutoplay = !!vc.videoAutoplay;
    const vLoop = !!vc.videoLoop;
    const vShowControls = vc.videoShowControls !== false;
    const sourceLabel = vSource === 'vimeo' ? 'Vimeo' : 'YouTube';
    const videoWidthStyle = VIDEO_WIDTH_STYLES[vWidth] || VIDEO_WIDTH_STYLES.Full;
    const aspectRatioCss = VIDEO_ASPECT_RATIO_MAP[vAspectRatio] || VIDEO_ASPECT_RATIO_MAP['16:9'];
    const parsedVideo = parseVideoEmbed(vUrl, vSource);
    const embedUrl = buildVideoEmbedUrl(parsedVideo, {
      autoplay: vAutoplay,
      loop: vLoop,
      showControls: vShowControls,
    });
    const hasUrl = !!vUrl.trim();
    const urlMismatch = hasUrl && !parsedVideo;
    content = (
      <>
        <div
          className={`relative flex flex-col shrink-0 px-14 pt-11 pb-5 ${vHidden && !isPreviewMode ? 'opacity-40' : ''} ${vHidden && isPreviewMode ? 'hidden' : ''}`}
        >
          <HiddenFieldOverlay show={vHidden && !isPreviewMode} />
          <SectionBadge num={blockNum} label="Video with question" />
          <div className="pt-[10px] mb-4" style={videoWidthStyle}>
            <div className="overflow-hidden" style={{ borderRadius: vCornerRadius, border: '1px solid rgba(0,0,0,0.1)' }}>
              {embedUrl ? (
                <>
                  <iframe
                    src={embedUrl}
                    className="w-full"
                    style={{ aspectRatio: aspectRatioCss, display: 'block' }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={vCaption || vQuestion}
                  />
                  <div className="bg-[rgba(0,0,0,0.02)] border-t border-[rgba(0,0,0,0.07)] px-3 py-[7px] flex items-center justify-between gap-2">
                    <p className="text-[11px] text-[#888]">{vCaption || 'Video'}</p>
                    {(vAutoplay || vLoop || !vShowControls) && (
                      <span className="text-[10px] text-[#aaa] shrink-0">
                        {[vAutoplay && 'Autoplay', vLoop && 'Loop', !vShowControls && 'No controls'].filter(Boolean).join(' Â· ')}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#eceae6] flex flex-col items-center justify-center py-16 gap-3 px-6">
                    <VideoCardIcon size={28} className="text-[#aaa]" />
                    <p className="text-[#888] text-[15px] text-center">
                      {urlMismatch
                        ? `URL doesn't match ${sourceLabel} â€” check Video Source`
                        : `Paste a ${sourceLabel} URL`}
                    </p>
                  </div>
                  <div className="bg-[rgba(0,0,0,0.02)] border-t border-[rgba(0,0,0,0.07)] px-3 py-[7px]">
                    <p className="text-[11px] text-[#888]">{vCaption || 'Click to configure video'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="pt-[4px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {vQuestion}
              {vRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          <p className="text-[#888] text-[15px] font-light mt-[1px] mb-[15px]">{vDescription}</p>
          <div className="border border-[rgba(0,0,0,0.1)] rounded-[8px] px-4 py-3 min-h-[80px] mb-3">
            {isPreviewMode ? (
              <textarea
                value={pf('videoAns')}
                onChange={(e) => setPf('videoAns', e.target.value.slice(0, 500))}
                placeholder="Type your answer hereâ€¦"
                className="w-full min-h-[72px] text-[14px] font-light text-[#111] bg-transparent outline-none border-0 resize-y placeholder:text-[#bbb]"
              />
            ) : (
              <p className="text-[#bbb] text-[14px] font-light">Type your answer hereâ€¦</p>
            )}
          </div>
          <div className="flex justify-between items-center pb-[14px]">
            <span className="text-[11px] text-[#bbb]">Press Enter â†µ to continue</span>
            <span className="text-[11px] text-[#bbb]">{isPreviewMode ? pf('videoAns').length : 0} / 500</span>
          </div>
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'basicInfo:Contact') {
    const cc = contactConfig || {};
    const cQuestion = cc.contactQuestion || 'How can we get in touch?';
    const cHelperText = cc.contactHelperText || "We'll only reach out if we have a follow-up question.";
    const cBlockRequired = !!cc.contactRequired;
    const cFields = cc.contactFields || { firstName: { visible: true }, lastName: { visible: true }, email: { visible: true }, phone: { visible: true }, company: { visible: false } };
    const cReq = (fld) => isCompositeFieldRequired(cBlockRequired, fld);
    const cLabel = (name, fld) => `${name}${cReq(fld) ? ' *' : ''}`;
    const showFirst = cFields.firstName?.visible !== false;
    const showLast = cFields.lastName?.visible !== false;
    const showEmail = cFields.email?.visible !== false;
    const showPhone = cFields.phone?.visible !== false;
    const showCompany = cFields.company?.visible !== false;
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Contact" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {cQuestion}
              {cBlockRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {cHelperText && (
            <p className="text-[#888] text-[15px] font-light mt-[1px] mb-[19px]">{cHelperText}</p>
          )}
          {(showFirst || showLast) && (
            <div className="grid grid-cols-2 gap-4">
              {showFirst && (isPreviewMode ? (
                <PreviewLabeledInput
                  label={cLabel('FIRST NAME', cFields.firstName)}
                  value={pf('c.fn')}
                  onChange={(v) => setPf('c.fn', v)}
                  placeholder=""
                />
              ) : (
                <FormField label={cLabel('FIRST NAME', cFields.firstName)} value="Jane" />
              ))}
              {showLast && (isPreviewMode ? (
                <PreviewLabeledInput
                  label={cLabel('LAST NAME', cFields.lastName)}
                  value={pf('c.ln')}
                  onChange={(v) => setPf('c.ln', v)}
                  placeholder=""
                />
              ) : (
                <FormField label={cLabel('LAST NAME', cFields.lastName)} value="Smith" />
              ))}
            </div>
          )}
          {showEmail && (
            <div className="mt-[9px]">
              {isPreviewMode ? (
                <PreviewLabeledInput
                  label={cLabel('EMAIL ADDRESS', cFields.email)}
                  value={pf('c.em')}
                  onChange={(v) => setPf('c.em', v)}
                  placeholder="you@example.com"
                  type="email"
                />
              ) : (
                <FormField label={cLabel('EMAIL ADDRESS', cFields.email)} value="jane@example.com" />
              )}
            </div>
          )}
          {showPhone && (
            <div className="mt-[9px]">
              {isPreviewMode ? (
                <PreviewLabeledInput
                  label={cReq(cFields.phone) ? cLabel('PHONE', cFields.phone) : 'PHONE (OPTIONAL)'}
                  value={pf('c.ph')}
                  onChange={(v) => setPf('c.ph', v)}
                  placeholder=""
                  type="tel"
                />
              ) : (
                <FormField label={cReq(cFields.phone) ? cLabel('PHONE', cFields.phone) : 'PHONE (OPTIONAL)'} value="+1 (555) 000-0000" />
              )}
            </div>
          )}
          {showCompany && (
            <div className="mt-[9px]">
              {isPreviewMode ? (
                <PreviewLabeledInput
                  label={cLabel('COMPANY', cFields.company)}
                  value={pf('c.co')}
                  onChange={(v) => setPf('c.co', v)}
                  placeholder=""
                />
              ) : (
                <FormField label={cLabel('COMPANY', cFields.company)} value="Acme Inc." />
              )}
            </div>
          )}
          <div className="pb-[17px]" />
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'basicInfo:Address') {
    const ac = addressConfig || {};
    const aQuestion = ac.addressQuestion || "What's your mailing address?";
    const aHelperText = ac.addressHelperText || '';
    const aBlockRequired = !!ac.addressRequired;
    const aFields = ac.addressFields || { street: { visible: true }, city: { visible: true }, state: { visible: true }, postal: { visible: true }, country: { visible: true } };
    const aReq = (fld) => isCompositeFieldRequired(aBlockRequired, fld);
    const aLabel = (name, fld) => `${name}${aReq(fld) ? ' *' : ''}`;
    const showStreet = aFields.street?.visible !== false;
    const showCity = aFields.city?.visible !== false;
    const showState = aFields.state?.visible !== false;
    const showPostal = aFields.postal?.visible !== false;
    const showCountry = aFields.country?.visible !== false;
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Address" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {aQuestion}
              {aBlockRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {aHelperText && <p className="text-[#888] text-[15px] font-light mt-[1px]">{aHelperText}</p>}
          {showStreet && (
            <div className="mt-[19px]">
              {isPreviewMode ? (
                <PreviewLabeledInput
                  label={aLabel('STREET ADDRESS', aFields.street)}
                  value={pf('a.st')}
                  onChange={(v) => setPf('a.st', v)}
                  placeholder=""
                />
              ) : (
                <FormField label={aLabel('STREET ADDRESS', aFields.street)} value="123 Main Street" />
              )}
            </div>
          )}
          {(showCity || showState) && (
            <div className="grid grid-cols-2 gap-4 mt-[9px]">
              {showCity && (isPreviewMode ? (
                <PreviewLabeledInput label={aLabel('CITY', aFields.city)} value={pf('a.ci')} onChange={(v) => setPf('a.ci', v)} />
              ) : (
                <FormField label={aLabel('CITY', aFields.city)} value="San Francisco" />
              ))}
              {showState && (isPreviewMode ? (
                <PreviewLabeledInput label={aLabel('STATE / REGION', aFields.state)} value={pf('a.ste')} onChange={(v) => setPf('a.ste', v)} />
              ) : (
                <FormField label={aLabel('STATE / REGION', aFields.state)} value="California" />
              ))}
            </div>
          )}
          {(showPostal || showCountry) && (
            <div className="grid grid-cols-2 gap-4 mt-[9px] pb-[17px]">
              {showPostal && (isPreviewMode ? (
                <PreviewLabeledInput label={aLabel('POSTAL CODE', aFields.postal)} value={pf('a.po')} onChange={(v) => setPf('a.po', v)} />
              ) : (
                <FormField label={aLabel('POSTAL CODE', aFields.postal)} value="94103" />
              ))}
              {showCountry && (isPreviewMode ? (
                <PreviewLabeledInput label={aLabel('COUNTRY', aFields.country)} value={pf('a.ct')} onChange={(v) => setPf('a.ct', v)} />
              ) : (
                <FormField label={aLabel('COUNTRY', aFields.country)} value="United States" />
              ))}
            </div>
          )}
          {!showPostal && !showCountry && <div className="pb-[17px]" />}
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'basicInfo:Work Info') {
    const wc = workConfig || {};
    const wQuestion = wc.workQuestion || 'Tell us about your role';
    const wHelperText = wc.workHelperText || '';
    const wBlockRequired = !!wc.workRequired;
    const wFields = wc.workFields || { company: { visible: true }, title: { visible: true }, industry: { visible: true }, teamSize: { visible: true } };
    const wReq = (fld) => isCompositeFieldRequired(wBlockRequired, fld);
    const wLabel = (name, fld) => `${name}${wReq(fld) ? ' *' : ''}`;
    const showWCompany = wFields.company?.visible !== false;
    const showTitle = wFields.title?.visible !== false;
    const showIndustry = wFields.industry?.visible !== false;
    const showTeamSize = wFields.teamSize?.visible !== false;
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Work Info" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {wQuestion}
              {wBlockRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {wHelperText && <p className="text-[#888] text-[15px] font-light mt-[1px]">{wHelperText}</p>}
          {(showWCompany || showTitle) && (
            <div className="grid grid-cols-2 gap-4 mt-[19px]">
              {showWCompany && (isPreviewMode ? (
                <PreviewLabeledInput label={wLabel('COMPANY', wFields.company)} value={pf('w.co')} onChange={(v) => setPf('w.co', v)} />
              ) : (
                <FormField label={wLabel('COMPANY', wFields.company)} value="Acme Inc." />
              ))}
              {showTitle && (isPreviewMode ? (
                <PreviewLabeledInput label={wLabel('JOB TITLE', wFields.title)} value={pf('w.ti')} onChange={(v) => setPf('w.ti', v)} />
              ) : (
                <FormField label={wLabel('JOB TITLE', wFields.title)} value="Product Manager" />
              ))}
            </div>
          )}
          {(showIndustry || showTeamSize) && (
            <div className="grid grid-cols-2 gap-4 mt-[9px] pb-[17px]">
              {showIndustry && (isPreviewMode ? (
                <PreviewLabeledInput label={wLabel('INDUSTRY', wFields.industry)} value={pf('w.ind')} onChange={(v) => setPf('w.ind', v)} />
              ) : (
                <FormField label={wLabel('INDUSTRY', wFields.industry)} value="Technology" />
              ))}
              {showTeamSize && (isPreviewMode ? (
                <PreviewLabeledInput label={wLabel('TEAM SIZE', wFields.teamSize)} value={pf('w.ts')} onChange={(v) => setPf('w.ts', v)} />
              ) : (
                <FormField label={wLabel('TEAM SIZE', wFields.teamSize)} value="11â€“50 people" />
              ))}
            </div>
          )}
          {!showIndustry && !showTeamSize && <div className="pb-[17px]" />}
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'qualitative:Short text') {
    const stc = shortTextConfig || {};
    const stQuestion = stc.shortTextQuestion || "What's your name?";
    const stHelper = stc.shortTextHelperText || 'Please enter your full name as it appears on official documents.';
    const stPlaceholder = stc.shortTextPlaceholder || 'Type your answer hereâ€¦';
    const stMaxChars = stc.shortTextMaxChars ?? 100;
    const stMinChars = Math.max(0, Number(stc.shortTextMinChars) || 0);
    const stValidation = stc.shortTextValidation || 'None';
    const stInputType = TEXT_VALIDATION_INPUT_TYPE[stValidation] || 'text';
    const stHidden = !!stc.shortTextHidden;
    const stRequired = !!stc.shortTextRequired;
    const stAlign = stc.shortTextAlign || 'left';
    const stSize = stc.shortTextSize || 'M';
    const stFontSize = { S: '16px', M: '20px', L: '24px' }[stSize] || '20px';
    const stTextAlign = stAlign === 'center' ? 'text-center' : stAlign === 'right' ? 'text-right' : 'text-left';
    content = (
      <>
        <div
          className={`relative flex flex-col px-14 pt-11 pb-5 ${stHidden && !isPreviewMode ? 'opacity-40' : ''} ${stHidden && isPreviewMode ? 'hidden' : ''}`}
        >
          <HiddenFieldOverlay show={stHidden && !isPreviewMode} />
          <SectionBadge num={blockNum} label="Short text" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p
              className={`font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0 ${stTextAlign}`}
              style={{ fontSize: stFontSize, fontWeight: '600' }}
            >
              {stQuestion}
              {stRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {stHelper && (
            <p className={`text-[#888] text-[15px] font-light mt-[1px] ${stTextAlign}`}>{stHelper}</p>
          )}
          {(stValidation !== 'None' || stMinChars > 0) && (
            <p className={`text-[#aaa] text-[11px] mt-[4px] ${stTextAlign}`}>
              {stValidation !== 'None' ? `${stValidation} format` : ''}
              {stValidation !== 'None' && stMinChars > 0 ? ' Â· ' : ''}
              {stMinChars > 0 ? `min ${stMinChars} characters` : ''}
            </p>
          )}
          <div className="mt-[19px]">
            <div className="border-b-2 border-[rgba(0,0,0,0.12)] pb-[10px] pt-[8px]">
              <input
                type={stInputType}
                value={shortTextDraft}
                onChange={(e) => setShortTextDraft(e.target.value.slice(0, stMaxChars))}
                maxLength={stMaxChars}
                placeholder={stPlaceholder}
                aria-label={stQuestion}
                onMouseDown={(e) => e.stopPropagation()}
                className={`w-full bg-transparent text-[14px] font-light text-[#111] outline-none border-0 placeholder:text-[#bbb] ${stTextAlign}`}
              />
            </div>
            <div className="flex justify-between items-center pt-[11px] pb-[9px]">
              <p className="text-[#bbb] text-[11px]">Short answer</p>
              <p className="text-[#bbb] text-[11px]">
                {shortTextDraft.length}{stMinChars > 0 ? ` (min ${stMinChars})` : ''} / {stMaxChars}
              </p>
            </div>
          </div>
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'qualitative:Long text') {
    const ltc = longTextConfig || {};
    const ltQuestion = ltc.longTextQuestion || 'Tell us about your experience';
    const ltHelper = ltc.longTextHelperText || "Share as much or as little as you'd like.";
    const ltPlaceholder = ltc.longTextPlaceholder || 'Type your answer hereâ€¦';
    const ltMaxChars = ltc.longTextMaxChars ?? 500;
    const ltMinChars = Math.max(0, Number(ltc.longTextMinChars) || 0);
    const ltValidation = ltc.longTextValidation || 'None';
    const ltHidden = !!ltc.longTextHidden;
    const ltRequired = !!ltc.longTextRequired;
    const ltAlign = ltc.longTextAlign || 'left';
    const ltSize = ltc.longTextSize || 'M';
    const ltFontSize = { S: '16px', M: '20px', L: '24px' }[ltSize] || '20px';
    const ltTextAlign = ltAlign === 'center' ? 'text-center' : ltAlign === 'right' ? 'text-right' : 'text-left';
    const ltInputMode = { Email: 'email', URL: 'url', Number: 'numeric', Phone: 'tel' }[ltValidation];
    content = (
      <>
        <div
          className={`relative flex flex-col px-14 pt-11 pb-5 ${ltHidden && !isPreviewMode ? 'opacity-40' : ''} ${ltHidden && isPreviewMode ? 'hidden' : ''}`}
        >
          <HiddenFieldOverlay show={ltHidden && !isPreviewMode} />
          <SectionBadge num={blockNum} label="Long text" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p
              className={`font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0 ${ltTextAlign}`}
              style={{ fontSize: ltFontSize, fontWeight: '600' }}
            >
              {ltQuestion}
              {ltRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {ltHelper && (
            <p className={`text-[#888] text-[15px] font-light mt-[1px] ${ltTextAlign}`}>{ltHelper}</p>
          )}
          {(ltValidation !== 'None' || ltMinChars > 0) && (
            <p className={`text-[#aaa] text-[11px] mt-[4px] ${ltTextAlign}`}>
              {ltValidation !== 'None' ? `${ltValidation} format` : ''}
              {ltValidation !== 'None' && ltMinChars > 0 ? ' Â· ' : ''}
              {ltMinChars > 0 ? `min ${ltMinChars} characters` : ''}
            </p>
          )}
          <div className="mt-[19px]">
            {isPreviewMode && responseQualityConfig?.enabled ? (
              <>
                <div className="border-b-2 border-[rgba(0,0,0,0.12)] pb-[10px] pt-[8px]">
                  <textarea
                    value={longTextDraft}
                    onChange={(e) => setLongTextDraft(e.target.value.slice(0, ltMaxChars))}
                    maxLength={ltMaxChars}
                    placeholder={ltPlaceholder}
                    inputMode={ltInputMode}
                    aria-label={ltQuestion}
                    onMouseDown={(e) => e.stopPropagation()}
                    rows={3}
                    className={`w-full min-h-[72px] text-[14px] font-light text-[#111] bg-transparent outline-none border-0 resize-none placeholder:text-[#bbb] ${ltTextAlign}`}
                  />
                </div>
                <ResponseQualityFeedback
                  evaluation={responseQualityEvaluation}
                  charCount={longTextDraft.length}
                  maxChars={ltMaxChars}
                />
              </>
            ) : (
              <>
                <div className="border border-[rgba(0,0,0,0.1)] rounded-[8px] px-4 py-3 min-h-[120px]">
                  {isPreviewMode ? (
                    <textarea
                      value={longTextDraft}
                      onChange={(e) => setLongTextDraft(e.target.value.slice(0, ltMaxChars))}
                      maxLength={ltMaxChars}
                      placeholder={ltPlaceholder}
                      inputMode={ltInputMode}
                      aria-label={ltQuestion}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={`w-full min-h-[100px] text-[14px] font-light text-[#111] bg-transparent outline-none border-0 resize-y placeholder:text-[#bbb] ${ltTextAlign}`}
                    />
                  ) : (
                    <p className={`text-[#bbb] text-[14px] font-light ${ltTextAlign}`}>{ltPlaceholder}</p>
                  )}
                </div>
                <div className="flex justify-between items-center pt-[11px] pb-[9px]">
                  <p className="text-[#bbb] text-[11px]">Long answer</p>
                  <p className="text-[#bbb] text-[11px]">
                    {isPreviewMode ? longTextDraft.length : 0}{ltMinChars > 0 && isPreviewMode ? ` (min ${ltMinChars})` : ''} / {ltMaxChars}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'choiceBased:Single') {
    const sc = singleConfig || {};
    const sQuestion = sc.singleQuestion || 'How did you hear about us?';
    const sHelper = sc.singleHelperText || 'Choose the option that best describes your experience.';
    const sAllowOther = sc.singleAllowOther ?? true;
    const sLayout = sc.singleLayout || 'List';
    const sHeight = sc.singleOptionHeight || 'M';
    const sHeightPy = sHeight === 'S' ? 'py-[8px]' : sHeight === 'L' ? 'py-[18px]' : 'py-[13px]';
    const allOpts = singleDisplayOpts;
    const isList = sLayout === 'List';
    const is2col = sLayout === '2col';
    const onOpenPanel = sc.onOpenPanel;
    const sMulti = sc.singleMultipleSelect ?? false;
    const sRequired = !!sc.singleRequired;
    const sShowHints = !!sc.singleShowKeyboardHints;
    const sMaxChoices = sMulti ? sc.singleMaxChoices : 1;
    const sMinChoices = sMulti ? (Number(sc.singleMinChoices) || 1) : (sRequired ? 1 : 0);
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5 min-h-0 flex-1">
          <SectionBadge num={blockNum} label="Single choice" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {sQuestion}
              {sRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {sHelper && <p className="text-[#888] text-[15px] font-light mt-[1px]">{sHelper}</p>}
          {sMulti && (sMinChoices > 1 || sMaxChoices != null) && (
            <p className="text-[#aaa] text-[11px] mt-[4px] mb-[12px]">
              Select {sMinChoices}{sMaxChoices != null ? `â€“${sMaxChoices}` : '+'} option{sMaxChoices !== 1 ? 's' : ''}
            </p>
          )}
          {(!sMulti || !(sMinChoices > 1 || sMaxChoices != null)) && sHelper && <div className="mb-[19px]" />}
          <div className={`mb-5 overflow-y-auto max-h-[320px] ${isList ? 'flex flex-col' : is2col ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-3 gap-2'}`}>
            {allOpts.map((opt, i) => {
              const isOther = sAllowOther && opt === 'Other';
              const hint = isPreviewMode && sShowHints && !isOther ? CHOICE_KEYBOARD_HINT(i) : null;
              const isPicked = previewPicks.includes(opt);
              const markCls = sMulti
                ? `w-[20px] h-[20px] rounded-[4px] flex items-center justify-center border-2 shrink-0 ${isPicked ? 'border-[#111] bg-[#111]' : 'border-[rgba(0,0,0,0.2)]'}`
                : `w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 shrink-0 ${isPicked ? 'border-[#111] bg-[#111]' : 'border-[rgba(0,0,0,0.2)]'}`;
              const mark = (
                <div className={markCls}>
                  {isPicked && (sMulti ? <RiCheckLine size={12} className="text-white" /> : <div className="w-[7px] h-[7px] rounded-full bg-white" />)}
                </div>
              );
              if (isList) {
                const rowCls = `flex items-center gap-4 px-4 ${sHeightPy} border-x border-b ${i === 0 ? 'border-t rounded-t-[8px]' : ''} ${i === allOpts.length - 1 ? 'rounded-b-[8px]' : ''} ${isOther ? 'border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.01)]' : 'border-[rgba(0,0,0,0.08)]'} ${isPreviewMode && !isOther ? 'cursor-pointer hover:bg-[rgba(0,0,0,0.02)]' : ''}`;
                if (isPreviewMode) {
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => !isOther && togglePreviewPick(opt, sMulti, sMaxChoices)}
                      className={`w-full text-left ${rowCls}`}
                    >
                      {hint && <span className="text-[10px] font-semibold text-[#bbb] w-4 shrink-0">{hint}</span>}
                      {mark}
                      <span className={`text-[14px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                    </button>
                  );
                }
                return (
                  <div
                    key={opt}
                    className={rowCls}
                  >
                    {hint && <span className="text-[10px] font-semibold text-[#bbb] w-4 shrink-0">{hint}</span>}
                    <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 shrink-0 border-[rgba(0,0,0,0.2)]" />
                    <span className={`text-[14px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                  </div>
                );
              }
              const tileCls = `flex items-center gap-3 px-3 ${sHeightPy} border rounded-[8px] border-[rgba(0,0,0,0.08)] ${isOther ? 'bg-[rgba(0,0,0,0.01)]' : ''} ${isPreviewMode && !isOther ? 'cursor-pointer hover:border-[rgba(0,0,0,0.2)]' : ''}`;
              if (isPreviewMode) {
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => !isOther && togglePreviewPick(opt, sMulti, sMaxChoices)}
                    className={`w-full text-left ${tileCls}`}
                  >
                    {hint && <span className="text-[10px] font-semibold text-[#bbb] w-4 shrink-0">{hint}</span>}
                    {sMulti ? (
                      <div className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center border-2 shrink-0 ${isPicked ? 'border-[#111] bg-[#111]' : 'border-[rgba(0,0,0,0.2)]'}`}>
                        {isPicked && <RiCheckLine size={11} className="text-white" />}
                      </div>
                    ) : (
                      mark
                    )}
                    <span className={`text-[13px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                  </button>
                );
              }
              return (
                <div
                  key={opt}
                  className={tileCls}
                >
                  <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 shrink-0 border-[rgba(0,0,0,0.2)]" />
                  <span className={`text-[13px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
        {!isPreviewMode && (
        <div className="border-t border-[rgba(0,0,0,0.1)] flex gap-2 items-center px-14 py-[19px]">
          {onOpenPanel && (
            <button
              onClick={onOpenPanel}
              className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
            >
              <RiPencilLine size={12} className="shrink-0" />
              Edit options
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,245,245,0.7)] border border-[rgba(200,50,50,0.2)] text-[#d63030] text-[12px] cursor-pointer hover:bg-[rgba(255,235,235,0.9)] transition-colors whitespace-nowrap"
          >
            <RiDeleteBin6Line size={12} className="shrink-0" />
            Delete
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-[5px] px-[16px] py-[8px] rounded-[8px] bg-[#111] text-white text-[12px] font-medium cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap">
            <RiCheckLine size={11} className="shrink-0" />
            Save
          </button>
        </div>
        )}
      </>
    );
  } else if (cardKey === 'choiceBased:Multiple') {
    const mc = multipleConfig || {};
    const mQuestion = mc.multipleQuestion || 'Which features do you use most?';
    const mHelper = mc.multipleHelperText || 'Select all that apply.';
    const mAllowOther = mc.multipleAllowOther ?? false;
    const mLayout = mc.multipleLayout || 'List';
    const mMultipleSelect = mc.multipleMultipleSelect ?? false;
    const mHeight = mc.multipleOptionHeight || 'M';
    const mHeightPy = mHeight === 'S' ? 'py-[8px]' : mHeight === 'L' ? 'py-[18px]' : 'py-[13px]';
    const mOnOpenPanel = mc.onOpenPanel;
    const allMOpts = multipleDisplayOpts;
    const mRequired = !!mc.multipleRequired;
    const mShowHints = !!mc.multipleShowKeyboardHints;
    const mMaxChoices = mMultipleSelect ? mc.multipleMaxChoices : 1;
    const mMinChoices = mMultipleSelect ? (Number(mc.multipleMinChoices) || 1) : (mRequired ? 1 : 0);
    const isMList = mLayout === 'List';
    const isM2col = mLayout === '2col';
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5 min-h-0 flex-1">
          <SectionBadge num={blockNum} label="Multiple choice" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {mQuestion}
              {mRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {mHelper && <p className="text-[#888] text-[15px] font-light mt-[1px]">{mHelper}</p>}
          {mMultipleSelect && (mMinChoices > 1 || mMaxChoices != null) && (
            <p className="text-[#aaa] text-[11px] mt-[4px] mb-[12px]">
              Select {mMinChoices}{mMaxChoices != null ? `â€“${mMaxChoices}` : '+'} option{mMaxChoices !== 1 ? 's' : ''}
            </p>
          )}
          {(!mMultipleSelect || !(mMinChoices > 1 || mMaxChoices != null)) && mHelper && <div className="mb-[19px]" />}
          <div className={`mb-5 overflow-y-auto max-h-[320px] ${isMList ? 'flex flex-col' : isM2col ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-3 gap-2'}`}>
            {allMOpts.map((opt, i) => {
              const isOther = mAllowOther && opt === 'Other';
              const mHint = isPreviewMode && mShowHints && !isOther ? CHOICE_KEYBOARD_HINT(i) : null;
              const isPicked = previewPicks.includes(opt);
              const markCls = mMultipleSelect
                ? `flex items-center justify-center shrink-0 border-2 w-[20px] h-[20px] rounded-[4px] ${isPicked ? 'border-[#111] bg-[#111]' : 'border-[rgba(0,0,0,0.2)]'}`
                : `flex items-center justify-center shrink-0 border-2 w-[22px] h-[22px] rounded-full ${isPicked ? 'border-[#111] bg-[#111]' : 'border-[rgba(0,0,0,0.2)]'}`;
              const mark = (
                <div className={markCls}>
                  {isPicked && (mMultipleSelect ? <RiCheckLine size={12} className="text-white" /> : <div className="w-[7px] h-[7px] rounded-full bg-white" />)}
                </div>
              );
              if (isMList) {
                const rowCls = `flex items-center gap-4 px-4 ${mHeightPy} border-x border-b ${i === 0 ? 'border-t rounded-t-[8px]' : ''} ${i === allMOpts.length - 1 ? 'rounded-b-[8px]' : ''} ${isOther ? 'border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.01)]' : 'border-[rgba(0,0,0,0.08)]'} ${isPreviewMode && !isOther ? 'cursor-pointer hover:bg-[rgba(0,0,0,0.02)]' : ''}`;
                if (isPreviewMode) {
                  return (
                    <button type="button" key={i} onClick={() => !isOther && togglePreviewPick(opt, mMultipleSelect, mMaxChoices)} className={`w-full text-left ${rowCls}`}>
                      {mHint && <span className="text-[10px] font-semibold text-[#bbb] w-4 shrink-0">{mHint}</span>}
                      {mark}
                      <span className={`text-[14px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                    </button>
                  );
                }
                return (
                  <div
                    key={i}
                    className={rowCls}
                  >
                    {mHint && <span className="text-[10px] font-semibold text-[#bbb] w-4 shrink-0">{mHint}</span>}
                    <div className={`flex items-center justify-center shrink-0 border-2 border-[rgba(0,0,0,0.2)] ${mMultipleSelect ? 'w-[20px] h-[20px] rounded-[4px]' : 'w-[22px] h-[22px] rounded-full'}`} />
                    <span className={`text-[14px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                  </div>
                );
              }
              const tileCls = `flex items-center gap-3 px-3 ${mHeightPy} border rounded-[8px] border-[rgba(0,0,0,0.08)] ${isOther ? 'bg-[rgba(0,0,0,0.01)]' : ''} ${isPreviewMode && !isOther ? 'cursor-pointer hover:border-[rgba(0,0,0,0.2)]' : ''}`;
              if (isPreviewMode) {
                return (
                  <button type="button" key={i} onClick={() => !isOther && togglePreviewPick(opt, mMultipleSelect, mMaxChoices)} className={`w-full text-left ${tileCls}`}>
                    {mHint && <span className="text-[10px] font-semibold text-[#bbb] w-4 shrink-0">{mHint}</span>}
                    {mMultipleSelect ? (
                      <div className={`flex items-center justify-center shrink-0 border-2 w-[18px] h-[18px] rounded-[4px] ${isPicked ? 'border-[#111] bg-[#111]' : 'border-[rgba(0,0,0,0.2)]'}`}>
                        {isPicked && <RiCheckLine size={11} className="text-white" />}
                      </div>
                    ) : (
                      mark
                    )}
                    <span className={`text-[13px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                  </button>
                );
              }
              return (
                <div
                  key={i}
                  className={tileCls}
                >
                  <div className={`flex items-center justify-center shrink-0 border-2 border-[rgba(0,0,0,0.2)] ${mMultipleSelect ? 'w-[18px] h-[18px] rounded-[4px]' : 'w-[20px] h-[20px] rounded-full'}`} />
                  <span className={`text-[13px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
        {!isPreviewMode && (
        <div className="border-t border-[rgba(0,0,0,0.1)] flex gap-2 items-center px-14 py-[19px]">
          {mOnOpenPanel && (
            <button
              onClick={mOnOpenPanel}
              className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
            >
              <RiPencilLine size={12} className="shrink-0" />
              Edit options
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,245,245,0.7)] border border-[rgba(200,50,50,0.2)] text-[#d63030] text-[12px] cursor-pointer hover:bg-[rgba(255,235,235,0.9)] transition-colors whitespace-nowrap"
          >
            <RiDeleteBin6Line size={12} className="shrink-0" />
            Delete
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-[5px] px-[16px] py-[8px] rounded-[8px] bg-[#111] text-white text-[12px] font-medium cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap">
            <RiCheckLine size={11} className="shrink-0" />
            Save
          </button>
        </div>
        )}
      </>
    );
  } else if (cardKey === 'choiceBased:Media') {
    const mec = mediaConfig || {};
    const meQuestion = mec.mediaQuestion || 'Choose an image option';
    const meHelper = mec.mediaHelperText || 'Select the image that best represents your answer.';
    const meOpts = mediaDisplayOpts.length ? mediaDisplayOpts : [{ label: 'Option A', image: null }, { label: 'Option B', image: null }, { label: 'Option C', image: null }, { label: 'Option D', image: null }];
    const meAllowMultiple = mec.mediaAllowMultiple || false;
    const meRequired = !!mec.mediaRequired;
    const meMaxChoices = meAllowMultiple ? mec.mediaMaxChoices : 1;
    const meMinChoices = meAllowMultiple ? (Number(mec.mediaMinChoices) || 1) : (meRequired ? 1 : 0);
    const meLayout = mec.mediaLayout || '2col';
    const meOptHeight = mec.mediaOptionHeight || 'M';
    const meGridCols = meLayout === 'list' ? 'grid-cols-1' : meLayout === '3col' ? 'grid-cols-3' : 'grid-cols-2';
    const meImgRatio = meOptHeight === 'S' ? '16/4' : meOptHeight === 'L' ? '16/7' : '16/5';
    content = (
      <>
        <div className="flex flex-col px-14 pt-6">
          <SectionBadge num={blockNum} label="Media choice" />
          <div className="pt-[6px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '26px', fontWeight: '600' }}>
              {meQuestion}
              {meRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {meHelper && <p className="text-[#888] text-[15px] font-light mt-px">{meHelper}</p>}
          {meAllowMultiple && (meMinChoices > 1 || meMaxChoices != null) && (
            <p className="text-[#aaa] text-[11px] mt-[4px] mb-[10px]">
              Select {meMinChoices}{meMaxChoices != null ? `â€“${meMaxChoices}` : '+'} option{meMaxChoices !== 1 ? 's' : ''}
            </p>
          )}
          {(!meAllowMultiple || !(meMinChoices > 1 || meMaxChoices != null)) && meHelper && <div className="mb-[10px]" />}
        </div>
        <div className="overflow-y-auto px-14 pb-3" style={{ maxHeight: '290px' }}>
          <div className={`grid ${meGridCols} gap-2`}>
            {meOpts.map((opt, i) => {
              const optKey = opt.label || `Option ${i + 1}`;
              const isPicked = previewPicks.includes(optKey);
              const tile = (
                <>
                  {opt.image ? (
                    <img src={opt.image} alt={opt.label} className="w-full object-cover" style={{ aspectRatio: meImgRatio }} />
                  ) : (
                    <div className="bg-[rgba(0,0,0,0.04)] flex items-center justify-center" style={{ aspectRatio: meImgRatio }}>
                      <RiImageLine size={20} className="text-[#bbb]" />
                    </div>
                  )}
                  <div className="px-3 py-[6px] flex items-center gap-2">
                    <div className={`shrink-0 flex items-center justify-center border-2 ${meAllowMultiple ? 'w-[16px] h-[16px] rounded-[4px]' : 'w-[16px] h-[16px] rounded-full'} ${isPicked ? 'border-[#111] bg-[#111]' : 'border-[rgba(0,0,0,0.2)]'}`}>
                      {isPicked && (meAllowMultiple ? <RiCheckLine size={10} className="text-white" /> : <div className="w-[5px] h-[5px] rounded-full bg-white" />)}
                    </div>
                    <span className="text-[12px] text-[#111]">{optKey}</span>
                  </div>
                </>
              );
              if (isPreviewMode) {
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => togglePreviewPick(optKey, meAllowMultiple, meMaxChoices)}
                    className={`border rounded-[10px] overflow-hidden text-left transition-colors cursor-pointer ${isPicked ? 'border-[#111] ring-1 ring-[#111]' : 'border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.25)]'}`}
                  >
                    {tile}
                  </button>
                );
              }
              return (
                <div key={i} className="border rounded-[10px] overflow-hidden border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.25)] transition-colors cursor-pointer">
                  {opt.image ? (
                    <img src={opt.image} alt={opt.label} className="w-full object-cover" style={{ aspectRatio: meImgRatio }} />
                  ) : (
                    <div className="bg-[rgba(0,0,0,0.04)] flex items-center justify-center" style={{ aspectRatio: meImgRatio }}>
                      <RiImageLine size={20} className="text-[#bbb]" />
                    </div>
                  )}
                  <div className="px-3 py-[6px] flex items-center gap-2">
                    <div className={`shrink-0 flex items-center justify-center border-2 border-[rgba(0,0,0,0.2)] ${meAllowMultiple ? 'w-[16px] h-[16px] rounded-[4px]' : 'w-[16px] h-[16px] rounded-full'}`} />
                    <span className="text-[12px] text-[#111]">{opt.label || `Option ${i + 1}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'interactive:Maps') {
    const mapc = mapConfig || {};
    const mapQ = mapc.mapQuestion || 'Where are you located?';
    const mapH = mapc.mapHelperText || 'Drag the pin to your location';
    const mapLat = mapSelection?.lat ?? mapc.mapDefaultLat ?? DEFAULT_MAP_CENTER.lat;
    const mapLng = mapSelection?.lng ?? mapc.mapDefaultLng ?? DEFAULT_MAP_CENTER.lng;
    const mapAddr = mapSelection?.address ?? mapc.mapDefaultAddress ?? DEFAULT_MAP_CENTER.address;
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Maps" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {mapQ}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {mapH && <p className="text-[#888] text-[15px] font-light mt-[1px] mb-[15px]">{mapH}</p>}
          <MapLocationPicker
            latitude={mapLat}
            longitude={mapLng}
            address={mapAddr}
            zoom={mapc.mapZoom ?? 12}
            mapStyle={mapc.mapType === 'roadmap' ? 'default' : (mapc.mapType || 'default')}
            height={mapc.mapHeight || 'M'}
            allowPinMovement={mapc.mapAllowPinMovement !== false}
            showSearch={mapc.mapShowSearchBar !== false}
            restrictRadius={!!mapc.mapRestrictRadius}
            restrictRadiusKm={mapc.mapRestrictRadiusKm ?? 5}
            onChange={(loc) => setMapSelection(loc)}
            searchPlaceholder="Search for a location..."
            className="mb-5"
          />
          {mapc.mapPinLabel && (
            <p className="text-[11px] text-[#aaa] -mt-3 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {mapc.mapPinLabel}
            </p>
          )}
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'interactive:Upload') {
    content = <FileUploadCard blockNum={blockNum} onDelete={onDelete} config={uploadConfig} isPreviewMode={isPreviewMode} />;
  } else if (cardKey === 'interactive:Multi-image upload') {
    return <MultiImageUploadCard blockNum={blockNum} onDelete={onDelete} config={multiImageConfig} fullCanvas={fullCanvas} cardColor={cardColor} cardImage={cardImage} isPreviewMode={isPreviewMode} previewStepNav={previewStepNav} previewScreenValidatorRef={previewScreenValidatorRef} />;
  } else if (cardKey === 'interactive:Captcha') {
    const capc = captchaConfig || {};
    const capProvider = capc.captchaProvider || 'Google reCAPTCHA v3';
    const capEnabled = capc.captchaEnabled !== false;
    const PROVIDER_SHORT = {
      'Google reCAPTCHA v3': 'reCAPTCHA',
      'Google reCAPTCHA v2': 'reCAPTCHA',
      'hCaptcha': 'hCaptcha',
      'Cloudflare Turnstile': 'Turnstile',
    };
    const capLabel = PROVIDER_SHORT[capProvider] || capProvider;
    content = (
      <>
        <div className={`flex flex-col px-14 pt-11 pb-5 transition-opacity ${capEnabled ? 'opacity-100' : 'opacity-40'}`}>
          <SectionBadge num={blockNum} label="Captcha" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-medium text-[#111] tracking-[-0.52px] leading-[32.5px] flex-1 min-w-0" style={{ fontSize: '26px' }}>
              One last check before we submit
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          <p className="text-[#888] text-[15px] font-light mt-px mb-[19px] leading-[20.8px]">Please confirm you're not a robot.</p>
          <div className="flex items-center gap-[14px] bg-[rgba(255,255,255,0.5)] border border-[rgba(0,0,0,0.16)] rounded-[10px] px-[21px] py-[17px]">
            <button
              onClick={() => capEnabled && setCaptchaChecked((v) => !v)}
              className={`w-[22px] h-[22px] rounded-[5px] border shrink-0 flex items-center justify-center transition-colors ${
                capEnabled ? 'cursor-pointer' : 'cursor-default'
              } ${
                captchaChecked
                  ? 'bg-[#111] border-[#111]'
                  : 'bg-transparent border-[rgba(0,0,0,0.16)] hover:border-[rgba(0,0,0,0.35)]'
              }`}
            >
              <AnimatePresence>
                {captchaChecked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    <RiCheckLine size={13} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <span className="text-[14px] text-[#111] flex-1 select-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>I'm not a robot</span>
            <div className="flex flex-col items-center gap-[2px]">
              <span className="text-[16px] leading-none">ðŸ”’</span>
              <span className="text-[8px] text-black leading-none">{capLabel}</span>
            </div>
          </div>
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} />}
      </>
    );
  } else if (cardKey === 'numeric:Rating') {
    const rc = ratingConfig || {};
    const rQuestion = rc.ratingQuestion || 'How would you rate your overall experience?';
    const rStyle = rc.ratingStyle || 'Stars';
    const rMax = rc.ratingMaxRating || 5;
    const rLow = rc.ratingLowLabel ?? 'Very poor';
    const rHigh = rc.ratingHighLabel ?? 'Excellent';
    const rShowLabels = rc.ratingShowLabels !== false;
    const rIconSize = rc.ratingIconSize || 'M';
    const iconPx = rIconSize === 'S' ? 13 : rIconSize === 'L' ? 20 : 16;
    const btnSizePx = rIconSize === 'S' ? 30 : rIconSize === 'L' ? 42 : 36;

    const activeRating = ratingHover || ratingValue;

    const renderIconBtn = (n) => {
      const filled = n <= activeRating;
      if (rStyle === '1-10') {
        return (
          <button
            key={n}
            onClick={() => setRatingValue(n === ratingValue ? 0 : n)}
            onMouseEnter={() => setRatingHover(n)}
            onMouseLeave={() => setRatingHover(0)}
            className="flex-1 flex items-center justify-center py-[8px] transition-all duration-150 cursor-pointer rounded-[8px]"
            style={{
              border: `1px solid ${filled ? '#111' : '#e2e2de'}`,
              background: filled ? '#111' : 'transparent',
              minWidth: 0,
            }}
            aria-label={`Rate ${n}`}
          >
            <span className="text-[13.5px] font-medium leading-none" style={{ color: filled ? '#fff' : '#141412' }}>{n}</span>
          </button>
        );
      }
      const FilledIcon = rStyle === 'Hearts' ? RiHeartFill : RiStarFill;
      const EmptyIcon = rStyle === 'Hearts' ? RiHeartLine : RiStarLine;
      return (
        <button
          key={n}
          onClick={() => setRatingValue(n === ratingValue ? 0 : n)}
          onMouseEnter={() => setRatingHover(n)}
          onMouseLeave={() => setRatingHover(0)}
          className="shrink-0 flex items-center justify-center transition-all duration-150 cursor-pointer"
          style={{
            width: btnSizePx,
            height: btnSizePx,
            borderRadius: 9,
            border: `1px solid ${filled ? '#111' : 'rgba(0,0,0,0.16)'}`,
            background: filled ? '#111' : 'rgba(255,255,255,0.6)',
            padding: 1,
          }}
          aria-label={`Rate ${n} out of ${rMax}`}
        >
          {filled
            ? <FilledIcon size={iconPx} className="text-white" />
            : <EmptyIcon size={iconPx} className="text-[#555]" />
          }
        </button>
      );
    };

    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Rating" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-medium text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '26px' }}>
              {rQuestion}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          <div className={`flex pt-[19px] pb-[17px] ${rStyle === '1-10' ? '' : 'justify-center'}`}>
            <div className={`flex flex-col ${rStyle === '1-10' ? 'w-full' : ''}`}>
              <div className={`flex items-center ${rStyle === '1-10' ? 'gap-[6px]' : 'gap-2'}`}>
                {Array.from({ length: rMax }, (_, i) => i + 1).map(renderIconBtn)}
              </div>
              {rShowLabels && (
                <div className="flex items-start justify-between pt-[6px]">
                  <span className="text-[10px] text-black font-light">{rLow}</span>
                  <span className="text-[10px] text-black font-light">{rHigh}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else if (cardKey === 'numeric:Time') {
    content = (
      <TimePickerCard
        blockNum={blockNum}
        onDelete={onDelete}
        config={timeConfig}
        isPreviewMode={isPreviewMode}
        previewRequiredHint={previewRequiredHint}
        onTimeChange={setTimeSelection}
      />
    );
  } else if (cardKey === 'numeric:Date') {
    const dc = dateConfig || {};
    const dQuestion = dc.dateQuestion || "When's the best date for you?";
    const dHelper = dc.dateHelperText || 'Pick a date from the calendar.';
    const dRequired = !!dc.dateRequired;
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekendIdx = new Set([4, 5, 11, 12, 18, 19, 25, 26]);
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Date" />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {dQuestion}
              {dRequired && <span className="text-red-600 ml-1">*</span>}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          {dHelper && <p className="text-[#888] text-[15px] font-light mt-[1px] mb-[19px]">{dHelper}</p>}
          <div className="border border-[rgba(0,0,0,0.12)] rounded-[10px] overflow-hidden mb-5">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(0,0,0,0.07)]">
              <span className="text-[13px] font-medium text-[#111]">May 2026</span>
              <div className="flex gap-3">
                <RiArrowLeftSLine size={16} className="text-[#888] cursor-pointer shrink-0" aria-hidden />
                <RiArrowRightSLine size={16} className="text-[#888] cursor-pointer shrink-0" aria-hidden />
              </div>
            </div>
            <div className="grid grid-cols-7 text-center px-4 py-3 gap-y-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="text-[10px] text-[#888] pb-1">{d}</span>
              ))}
              {days.map((d) => (
                <span
                  key={d}
                  className={`text-[13px] py-1 rounded-full ${d === 11 ? 'bg-[#111] text-white' : weekendIdx.has(d - 1) ? 'text-[#ccc]' : 'text-[#111] cursor-pointer hover:bg-[rgba(0,0,0,0.05)]'}`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  } else {
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label={label} />
          <div className="pt-[9px] flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pb-5">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] flex-1 min-w-0" style={{ fontSize: '32px', fontWeight: '600' }}>
              {label}
            </p>
            <PreviewRequiredInline show={previewRequiredHint} />
          </div>
          <p className="text-[#888] text-[15px] font-light pb-5">
            This is a {label.toLowerCase()} field for collecting respondent data.
          </p>
        </div>
        {!isPreviewMode && <ContentCardFooter onDelete={onDelete} variant="field" />}
      </>
    );
  }

  const isImageCard = cardKey === 'buildingBlocks:Images';
  const isVideoCard = cardKey === 'buildingBlocks:Video';
  const isScrollableCard = isImageCard || isVideoCard;
  const scrollableLabel = isImageCard ? 'IMAGE WITH QUESTION' : 'VIDEO WITH QUESTION';

  const inCardPreviewNav = isPreviewMode && previewStepNav ? previewStepNav : null;

  return (
    <motion.div
      className="h-full min-h-0 flex flex-col"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {isScrollableCard ? (
        <div className="flex-1 min-h-0 flex flex-col gap-[6px]">
          <div className="flex gap-[14px] items-center pb-[8px] pt-[6px]">
            <span className="text-[15px] font-semibold tracking-[1.52px] uppercase text-black whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {scrollableLabel}
            </span>
            <div className="flex-1 h-px bg-[rgba(0,0,0,0.1)]" />
          </div>
          <CardShell fullCanvas={fullCanvas} cardColor={cardColor} cardImage={cardImage} scrollable footer={inCardPreviewNav}>{content}</CardShell>
        </div>
      ) : (
        <CardShell fullCanvas={fullCanvas} cardColor={cardColor} cardImage={cardImage} footer={inCardPreviewNav}>{content}</CardShell>
      )}
    </motion.div>
  );
};

/* â”€â”€ Essentials â†’ ContentCard block mapping (for intro screen) â”€â”€ */
const ESSENTIAL_TO_BLOCK = {
  'CTA':         { section: 'buildingBlocks', label: 'CTA' },
  'Heading':     { section: 'buildingBlocks', label: 'Heading' },
  'Description': { section: 'buildingBlocks', label: 'Description' },
  'Text Box':    { section: 'qualitative',    label: 'Short text' },
  'Images':      { section: 'buildingBlocks', label: 'Images' },
  'Video':       { section: 'buildingBlocks', label: 'Video' },
  'Captcha':     { section: 'interactive',    label: 'Captcha' },
};

/* â”€â”€ Screen list icon + color map (keyed by screen label) â”€â”€ */
const SCREEN_ICON_MAP = {
  'CTA':               { Icon: BoxesIcon,      bg: 'bg-[#f0fdf4]', color: 'text-emerald-600' },
  'Heading':           { Icon: TextHIcon,         bg: 'bg-[#eef2ff]', color: 'text-indigo-500'  },
  'Description':       { Icon: TextAlignLeftIcon,  bg: 'bg-[#eef2ff]', color: 'text-indigo-500'  },
  'Images':            { Icon: ImagesCardIcon,    bg: 'bg-[#f0fdf4]', color: 'text-emerald-600' },
  'Video':             { Icon: VideoCardIcon,      bg: 'bg-[#f0fdf4]', color: 'text-emerald-600' },
  'Contact':           { Icon: RiIdCardLine,      bg: 'bg-[#eef2ff]', color: 'text-indigo-500'  },
  'Address':           { Icon: RiMapPinLine,      bg: 'bg-[#f0fdf4]', color: 'text-emerald-600' },
  'Work Info':         { Icon: RiBriefcaseLine,   bg: 'bg-[#fff7ed]', color: 'text-orange-500'  },
  'Short text':        { Icon: ShortTextIcon,    bg: 'bg-[#f0fdf4]', color: 'text-emerald-600' },
  'Long text':         { Icon: LongTextIcon,     bg: 'bg-[#f0fdf4]', color: 'text-emerald-600' },
  'Single':            { Icon: RiRadioButtonLine, bg: 'bg-[#fff2ee]', color: 'text-rose-500'    },
  'Multiple':          { Icon: RiCheckboxLine,    bg: 'bg-[#fff7ed]', color: 'text-orange-500'  },
  'Media':             { Icon: RiImageLine,       bg: 'bg-[#fff7ed]', color: 'text-orange-500'  },
  'Maps':              { Icon: RiCompassLine,     bg: 'bg-[#ecfeff]', color: 'text-cyan-600'    },
  'Captcha':           { Icon: RiRobot2Line,      bg: 'bg-[#f4f4f4]', color: 'text-gray-500'   },
  'Multi-image upload':{ Icon: RiFileUploadLine,  bg: 'bg-[#f0fdf4]', color: 'text-emerald-600' },
  'Rating':            { Icon: RiStarLine,        bg: 'bg-[#eef2ff]', color: 'text-indigo-500'  },
  'Upload':            { Icon: RiFileUploadLine,  bg: 'bg-[#f0fdf4]', color: 'text-emerald-600' },
  'Date':              { Icon: RiCalendarLine,    bg: 'bg-[#eef2ff]', color: 'text-indigo-500'  },
};

/* â”€â”€ Settings Toggle â”€â”€ */
const Toggle = ({ checked, onChange }) => (
  <ToggleSwitch checked={checked} onChange={onChange} />
);

/* â”€â”€ Form Builder Page â”€â”€ */
const FormBuilderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previewScreenValidatorRef = useRef(null);
  const [deviceView, setDeviceView] = useState('desktop');
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishView, setIsPublishView] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [screens, setScreens] = useState([]);
  const [activeScreenId, setActiveScreenId] = useState(null);
  const [logicModeManual, setLogicModeManual] = useState(true);
  const [logicCanvasZoom, setLogicCanvasZoom] = useState(1);
  const [logicCanvasPan, setLogicCanvasPan] = useState({ x: 0, y: 0 });
  const logicPanDragRef = useRef(null);
  const [logicCanvasPanning, setLogicCanvasPanning] = useState(false);
  const logicViewportRef = useRef(null);
  const logicBoardMeasureRef = useRef(null);
  const logicPortPositionsRef = useRef(new Map());
  const logicConnectGestureRef = useRef(null);
  const logicPortTapRef = useRef(null);
  const logicCanvasPanRef = useRef({ x: 0, y: 0 });
  const logicCanvasZoomRef = useRef(1);
  const logicPrevTabRef = useRef(activeTab);
  const [logicCardDraggingId, setLogicCardDraggingId] = useState(null);
  const [logicCardDragOffset, setLogicCardDragOffset] = useState({ x: 0, y: 0 });
  const logicCardDragRef = useRef(null);
  /** Per-screen-id offsets on the logic canvas only; does not change Content sidebar order */
  const [logicCardOffsets, setLogicCardOffsets] = useState({});
  /** Directed edges on the logic canvas only (screen id â†’ screen id); does not reorder the Content list */
  const [logicConnections, setLogicConnections] = useState([]);
  /** While dragging from an output port: current pointer in board (padding) coordinates */
  const [logicConnectDrag, setLogicConnectDrag] = useState(null);
  /** Context menu from a quick tap on an output connector dot (coords relative to logic viewport) */
  const [logicConnectorMenu, setLogicConnectorMenu] = useState(null);
  /** Per content screen: if/then rules edited in the side panel (Figma IF/THEN PANEL) */
  /** If/then rules keyed by `${fromScreenId}-${toScreenId}` (one config per connection) */
  const [logicIfRulesByEdge, setLogicIfRulesByEdge] = useState({});
  /** Else fallback when leaving a screen (shared across connections from that screen) */
  const [logicElseByScreen, setLogicElseByScreen] = useState({});
  const [ifThenLogicPanelEdge, setIfThenLogicPanelEdge] = useState(null);
  const [ifThenDraft, setIfThenDraft] = useState(null);
  const ifThenDraftSnapshotRef = useRef(null);
  const previewSnapByScreenRef = useRef({});
  const previewAnswersByScreenRef = useRef({});
  const [previewVisitStack, setPreviewVisitStack] = useState([]);
  const [previewSnapVersion, setPreviewSnapVersion] = useState(0);
  const logicStorageHydratedRef = useRef(false);
  /** Hover on disconnect control highlights the corresponding edge in red */
  const [logicDisconnectHoveredKey, setLogicDisconnectHoveredKey] = useState(null);
  const [logicEdgeKindHoveredKey, setLogicEdgeKindHoveredKey] = useState(null);
  /** Measured card heights on the logic canvas (for vertically centered connector ports) */
  const [logicCardHeights, setLogicCardHeights] = useState({});
  /* â”€â”€ Left panel: reorder content screens (between intro & end) â”€â”€ */
  const contentDragSourceIdRef = useRef(null);
  const [contentDraggingId, setContentDraggingId] = useState(null);
  const [contentDropTargetId, setContentDropTargetId] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loadedFormTitle, setLoadedFormTitle] = useState(
    () => location.state?.formTitle ?? null
  );
  const templateHydratedRef = useRef(false);
  const newFormHydratedRef = useRef(false);
  const prevActiveScreenIdRef = useRef(null);
  const configGlobalsRef = useRef({});
  const [sections, setSections] = useState({
    essentials: true,
    questionTemplates: false,
    fieldSettings: false,
    appearance: false,
  });

  /* â”€â”€ Welcome screen field-settings state â”€â”€ */
  const [welcomeRequired, setWelcomeRequired] = useState(true);
  const [welcomeHidden, setWelcomeHidden] = useState(false);
  const [welcomeReadOnly, setWelcomeReadOnly] = useState(false);
  const [welcomePlaceholder, setWelcomePlaceholder] = useState('Type your answer hereâ€¦');
  const [welcomeHelperText, setWelcomeHelperText] = useState('Press Enter to continue');
  const [welcomeMinLength, setWelcomeMinLength] = useState(0);
  const [welcomeMaxLength, setWelcomeMaxLength] = useState(80);
  const [welcomeInputType, setWelcomeInputType] = useState('Free text');
  const [welcomeInputTypeOpen, setWelcomeInputTypeOpen] = useState(false);
  const [welcomeTextSize, setWelcomeTextSize] = useState('M');
  const [welcomeAlignment, setWelcomeAlignment] = useState('left');
  const welcomeInputTypeRef = useRef(null);

  /* â”€â”€ Response quality scoring state â”€â”€ */
  const [responseQualityEnabled, setResponseQualityEnabled] = useState(false);
  const [responseQualityOptions, setResponseQualityOptions] = useState(DEFAULT_RESPONSE_QUALITY_OPTIONS);

  /* â”€â”€ Content panel state â”€â”€ */
  const [showContentPanel, setShowContentPanel] = useState(false);

  /* â”€â”€ Form Settings state â”€â”€ */
  const [settingsOneAtATime, setSettingsOneAtATime] = useState(false);
  const [settingsAutoAdvance, setSettingsAutoAdvance] = useState(true);
  const [settingsBackButton, setSettingsBackButton] = useState(false);
  const [settingsCompletionAction, setSettingsCompletionAction] = useState('Show thank you screen');
  const [settingsResubmission, setSettingsResubmission] = useState(true);
  const [settingsConfirmationEmail, setSettingsConfirmationEmail] = useState(true);
  const [settingsSubmissionNotifications, setSettingsSubmissionNotifications] = useState(false);
  const [settingsEmailCollection, setSettingsEmailCollection] = useState(true);
  const [settingsLanguage, setSettingsLanguage] = useState('English');
  const [settingsPasswordProtection, setSettingsPasswordProtection] = useState(false);
  const [settingsResponseLimit, setSettingsResponseLimit] = useState(false);
  const [settingsResponseLimitCount, setSettingsResponseLimitCount] = useState('500');
  const [settingsWebhook, setSettingsWebhook] = useState(false);

  /* â”€â”€ Design (Customization) panel state â”€â”€ */
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [showThemeOverlay, setShowThemeOverlay] = useState(false);
  const [pendingScreenDelete, setPendingScreenDelete] = useState(null);
  const [activeThemeId, setActiveThemeId] = useState('sage');
  const [designLayoutStyle, setDesignLayoutStyle] = useState('withCard');
  const [designBackground, setDesignBackground] = useState('#f0eee8');
  const [designCardColor, setDesignCardColor] = useState('#f9f9fa');
  const [designCardImage, setDesignCardImage] = useState(null);
  const [designCardColorGridOpen, setDesignCardColorGridOpen] = useState(false);
  const [designCardOpacity, setDesignCardOpacity] = useState(74);
  const [designTextColor, setDesignTextColor] = useState('#198eea');
  const [designTypography, setDesignTypography] = useState('default');

  /* â”€â”€ CTA configure panel state â”€â”€ */
  const [showCtaConfigPanel, setShowCtaConfigPanel] = useState(false);
  const [ctaButtonLabel, setCtaButtonLabel] = useState('Get started');
  const [ctaButtonSize, setCtaButtonSize] = useState('M');
  const [ctaButtonStyle, setCtaButtonStyle] = useState('Filled');
  const [ctaCornerRadius, setCtaCornerRadius] = useState(10);
  const [ctaBtnColor, setCtaBtnColor] = useState('#1a1a1a');
  const [ctaBtnColorGridOpen, setCtaBtnColorGridOpen] = useState(false);
  const [ctaTextColor, setCtaTextColor] = useState('#ffffff');
  const [ctaColorGridOpen, setCtaColorGridOpen] = useState(false);
  const [ctaLabelColor, setCtaLabelColor] = useState('white');
  const [ctaShowIcon, setCtaShowIcon] = useState(true);
  const [ctaHeadingSize, setCtaHeadingSize] = useState(28);
  const [ctaBodySize, setCtaBodySize] = useState(15);
  const [ctaFontWeight, setCtaFontWeight] = useState('Regular');
  const [ctaTextAlign, setCtaTextAlign] = useState('center');
  const [ctaPadding, setCtaPadding] = useState(44);
  const [ctaContentWidth, setCtaContentWidth] = useState('Default');
  const [ctaSections, setCtaSections] = useState({ button: true, typography: true, spacing: true });

  /* â”€â”€ Heading configure panel state â”€â”€ */
  const [showHeadingConfigPanel, setShowHeadingConfigPanel] = useState(false);
  const [isEditingHeadingCard, setIsEditingHeadingCard] = useState(false);
  const [headingText, setHeadingText] = useState('');
  const [headingAnswerText, setHeadingAnswerText] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [headingRequired, setHeadingRequired] = useState(false);
  const [headingHidden, setHeadingHidden] = useState(false);
  const [headingLevel, setHeadingLevel] = useState('H2');
  const [headingTextSize, setHeadingTextSize] = useState('M');
  const [headingAlignment, setHeadingAlignment] = useState('left');
  const [headingFontWeight, setHeadingFontWeight] = useState('Regular');
  const [headingSections, setHeadingSections] = useState({ fieldSettings: true, conditionalLogic: true, appearance: true });

  /* â”€â”€ Description configure panel state â”€â”€ */
  const [showDescriptionConfigPanel, setShowDescriptionConfigPanel] = useState(false);
  const [descriptionContent, setDescriptionContent] = useState('');
  const [descriptionHidden, setDescriptionHidden] = useState(false);
  const [descriptionShowCharCount, setDescriptionShowCharCount] = useState(false);
  const [descriptionCharLimit, setDescriptionCharLimit] = useState('');
  const [descriptionFormatting, setDescriptionFormatting] = useState({ bold: false, italic: false, underline: false, link: false, list: false });
  const [descriptionTextSize, setDescriptionTextSize] = useState('M');
  const [descriptionAlignment, setDescriptionAlignment] = useState('left');
  const [descriptionSections, setDescriptionSections] = useState({ fieldSettings: true, conditionalLogic: true, appearance: true });

  /* â”€â”€ Image configure panel state â”€â”€ */
  const [showImageConfigPanel, setShowImageConfigPanel] = useState(false);
  const [imageHidden, setImageHidden] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [imageAltText, setImageAltText] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageLinkOnClick, setImageLinkOnClick] = useState(false);
  const [imageLinkUrl, setImageLinkUrl] = useState('');
  const [imageOpenInNewTab, setImageOpenInNewTab] = useState(false);
  const [imageAlignment, setImageAlignment] = useState('left');
  const [imageWidth, setImageWidth] = useState('Full');
  const [imageCornerRadius, setImageCornerRadius] = useState(8);
  const [imageQuestion, setImageQuestion] = useState('What do you see in this image?');
  const [imageDescription, setImageDescription] = useState("Describe what's happening in the photo above.");
  const [imageSections, setImageSections] = useState({ fieldSettings: true, conditionalLogic: true, appearance: true });
  const imageFileInputRef = useRef(null);

  /* â”€â”€ Video configure panel state â”€â”€ */
  const [showVideoConfigPanel, setShowVideoConfigPanel] = useState(false);
  const [videoRequired, setVideoRequired] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [videoLoop, setVideoLoop] = useState(false);
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [videoShowControls, setVideoShowControls] = useState(true);
  const [videoSource, setVideoSource] = useState('youtube');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [videoWidth, setVideoWidth] = useState('Full');
  const [videoAspectRatio, setVideoAspectRatio] = useState('16:9');
  const [videoCornerRadius, setVideoCornerRadius] = useState(8);
  const [videoQuestion, setVideoQuestion] = useState('After watching the video, what are your thoughts?');
  const [videoDescription, setVideoDescription] = useState('Share your honest feedback about the product demo.');
  const [videoSections, setVideoSections] = useState({ fieldSettings: true, appearance: true, conditionalLogic: false });

  /* â”€â”€ Contact configure panel state â”€â”€ */
  const [showContactConfigPanel, setShowContactConfigPanel] = useState(false);
  const [contactRequired, setContactRequired] = useState(false);
  const [contactQuestion, setContactQuestion] = useState('How can we get in touch?');
  const [contactHelperText, setContactHelperText] = useState("We'll only reach out if we have a follow-up question.");
  const [contactFields, setContactFields] = useState({
    firstName: { visible: true, required: false },
    lastName: { visible: true, required: false },
    email: { visible: true, required: true },
    phone: { visible: true, required: false },
    company: { visible: false, required: false },
  });
  const [contactSections, setContactSections] = useState({ fieldSettings: true, fields: true, conditionalLogic: false });

  /* â”€â”€ Address configure panel state â”€â”€ */
  const [showAddressConfigPanel, setShowAddressConfigPanel] = useState(false);
  const [addressRequired, setAddressRequired] = useState(false);
  const [addressQuestion, setAddressQuestion] = useState("What's your mailing address?");
  const [addressHelperText, setAddressHelperText] = useState('');
  const [addressFields, setAddressFields] = useState({
    street: { visible: true, required: false },
    city: { visible: true, required: false },
    state: { visible: true, required: false },
    postal: { visible: true, required: false },
    country: { visible: true, required: false },
  });
  const [addressSections, setAddressSections] = useState({ fieldSettings: true, fields: true, conditionalLogic: false });

  /* â”€â”€ Work configure panel state â”€â”€ */
  const [showWorkConfigPanel, setShowWorkConfigPanel] = useState(false);
  const [workRequired, setWorkRequired] = useState(false);
  const [workQuestion, setWorkQuestion] = useState('Tell us about your role');
  const [workHelperText, setWorkHelperText] = useState('');
  const [workFields, setWorkFields] = useState({
    company: { visible: true, required: false },
    title: { visible: true, required: false },
    industry: { visible: true, required: false },
    teamSize: { visible: true, required: false },
  });
  const [workSections, setWorkSections] = useState({ fieldSettings: true, fields: true, conditionalLogic: false });

  /* â”€â”€ Short text configure panel state â”€â”€ */
  const [showShortTextConfigPanel, setShowShortTextConfigPanel] = useState(false);
  const [shortTextRequired, setShortTextRequired] = useState(false);
  const [shortTextHidden, setShortTextHidden] = useState(false);
  const [shortTextQuestion, setShortTextQuestion] = useState("What's your name?");
  const [shortTextHelperText, setShortTextHelperText] = useState('Please enter your full name as it appears on official documents.');
  const [shortTextPlaceholder, setShortTextPlaceholder] = useState('Type your answer hereâ€¦');
  const [shortTextMinChars, setShortTextMinChars] = useState(0);
  const [shortTextMaxChars, setShortTextMaxChars] = useState(100);
  const [shortTextValidation, setShortTextValidation] = useState('None');
  const [shortTextSize, setShortTextSize] = useState('M');
  const [shortTextAlign, setShortTextAlign] = useState('left');
  const [shortTextSections, setShortTextSections] = useState({ fieldSettings: true, appearance: true, conditionalLogic: false });

  /* â”€â”€ Long text configure panel state â”€â”€ */
  const [showLongTextConfigPanel, setShowLongTextConfigPanel] = useState(false);
  const [longTextRequired, setLongTextRequired] = useState(false);
  const [longTextHidden, setLongTextHidden] = useState(false);
  const [longTextQuestion, setLongTextQuestion] = useState('Tell us about your experience');
  const [longTextHelperText, setLongTextHelperText] = useState("Share as much or as little as you'd like.");
  const [longTextPlaceholder, setLongTextPlaceholder] = useState('Type your answer hereâ€¦');
  const [longTextMinChars, setLongTextMinChars] = useState(0);
  const [longTextMaxChars, setLongTextMaxChars] = useState(500);
  const [longTextValidation, setLongTextValidation] = useState('None');
  const [longTextSize, setLongTextSize] = useState('M');
  const [longTextAlign, setLongTextAlign] = useState('left');
  const [longTextSections, setLongTextSections] = useState({ fieldSettings: true, appearance: true, conditionalLogic: false, responseQuality: false });

  /* â”€â”€ Multiple choice configure panel state â”€â”€ */
  const [showMultipleConfigPanel, setShowMultipleConfigPanel] = useState(false);
  const [multipleRequired, setMultipleRequired] = useState(true);
  const [multipleAllowOther, setMultipleAllowOther] = useState(false);
  const [multipleRandomize, setMultipleRandomize] = useState(false);
  const [multipleMultipleSelect, setMultipleMultipleSelect] = useState(false);
  const [multipleShowKeyboardHints, setMultipleShowKeyboardHints] = useState(false);
  const [multipleOptionHeight, setMultipleOptionHeight] = useState('M');
  const [multipleMinChoices, setMultipleMinChoices] = useState(1);
  const [multipleMaxChoices, setMultipleMaxChoices] = useState(null);
  const [multipleQuestion, setMultipleQuestion] = useState('Which features do you use most?');
  const [multipleHelperText, setMultipleHelperText] = useState('Select all that apply.');
  const [multipleOptions, setMultipleOptions] = useState(['Dashboard', 'Reports', 'Integrations', 'Analytics']);
  const [multipleLayout, setMultipleLayout] = useState('List');
  const [multipleSections, setMultipleSections] = useState({ fieldSettings: true, options: false, appearance: true });

  /* â”€â”€ Single choice configure panel state â”€â”€ */
  const [showSingleConfigPanel, setShowSingleConfigPanel] = useState(false);
  const [singleRequired, setSingleRequired] = useState(true);
  const [singleMultipleSelect, setSingleMultipleSelect] = useState(false);
  const [singleRandomize, setSingleRandomize] = useState(false);
  const [singleAllowOther, setSingleAllowOther] = useState(true);
  const [singleMinChoices, setSingleMinChoices] = useState(1);
  const [singleMaxChoices, setSingleMaxChoices] = useState(null);
  const [singleShowKeyboardHints, setSingleShowKeyboardHints] = useState(true);
  const [singleLayout, setSingleLayout] = useState('List');
  const [singleOptionHeight, setSingleOptionHeight] = useState('M');
  const [singleQuestion, setSingleQuestion] = useState('How did you hear about us?');
  const [singleHelperText, setSingleHelperText] = useState('Choose the option that best describes your experience.');
  const [singleOptions, setSingleOptions] = useState(['Social media', 'Search engine', 'Friend / colleague', 'Advertisement']);
  const [singleSections, setSingleSections] = useState({ fieldSettings: true, appearance: true });

  /* â”€â”€ Media choices configure panel state â”€â”€ */
  const [showMediaConfigPanel, setShowMediaConfigPanel] = useState(false);
  const [mediaRequired, setMediaRequired] = useState(false);
  const [mediaAllowMultiple, setMediaAllowMultiple] = useState(false);
  const [mediaRandomiseOrder, setMediaRandomiseOrder] = useState(false);
  const [mediaMinChoices, setMediaMinChoices] = useState(1);
  const [mediaMaxChoices, setMediaMaxChoices] = useState(null);
  const [mediaLayout, setMediaLayout] = useState('2col');
  const [mediaOptionHeight, setMediaOptionHeight] = useState('S');
  const [mediaQuestion, setMediaQuestion] = useState('Choose an image option');
  const [mediaHelperText, setMediaHelperText] = useState('Select the image that best represents your answer.');
  const [mediaOptions, setMediaOptions] = useState([
    { label: 'Option A', image: null },
    { label: 'Option B', image: null },
    { label: 'Option C', image: null },
    { label: 'Option D', image: null },
  ]);
  const [mediaSections, setMediaSections] = useState({ fieldSettings: true, options: true, conditionalLogic: false, appearance: true });

  /* â”€â”€ Map configure panel state â”€â”€ */
  const [showMapConfigPanel, setShowMapConfigPanel] = useState(false);
  const [mapRequired, setMapRequired] = useState(false);
  const [mapHidden, setMapHidden] = useState(false);
  const [mapQuestion, setMapQuestion] = useState('Where is your office located?');
  const [mapHelperText, setMapHelperText] = useState('Drag the pin to your location');
  const [mapType, setMapType] = useState('roadmap');
  const [mapZoom, setMapZoom] = useState(12);
  const [mapDefaultLat, setMapDefaultLat] = useState(DEFAULT_MAP_CENTER.lat);
  const [mapDefaultLng, setMapDefaultLng] = useState(DEFAULT_MAP_CENTER.lng);
  const [mapDefaultAddress, setMapDefaultAddress] = useState('');
  const [mapAllowPinMovement, setMapAllowPinMovement] = useState(true);
  const [mapShowSearchBar, setMapShowSearchBar] = useState(true);
  const [mapRestrictRadius, setMapRestrictRadius] = useState(false);
  const [mapRestrictRadiusKm, setMapRestrictRadiusKm] = useState(5);
  const [mapPinLabel, setMapPinLabel] = useState('Your location');
  const [mapHeight, setMapHeight] = useState('M');
  const [mapSections, setMapSections] = useState({ fieldSettings: true, appearance: true, conditionalLogic: false });

  /* â”€â”€ Captcha configure panel state â”€â”€ */
  const [showCaptchaConfigPanel, setShowCaptchaConfigPanel] = useState(false);
  const [captchaEnabled, setCaptchaEnabled] = useState(true);
  const [captchaProvider, setCaptchaProvider] = useState('Google reCAPTCHA v3');
  const [captchaSiteKey, setCaptchaSiteKey] = useState('');
  const [captchaSecretKey, setCaptchaSecretKey] = useState('');
  const [captchaVisibility, setCaptchaVisibility] = useState('invisible');
  const [captchaShowBadge, setCaptchaShowBadge] = useState(true);
  const [captchaBadgePosition, setCaptchaBadgePosition] = useState('bottom-right');
  const [captchaBlockOnFailure, setCaptchaBlockOnFailure] = useState(true);
  const [captchaSections, setCaptchaSections] = useState({ fieldSettings: true, behaviour: false, conditionalLogic: false });

  /* â”€â”€ Multi-image upload configure panel state â”€â”€ */
  const [showMultiImageConfigPanel, setShowMultiImageConfigPanel] = useState(false);
  const [multiImageQuestion, setMultiImageQuestion] = useState('Upload photos of the issue');
  const [multiImageHelperText, setMultiImageHelperText] = useState('Add up to 9 images. Drag to reorder.');
  const [multiImageRequired, setMultiImageRequired] = useState(false);
  const [multiImageMultipleFiles, setMultiImageMultipleFiles] = useState(true);
  const [multiImageMaxFiles, setMultiImageMaxFiles] = useState(5);
  const [multiImageMaxFileSize, setMultiImageMaxFileSize] = useState('25 MB');
  const [multiImageSizeDropdownOpen, setMultiImageSizeDropdownOpen] = useState(false);

  /* ── File upload (Upload) configure state ── */
  const [uploadQuestion, setUploadQuestion] = useState('Attach supporting documents');
  const [uploadHelperText, setUploadHelperText] = useState('Attach any files that help us understand your request better.');
  const [uploadMaxFileSize, setUploadMaxFileSize] = useState('25 MB');
  const [multiImageAcceptedTypes, setMultiImageAcceptedTypes] = useState(['PDF', 'PNG', 'JPG', 'DOCX']);
  const [multiImageUploadZoneSize, setMultiImageUploadZoneSize] = useState('Default');
  const [multiImageShowPreview, setMultiImageShowPreview] = useState(true);
  const [multiImageSections, setMultiImageSections] = useState({ fieldSettings: true, appearance: true });

  /* â”€â”€ Date configure panel state â”€â”€ */
  const [showDateConfigPanel, setShowDateConfigPanel] = useState(false);
  const [dateQuestion, setDateQuestion] = useState("When's the best date for you?");
  const [dateHelperText, setDateHelperText] = useState('Pick a date from the calendar.');
  const [dateRequired, setDateRequired] = useState(false);
  const [dateSections, setDateSections] = useState({ fieldSettings: true });

  /* â”€â”€ Time configure panel state â”€â”€ */
  const [showTimeConfigPanel, setShowTimeConfigPanel] = useState(false);
  const [timeQuestion, setTimeQuestion] = useState('What time works best for you?');
  const [timeHelperText, setTimeHelperText] = useState('Select your preferred time slot.');
  const [timeRequired, setTimeRequired] = useState(true);
  const [timeUse12h, setTimeUse12h] = useState(false);
  const [timeShowSeconds, setTimeShowSeconds] = useState(true);
  const [timeMinTime, setTimeMinTime] = useState('');
  const [timeMaxTime, setTimeMaxTime] = useState('');
  const [timeSections, setTimeSections] = useState({ fieldSettings: true });

  /* â”€â”€ Rating configure panel state â”€â”€ */
  const [showRatingConfigPanel, setShowRatingConfigPanel] = useState(false);
  const [ratingQuestion, setRatingQuestion] = useState('How would you rate your overall experience?');
  const [ratingRequired, setRatingRequired] = useState(false);
  const [ratingUseScale, setRatingUseScale] = useState(true);
  const [ratingUseSlider, setRatingUseSlider] = useState(false);
  const [ratingMaxRating, setRatingMaxRating] = useState(5);
  const [ratingStyle, setRatingStyle] = useState('Stars');
  const [ratingLowLabel, setRatingLowLabel] = useState('Very poor');
  const [ratingHighLabel, setRatingHighLabel] = useState('Excellent');
  const [ratingShowLabels, setRatingShowLabels] = useState(true);
  const [ratingIconSize, setRatingIconSize] = useState('M');
  const [ratingSections, setRatingSections] = useState({ fieldSettings: true, appearance: true });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFileName(file.name);
    }
    e.target.value = '';
  };

  const [openContentSections, setOpenContentSections] = useState({
    buildingBlocks: true,
    basicInfo: true,
    qualitative: true,
    choiceBased: true,
    interactive: true,
    numeric: true,
  });

  const toggleContentSection = (key) => {
    setOpenContentSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* â”€â”€ Add/remove content screens â”€â”€ */
  const nextIdRef = useRef(100);
  const addContentScreen = (sectionKey, itemLabel) => {
    const newId = (nextIdRef.current += 1);
    const newScreen = {
      id: newId,
      name: itemLabel,
      type: 'content',
      section: sectionKey,
      label: itemLabel,
    };
    setScreens((prev) => {
      const endIdx = prev.findIndex((s) => s.type === 'end');
      if (endIdx === -1) return [...prev, newScreen];
      return [...prev.slice(0, endIdx), newScreen, ...prev.slice(endIdx)];
    });
    setActiveScreenId(newId);
    setShowContentPanel(false);
    if (itemLabel === 'CTA') {
      setShowCtaConfigPanel(true);
    } else if (itemLabel === 'Heading') {
      setShowHeadingConfigPanel(true);
    } else if (itemLabel === 'Description') {
      setShowDescriptionConfigPanel(true);
    } else if (itemLabel === 'Images') {
      setShowImageConfigPanel(true);
    } else if (itemLabel === 'Video') {
      setShowVideoConfigPanel(true);
    } else if (itemLabel === 'Contact') {
      setShowContactConfigPanel(true);
    } else if (itemLabel === 'Address') {
      setShowAddressConfigPanel(true);
    } else if (itemLabel === 'Work Info') {
      setShowWorkConfigPanel(true);
    } else if (itemLabel === 'Short text') {
      setShowShortTextConfigPanel(true);
    } else if (itemLabel === 'Long text') {
      setShowLongTextConfigPanel(true);
    } else if (itemLabel === 'Single') {
      setShowSingleConfigPanel(true);
    } else if (itemLabel === 'Multiple') {
      setShowMultipleConfigPanel(true);
    } else if (itemLabel === 'Media') {
      setShowMediaConfigPanel(true);
    } else if (itemLabel === 'Maps') {
      setShowMapConfigPanel(true);
    } else if (itemLabel === 'Captcha') {
      setShowCaptchaConfigPanel(true);
    } else if (itemLabel === 'Multi-image upload' || itemLabel === 'Upload') {
      setShowMultiImageConfigPanel(true);
    } else if (itemLabel === 'Rating') {
      setShowRatingConfigPanel(true);
    } else if (itemLabel === 'Date') {
      setShowDateConfigPanel(true);
    } else if (itemLabel === 'Time') {
      setShowTimeConfigPanel(true);
    }
  };

  const removeContentScreen = (screenId) => {
    if (activeScreenId === screenId) {
      closeAllRightPanels();
    }
    setLogicConnections((prev) => prev.filter((c) => c.from !== screenId && c.to !== screenId));
    setLogicIfRulesByEdge((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        const [from, to] = key.split('-').map(Number);
        if (from === screenId || to === screenId) delete next[key];
      }
      return next;
    });
    setLogicElseByScreen((prev) => {
      const next = { ...prev };
      delete next[screenId];
      return next;
    });
    if (ifThenLogicPanelEdge?.from === screenId || ifThenLogicPanelEdge?.to === screenId) {
      setIfThenLogicPanelEdge(null);
      setIfThenDraft(null);
    }
    setScreens((prev) => {
      const remaining = prev.filter((s) => s.id !== screenId);
      if (activeScreenId === screenId) {
        const idx = prev.findIndex((s) => s.id === screenId);
        const fallback = remaining[Math.max(0, idx - 1)];
        setActiveScreenId(fallback ? fallback.id : null);
      }
      return remaining;
    });
  };

  const handleContentRowDragStart = (e, screenId) => {
    contentDragSourceIdRef.current = screenId;
    setContentDraggingId(screenId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(screenId));
  };

  const handleContentRowDragOver = (e, screenId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const fromId = contentDragSourceIdRef.current;
    if (fromId != null && fromId !== screenId) {
      setContentDropTargetId(screenId);
    }
  };

  const handleContentRowDrop = (e, targetScreenId) => {
    e.preventDefault();
    const fromId = contentDragSourceIdRef.current;
    contentDragSourceIdRef.current = null;
    setContentDraggingId(null);
    setContentDropTargetId(null);
    if (fromId == null || fromId === targetScreenId) return;
    setScreens((prev) => {
      const intro = prev.filter((s) => s.type === 'intro');
      const content = prev.filter((s) => s.type === 'content');
      const end = prev.filter((s) => s.type === 'end');
      const safeIntro = intro.length ? intro : [];
      const safeEnd = end.length ? end : [];
      const fromIdx = content.findIndex((s) => s.id === fromId);
      const toIdx = content.findIndex((s) => s.id === targetScreenId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...content];
      const [removed] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, removed);
      return [...safeIntro, ...next, ...safeEnd];
    });
  };

  const handleContentRowDragEnd = () => {
    contentDragSourceIdRef.current = null;
    setContentDraggingId(null);
    setContentDropTargetId(null);
  };

  const onLogicCardPointerDown = useCallback((e, screenId) => {
    if (e.button !== 0) return;
    if (e.target instanceof Element && e.target.closest('[data-logic-output-port]')) return;
    e.stopPropagation();
    logicCardDragRef.current = { startX: e.clientX, startY: e.clientY, screenId };
    setLogicCardDraggingId(screenId);
    setLogicCardDragOffset({ x: 0, y: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onLogicCardPointerMove = useCallback((e, screenId) => {
    const d = logicCardDragRef.current;
    if (!d || d.screenId !== screenId) return;
    const z = logicCanvasZoomRef.current;
    setLogicCardDragOffset({ x: (e.clientX - d.startX) / z, y: (e.clientY - d.startY) / z });
  }, []);

  const onLogicCardPointerUp = useCallback((e, screenId) => {
    const d = logicCardDragRef.current;
    logicCardDragRef.current = null;
    setLogicCardDraggingId(null);
    setLogicCardDragOffset({ x: 0, y: 0 });
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (!d || d.screenId !== screenId) return;
    const moved = Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY);
    if (moved < 10) return;

    const z = logicCanvasZoomRef.current;
    const dx = (e.clientX - d.startX) / z;
    const dy = (e.clientY - d.startY) / z;
    setLogicCardOffsets((prev) => ({
      ...prev,
      [screenId]: {
        x: (prev[screenId]?.x ?? 0) + dx,
        y: (prev[screenId]?.y ?? 0) + dy,
      },
    }));
  }, []);

  const clientToLogicBoardLocal = useCallback((clientX, clientY) => {
    const board = logicBoardMeasureRef.current;
    if (!board) return { x: 0, y: 0 };
    const r = board.getBoundingClientRect();
    const z = logicCanvasZoomRef.current;
    return {
      x: (clientX - r.left - LOGIC_BOARD_PAD_X * z) / z,
      y: (clientY - r.top - LOGIC_BOARD_PAD_Y * z) / z,
    };
  }, []);

  const resolveLogicDropTarget = useCallback((clientX, clientY, fromId) => {
    const stack = document.elementsFromPoint(clientX, clientY);
    for (const node of stack) {
      if (!(node instanceof Element)) continue;
      const card = node.closest('[data-logic-card]');
      if (!card) continue;
      const sid = card.getAttribute('data-screen-id');
      if (!sid) continue;
      const id = Number(sid);
      if (id === fromId) continue;
      return id;
    }
    return null;
  }, []);

  const applyLogicConnectionDrop = useCallback(
    (g, clientX, clientY) => {
      const fromMeta = logicPortPositionsRef.current.get(g.fromId);
      if (!fromMeta || fromMeta.outX == null) return;
      const boardMoved = Math.hypot(g.x1 - fromMeta.outX, g.y1 - fromMeta.portY);
      if (boardMoved < 12) return;
      const targetId = resolveLogicDropTarget(clientX, clientY, g.fromId);
      if (targetId == null) return;
      const toMeta = logicPortPositionsRef.current.get(targetId);
      if (!toMeta || toMeta.inX == null || toMeta.kind === 'intro') return;
      const droppedKind = g.kind != null ? g.kind : null;
      setLogicConnections((prev) => upsertLogicConnection(prev, g.fromId, targetId, droppedKind));
      if (droppedKind == null) {
        requestAnimationFrame(() => {
          const vr = logicViewportRef.current?.getBoundingClientRect();
          if (!vr) return;
          const rawVx = clientX - vr.left + 6;
          const rawVy = clientY - vr.top + 6;
          const { vx, vy } = clampLogicMenuViewportPos(rawVx, rawVy, vr);
          setLogicConnectorMenu({
            mode: 'chooseEdgeKind',
            fromId: g.fromId,
            toId: targetId,
            vx,
            vy,
          });
        });
      } else {
        setLogicConnectorMenu(null);
      }
    },
    [resolveLogicDropTarget]
  );

  const removeLogicConnection = useCallback(
    (fromId, toId) => {
      setLogicConnectorMenu(null);
      setLogicDisconnectHoveredKey(null);
      setLogicConnections((prev) => prev.filter((c) => !(c.from === fromId && c.to === toId)));
      setLogicIfRulesByEdge((prev) => {
        const next = { ...prev };
        delete next[logicEdgeKey(fromId, toId)];
        return next;
      });
      if (ifThenLogicPanelEdge?.from === fromId && ifThenLogicPanelEdge?.to === toId) {
        setIfThenLogicPanelEdge(null);
        setIfThenDraft(null);
      }
    },
    [ifThenLogicPanelEdge]
  );

  const handleLogicMenuConnectNext = useCallback((fromId) => {
    setLogicConnectorMenu(null);
    const idx = screens.findIndex((s) => s.id === fromId);
    if (idx === -1 || idx >= screens.length - 1) return;
    const target = screens[idx + 1];
    if (target.type === 'intro') return;
    setLogicConnections((prev) => upsertLogicConnection(prev, fromId, target.id, LOGIC_EDGE_KIND.next));
  }, [screens]);

  const handleLogicMenuConnectEnd = useCallback((fromId) => {
    setLogicConnectorMenu(null);
    const end = screens.find((s) => s.type === 'end');
    if (!end) return;
    setLogicConnections((prev) => upsertLogicConnection(prev, fromId, end.id, LOGIC_EDGE_KIND.end));
  }, [screens]);

  const handleLogicMenuSkip = useCallback((fromId) => {
    setLogicConnectorMenu(null);
    const idx = screens.findIndex((s) => s.id === fromId);
    if (idx === -1) return;
    const target = screens[idx + 2];
    if (!target || target.type === 'intro') return;
    setLogicConnections((prev) => upsertLogicConnection(prev, fromId, target.id, LOGIC_EDGE_KIND.skip));
  }, [screens]);

  const getLogicFieldOptionsForScreen = useCallback((screen) => {
    if (!screen || screen.type !== 'content') {
      return getLogicFieldsForScreenLabel('Short text');
    }
    return getLogicFieldsForScreenLabel(screen.label);
  }, []);

  const getLogicDestinationOptions = useCallback(
    (fromScreenId) => {
      const end = screens.find((s) => s.type === 'end');
      const destinations = screens
        .filter((s) => s.type === 'content' && s.id !== fromScreenId)
        .map((s) => ({
          id: s.id,
          label: s.name || s.label || 'Screen',
        }));
      if (end) destinations.push({ id: end.id, label: 'End screen' });
      return destinations;
    },
    [screens]
  );

  const normalizeConditionFieldId = useCallback((fieldId, screen) => {
    if (getLogicFieldById(fieldId)) return fieldId;
    const screenFields = getLogicFieldsForScreenLabel(screen?.label);
    if (screenFields[0]?.id) return screenFields[0].id;
    return LOGIC_FIELD_CATALOG[0]?.id ?? 'rating';
  }, []);

  const buildDefaultIfThenDraft = useCallback(
    (fromScreenId, toScreenId, initialThenScreenId = null) => {
      const screen = screens.find((s) => s.id === fromScreenId);
      const fieldOptions = getLogicFieldOptionsForScreen(screen);
      const fieldId = fieldOptions[0]?.id ?? 'rating';
      const end = screens.find((s) => s.type === 'end');
      const targetTo = toScreenId ?? initialThenScreenId;
      const elseScreenId = logicElseByScreen[fromScreenId] ?? end?.id ?? null;

      if (targetTo != null) {
        const saved = logicIfRulesByEdge[logicEdgeKey(fromScreenId, targetTo)];
        if (saved?.rules?.length) {
          return {
            rules: saved.rules.map((r) => ({
              ...r,
              thenScreenId: targetTo,
              conditions: r.conditions.map((c) => ({
                ...c,
                fieldId: normalizeConditionFieldId(c.fieldId, screen),
              })),
            })),
            elseScreenId,
          };
        }
        return {
          rules: [{ ...createEmptyRule(fieldId), thenScreenId: targetTo }],
          elseScreenId,
        };
      }

      const firstDest =
        initialThenScreenId ??
        screens.find((s) => s.type === 'content' && s.id !== fromScreenId)?.id ??
        end?.id ??
        null;
      return {
        rules: [{ ...createEmptyRule(fieldId), thenScreenId: firstDest }],
        elseScreenId,
      };
    },
    [
      screens,
      logicIfRulesByEdge,
      logicElseByScreen,
      getLogicFieldOptionsForScreen,
      normalizeConditionFieldId,
    ]
  );

  const openIfThenLogicPanel = useCallback(
    (fromScreenId, { to: toScreenId = null, initialThenScreenId = null } = {}) => {
      closeAllRightPanels();
      setLogicConnectorMenu(null);
      const targetTo = toScreenId ?? initialThenScreenId;
      const draft = buildDefaultIfThenDraft(fromScreenId, targetTo, initialThenScreenId);
      ifThenDraftSnapshotRef.current = JSON.parse(JSON.stringify(draft));
      setIfThenDraft(draft);
      setIfThenLogicPanelEdge(
        targetTo != null
          ? { from: fromScreenId, to: targetTo }
          : { from: fromScreenId, to: null }
      );
    },
    [buildDefaultIfThenDraft]
  );

  const closeIfThenLogicPanel = useCallback(() => {
    setIfThenLogicPanelEdge(null);
    setIfThenDraft(null);
    ifThenDraftSnapshotRef.current = null;
  }, []);

  const clearLogicForConnection = useCallback(
    (fromId, toId) => {
      setLogicConnectorMenu(null);
      setLogicIfRulesByEdge((prev) => {
        const next = { ...prev };
        delete next[logicEdgeKey(fromId, toId)];
        return next;
      });
      setLogicConnections((prev) => {
        const edge = prev.find((c) => c.from === fromId && c.to === toId);
        if (edge?.kind === LOGIC_EDGE_KIND.if) {
          return upsertLogicConnection(prev, fromId, toId, LOGIC_EDGE_KIND.next);
        }
        return prev;
      });
      if (ifThenLogicPanelEdge?.from === fromId && ifThenLogicPanelEdge?.to === toId) {
        setIfThenLogicPanelEdge(null);
        setIfThenDraft(null);
        ifThenDraftSnapshotRef.current = null;
      }
    },
    [ifThenLogicPanelEdge]
  );

  const cancelIfThenLogicPanel = useCallback(() => {
    closeIfThenLogicPanel();
  }, [closeIfThenLogicPanel]);

  const saveIfThenLogic = useCallback(() => {
    if (!ifThenLogicPanelEdge || !ifThenDraft) return;
    let { from, to } = ifThenLogicPanelEdge;
    if (to == null) {
      to = ifThenDraft.rules[0]?.thenScreenId;
      if (to == null) return;
    }

    setLogicIfRulesByEdge((prev) => ({
      ...prev,
      [logicEdgeKey(from, to)]: {
        rules: ifThenDraft.rules.map((r) => ({
          ...r,
          thenScreenId: to,
          conditions: r.conditions.map((c) => ({ ...c })),
        })),
      },
    }));

    setLogicElseByScreen((prev) => ({
      ...prev,
      [from]: ifThenDraft.elseScreenId,
    }));

    setLogicConnections((prev) => {
      let next = upsertLogicConnection(
        prev.filter((c) => !(c.from === from && c.to === to)),
        from,
        to,
        LOGIC_EDGE_KIND.if
      );
      if (ifThenDraft.elseScreenId != null) {
        next = next.filter(
          (c) =>
            !(
              c.from === from &&
              c.to === ifThenDraft.elseScreenId &&
              c.kind === LOGIC_EDGE_KIND.next
            )
        );
        next = upsertLogicConnection(next, from, ifThenDraft.elseScreenId, LOGIC_EDGE_KIND.next);
      }
      return next;
    });

    closeIfThenLogicPanel();
  }, [ifThenLogicPanelEdge, ifThenDraft, closeIfThenLogicPanel]);

  const openLogicOptionsForEdge = useCallback(
    (connection, clientX, clientY) => {
      setLogicEdgeKindHoveredKey(null);
      setLogicDisconnectHoveredKey(null);
      const vr = logicViewportRef.current?.getBoundingClientRect();
      if (!vr) return;
      const pos = clampLogicMenuViewportPos(clientX - vr.left + 6, clientY - vr.top + 6, vr);
      if (connection.kind === LOGIC_EDGE_KIND.if) {
        openIfThenLogicPanel(connection.from, { to: connection.to });
        return;
      }
      if (connection.kind == null) {
        setLogicConnectorMenu({
          mode: 'chooseEdgeKind',
          fromId: connection.from,
          toId: connection.to,
          ...pos,
        });
        return;
      }
      setLogicConnectorMenu({ mode: 'fromPort', fromId: connection.from, ...pos });
    },
    [openIfThenLogicPanel]
  );

  /** After drawing a new wire (pending `kind`), user picks Next / If / Skip / End for that edge only. */
  const applyChosenEdgeKind = useCallback(
    (fromId, toId, edgeKind) => {
      setLogicConnectorMenu(null);
      const end = screens.find((s) => s.type === 'end');
      if (edgeKind === LOGIC_EDGE_KIND.if) {
        openIfThenLogicPanel(fromId, { to: toId });
        return;
      }
      if (edgeKind === LOGIC_EDGE_KIND.end) {
        if (!end) return;
        setLogicConnections((prev) => {
          const tail = prev.filter((c) => !(c.from === fromId && c.to === toId));
          return upsertLogicConnection(tail, fromId, end.id, LOGIC_EDGE_KIND.end);
        });
        return;
      }
      setLogicConnections((prev) => upsertLogicConnection(prev, fromId, toId, edgeKind));
    },
    [screens, openIfThenLogicPanel]
  );

  const startLogicDocumentConnect = useCallback(
    (fromId, kind) => {
      setLogicConnectorMenu(null);
      if (kind === LOGIC_EDGE_KIND.if) {
        openIfThenLogicPanel(fromId);
        return;
      }
      requestAnimationFrame(() => {
        const meta = logicPortPositionsRef.current.get(fromId);
        if (!meta?.outX) return;
        const payload = { fromId, x1: meta.outX, y1: meta.portY, kind };
        logicConnectGestureRef.current = payload;
        setLogicConnectDrag(payload);

        const onMove = (ev) => {
          if (!logicConnectGestureRef.current) return;
          const p = clientToLogicBoardLocal(ev.clientX, ev.clientY);
          const next = { ...logicConnectGestureRef.current, x1: p.x, y1: p.y };
          logicConnectGestureRef.current = next;
          setLogicConnectDrag({ ...next });
        };
        const onUp = (ev) => {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
          const g = logicConnectGestureRef.current;
          logicConnectGestureRef.current = null;
          setLogicConnectDrag(null);
          if (g) applyLogicConnectionDrop(g, ev.clientX, ev.clientY);
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
      });
    },
    [clientToLogicBoardLocal, applyLogicConnectionDrop, openIfThenLogicPanel]
  );

  const onLogicOutputPortPointerDown = useCallback((e, fromId) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    logicPortTapRef.current = { fromId, sx: e.clientX, sy: e.clientY, pointerId: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onLogicOutputPortPointerMove = useCallback(
    (e) => {
      const tap = logicPortTapRef.current;
      if (tap && tap.pointerId === e.pointerId) {
        const moved = Math.abs(e.clientX - tap.sx) + Math.abs(e.clientY - tap.sy);
        if (moved > 8) {
          logicPortTapRef.current = null;
          const p = clientToLogicBoardLocal(e.clientX, e.clientY);
          const payload = { fromId: tap.fromId, x1: p.x, y1: p.y, kind: null };
          logicConnectGestureRef.current = payload;
          setLogicConnectDrag(payload);
        }
        return;
      }
      if (!logicConnectGestureRef.current) return;
      const p = clientToLogicBoardLocal(e.clientX, e.clientY);
      const next = { ...logicConnectGestureRef.current, x1: p.x, y1: p.y };
      logicConnectGestureRef.current = next;
      setLogicConnectDrag(next);
    },
    [clientToLogicBoardLocal]
  );

  const onLogicOutputPortPointerUp = useCallback(
    (e) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }

      const tap = logicPortTapRef.current;
      logicPortTapRef.current = null;

      if (tap && tap.pointerId === e.pointerId) {
        const moved = Math.abs(e.clientX - tap.sx) + Math.abs(e.clientY - tap.sy);
        if (moved < 8) return;
      }

      const g = logicConnectGestureRef.current;
      logicConnectGestureRef.current = null;
      setLogicConnectDrag(null);
      if (!g) return;
      applyLogicConnectionDrop(g, e.clientX, e.clientY);
    },
    [applyLogicConnectionDrop]
  );

  /* â”€â”€ Intro essential variant (null = show default welcome card) â”€â”€ */
  const [introEssential, setIntroEssential] = useState(null);

  /* â”€â”€ End screen state â”€â”€ */
  const [endScreenTitle, setEndScreenTitle] = useState('Thanks for your response!');
  const [endScreenDescription, setEndScreenDescription] = useState('Your submission has been recorded. We really appreciate you taking the time to share your feedback with us.');
  const [endScreenButtonText, setEndScreenButtonText] = useState('Done');
  const [isEditingEndScreen, setIsEditingEndScreen] = useState(false);
  const [draftEndTitle, setDraftEndTitle] = useState('Thanks for your response!');
  const [draftEndDescription, setDraftEndDescription] = useState('Your submission has been recorded. We really appreciate you taking the time to share your feedback with us.');
  const [draftEndButtonText, setDraftEndButtonText] = useState('Done');

  /* â”€â”€ Default welcome card content state â”€â”€ */
  const [introTitle, setIntroTitle] = useState('Title');
  const [introDescription, setIntroDescription] = useState('Add the purpose of form here');
  const [introButtonText, setIntroButtonText] = useState('Start \u2192');
  const [logoImage, setLogoImage] = useState(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [draftTitle, setDraftTitle] = useState('Title');
  const [draftDescription, setDraftDescription] = useState('Add the purpose of form here');
  const [draftButtonText, setDraftButtonText] = useState('Start \u2192');
  const [draftLogo, setDraftLogo] = useState(null);
  const logoInputRef = useRef(null);

  const handleEditContent = () => {
    setDraftTitle(introTitle);
    setDraftDescription(introDescription);
    setDraftButtonText(introButtonText);
    setDraftLogo(logoImage);
    setIsEditingContent(true);
  };

  const handleSaveContent = () => {
    setIntroTitle(draftTitle);
    setIntroDescription(draftDescription);
    setIntroButtonText(draftButtonText);
    setLogoImage(draftLogo);
    setIsEditingContent(false);
  };

  const handleEditEndScreen = () => {
    setDraftEndTitle(endScreenTitle);
    setDraftEndDescription(endScreenDescription);
    setDraftEndButtonText(endScreenButtonText);
    setIsEditingEndScreen(true);
  };

  const handleSaveEndScreen = () => {
    setEndScreenTitle(draftEndTitle);
    setEndScreenDescription(draftEndDescription);
    setEndScreenButtonText(draftEndButtonText);
    setIsEditingEndScreen(false);
  };

  const hasEndScreenChanges =
    isEditingEndScreen &&
    (draftEndTitle !== endScreenTitle ||
      draftEndDescription !== endScreenDescription ||
      draftEndButtonText !== endScreenButtonText);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setDraftLogo(URL.createObjectURL(file));
    e.target.value = '';
  };

  const hasChanges =
    isEditingContent &&
    (draftTitle !== introTitle ||
      draftDescription !== introDescription ||
      draftButtonText !== introButtonText ||
      draftLogo !== logoImage);

  const panelTimerRef = useRef(null);

  const closeAllRightPanels = () => {
    setShowConfigPanel(false);
    setShowContentPanel(false);
    setShowCtaConfigPanel(false);
    setShowHeadingConfigPanel(false);
    setShowDescriptionConfigPanel(false);
    setShowImageConfigPanel(false);
    setShowVideoConfigPanel(false);
    setShowContactConfigPanel(false);
    setShowAddressConfigPanel(false);
    setShowWorkConfigPanel(false);
    setShowShortTextConfigPanel(false);
    setShowLongTextConfigPanel(false);
    setShowSingleConfigPanel(false);
    setShowMultipleConfigPanel(false);
    setShowMediaConfigPanel(false);
    setShowMapConfigPanel(false);
    setShowCaptchaConfigPanel(false);
    setShowMultiImageConfigPanel(false);
    setShowRatingConfigPanel(false);
    setShowDateConfigPanel(false);
    setShowTimeConfigPanel(false);
    setShowDesignPanel(false);
    setIfThenLogicPanelEdge(null);
    setIfThenDraft(null);
    ifThenDraftSnapshotRef.current = null;
  };

  const openPanelByName = (name) => {
    if (name === 'config') setShowConfigPanel(true);
    else if (name === 'content') setShowContentPanel(true);
    else if (name === 'ctaConfig') setShowCtaConfigPanel(true);
    else if (name === 'headingConfig') setShowHeadingConfigPanel(true);
    else if (name === 'descriptionConfig') setShowDescriptionConfigPanel(true);
    else if (name === 'imageConfig') setShowImageConfigPanel(true);
    else if (name === 'videoConfig') setShowVideoConfigPanel(true);
    else if (name === 'contactConfig') setShowContactConfigPanel(true);
    else if (name === 'addressConfig') setShowAddressConfigPanel(true);
    else if (name === 'workConfig') setShowWorkConfigPanel(true);
    else if (name === 'shortTextConfig') setShowShortTextConfigPanel(true);
    else if (name === 'longTextConfig') setShowLongTextConfigPanel(true);
    else if (name === 'singleConfig') setShowSingleConfigPanel(true);
    else if (name === 'multipleConfig') setShowMultipleConfigPanel(true);
    else if (name === 'mediaConfig') setShowMediaConfigPanel(true);
    else if (name === 'mapConfig') setShowMapConfigPanel(true);
    else if (name === 'captchaConfig') setShowCaptchaConfigPanel(true);
    else if (name === 'multiImageConfig') setShowMultiImageConfigPanel(true);
    else if (name === 'ratingConfig') setShowRatingConfigPanel(true);
    else if (name === 'dateConfig') setShowDateConfigPanel(true);
    else if (name === 'timeConfig') setShowTimeConfigPanel(true);
    else if (name === 'designPanel') setShowDesignPanel(true);
  };

  /* Close one panel, then open another after the exit animation finishes */
  const switchPanel = (open) => {
    if (panelTimerRef.current) clearTimeout(panelTimerRef.current);
    closeAllRightPanels();
    panelTimerRef.current = setTimeout(() => {
      openPanelByName(open);
    }, 300);
  };

  const handleAddScreen = () => {
    if (screens.length === 0) {
      const welcomeScreen = { id: 1, name: 'Start Screen', type: 'intro' };
      const endScreen = { id: 2, name: 'End Screen', type: 'end' };
      setScreens([welcomeScreen, endScreen]);
      setActiveScreenId(1);
      closeAllRightPanels();
      setShowConfigPanel(true);
    } else {
      if (showContentPanel) {
        setShowContentPanel(false);
      } else {
        switchPanel('content', null);
      }
    }
  };

  const handleSelectTheme = useCallback((theme) => {
    setDesignCardColor(theme.cardBg);
    setDesignCardImage(theme.previewImg);
    setActiveThemeId(theme.id);
    setShowThemeOverlay(false);
  }, []);

  const performDeleteIntroScreen = () => {
    setScreens([]);
    setActiveScreenId(null);
    setLogicConnections([]);
    setLogicIfRulesByEdge({});
    setLogicElseByScreen({});
    setLogicCardOffsets({});
    setLogicConnectDrag(null);
    setLogicConnectorMenu(null);
    setLogicCardHeights({});
    closeAllRightPanels();
    setIntroEssential(null);
    setIsEditingContent(false);
    setLogoImage(null);
    setIntroTitle('Title');
    setIntroDescription('Add the purpose of form here');
    setIntroButtonText('Start \u2192');
    setIsEditingEndScreen(false);
    setEndScreenTitle('Thanks for your response!');
    setEndScreenDescription('Your submission has been recorded. We really appreciate you taking the time to share your feedback with us.');
    setEndScreenButtonText('Done');
  };

  const performDeleteEndScreen = () => {
    setScreens((prev) => {
      const remaining = prev.filter((s) => s.type !== 'end');
      const fallback = remaining[remaining.length - 1];
      setActiveScreenId(fallback ? fallback.id : null);
      return remaining;
    });
    setIsEditingEndScreen(false);
  };

  const toggleSection = (key) => {
    setSections((prev) => {
      const isAlreadyOpen = prev[key];
      const allClosed = Object.fromEntries(Object.keys(prev).map((k) => [k, false]));
      return { ...allClosed, [key]: !isAlreadyOpen };
    });
  };

  const hasScreens = screens.length > 0;
  const activeScreen = screens.find((s) => s.id === activeScreenId) ?? null;
  const configureIsUpload = activeScreen?.label === 'Upload';
  const configureMaxFileSize = configureIsUpload ? uploadMaxFileSize : multiImageMaxFileSize;
  const setConfigureMaxFileSize = configureIsUpload ? setUploadMaxFileSize : setMultiImageMaxFileSize;
  const contentScreens = screens.filter((s) => s.type === 'content');
  /** Design: only after Add screen creates the form shell */
  const designTabDisabled = !hasScreens;
  /** Logic: needs at least one question screen (also implies hasScreens) */
  const logicTabDisabled = contentScreens.length === 0;
  const contentBlockNum = contentScreens.findIndex((s) => s.id === activeScreenId) + 1;
  const activeScreenIdx = screens.findIndex((s) => s.id === activeScreenId);

  configGlobalsRef.current = {
    contactQuestion,
    contactHelperText,
    contactFields,
    contactRequired,
    addressQuestion,
    addressHelperText,
    addressFields,
    addressRequired,
    workQuestion,
    workHelperText,
    workFields,
    workRequired,
    shortTextQuestion,
    shortTextHelperText,
    shortTextPlaceholder,
    shortTextMaxChars,
    shortTextMinChars,
    shortTextValidation,
    shortTextAlign,
    shortTextSize,
    shortTextRequired,
    shortTextHidden,
    longTextQuestion,
    longTextHelperText,
    longTextPlaceholder,
    longTextMaxChars,
    longTextMinChars,
    longTextValidation,
    longTextAlign,
    longTextSize,
    longTextRequired,
    longTextHidden,
    singleQuestion,
    singleHelperText,
    singleOptions,
    singleLayout,
    singleOptionHeight,
    singleRequired,
    singleAllowOther,
    singleRandomize,
    singleMultipleSelect,
    singleMinChoices,
    singleMaxChoices,
    singleShowKeyboardHints,
    multipleQuestion,
    multipleHelperText,
    multipleOptions,
    multipleLayout,
    multipleRequired,
    multipleAllowOther,
    multipleRandomize,
    multipleMultipleSelect,
    multipleMinChoices,
    multipleMaxChoices,
    multipleShowKeyboardHints,
    multipleOptionHeight,
    headingText,
    subHeading,
    headingRequired,
    headingHidden,
    headingLevel,
    headingTextSize,
    headingAlignment,
    headingFontWeight,
    headingAnswerText,
    descriptionContent,
    descriptionHidden,
    descriptionShowCharCount,
    descriptionCharLimit,
    descriptionFormatting,
    descriptionTextSize,
    descriptionAlignment,
    dateQuestion,
    dateHelperText,
    dateRequired,
    timeQuestion,
    timeHelperText,
    timeRequired,
    timeUse12h,
    timeShowSeconds,
    timeMinTime,
    timeMaxTime,
    ratingQuestion,
    ratingRequired,
    ratingUseScale,
    ratingUseSlider,
    ratingMaxRating,
    ratingStyle,
    ratingLowLabel,
    ratingHighLabel,
    ratingShowLabels,
    ratingIconSize,
    imageQuestion,
    imageDescription,
    imageHidden,
    imageAltText,
    imageCaption,
    imageLinkOnClick,
    imageLinkUrl,
    imageOpenInNewTab,
    imageAlignment,
    imageWidth,
    imageCornerRadius,
    imagePreview,
    imageFileName,
    videoQuestion,
    videoDescription,
    videoRequired,
    videoHidden,
    videoLoop,
    videoAutoplay,
    videoShowControls,
    videoSource,
    videoUrl,
    videoCaption,
    videoWidth,
    videoAspectRatio,
    videoCornerRadius,
    mapQuestion,
    mapHelperText,
    mapType,
    mapZoom,
    mapRequired,
    mapHidden,
    mediaQuestion,
    mediaHelperText,
    mediaOptions,
    mediaAllowMultiple,
    mediaRequired,
    mediaRandomiseOrder,
    mediaMinChoices,
    mediaMaxChoices,
    mediaLayout,
    mediaOptionHeight,
    captchaProvider,
    captchaSiteKey,
    captchaEnabled,
    captchaVisibility,
    multiImageQuestion,
    multiImageHelperText,
    multiImageMaxFiles,
    multiImageRequired,
    multiImageMultipleFiles,
    multiImageMaxFileSize,
    uploadQuestion,
    uploadHelperText,
    uploadMaxFileSize,
  };

  const screenConfigSetters = useMemo(
    () => ({
      setContactQuestion,
      setContactHelperText,
      setContactFields,
      setContactRequired,
      setAddressQuestion,
      setAddressHelperText,
      setAddressFields,
      setAddressRequired,
      setWorkQuestion,
      setWorkHelperText,
      setWorkFields,
      setWorkRequired,
      setShortTextQuestion,
      setShortTextHelperText,
      setShortTextPlaceholder,
      setShortTextMaxChars,
      setShortTextMinChars,
      setShortTextValidation,
      setShortTextAlign,
      setShortTextSize,
      setShortTextRequired,
      setShortTextHidden,
      setLongTextQuestion,
      setLongTextHelperText,
      setLongTextPlaceholder,
      setLongTextMaxChars,
      setLongTextMinChars,
      setLongTextValidation,
      setLongTextAlign,
      setLongTextSize,
      setLongTextRequired,
      setLongTextHidden,
      setSingleQuestion,
      setSingleHelperText,
      setSingleOptions,
      setSingleLayout,
      setSingleOptionHeight,
      setSingleRequired,
      setSingleAllowOther,
      setSingleRandomize,
      setSingleMultipleSelect,
      setSingleMinChoices,
      setSingleMaxChoices,
      setSingleShowKeyboardHints,
      setMultipleQuestion,
      setMultipleHelperText,
      setMultipleOptions,
      setMultipleLayout,
      setMultipleRequired,
      setMultipleAllowOther,
      setMultipleRandomize,
      setMultipleMultipleSelect,
      setMultipleMinChoices,
      setMultipleMaxChoices,
      setMultipleShowKeyboardHints,
      setMultipleOptionHeight,
      setHeadingText,
      setSubHeading,
      setHeadingRequired,
      setHeadingHidden,
      setHeadingLevel,
      setHeadingTextSize,
      setHeadingAlignment,
      setHeadingFontWeight,
      setHeadingAnswerText,
      setDescriptionContent,
      setDescriptionHidden,
      setDescriptionShowCharCount,
      setDescriptionCharLimit,
      setDescriptionFormatting,
      setDescriptionTextSize,
      setDescriptionAlignment,
      setDateQuestion,
      setDateHelperText,
      setDateRequired,
      setTimeQuestion,
      setTimeHelperText,
      setTimeRequired,
      setTimeUse12h,
      setTimeShowSeconds,
      setTimeMinTime,
      setTimeMaxTime,
      setRatingQuestion,
      setRatingRequired,
      setRatingUseScale,
      setRatingUseSlider,
      setRatingMaxRating,
      setRatingStyle,
      setRatingLowLabel,
      setRatingHighLabel,
      setRatingShowLabels,
      setRatingIconSize,
      setImageQuestion,
      setImageDescription,
      setImageHidden,
      setImageAltText,
      setImageCaption,
      setImageLinkOnClick,
      setImageLinkUrl,
      setImageOpenInNewTab,
      setImageAlignment,
      setImageWidth,
      setImageCornerRadius,
      setImagePreview,
      setImageFileName,
      setVideoQuestion,
      setVideoDescription,
      setVideoRequired,
      setVideoHidden,
      setVideoLoop,
      setVideoAutoplay,
      setVideoShowControls,
      setVideoSource,
      setVideoUrl,
      setVideoCaption,
      setVideoWidth,
      setVideoAspectRatio,
      setVideoCornerRadius,
      setMapQuestion,
      setMapHelperText,
      setMapType,
      setMapZoom,
      setMapDefaultLat,
      setMapDefaultLng,
      setMapDefaultAddress,
      setMapAllowPinMovement,
      setMapShowSearchBar,
      setMapRestrictRadius,
      setMapRestrictRadiusKm,
      setMapPinLabel,
      setMapHeight,
      setMapRequired,
      setMapHidden,
      setMediaQuestion,
      setMediaHelperText,
      setMediaOptions,
      setMediaAllowMultiple,
      setMediaRequired,
      setMediaRandomiseOrder,
      setMediaMinChoices,
      setMediaMaxChoices,
      setMediaLayout,
      setMediaOptionHeight,
      setCaptchaProvider,
      setCaptchaSiteKey,
      setCaptchaEnabled,
      setCaptchaVisibility,
      setMultiImageQuestion,
      setMultiImageHelperText,
      setMultiImageMaxFiles,
      setMultiImageRequired,
      setMultiImageMultipleFiles,
      setMultiImageMaxFileSize,
      setUploadQuestion,
      setUploadHelperText,
      setUploadMaxFileSize,
    }),
    []
  );

  const persistScreenConfigById = useCallback((screenId) => {
    if (screenId == null) return;
    setScreens((prev) => {
      const screen = prev.find((s) => s.id === screenId);
      if (!screen || screen.type !== 'content') return prev;
      const config = extractScreenConfig(screen, configGlobalsRef.current);
      if (!config) return prev;
      return prev.map((s) => (s.id === screenId ? { ...s, config } : s));
    });
  }, []);

  useEffect(() => {
    const formTitle = location.state?.formTitle;
    if (formTitle && !newFormHydratedRef.current && !location.state?.templateId) {
      newFormHydratedRef.current = true;
      setLoadedFormTitle(formTitle);
    }
  }, [location.state?.formTitle, location.state?.templateId]);

  useEffect(() => {
    const templateId = location.state?.templateId;
    if (!templateId || templateHydratedRef.current) return;

    const built = buildFormFromTemplate(templateId);
    if (!built) return;

    templateHydratedRef.current = true;
    nextIdRef.current = built.nextId;

    setScreens(built.screens);
    setLoadedFormTitle(built.formTitle);
    setIntroTitle(built.intro.title);
    setIntroDescription(built.intro.description);
    setIntroButtonText(built.intro.buttonText);
    setDraftTitle(built.intro.title);
    setDraftDescription(built.intro.description);
    setDraftButtonText(built.intro.buttonText);
    setEndScreenTitle(built.end.title);
    setEndScreenDescription(built.end.description);
    setEndScreenButtonText(built.end.buttonText);
    setDraftEndTitle(built.end.title);
    setDraftEndDescription(built.end.description);
    setDraftEndButtonText(built.end.buttonText);
    setIntroEssential(null);
    setLogicConnections([]);
    setLogicIfRulesByEdge({});
    setLogicElseByScreen({});
    setLogicCardOffsets({});
    setActiveScreenId(built.screens[0]?.id ?? null);
    closeAllRightPanels();
    setShowConfigPanel(true);
    setActiveTab('content');
  }, [location.state]);

  useEffect(() => {
    const prevId = prevActiveScreenIdRef.current;
    if (prevId != null && prevId !== activeScreenId) {
      persistScreenConfigById(prevId);
    }
    prevActiveScreenIdRef.current = activeScreenId;

    const screen = screens.find((s) => s.id === activeScreenId);
    if (screen?.type === 'content' && screen.config) {
      applyScreenConfig(screen, screen.config, screenConfigSetters);
    }
  }, [activeScreenId, screens, persistScreenConfigById, screenConfigSetters]);

  const fieldPreviewFallback = useMemo(
    () => ({
      Contact: contactQuestion,
      Address: addressQuestion,
      'Work Info': workQuestion,
      'Short text': shortTextQuestion,
      'Long text': longTextQuestion,
      Single: singleQuestion,
      Multiple: multipleQuestion,
      Rating: ratingQuestion || ratingLowLabel || 'Rate your experience',
      Date: dateQuestion,
      Time: timeQuestion,
      Images: imageQuestion,
      Video: videoQuestion,
      Maps: mapQuestion,
      'Multi-image upload': multiImageQuestion,
      Heading: headingText || 'Add a heading',
      Description: descriptionContent || 'Add a description',
      CTA: ctaButtonLabel,
      Media: mediaQuestion,
      Captcha: "Verify you're human",
    }),
    [
      contactQuestion,
      addressQuestion,
      workQuestion,
      shortTextQuestion,
      longTextQuestion,
      singleQuestion,
      multipleQuestion,
      ratingLowLabel,
      imageQuestion,
      videoQuestion,
      mapQuestion,
      multiImageQuestion,
      headingText,
      descriptionContent,
      ctaButtonLabel,
      mediaQuestion,
    ]
  );

  const getScreenDeleteLabel = useCallback(
    (screen) => {
      if (!screen) return 'Screen';
      if (screen.type === 'intro') {
        return introTitle?.trim() || getScreenPreviewText(screen, fieldPreviewFallback) || 'Start Screen';
      }
      if (screen.type === 'end') {
        return endScreenTitle?.trim() || getScreenPreviewText(screen, fieldPreviewFallback) || 'End Screen';
      }
      return getScreenPreviewText(screen, fieldPreviewFallback) || screen.name || screen.label || 'Screen';
    },
    [fieldPreviewFallback, introTitle, endScreenTitle]
  );

  const requestDeleteScreen = useCallback(
    (payload) => setPendingScreenDelete(payload),
    []
  );

  const closeDeleteScreenModal = useCallback(() => setPendingScreenDelete(null), []);

  const confirmScreenDelete = useCallback(() => {
    if (!pendingScreenDelete) return;
    const { kind, screenId } = pendingScreenDelete;
    if (kind === 'content' && screenId != null) {
      removeContentScreen(screenId);
    } else if (kind === 'intro') {
      performDeleteIntroScreen();
    } else if (kind === 'end') {
      performDeleteEndScreen();
    }
    setPendingScreenDelete(null);
  }, [pendingScreenDelete, removeContentScreen, performDeleteIntroScreen, performDeleteEndScreen]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOGIC_STORAGE_KEY);
      if (!raw) {
        logicStorageHydratedRef.current = true;
        return;
      }
      const data = JSON.parse(raw);
      if (Array.isArray(data.logicConnections)) {
        setLogicConnections(data.logicConnections);
      }
      if (data.logicIfRulesByEdge && typeof data.logicIfRulesByEdge === 'object') {
        setLogicIfRulesByEdge(data.logicIfRulesByEdge);
      } else if (data.logicIfRulesByScreen && typeof data.logicIfRulesByScreen === 'object') {
        const migrated = migrateLogicIfRulesToEdges(data.logicIfRulesByScreen);
        setLogicIfRulesByEdge(migrated.byEdge);
        setLogicElseByScreen(migrated.elseByScreen);
      }
      if (data.logicElseByScreen && typeof data.logicElseByScreen === 'object') {
        setLogicElseByScreen(data.logicElseByScreen);
      }
    } catch {
      /* ignore corrupt storage */
    }
    logicStorageHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!logicStorageHydratedRef.current) return;
    try {
      localStorage.setItem(
        LOGIC_STORAGE_KEY,
        JSON.stringify({
          logicConnections,
          logicIfRulesByEdge,
          logicElseByScreen,
        })
      );
    } catch {
      /* quota / private mode */
    }
  }, [logicConnections, logicIfRulesByEdge, logicElseByScreen]);

  useEffect(() => {
    if (!isPreview) return;
    setPreviewVisitStack([]);
    previewSnapByScreenRef.current = {};
    previewAnswersByScreenRef.current = {};
    setPreviewSnapVersion(0);
  }, [isPreview]);

  const handlePreviewSnapChange = useCallback(
    (screenId, snap) => {
      if (!isPreview || screenId == null) return;
      previewSnapByScreenRef.current[screenId] = snap;
      const screen = screens.find((s) => s.id === screenId);
      if (screen) {
        previewAnswersByScreenRef.current[screenId] = buildLogicAnswersFromScreen(screen, snap);
      }
      setPreviewSnapVersion((v) => v + 1);
    },
    [isPreview, screens]
  );

  const capturePreviewAnswersForScreen = useCallback(
    (screenId) => {
      const screen = screens.find((s) => s.id === screenId);
      const snap = previewSnapByScreenRef.current[screenId];
      if (screen && snap) {
        previewAnswersByScreenRef.current[screenId] = buildLogicAnswersFromScreen(screen, snap);
      }
    },
    [screens]
  );

  const getLogicalNextScreenId = useCallback(
    (fromScreenId) =>
      resolveNextScreenId({
        fromScreenId,
        screens,
        logicIfRulesByEdge,
        logicElseByScreen,
        logicConnections,
        answersByScreenId: previewAnswersByScreenRef.current,
      }),
    [screens, logicIfRulesByEdge, logicElseByScreen, logicConnections]
  );

  const prevScreen = useMemo(() => {
    if (isPreview && previewVisitStack.length > 0) {
      const prevId = previewVisitStack[previewVisitStack.length - 1];
      return screens.find((s) => s.id === prevId) ?? null;
    }
    return activeScreenIdx > 0 ? screens[activeScreenIdx - 1] : null;
  }, [isPreview, previewVisitStack, screens, activeScreenIdx]);

  const nextScreen = useMemo(() => {
    if (isPreview && activeScreenId != null) {
      const nextId = getLogicalNextScreenId(activeScreenId);
      return nextId != null ? screens.find((s) => s.id === nextId) ?? null : null;
    }
    return activeScreenIdx < screens.length - 1 ? screens[activeScreenIdx + 1] : null;
  }, [
    isPreview,
    activeScreenId,
    screens,
    activeScreenIdx,
    getLogicalNextScreenId,
    previewVisitStack,
    previewSnapVersion,
  ]);

  useEffect(() => {
    const ids = new Set(screens.map((s) => s.id));
    setLogicConnections((prev) => {
      const next = prev.filter((c) => ids.has(c.from) && ids.has(c.to));
      return next.length === prev.length ? prev : next;
    });
    setLogicCardOffsets((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        const id = Number(k);
        if (!ids.has(id)) {
          delete next[k];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    setLogicCardHeights((prev) => {
      let changed = false;
      const next = {};
      for (const s of screens) {
        if (prev[s.id] !== undefined) next[s.id] = prev[s.id];
      }
      if (Object.keys(next).length !== Object.keys(prev).length) changed = true;
      return changed ? next : prev;
    });
  }, [screens]);

  useEffect(() => {
    if (logicConnections.length === 0) return;
    setScreens((prev) => {
      const next = reorderScreensFromLogicConnections(prev, logicConnections);
      const a = prev.map((s) => s.id).join(',');
      const b = next.map((s) => s.id).join(',');
      if (a === b) return prev;
      return next;
    });
  }, [logicConnections]);

  useEffect(() => {
    if (!logicConnectorMenu) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLogicConnectorMenu(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [logicConnectorMenu]);

  useEffect(() => {
    if (activeTab !== 'logic') setLogicDisconnectHoveredKey(null);
  }, [activeTab]);

  const goPreviewPrev = useCallback(() => {
    setPreviewVisitStack((stack) => {
      if (!stack.length) return stack;
      const nextStack = stack.slice(0, -1);
      const prevId = stack[stack.length - 1];
      if (prevId != null) setActiveScreenId(prevId);
      return nextStack;
    });
  }, []);

  const goPreviewNext = useCallback(() => {
    if (activeScreenId == null) return;
    const validate = previewScreenValidatorRef.current;
    if (validate && !validate()) return;
    capturePreviewAnswersForScreen(activeScreenId);
    const nextId = getLogicalNextScreenId(activeScreenId);
    if (nextId == null) return;
    setPreviewVisitStack((stack) => [...stack, activeScreenId]);
    setActiveScreenId(nextId);
  }, [activeScreenId, capturePreviewAnswersForScreen, getLogicalNextScreenId]);

  const previewStepNavEl = isPreview ? (
    <PreviewCardStepNav
      prevScreen={prevScreen}
      nextScreen={nextScreen}
      onGoPrev={goPreviewPrev}
      onGoContinue={goPreviewNext}
    />
  ) : null;

  /* â”€â”€ Responsive canvas scaling â”€â”€ */
  // Base "design" resolution the form is authored at
  const CANVAS_BASE_W = deviceView === 'mobile' ? 420 : 820;
  const CANVAS_BASE_H = deviceView === 'mobile' ? 680 : 560;
  const CANVAS_PAD = 40; // px gap around the scaled frame

  const canvasContainerRef = useRef(null);
  const [canvasScale, setCanvasScale] = useState(0);

  const updateScale = useCallback(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    // Use offsetWidth/offsetHeight â€” unlike getBoundingClientRect these are
    // unaffected by CSS transforms, so Framer Motion layout animations don't
    // produce a stale/mid-animation size reading.
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const availW = width - CANVAS_PAD * 2;
    const availH = height - CANVAS_PAD * 2;
    const scaleX = availW / CANVAS_BASE_W;
    const scaleY = availH / CANVAS_BASE_H;
    setCanvasScale(Math.min(scaleX, scaleY));
  }, [CANVAS_BASE_W, CANVAS_BASE_H]);

  useEffect(() => {
    updateScale();
    const obs = new ResizeObserver(updateScale);
    if (canvasContainerRef.current) obs.observe(canvasContainerRef.current);
    return () => obs.disconnect();
  }, [updateScale, hasScreens]);

  // Re-compute scale after preview is toggled so the canvas immediately fills
  // the correct space without needing a second interaction to trigger it.
  useEffect(() => {
    updateScale();
  }, [isPreview, updateScale]);

  // Scroll the input-type dropdown into view when it opens
  useEffect(() => {
    if (welcomeInputTypeOpen && welcomeInputTypeRef.current) {
      setTimeout(() => {
        welcomeInputTypeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [welcomeInputTypeOpen]);

  useEffect(() => {
    if (activeTab === 'logic' && logicTabDisabled) {
      setActiveTab('content');
    }
  }, [activeTab, logicTabDisabled]);

  useEffect(() => {
    if (activeTab === 'design' && designTabDisabled) {
      setActiveTab('content');
      setShowDesignPanel(false);
    }
  }, [activeTab, designTabDisabled]);

  const getLogicCardQuestionText = (screen) =>
    getScreenPreviewText(screen, fieldPreviewFallback);

  const logicIntro = screens.find((s) => s.type === 'intro') ?? null;
  const logicEnd = screens.find((s) => s.type === 'end') ?? null;
  const logicFlowNodes = [
    ...(logicIntro ? [{ kind: 'intro', screen: logicIntro }] : []),
    ...contentScreens.map((s) => ({ kind: 'content', screen: s })),
    ...(logicEnd ? [{ kind: 'end', screen: logicEnd }] : []),
  ];

  const logicBoardSize = useMemo(() => {
    const intro = screens.find((s) => s.type === 'intro') ?? null;
    const end = screens.find((s) => s.type === 'end') ?? null;
    const content = screens.filter((s) => s.type === 'content');
    const nodes = [
      ...(intro ? [intro] : []),
      ...content,
      ...(end ? [end] : []),
    ];
    const padX = 64;
    const padY = 80;
    let maxR = 0;
    let maxB = 0;
    nodes.forEach((scr, i) => {
      const id = scr.id;
      const off = logicCardOffsets[id] ?? { x: 0, y: 0 };
      let x = i * (LOGIC_FLOW_CARD_W + LOGIC_FLOW_GAP) + off.x;
      let y = off.y;
      if (logicCardDraggingId === id) {
        x += logicCardDragOffset.x;
        y += logicCardDragOffset.y;
      }
      const h = logicCardHeights[id] ?? LOGIC_FLOW_CARD_H_EST;
      maxR = Math.max(maxR, x + LOGIC_FLOW_CARD_W);
      maxB = Math.max(maxB, y + h);
    });
    const n = nodes.length;
    const minFlowW = n > 0 ? n * LOGIC_FLOW_CARD_W + Math.max(0, n - 1) * LOGIC_FLOW_GAP : LOGIC_FLOW_CARD_W;
    const width = Math.max(minFlowW + padX, maxR + 48);
    const height = Math.max(LOGIC_FLOW_CARD_H_EST + padY, maxB + 48);
    return { width, height };
  }, [screens, logicCardOffsets, logicCardDraggingId, logicCardDragOffset, logicCardHeights]);

  const logicPortPositions = useMemo(() => {
    const intro = screens.find((s) => s.type === 'intro') ?? null;
    const end = screens.find((s) => s.type === 'end') ?? null;
    const content = screens.filter((s) => s.type === 'content');
    const nodes = [
      ...(intro ? [{ kind: 'intro', screen: intro }] : []),
      ...content.map((s) => ({ kind: 'content', screen: s })),
      ...(end ? [{ kind: 'end', screen: end }] : []),
    ];
    const map = new Map();
    nodes.forEach((item, idx) => {
      const id = item.screen.id;
      const off = logicCardOffsets[id] ?? { x: 0, y: 0 };
      const dragging = logicCardDraggingId === id;
      const ddx = dragging ? logicCardDragOffset.x : 0;
      const ddy = dragging ? logicCardDragOffset.y : 0;
      const left = idx * (LOGIC_FLOW_CARD_W + LOGIC_FLOW_GAP) + off.x + ddx;
      const top = off.y + ddy;
      const h = logicCardHeights[id] ?? LOGIC_FLOW_CARD_H_EST;
      const portY = top + h / 2;
      let inX = null;
      let outX = null;
      if (item.kind === 'intro') {
        outX = left + LOGIC_FLOW_CARD_W + LOGIC_CONNECTOR_DOT_R;
      } else if (item.kind === 'end') {
        inX = left - LOGIC_CONNECTOR_DOT_R;
      } else {
        inX = left - LOGIC_CONNECTOR_DOT_R;
        outX = left + LOGIC_FLOW_CARD_W + LOGIC_CONNECTOR_DOT_R;
      }
      map.set(id, { left, top, inX, outX, portY, kind: item.kind });
    });
    return map;
  }, [screens, logicCardOffsets, logicCardDraggingId, logicCardDragOffset, logicCardHeights]);

  const logicConnectionsForRender = logicConnections;

  const logicConnByFrom = useMemo(
    () => groupLogicConnectionsByFrom(logicConnectionsForRender),
    [logicConnectionsForRender]
  );
  const logicConnByTo = useMemo(
    () => groupLogicConnectionsByTo(logicConnectionsForRender),
    [logicConnectionsForRender]
  );

  useLayoutEffect(() => {
    if (activeTab !== 'logic' || !logicModeManual || contentScreens.length === 0) return;
    const board = logicBoardMeasureRef.current;
    if (!board) return;

    const measure = () => {
      const next = {};
      board.querySelectorAll('[data-logic-card]').forEach((el) => {
        const sid = el.getAttribute('data-screen-id');
        if (!sid) return;
        next[Number(sid)] = el.offsetHeight;
      });
      setLogicCardHeights((prev) => {
        let changed = false;
        const merged = { ...prev };
        for (const sid of Object.keys(next)) {
          const id = Number(sid);
          if (merged[id] !== next[id]) {
            merged[id] = next[id];
            changed = true;
          }
        }
        for (const k of Object.keys(prev)) {
          const id = Number(k);
          if (next[id] === undefined && merged[id] !== undefined) {
            delete merged[id];
            changed = true;
          }
        }
        return changed ? merged : prev;
      });
    };

    measure();
    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(board);
    board.querySelectorAll('[data-logic-card]').forEach((el) => ro.observe(el));

    return () => ro.disconnect();
  }, [
    activeTab,
    logicModeManual,
    contentScreens.length,
    screens,
    logicCardOffsets,
    logicCardDraggingId,
    logicCardDragOffset,
  ]);

  useLayoutEffect(() => {
    logicPortPositionsRef.current = logicPortPositions;
  }, [logicPortPositions]);

  const cardDragHandlers = (screenId) => ({
    onPointerDown: (e) => onLogicCardPointerDown(e, screenId),
    onPointerMove: (e) => onLogicCardPointerMove(e, screenId),
    onPointerUp: (e) => onLogicCardPointerUp(e, screenId),
    onPointerCancel: (e) => onLogicCardPointerUp(e, screenId),
  });

  const renderLogicFlowCard = (item, flowIndex) => {
    const screenId = item.screen.id;
    const off = logicCardOffsets[screenId] ?? { x: 0, y: 0 };
    const baseX = flowIndex * (LOGIC_FLOW_CARD_W + LOGIC_FLOW_GAP);
    const baseY = 0;
    const dragging = logicCardDraggingId === screenId;
    const ddx = dragging ? logicCardDragOffset.x : 0;
    const ddy = dragging ? logicCardDragOffset.y : 0;
    const posStyle = {
      position: 'absolute',
      left: baseX + off.x + ddx,
      top: baseY + off.y + ddy,
      width: LOGIC_FLOW_CARD_W,
      zIndex: dragging ? 50 : 2,
      boxShadow: dragging ? '0 12px 36px rgba(0,0,0,0.14)' : undefined,
      opacity: dragging ? 0.95 : undefined,
    };

    const outputPortHandlers = {
      onPointerDown: (e) => onLogicOutputPortPointerDown(e, screenId),
      onPointerMove: onLogicOutputPortPointerMove,
      onPointerUp: onLogicOutputPortPointerUp,
      onPointerCancel: onLogicOutputPortPointerUp,
    };

    const inDot = (
      <span
        className="absolute z-[15] w-2 h-2 rounded-full bg-[#1a1a1a] pointer-events-none"
        style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }}
        aria-hidden
      />
    );

    const outDot = (
      <span
        role="presentation"
        data-logic-output-port
        className="absolute z-[15] w-2 h-2 rounded-full bg-[#1a1a1a] cursor-crosshair touch-none hover:scale-125 transition-transform"
        style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }}
        {...outputPortHandlers}
      />
    );

    const contentIdx =
      item.kind === 'content'
        ? contentScreens.findIndex((s) => s.id === item.screen.id) + 1
        : 0;

    if (item.kind === 'intro') {
      return (
        <div
          key={screenId}
          data-logic-card
          data-screen-id={screenId}
          data-logic-kind="intro"
          style={posStyle}
          className="relative rounded-[12px] border border-[rgba(71,69,74,0.08)] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-grab active:cursor-grabbing touch-none overflow-visible"
          {...cardDragHandlers(screenId)}
        >
          {outDot}
          <div className="flex items-start gap-2">
            <div className="flex h-6 items-center rounded-md bg-[#dedcde] px-1.5 shrink-0">
              <PagesStartIcon size={14} className="text-[#3C323E]" />
            </div>
          </div>
          <div className="mt-2 text-[13px] leading-[16px] text-[#4c414e] line-clamp-4 whitespace-pre-wrap">
            {[introTitle, introDescription].filter(Boolean).join('\n')}
          </div>
        </div>
      );
    }

    if (item.kind === 'content') {
      const meta = SCREEN_ICON_MAP[item.screen.label] ?? {
        Icon: RiFileTextLine,
        bg: 'bg-[#f4f4f4]',
        color: 'text-gray-500',
      };
      const QIcon = meta.Icon;
      return (
        <div
          key={screenId}
          data-logic-card
          data-screen-id={screenId}
          data-logic-kind="content"
          style={posStyle}
          className="relative rounded-[12px] border border-[rgba(81,76,84,0.15)] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-grab active:cursor-grabbing touch-none overflow-visible"
          {...cardDragHandlers(screenId)}
        >
          {inDot}
          {outDot}
          <div className="flex items-start gap-2">
            <div
              className={`relative flex h-6 min-w-[48px] items-center overflow-hidden rounded-md pl-1 pr-5 ${meta.bg}`}
            >
              <QIcon size={14} className={`shrink-0 ${meta.color}`} />
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[12px] font-semibold tabular-nums text-[#3c323e]">
                {contentIdx}
              </span>
            </div>
          </div>
          <div className="mt-2 line-clamp-3 text-[13px] leading-[16px] text-[#4c414e]">
            {getLogicCardQuestionText(item.screen)}
          </div>
        </div>
      );
    }

    return (
      <div
        key={screenId}
        data-logic-card
        data-screen-id={screenId}
        data-logic-kind="end"
        style={posStyle}
        className="relative rounded-[12px] border border-[rgba(71,69,74,0.08)] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-grab active:cursor-grabbing touch-none overflow-visible"
        {...cardDragHandlers(screenId)}
      >
        {inDot}
        <div className="flex items-start gap-2">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#eef2ff] shrink-0">
            <PagesEndIcon size={14} className="text-[#3C323E]" />
          </div>
        </div>
        <div className="mt-2 text-[13px] leading-[16px] text-[#4c414e] line-clamp-4 whitespace-pre-wrap">
          {[endScreenTitle, endScreenDescription].filter(Boolean).join('\n')}
        </div>
      </div>
    );
  };

  useEffect(() => {
    logicCanvasPanRef.current = logicCanvasPan;
  }, [logicCanvasPan]);
  useEffect(() => {
    logicCanvasZoomRef.current = logicCanvasZoom;
  }, [logicCanvasZoom]);

  const fitLogicCanvasView = useCallback(() => {
    const vp = logicViewportRef.current;
    const board = logicBoardMeasureRef.current;
    if (!vp || !board) return;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const w = board.offsetWidth;
    const h = board.offsetHeight;
    if (w <= 0 || h <= 0 || vw <= 0 || vh <= 0) return;
    const pad = 80;
    const z = Math.min((vw - pad) / w, (vh - pad) / h, 2.5);
    const newZoom = Math.max(0.25, z);
    const panX = (vw - w * newZoom) / 2;
    const panY = (vh - h * newZoom) / 2;
    setLogicCanvasZoom(newZoom);
    setLogicCanvasPan({ x: panX, y: panY });
  }, []);

  const handleLogicCanvasWheel = useCallback((e) => {
    const vp = logicViewportRef.current;
    if (!vp) return;
    e.preventDefault();
    const rect = vp.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const prevZoom = logicCanvasZoomRef.current;
    const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const newZoom = Math.min(2.5, Math.max(0.25, prevZoom * zoomFactor));
    if (Math.abs(newZoom - prevZoom) < 0.0001) return;
    const prevPan = logicCanvasPanRef.current;
    const wx = (mx - prevPan.x) / prevZoom;
    const wy = (my - prevPan.y) / prevZoom;
    setLogicCanvasZoom(newZoom);
    setLogicCanvasPan({ x: mx - wx * newZoom, y: my - wy * newZoom });
  }, []);

  const nudgeLogicZoom = useCallback((factor) => {
    const vp = logicViewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const mx = rect.width / 2;
    const my = rect.height / 2;
    const prevZoom = logicCanvasZoomRef.current;
    const newZoom = Math.min(2.5, Math.max(0.25, prevZoom * factor));
    if (Math.abs(newZoom - prevZoom) < 0.0001) return;
    const prevPan = logicCanvasPanRef.current;
    const wx = (mx - prevPan.x) / prevZoom;
    const wy = (my - prevPan.y) / prevZoom;
    setLogicCanvasZoom(newZoom);
    setLogicCanvasPan({ x: mx - wx * newZoom, y: my - wy * newZoom });
  }, []);

  const onLogicPanSurfacePointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    setLogicConnectorMenu(null);
    const t = e.target;
    if (
      t instanceof Element &&
      (t.closest('[data-logic-card]') ||
        t.closest('[data-logic-edge-disconnect]') ||
        t.closest('[data-logic-output-port]'))
    )
      return;
    logicPanDragRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      pan: { ...logicCanvasPanRef.current },
    };
    setLogicCanvasPanning(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onLogicPanSurfacePointerMove = useCallback((e) => {
    const d = logicPanDragRef.current;
    if (!d) return;
    setLogicCanvasPan({
      x: d.pan.x + e.clientX - d.sx,
      y: d.pan.y + e.clientY - d.sy,
    });
  }, []);

  const onLogicPanSurfacePointerUp = useCallback((e) => {
    logicPanDragRef.current = null;
    setLogicCanvasPanning(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  useLayoutEffect(() => {
    const prev = logicPrevTabRef.current;
    logicPrevTabRef.current = activeTab;
    if (activeTab === 'logic' && prev !== 'logic' && contentScreens.length > 0) {
      requestAnimationFrame(() => fitLogicCanvasView());
    }
  }, [activeTab, contentScreens.length, fitLogicCanvasView]);

  const publishFormTitle = useMemo(() => {
    if (loadedFormTitle) return loadedFormTitle;
    if (location.state?.formTitle) return location.state.formTitle;
    if (selectedTemplate) {
      const parts = selectedTemplate.split(':');
      return parts.length > 1 ? parts.slice(1).join(':') : parts[0];
    }
    return 'Untitled Form';
  }, [loadedFormTitle, selectedTemplate, location.state?.formTitle]);

  const formAccentColor = location.state?.formColor ?? '#3b7bf6';

  if (isPublishView) {
    return <FormPublishView formTitle={publishFormTitle} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* â”€â”€ Topbar â”€â”€ */}
      {!isPreview && (
      <header className="h-[48px] shrink-0 bg-white border-b border-[#e4e2dc] flex items-center px-6 z-10 gap-4">
        <div className="flex items-center shrink-0">
          <img src={clearformLogo} alt="Clearform" className="h-[26px] w-auto object-contain" />
        </div>

        <div className="flex-1 flex items-center justify-center min-w-0 overflow-hidden">
          <StepBar activeStep={3} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="px-[15px] py-[8px] bg-white border border-[#e4e2dc] rounded-[8px] text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] transition-colors cursor-pointer whitespace-nowrap"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setPublishModalOpen(true)}
            className="inline-flex items-center gap-[6px] px-[15px] py-[8px] bg-[#1a1a1a] border border-[#1a1a1a] rounded-[8px] text-[12px] font-medium text-white hover:bg-[#2c2c2c] transition-colors cursor-pointer whitespace-nowrap"
          >
            Publish
            <RiArrowRightLine size={14} className="shrink-0" aria-hidden />
          </button>
        </div>
      </header>
      )}

      {/* â”€â”€ Body: Sidebar + Screens Panel + Content + Config Panel â”€â”€ */}
      <LayoutGroup>
      <div className="flex flex-1 overflow-hidden">
        {/* â”€â”€ Icon sidebar (collapsible) â”€â”€ */}
        {!isPreview && <Sidebar hideLogo />}

        {/* â”€â”€ Screens panel (visible after first screen is added) â”€â”€ */}
        {!isPreview && hasScreens && (
          <motion.div
            key="screens-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="shrink-0 bg-[#f7f7f8] border-r border-[#e4e2dc] flex flex-col overflow-hidden"
            style={{ width: 200 }}
          >
            <div className="w-[200px] flex flex-col h-full min-h-0 overflow-hidden">
              {/* Add screen button - sticky at top */}
              <div className="px-[15px] pt-[16px] pb-[24px] shrink-0">
                <button
                  onClick={handleAddScreen}
                  className="w-full flex items-center gap-[4px] bg-[#272727] text-white text-[12px] font-normal px-[12px] py-[8px] rounded-[6px] justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                >
                  <RiAddLine size={12} className="shrink-0" />
                  Add screen
                </button>
              </div>

              {(() => {
                const LABEL_TO_PANEL = {
                  CTA: 'ctaConfig',
                  Heading: 'headingConfig',
                  Description: 'descriptionConfig',
                  Images: 'imageConfig',
                  Video: 'videoConfig',
                  Contact: 'contactConfig',
                  Address: 'addressConfig',
                  'Work Info': 'workConfig',
                  'Short text': 'shortTextConfig',
                  'Long text': 'longTextConfig',
                  Single: 'singleConfig',
                  Multiple: 'multipleConfig',
                  Media: 'mediaConfig',
                  Maps: 'mapConfig',
                  Captcha: 'captchaConfig',
                  'Multi-image upload': 'multiImageConfig',
                  Upload: 'multiImageConfig',
                  Rating: 'ratingConfig',
                  Date: 'dateConfig',
                  Time: 'timeConfig',
                };
                const PANEL_OPEN_STATE = {
                  ctaConfig: showCtaConfigPanel,
                  headingConfig: showHeadingConfigPanel,
                  descriptionConfig: showDescriptionConfigPanel,
                  imageConfig: showImageConfigPanel,
                  videoConfig: showVideoConfigPanel,
                  contactConfig: showContactConfigPanel,
                  addressConfig: showAddressConfigPanel,
                  workConfig: showWorkConfigPanel,
                  shortTextConfig: showShortTextConfigPanel,
                  longTextConfig: showLongTextConfigPanel,
                  singleConfig: showSingleConfigPanel,
                  multipleConfig: showMultipleConfigPanel,
                  mediaConfig: showMediaConfigPanel,
                  mapConfig: showMapConfigPanel,
                  captchaConfig: showCaptchaConfigPanel,
                  multiImageConfig: showMultiImageConfigPanel,
                  ratingConfig: showRatingConfigPanel,
                  dateConfig: showDateConfigPanel,
                  timeConfig: showTimeConfigPanel,
                  config: showConfigPanel,
                };

                const handleScreenRowClick = (screen) => {
                  if (activeTab === 'logic') {
                    setActiveScreenId(screen.id);
                    return;
                  }
                  const isSameCard = activeScreenId === screen.id;
                  setActiveScreenId(screen.id);
                  const targetPanel =
                    screen.type === 'intro'
                      ? 'config'
                      : screen.type === 'end'
                        ? null
                        : LABEL_TO_PANEL[screen.label] || null;
                  const isCurrentPanelOpen = targetPanel ? PANEL_OPEN_STATE[targetPanel] : false;
                  if (isSameCard && isCurrentPanelOpen) {
                    closeAllRightPanels();
                  } else if (showContentPanel) {
                    if (targetPanel) switchPanel(targetPanel, 'content');
                    else closeAllRightPanels();
                  } else {
                    closeAllRightPanels();
                    if (targetPanel) openPanelByName(targetPanel);
                  }
                };

                const hasContentScreens = contentScreens.length > 0;

                return (
                  <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
                    {/* Start + End are fixed chrome; only question rows scroll once added */}
                    {logicIntro && (
                      <div className="shrink-0 border-b border-[#e4e2dc]/70 bg-[#f7f7f8]">
                        <button
                          type="button"
                          onClick={() => handleScreenRowClick(logicIntro)}
                          className={`flex items-center gap-[8px] px-[14px] py-[9px] w-full text-left transition-colors cursor-pointer ${
                            activeScreenId === logicIntro.id ? 'bg-white/60' : 'hover:bg-white/40'
                          }`}
                        >
                          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#dedcde] flex items-center justify-center shrink-0">
                            <PagesStartIcon size={14} className="text-[#3C323E] shrink-0" />
                          </div>
                          <span className="text-[#1a1a1c] text-[12.5px] font-medium leading-none truncate">
                            {logicIntro.name}
                          </span>
                        </button>
                      </div>
                    )}

                    {hasContentScreens ? (
                      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain">
                        <div className="flex shrink-0 flex-col">
                          {contentScreens.map((screen) => {
                            const isActive = activeScreenId === screen.id;

                            const contentIndex =
                              screens.filter((s) => s.type === 'content').findIndex((s) => s.id === screen.id) + 1;
                            const { Icon: ScreenIcon, bg: iconBg, color: iconColor } = SCREEN_ICON_MAP[
                              screen.label
                            ] ?? { Icon: RiFileTextLine, bg: 'bg-[#f4f4f4]', color: 'text-gray-500' };
                            const questionText = getScreenPreviewText(screen, fieldPreviewFallback);

                            const isDropTarget = contentDropTargetId === screen.id;
                            const isDraggingRow = contentDraggingId === screen.id;

                            return (
                              <div
                                key={screen.id}
                                className="px-[14px] py-[4px]"
                                onDragOver={(e) => handleContentRowDragOver(e, screen.id)}
                                onDrop={(e) => handleContentRowDrop(e, screen.id)}
                              >
                                <div
                                  className={`relative flex w-full items-center overflow-hidden transition-colors h-[48px] ${
                                    isActive
                                      ? 'bg-[#eeeeec] rounded-tl-[8px] rounded-tr-[8px] rounded-br-[8px]'
                                      : `rounded-[8px] hover:bg-white/60${isDropTarget ? ' ring-1 ring-[#4f46e5]/45 ring-inset' : ''}`
                                  }${isActive && isDropTarget ? ' ring-1 ring-[#4f46e5]/45 ring-inset' : ''}${isDraggingRow ? ' opacity-60' : ''}`}
                                >
                                  {isActive && (
                                    <div
                                      className="absolute left-0 top-[8px] bottom-[6px] w-[3px] bg-[#4f46e5] rounded-tr-[2px] rounded-br-[2px] pointer-events-none z-10"
                                      aria-hidden
                                    />
                                  )}

                                  <div
                                    draggable
                                    onDragStart={(e) => handleContentRowDragStart(e, screen.id)}
                                    onDragEnd={handleContentRowDragEnd}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex h-full w-[20px] shrink-0 cursor-grab active:cursor-grabbing items-center justify-center text-[#b8b6b0] hover:text-[#9c9a94]"
                                    title="Drag to reorder"
                                    aria-label={`Drag to reorder screen ${contentIndex}`}
                                  >
                                    <div
                                      className="h-[12.5px] w-[8px]"
                                      style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 2.5px)',
                                        gap: '2.75px',
                                      }}
                                    >
                                      {[...Array(6)].map((_, i) => (
                                        <div
                                          key={i}
                                          className="rounded-[1.25px] bg-current"
                                          style={{ width: '2.5px', height: '2.5px' }}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleScreenRowClick(screen)}
                                    type="button"
                                    className="flex min-h-0 min-w-0 flex-1 items-center overflow-hidden border-0 bg-transparent p-0 text-left cursor-pointer h-full"
                                  >
                                    <div className="w-[16px] shrink-0 flex flex-col items-end justify-center self-stretch pr-[2px]">
                                      <span className="text-[#b8b6b0] text-[10px] font-semibold leading-none text-right whitespace-nowrap">
                                        {contentIndex}
                                      </span>
                                    </div>

                                    <div className="h-[48px] w-[44px] shrink-0 flex flex-col items-start justify-center pl-[4px] pr-[8px] py-[8px]">
                                      <div
                                        className={`w-[32px] h-[32px] rounded-[7px] flex items-center justify-center shrink-0 ${iconBg}`}
                                      >
                                        <ScreenIcon size={16} className={iconColor} />
                                      </div>
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col gap-[2px] items-start justify-center pr-[8px] py-[8px]">
                                      <span className="text-[#1a1a1c] text-[12.5px] font-semibold leading-none truncate w-full text-left">
                                        {screen.label}
                                      </span>
                                      <span className="text-[#8a8880] text-[11px] font-normal leading-none truncate w-full text-left">
                                        {questionText}
                                      </span>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Fills leftover height so End stays visually docked under short lists; collapses when rows overflow */}
                        <div className="flex-1 min-h-0 shrink" aria-hidden />
                      </div>
                    ) : null}

                    {logicEnd && (
                      <div className="shrink-0 border-t border-[#e4e2dc]/70 bg-[#f7f7f8]">
                        <button
                          type="button"
                          onClick={() => handleScreenRowClick(logicEnd)}
                          className={`flex items-center gap-[8px] px-[14px] py-[9px] w-full text-left transition-colors cursor-pointer ${
                            activeScreenId === logicEnd.id ? 'bg-white/60' : 'hover:bg-white/40'
                          }`}
                        >
                          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#eef2ff] flex items-center justify-center shrink-0">
                            <PagesEndIcon size={14} className="text-[#3C323E] shrink-0" />
                          </div>
                          <span className="text-[#1a1a1c] text-[12.5px] font-medium leading-none truncate">
                            {logicEnd.name}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* Hidden image file input (global for content screens) */}
        <input
          ref={imageFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* â”€â”€ Main content area â”€â”€ */}
        <motion.div
          layout
          transition={{ layout: { duration: 0.25, ease: [0.32, 0.72, 0, 1] } }}
          className={`flex-1 flex flex-col overflow-hidden min-w-0 relative ${isPreview ? 'bg-[#f5f4f0]' : 'bg-white'}`}
        >
          {/* Tab bar */}
          {!isPreview && (
          <div className="bg-white border-b border-[rgba(226,232,240,0.8)] flex items-center justify-between gap-3 px-[7px] pr-4 h-[40px] shrink-0">
            <div className="flex items-center gap-[6px] h-full min-w-0 overflow-x-auto">
            {TABS.map((tab) => {
              const isDesignDisabled = tab.id === 'design' && designTabDisabled;
              const isLogicDisabled = tab.id === 'logic' && logicTabDisabled;
              const isTabDisabled = isDesignDisabled || isLogicDisabled;
              const disabledTitle =
                isDesignDisabled
                  ? 'Add a screen first to use Design'
                  : isLogicDisabled
                    ? hasScreens
                      ? 'Add a question between start and end to use Logic'
                      : 'Add a screen first to use Logic'
                    : undefined;
              return (
              <button
                key={tab.id}
                type="button"
                disabled={isTabDisabled}
                title={disabledTitle}
                onClick={() => {
                  if (isTabDisabled) return;
                  setActiveTab(tab.id);
                  if (tab.id === 'design') {
                    closeAllRightPanels();
                    setShowDesignPanel(true);
                  } else if (tab.id === 'settings' || tab.id === 'logic') {
                    closeAllRightPanels();
                    setShowDesignPanel(false);
                  } else {
                    setShowDesignPanel(false);
                  }
                }}
                className={`h-full flex items-center gap-2 px-4 text-[14px] transition-colors whitespace-nowrap ${
                  isTabDisabled
                    ? 'text-[#c4c2bc] cursor-not-allowed border-b-2 border-transparent'
                    : 'cursor-pointer'
                } ${
                  !isTabDisabled && tab.id === activeTab
                    ? 'border-b-2 border-black text-black font-normal'
                    : !isTabDisabled
                      ? 'text-[#8c8a84] font-medium hover:text-[#1a1a1a] border-b-2 border-transparent'
                      : ''
                }`}
              >
                <tab.icon size={16} className="shrink-0" />
                {tab.label}
              </button>
              );
            })}
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2" title={publishFormTitle}>
              <span className="text-[12.5px] font-normal text-[#646464] whitespace-nowrap">
                Form name
              </span>
              <span className="text-[16px] font-normal text-[#686868] leading-none select-none">
                ›
              </span>
              <div className="flex items-center gap-[6px] h-[25px] max-w-[min(280px,32vw)] px-3 border border-[rgba(0,0,0,0.1)] rounded-[6px] bg-white">
                <span
                  className="w-[10px] h-[10px] rounded-full shrink-0"
                  style={{ backgroundColor: formAccentColor }}
                  aria-hidden
                />
                <span className="text-[12.5px] font-medium text-[#17160e] truncate">
                  {publishFormTitle}
                </span>
              </div>
            </div>
          </div>
          )}

          {/* ── Settings Panel ── */}
          {activeTab === 'settings' ? (
            <div className="flex-1 overflow-y-auto bg-[#fafaf9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <div className="max-w-[678px] mx-auto py-8 px-6">

                {/* FORM BEHAVIOR */}
                <div className="mb-6">
                  <div className="h-[48px] flex items-end pb-[10px]">
                    <span className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a7a72]">Form Behavior</span>
                  </div>
                  <div className="border border-[#e4e2dc] rounded-[6px] overflow-hidden bg-white">
                    {/* One question at a time */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <RiFileTextLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">One question at a time</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Show each question on its own screen (conversational style)</div>
                      </div>
                      <Toggle checked={settingsOneAtATime} onChange={setSettingsOneAtATime} />
                    </div>
                    {/* Auto-advance */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <RiArrowRightLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Auto-advance</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Move to next question automatically when a choice is clicked</div>
                      </div>
                      <Toggle checked={settingsAutoAdvance} onChange={setSettingsAutoAdvance} />
                    </div>
                    {/* Back button */}
                    <div className="flex items-center px-4 py-[14px]">
                      <RiArrowLeftLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Back button</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Show a back button so respondents can review previous answers</div>
                      </div>
                      <Toggle checked={settingsBackButton} onChange={setSettingsBackButton} />
                    </div>
                  </div>
                </div>

                {/* SUBMISSION */}
                <div className="mb-6">
                  <div className="h-[46px] flex items-end pb-[10px]">
                    <span className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a7a72]">Submission</span>
                  </div>
                  <div className="border border-[#e4e2dc] rounded-[6px] overflow-hidden bg-white">
                    {/* Completion action */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <RiCheckLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Completion action</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">What happens when a respondent completes the form</div>
                      </div>
                      <select
                        value={settingsCompletionAction}
                        onChange={(e) => setSettingsCompletionAction(e.target.value)}
                        className="ml-4 h-[26px] text-[12px] text-[#1a1a1a] border border-[#e4e2dc] rounded-[4px] px-2 bg-white cursor-pointer focus:outline-none focus:border-[#1a1a1a] shrink-0"
                      >
                        <option>Show thank you screen</option>
                        <option>Redirect to URL</option>
                        <option>Show custom message</option>
                      </select>
                    </div>
                    {/* Re-submission */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <RiRadioButtonLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Re-submission</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Let the same respondent fill out the form more than once</div>
                      </div>
                      <Toggle checked={settingsResubmission} onChange={setSettingsResubmission} />
                    </div>
                    {/* Confirmation email */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <RiMailLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Confirmation email</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Send an automatic confirmation to respondents after they submit</div>
                      </div>
                      <Toggle checked={settingsConfirmationEmail} onChange={setSettingsConfirmationEmail} />
                    </div>
                    {/* Submission notifications */}
                    <div className="flex items-center px-4 py-[14px]">
                      <RiTimeLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Submission notifications</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Get an email each time someone completes this form</div>
                      </div>
                      <Toggle checked={settingsSubmissionNotifications} onChange={setSettingsSubmissionNotifications} />
                    </div>
                  </div>
                </div>

                {/* RESPONDENT EXPERIENCE */}
                <div className="mb-6">
                  <div className="h-[43px] flex items-end pb-[10px]">
                    <span className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a7a72]">Respondent Experience</span>
                  </div>
                  <div className="border border-[#e4e2dc] rounded-[6px] overflow-hidden bg-white">
                    {/* Email collection */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <RiMailLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Email collection</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Ask respondents for their email before they start</div>
                      </div>
                      <Toggle checked={settingsEmailCollection} onChange={setSettingsEmailCollection} />
                    </div>
                    {/* Language */}
                    <div className="flex items-center px-4 py-[14px]">
                      <RiGlobeLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Language</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">UI labels and system text language for respondents</div>
                      </div>
                      <select
                        value={settingsLanguage}
                        onChange={(e) => setSettingsLanguage(e.target.value)}
                        className="ml-4 h-[26px] text-[12px] text-[#1a1a1a] border border-[#e4e2dc] rounded-[4px] px-2 bg-white cursor-pointer focus:outline-none focus:border-[#1a1a1a] shrink-0"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Portuguese</option>
                        <option>Arabic</option>
                        <option>Chinese</option>
                        <option>Japanese</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ACCESS & SECURITY */}
                <div className="mb-6">
                  <div className="h-[43px] flex items-end pb-[10px]">
                    <span className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#7a7a72]">Access &amp; Security</span>
                  </div>
                  <div className="border border-[#e4e2dc] rounded-[6px] overflow-hidden bg-white">
                    {/* Password protection */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <RiLockLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Password protection</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Require a password before respondents can access the form</div>
                      </div>
                      <Toggle checked={settingsPasswordProtection} onChange={setSettingsPasswordProtection} />
                    </div>
                    {/* Response limit */}
                    <div className="flex items-center px-4 py-[14px]">
                      <RiCalendarLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Response limit</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Close the form after a set number of responses</div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 shrink-0">
                        <Toggle checked={settingsResponseLimit} onChange={setSettingsResponseLimit} />
                        {settingsResponseLimit && (
                          <input
                            type="number"
                            value={settingsResponseLimitCount}
                            onChange={(e) => setSettingsResponseLimitCount(e.target.value)}
                            className="w-[80px] h-[28px] text-[12px] text-[#1a1a1a] border border-[#e4e2dc] rounded-[4px] px-2 bg-white focus:outline-none focus:border-[#1a1a1a] text-center"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* INTEGRATIONS */}
                <div className="mb-6">
                  <div className="border border-[#e4e2dc] rounded-[6px] overflow-hidden bg-white">
                    {/* Integrations */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <RiGitBranchLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Integrations</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Send responses to Zapier, Slack, Google Sheets, and more</div>
                      </div>
                      <button className="ml-4 flex items-center gap-1 text-[12px] font-medium text-[#1a1a1a] hover:text-[#4f46e5] transition-colors shrink-0 cursor-pointer">
                        Set up
                        <RiExternalLinkLine size={11} />
                      </button>
                    </div>
                    {/* Webhook */}
                    <div className="flex items-center px-4 py-[14px]">
                      <RiArrowRightLine size={15} className="text-[#6a6a6a] shrink-0 mt-[1px]" />
                      <div className="ml-[14px] flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Webhook</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">POST each submission payload to your own endpoint</div>
                      </div>
                      <Toggle checked={settingsWebhook} onChange={setSettingsWebhook} />
                    </div>
                  </div>
                </div>

                {/* DANGER ZONE */}
                <div className="mb-6">
                  <div className="border border-[#e4e2dc] rounded-[6px] overflow-hidden bg-white">
                    {/* Danger zone header */}
                    <div className="px-4 py-[11px] border-b border-[#e4e2dc]">
                      <span className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#c0392b]">Danger Zone</span>
                    </div>
                    {/* Reset form */}
                    <div className="flex items-center px-4 py-[14px] border-b border-[#e4e2dc]">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Reset form</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Remove all unsaved changes and reset to last published version</div>
                      </div>
                      <button className="ml-4 shrink-0 h-[28px] px-3 text-[12px] font-medium text-[#1a1a1a] border border-[#e4e2dc] rounded-[4px] bg-white hover:bg-[#f5f4f0] transition-colors cursor-pointer">
                        Reset form
                      </button>
                    </div>
                    {/* Delete form */}
                    <div className="flex items-center px-4 py-[14px]">
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#1a1a1a] leading-[20px]">Delete form</div>
                        <div className="text-[12px] text-[#7a7a72] leading-[17px]">Permanently delete this form and all its responses. Cannot be undone.</div>
                      </div>
                      <button className="ml-4 shrink-0 h-[28px] px-3 text-[12px] font-medium text-[#c0392b] border border-[#f5c6c2] rounded-[4px] bg-[#fff5f5] hover:bg-[#fee2e2] transition-colors cursor-pointer">
                        Delete form
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : !hasScreens ? (
            /* Empty state */
            <div
              className="flex-1 flex items-center justify-center overflow-hidden transition-colors duration-300"
              style={{ backgroundColor: isPreview ? '#f5f4f0' : designBackground }}
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex flex-col items-center gap-4"
              >
                <p className="text-[16px] font-medium text-black">
                  Start by adding an intro screen
                </p>
                <button
                  onClick={handleAddScreen}
                  className="flex items-center gap-1 bg-[#272727] text-white text-[12px] font-normal px-3 py-2 rounded-[6px] w-[183px] justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                >
                  <RiAddLine size={12} className="shrink-0" />
                  Add screen
                </button>
              </motion.div>
            </div>
          ) : activeTab === 'logic' ? (
            <div
              className="flex-1 flex flex-col min-h-0 bg-[#f2f2f0] overflow-hidden"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <div className="h-[40px] shrink-0 bg-white border-b border-[#e5e5e2] flex items-center gap-3 px-5">
                <span className="text-[11px] font-semibold tracking-[0.77px] uppercase text-[#a0a09c] shrink-0 pr-3 border-r border-[#e5e5e2]">
                  Logic mode
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLogicModeManual(true)}
                    className={`rounded-full border px-[13px] py-[5px] text-[12px] font-semibold transition-colors cursor-pointer ${
                      logicModeManual
                        ? 'bg-[#f4f4f2] border-[#d4d4d0] text-[#111110]'
                        : 'border-transparent text-[#6b6b68] hover:bg-[#ececea]'
                    }`}
                  >
                    Manual Logic
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogicModeManual(false)}
                    className={`flex items-center gap-2 rounded-full border px-[12px] py-[4px] text-[12px] font-semibold transition-colors cursor-pointer ${
                      !logicModeManual
                        ? 'bg-[#f4f4f2] border-[#d4d4d0] text-[#111110]'
                        : 'border-transparent text-[#6b6b68] hover:bg-[#ececea]'
                    }`}
                  >
                    <span>AI-Driven Logic</span>
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.57px] text-white bg-[#6b6b68] rounded-full px-[6px] py-[1.5px] leading-none">
                      PRO
                    </span>
                  </button>
                </div>
              </div>
              {!logicModeManual || contentScreens.length === 0 || logicFlowNodes.length === 0 ? (
                <div className="flex-1 overflow-auto min-h-0 flex items-start justify-center p-8">
                  {!logicModeManual ? (
                    <p className="text-[14px] text-[#6b6b68] mt-16 text-center max-w-md leading-relaxed">
                      AI-Driven Logic uses your form context to suggest screen order and branches. This mode is not
                      available in this build yet.
                    </p>
                  ) : contentScreens.length === 0 ? (
                    <p className="text-[14px] text-[#6b6b68] mt-16 text-center max-w-md leading-relaxed">
                      Add at least one question between the start and end screens from the Content tab to open the logic
                      canvas.
                    </p>
                  ) : (
                    <p className="text-[14px] text-[#6b6b68] mt-16 text-center max-w-md leading-relaxed">
                      No screens to show yet.
                    </p>
                  )}
                </div>
              ) : (
                <div
                  ref={logicViewportRef}
                  className="flex-1 min-h-0 overflow-hidden relative bg-[#e8e8e6] touch-none select-none isolate"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at center, rgba(0,0,0,0.08) 1.25px, transparent 1.25px)',
                    backgroundSize: '22px 22px',
                  }}
                  onWheel={handleLogicCanvasWheel}
                >
                  {logicConnectorMenu ? (
                    <div
                      className="absolute z-[50] w-[125px] rounded-[10px] border border-[#e2e0dc] bg-white py-0.5 shadow-[0_8px_28px_rgba(0,0,0,0.14)]"
                      style={{ left: logicConnectorMenu.vx, top: logicConnectorMenu.vy }}
                      role="menu"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {logicConnectorMenu.mode === 'chooseEdgeKind' ? (
                        <>
                          <button
                            type="button"
                            role="menuitem"
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer transition-colors"
                            onClick={() =>
                              applyChosenEdgeKind(
                                logicConnectorMenu.fromId,
                                logicConnectorMenu.toId,
                                LOGIC_EDGE_KIND.next
                              )
                            }
                          >
                            <RiArrowRightLine className="shrink-0 text-[#3c323e]" size={15} aria-hidden />
                            Next
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer transition-colors"
                            onClick={() =>
                              applyChosenEdgeKind(
                                logicConnectorMenu.fromId,
                                logicConnectorMenu.toId,
                                LOGIC_EDGE_KIND.if
                              )
                            }
                          >
                            <RiGitBranchLine className="shrink-0 text-[#3c323e]" size={15} aria-hidden />
                            If logic
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer transition-colors"
                            onClick={() =>
                              applyChosenEdgeKind(
                                logicConnectorMenu.fromId,
                                logicConnectorMenu.toId,
                                LOGIC_EDGE_KIND.skip
                              )
                            }
                          >
                            <RiSkipForwardLine className="shrink-0 text-[#3c323e]" size={15} aria-hidden />
                            Skip
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer transition-colors"
                            onClick={() =>
                              applyChosenEdgeKind(
                                logicConnectorMenu.fromId,
                                logicConnectorMenu.toId,
                                LOGIC_EDGE_KIND.end
                              )
                            }
                          >
                            <RiStopCircleLine className="shrink-0 text-[#3c323e]" size={15} aria-hidden />
                            End
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            role="menuitem"
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer transition-colors"
                            onClick={() => handleLogicMenuConnectNext(logicConnectorMenu.fromId)}
                          >
                            <RiArrowRightLine className="shrink-0 text-[#3c323e]" size={15} aria-hidden />
                            Next
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer transition-colors"
                            onClick={() => startLogicDocumentConnect(logicConnectorMenu.fromId, LOGIC_EDGE_KIND.if)}
                          >
                            <RiGitBranchLine className="shrink-0 text-[#3c323e]" size={15} aria-hidden />
                            If logic
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer transition-colors"
                            onClick={() => handleLogicMenuSkip(logicConnectorMenu.fromId)}
                          >
                            <RiSkipForwardLine className="shrink-0 text-[#3c323e]" size={15} aria-hidden />
                            Skip
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-[12px] font-medium text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer transition-colors"
                            onClick={() => handleLogicMenuConnectEnd(logicConnectorMenu.fromId)}
                          >
                            <RiStopCircleLine className="shrink-0 text-[#3c323e]" size={15} aria-hidden />
                            End
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                  <div
                    className="pointer-events-auto absolute bottom-4 right-4 z-20 flex items-center gap-0.5 rounded-lg border border-[#d4d4d0] bg-white/95 px-1 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <button
                      type="button"
                      onClick={() => nudgeLogicZoom(1 / 1.15)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[#1a1a1a] hover:bg-[#f0eeea] cursor-pointer transition-colors"
                      aria-label="Zoom out"
                    >
                      <RiSubtractLine size={16} />
                    </button>
                    <span className="min-w-[3rem] text-center text-[11px] tabular-nums text-[#4a4a48]">
                      {Math.round(logicCanvasZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => nudgeLogicZoom(1.15)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[#1a1a1a] hover:bg-[#f0eeea] cursor-pointer transition-colors"
                      aria-label="Zoom in"
                    >
                      <RiAddLine size={16} />
                    </button>
                    <div className="mx-0.5 h-5 w-px bg-[#e4e2dc]" aria-hidden />
                    <button
                      type="button"
                      onClick={fitLogicCanvasView}
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-[#1a1a1a] rounded-md hover:bg-[#f0eeea] cursor-pointer transition-colors whitespace-nowrap"
                    >
                      Fit view
                    </button>
                  </div>
                  <div
                    className={`absolute inset-0 z-10 ${logicCanvasPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onPointerDown={onLogicPanSurfacePointerDown}
                    onPointerMove={onLogicPanSurfacePointerMove}
                    onPointerUp={onLogicPanSurfacePointerUp}
                    onPointerCancel={onLogicPanSurfacePointerUp}
                  >
                    <div
                      style={{
                        transform: `translate(${logicCanvasPan.x}px, ${logicCanvasPan.y}px) scale(${logicCanvasZoom})`,
                        transformOrigin: '0 0',
                      }}
                      className="w-max"
                    >
                      <div
                        ref={logicBoardMeasureRef}
                        className="relative px-8 py-10 shrink-0"
                        style={{ width: logicBoardSize.width, height: logicBoardSize.height }}
                      >
                        <svg
                          className="absolute left-0 top-0 z-[1] overflow-visible"
                          style={{ pointerEvents: 'none' }}
                          width={logicBoardSize.width}
                          height={logicBoardSize.height}
                        >
                          <defs>
                            <marker
                              id="logicFlowArrowHead"
                              markerUnits="userSpaceOnUse"
                              markerWidth="7"
                              markerHeight="7"
                              refX="7"
                              refY="3.5"
                              orient="auto"
                            >
                              <path d="M0 0 L7 3.5 L0 7 Z" fill="#1a1a1a" />
                            </marker>
                            <marker
                              id="logicFlowArrowHeadRed"
                              markerUnits="userSpaceOnUse"
                              markerWidth="7"
                              markerHeight="7"
                              refX="7"
                              refY="3.5"
                              orient="auto"
                            >
                              <path d="M0 0 L7 3.5 L0 7 Z" fill={LOGIC_EDGE_HOVER_STROKE} />
                            </marker>
                            <marker
                              id="logicFlowArrowHeadMuted"
                              markerUnits="userSpaceOnUse"
                              markerWidth="7"
                              markerHeight="7"
                              refX="7"
                              refY="3.5"
                              orient="auto"
                            >
                              <path d="M0 0 L7 3.5 L0 7 Z" fill="#8a8880" />
                            </marker>
                            <marker
                              id="logicFlowArrowHeadGreen"
                              markerUnits="userSpaceOnUse"
                              markerWidth="7"
                              markerHeight="7"
                              refX="7"
                              refY="3.5"
                              orient="auto"
                            >
                              <path d="M0 0 L7 3.5 L0 7 Z" fill={LOGIC_EDGE_KIND_HOVER_STROKE} />
                            </marker>
                          </defs>
                          {logicConnectionsForRender.map((c, i) => {
                            const a = logicPortPositions.get(c.from);
                            const b = logicPortPositions.get(c.to);
                            if (!a || !b || a.outX == null || b.inX == null) return null;
                            const { x0, y0, x1, y1 } = logicConnectionEndpoints(
                              c,
                              logicConnByFrom,
                              logicConnByTo,
                              a,
                              b
                            );
                            const d = logicBezierConnectionPath(x0, y0, x1, y1);
                            const edgeKey = `${c.from}-${c.to}`;
                            return (
                              <LogicEdgePathGroup
                                key={`${c.from}-${c.to}-${i}`}
                                d={d}
                                edgeKey={edgeKey}
                                kind={c.kind}
                                connection={c}
                                disconnectHoveredKey={logicDisconnectHoveredKey}
                                kindHoveredKey={logicEdgeKindHoveredKey}
                                onKindEnter={setLogicEdgeKindHoveredKey}
                                onKindLeave={() => setLogicEdgeKindHoveredKey(null)}
                                onEdgeClick={openLogicOptionsForEdge}
                              />
                            );
                          })}
                          {logicConnectDrag &&
                            (() => {
                              const a = logicPortPositions.get(logicConnectDrag.fromId);
                              if (!a || a.outX == null) return null;
                              const d = logicBezierConnectionPath(
                                a.outX,
                                a.portY,
                                logicConnectDrag.x1,
                                logicConnectDrag.y1
                              );
                              const strokeProps = getLogicEdgePathProps(logicConnectDrag.kind);
                              return <path d={d} {...strokeProps} opacity={0.88} />;
                            })()}
                        </svg>
                        {logicConnectionsForRender.map((c, i) => {
                          const a = logicPortPositions.get(c.from);
                          const b = logicPortPositions.get(c.to);
                          if (!a || !b || a.outX == null || b.inX == null) return null;
                          const { x0, y0, x1, y1 } = logicConnectionEndpoints(
                            c,
                            logicConnByFrom,
                            logicConnByTo,
                            a,
                            b
                          );
                          const mid = logicBezierMidpoint(x0, y0, x1, y1);
                          const lineDisconnect = logicBezierPointAt(x0, y0, x1, y1, 0.38);
                          const edgeKey = `${c.from}-${c.to}`;
                          const hasKind = c.kind != null;
                          const meta = hasKind ? logicEdgeKindControlMeta(c.kind) : null;
                          const disconnectHoverHandlers = {
                            onPointerEnter: () => {
                              setLogicEdgeKindHoveredKey(null);
                              setLogicDisconnectHoveredKey(edgeKey);
                            },
                            onPointerLeave: () => setLogicDisconnectHoveredKey(null),
                          };
                          if (!hasKind) {
                            return (
                              <LogicEdgeLineDisconnectButton
                                key={`logic-edge-controls-${c.from}-${c.to}-${i}`}
                                x={mid.x}
                                y={mid.y}
                                onDisconnect={() => removeLogicConnection(c.from, c.to)}
                                {...disconnectHoverHandlers}
                              />
                            );
                          }

                          return (
                            <Fragment key={`logic-edge-controls-${c.from}-${c.to}-${i}`}>
                              <LogicEdgeLineDisconnectButton
                                x={lineDisconnect.x}
                                y={lineDisconnect.y}
                                onDisconnect={() => removeLogicConnection(c.from, c.to)}
                                {...disconnectHoverHandlers}
                              />
                              <LogicEdgeControlPill
                                pillX={mid.x}
                                pillY={mid.y}
                                meta={meta}
                                showClearLogic={c.kind === LOGIC_EDGE_KIND.if}
                                onClearLogic={() => clearLogicForConnection(c.from, c.to)}
                              />
                            </Fragment>
                          );
                        })}
                        {logicFlowNodes.map((node, i) => renderLogicFlowCard(node, i))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* â”€â”€ Scaled preview canvas â”€â”€ */
            <motion.div
              layout
              ref={canvasContainerRef}
              className="flex-1 overflow-hidden relative flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: isPreview ? '#f5f4f0' : designBackground }}
            >
              {/* Scaled form frame â€” transparent, just a scaling container */}
              <div
                style={{
                  width: CANVAS_BASE_W,
                  height: CANVAS_BASE_H,
                  transform: `scale(${canvasScale})`,
                  transformOrigin: 'center center',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: canvasScale === 0 ? 0 : 1,
                  transition: 'opacity 0.15s ease',
                  fontFamily: TYPOGRAPHY_FONTS[designTypography] ?? TYPOGRAPHY_FONTS.default,
                }}
              >
              <AnimatePresence mode="wait">
                {showContentPanel && !isPreview ? (
                  /* â”€â”€ Empty state while user selects a content block â”€â”€ */
                  <motion.div
                    key="content-panel-empty"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="h-full flex items-center justify-center p-6"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-10 h-10 rounded-full bg-[#f4f3ef] flex items-center justify-center">
                        <RiAddLine size={18} className="text-[#9a9a92]" />
                      </div>
                      <p
                        className="text-[14px] font-medium text-[#1a1a1a]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Select a block to add
                      </p>
                      <p
                        className="text-[12px] text-[#7a7a72] max-w-[220px] leading-normal"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Choose a content block from the panel on the right to add a new screen.
                      </p>
                    </div>
                  </motion.div>
                ) : activeScreen?.type === 'intro' ? (
                      introEssential ? (
                        /* â”€â”€ Essential selected: show matching ContentCard â”€â”€ */
                        <motion.div
                          key={`intro-essential-${introEssential}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className={`h-full min-h-0 flex flex-col ${deviceView === 'mobile' ? 'p-3' : 'p-5'}`}
                        >
                          <div className="w-full flex-1 min-h-0 flex flex-col">
                            <ContentCard
                              block={ESSENTIAL_TO_BLOCK[introEssential]}
                              blockNum={1}
                              onDelete={() =>
                                requestDeleteScreen({
                                  kind: 'intro',
                                  screenLabel: getScreenDeleteLabel(activeScreen),
                                })
                              }
                              fullCanvas={designLayoutStyle === 'fullCanvas'}
                              cardColor={hexToRgba(designCardColor, designCardOpacity)}
                              cardImage={designCardImage}
                              ctaConfig={{ ctaButtonLabel, ctaButtonSize, ctaButtonStyle, ctaCornerRadius, ctaShowIcon, ctaHeadingSize, ctaBodySize, ctaFontWeight, ctaTextAlign, ctaPadding, ctaTextColor, ctaBtnColor, ctaLabelColor, ctaContentWidth }}
                              headingConfig={{ headingText, subHeading, headingRequired, headingHidden, headingLevel, headingTextSize, headingAlignment, headingFontWeight, isEditingCard: isEditingHeadingCard, onEditToggle: () => setIsEditingHeadingCard(p => !p), setHeadingText, setSubHeading, headingAnswerText, setHeadingAnswerText }}
                              descriptionConfig={{ descriptionContent, descriptionHidden, descriptionShowCharCount, descriptionCharLimit, descriptionFormatting, descriptionTextSize, descriptionAlignment }}
                              imageConfig={{ imageHidden, imagePreview, imageAltText, imageCaption, imageLinkOnClick, imageLinkUrl, imageOpenInNewTab, imageAlignment, imageWidth, imageCornerRadius, imageQuestion, imageDescription, onRemoveImage: () => { setImagePreview(null); setImageFileName(''); } }}
                              imageFileInputRef={imageFileInputRef}
                              videoConfig={{ videoUrl, videoCaption, videoWidth, videoAspectRatio, videoCornerRadius, videoQuestion, videoDescription, videoRequired, videoHidden, videoLoop, videoAutoplay, videoShowControls, videoSource }}
                              contactConfig={{ contactQuestion, contactHelperText, contactFields, contactRequired }}
                              addressConfig={{ addressQuestion, addressHelperText, addressFields, addressRequired }}
                              workConfig={{ workQuestion, workHelperText, workFields, workRequired }}
                              shortTextConfig={{ shortTextQuestion, shortTextHelperText, shortTextPlaceholder, shortTextMaxChars, shortTextMinChars, shortTextValidation, shortTextAlign, shortTextSize, shortTextRequired, shortTextHidden }}
                              longTextConfig={{ longTextQuestion, longTextHelperText, longTextPlaceholder, longTextMaxChars, longTextMinChars, longTextValidation, longTextAlign, longTextSize, longTextRequired, longTextHidden }}
                              responseQualityConfig={{ enabled: responseQualityEnabled, options: responseQualityOptions }}
                              singleConfig={{ singleQuestion, singleHelperText, singleOptions, singleLayout, singleOptionHeight, singleRequired, singleAllowOther, singleRandomize, singleMultipleSelect, singleMinChoices, singleMaxChoices, singleShowKeyboardHints, onOpenPanel: () => { closeAllRightPanels(); setTimeout(() => setShowSingleConfigPanel(true), 300); } }}
                              multipleConfig={{ multipleQuestion, multipleHelperText, multipleOptions, multipleLayout, multipleRequired, multipleAllowOther, multipleRandomize, multipleMultipleSelect, multipleMinChoices, multipleMaxChoices, multipleShowKeyboardHints, multipleOptionHeight, onOpenPanel: () => { closeAllRightPanels(); setTimeout(() => setShowMultipleConfigPanel(true), 300); } }}
                              mediaConfig={{ mediaQuestion, mediaHelperText, mediaOptions, mediaAllowMultiple, mediaRequired, mediaRandomiseOrder, mediaMinChoices, mediaMaxChoices, mediaLayout, mediaOptionHeight }}
                              mapConfig={{
                                mapQuestion,
                                mapHelperText,
                                mapType,
                                mapZoom,
                                mapDefaultLat,
                                mapDefaultLng,
                                mapDefaultAddress,
                                mapAllowPinMovement,
                                mapShowSearchBar,
                                mapRestrictRadius,
                                mapRestrictRadiusKm,
                                mapPinLabel,
                                mapHeight,
                                mapRequired,
                                mapHidden,
                              }}
                              captchaConfig={{ captchaProvider, captchaSiteKey, captchaEnabled, captchaVisibility }}
                              multiImageConfig={{ question: multiImageQuestion, helperText: multiImageHelperText, maxFiles: multiImageMaxFiles, required: multiImageRequired, multipleFiles: multiImageMultipleFiles, maxFileSize: multiImageMaxFileSize }}
                              uploadConfig={{ question: uploadQuestion, helperText: uploadHelperText, maxFileSize: uploadMaxFileSize }}
                              ratingConfig={{ ratingQuestion, ratingRequired, ratingUseScale, ratingUseSlider, ratingMaxRating, ratingStyle, ratingLowLabel, ratingHighLabel, ratingShowLabels, ratingIconSize }}
                              dateConfig={{ dateQuestion, dateHelperText, dateRequired }}
                              timeConfig={{
                                timeQuestion,
                                timeHelperText,
                                timeRequired,
                                timeUse12h,
                                timeShowSeconds,
                                timeMinTime,
                                timeMaxTime,
                              }}
                              isPreviewMode={isPreview}
                              onPreviewAdvance={goPreviewNext}
                              previewStepNav={previewStepNavEl}
                              previewScreenValidatorRef={previewScreenValidatorRef}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        /* â”€â”€ Default welcome card â”€â”€ */
                        <motion.div
                          key="intro-screen"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className={`h-full flex flex-col ${deviceView === 'mobile' ? 'p-3' : 'p-5'}`}
                        >
                          {/* Hidden logo file input */}
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                          <motion.div
                            layout
                            className={`flex-1 flex flex-col w-full overflow-hidden ${designLayoutStyle === 'fullCanvas' ? '' : 'rounded-[20px]'}`}
                            style={designLayoutStyle === 'fullCanvas' ? {} : {
                              ...(designCardImage
                                ? { backgroundImage: `url(${designCardImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                : { background: hexToRgba(designCardColor, designCardOpacity) }),
                              boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.05), 0px 8px 32px 0px rgba(0,0,0,0.07)',
                              border: '1px solid rgba(0,0,0,0.07)',
                            }}
                          >
                            {/* Card body */}
                            <div className={`flex-1 flex flex-col items-center justify-center gap-4 ${deviceView === 'mobile' ? 'px-[32px] py-[28px]' : 'px-[52px] py-[44px]'}`}>
                              {/* Logo upload */}
                              <button
                                onClick={() => !isPreview && isEditingContent && logoInputRef.current?.click()}
                                title={!isPreview && isEditingContent ? 'Click to upload logo' : ''}
                                className={`${deviceView === 'mobile' ? 'w-[50px] h-[50px]' : 'w-[42px] h-[42px]'} rounded-[10px] flex items-center justify-center shrink-0 transition-colors overflow-hidden ${
                                  !isPreview && isEditingContent ? 'cursor-pointer hover:bg-[#2c2c2c]' : 'cursor-default'
                                } ${!draftLogo && !logoImage ? 'bg-[#18181a]' : ''}`}
                                style={(isEditingContent ? draftLogo : logoImage) ? { padding: 0 } : {}}
                              >
                                {(isEditingContent ? draftLogo : logoImage) ? (
                                  <img src={isEditingContent ? draftLogo : logoImage} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                  <RiAddLine size={deviceView === 'mobile' ? 24 : 20} className="text-white" />
                                )}
                              </button>

                              {isEditingContent ? (
                                <input
                                  type="text"
                                  value={draftTitle}
                                  onChange={(e) => setDraftTitle(e.target.value)}
                                  className={`text-[#18181a] ${deviceView === 'mobile' ? 'text-[28px] leading-[33.6px]' : 'text-[24px] leading-[28.8px]'} font-bold text-center bg-transparent border-b border-[#c8c6c0] outline-none w-full max-w-[320px] pb-[2px] focus:border-[#18181a] transition-colors`}
                                  placeholder="Title"
                                />
                              ) : (
                                <p className={`text-[#18181a] ${deviceView === 'mobile' ? 'text-[28px] leading-[33.6px]' : 'text-[24px] leading-[28.8px]'} font-bold text-center`}>{introTitle}</p>
                              )}

                              {isEditingContent ? (
                                <textarea
                                  value={draftDescription}
                                  onChange={(e) => setDraftDescription(e.target.value)}
                                  rows={2}
                                  className={`text-[#8c8a84] text-[15px] font-normal text-center bg-transparent border-b border-[#c8c6c0] outline-none w-full max-w-[360px] resize-none pb-[2px] focus:border-[#18181a] transition-colors leading-normal`}
                                  placeholder="Add the purpose of form here"
                                />
                              ) : (
                                <p className="text-[#8c8a84] text-[15px] font-normal text-center">{introDescription}</p>
                              )}

                              {isEditingContent ? (
                                <div className={`flex items-center gap-2 w-full ${deviceView === 'mobile' ? 'max-w-[320px]' : 'max-w-[280px]'}`}>
                                  <input
                                    type="text"
                                    value={draftButtonText}
                                    onChange={(e) => setDraftButtonText(e.target.value)}
                                    className={`bg-[#18181a] text-white ${deviceView === 'mobile' ? 'text-[16px] px-[28px] py-[12px]' : 'text-[14px] px-[24px] py-[10px]'} font-bold rounded-[8px] outline-none text-center w-full opacity-80`}
                                    placeholder="Button label"
                                  />
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={isPreview ? goPreviewNext : undefined}
                                  className={`bg-[#18181a] text-white ${deviceView === 'mobile' ? 'text-[16px] px-[40px] py-[13px]' : 'text-[14px] px-[36px] py-[11px]'} font-bold rounded-[8px] cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap`}
                                >
                                  {introButtonText}
                                </button>
                              )}
                            </div>

                            {/* Card footer */}
                            {!isPreview && (
                            <div className="border-t border-[rgba(0,0,0,0.1)] flex items-center gap-2 px-[20px] py-[10px] shrink-0">
                              <button
                                onClick={() =>
                                  requestDeleteScreen({
                                    kind: 'intro',
                                    screenLabel: getScreenDeleteLabel(activeScreen),
                                  })
                                }
                                className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,245,245,0.7)] border border-[rgba(200,50,50,0.2)] text-[#d63030] text-[12px] font-normal cursor-pointer hover:bg-[rgba(255,235,235,0.9)] transition-colors whitespace-nowrap"
                              >
                                <RiDeleteBin6Line size={12} className="shrink-0" />
                                Delete
                              </button>
                              {!isEditingContent ? (
                                <button
                                  onClick={handleEditContent}
                                  className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,255,255,0.7)] border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] font-normal cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
                                >
                                  <RiPencilLine size={12} className="shrink-0" />
                                  Edit content
                                </button>
                              ) : (
                                <button
                                  onClick={() => setIsEditingContent(false)}
                                  className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,255,255,0.7)] border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] font-normal cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
                                >
                                  <RiArrowLeftLine size={12} className="shrink-0" aria-hidden />
                                  Back
                                </button>
                              )}
                              <div className="flex-1" />
                              <button
                                onClick={handleSaveContent}
                                disabled={!hasChanges}
                                className={`flex items-center gap-[5px] px-[16px] py-[8px] rounded-[8px] text-[12px] font-medium transition-colors whitespace-nowrap ${
                                  hasChanges
                                    ? 'bg-[#111] text-white cursor-pointer hover:bg-[#2c2c2c]'
                                    : 'bg-[#d4d2cc] text-[#a0a09a] cursor-not-allowed'
                                }`}
                              >
                                <RiCheckLine size={11} className="shrink-0" />
                                Save
                              </button>
                            </div>
                            )}
                          </motion.div>
                        </motion.div>
                      )
                    ) : activeScreen?.type === 'content' ? (
                      /* â”€â”€ Content screen card â”€â”€ */
                      <motion.div
                        key={`content-${activeScreen.id}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={`h-full min-h-0 flex flex-col ${deviceView === 'mobile' ? 'p-3' : 'p-5'}`}
                      >
                        <div className="w-full flex-1 min-h-0 flex flex-col">
                          <ContentCard
                            block={activeScreen}
                            blockNum={contentBlockNum}
                            onDelete={() =>
                              requestDeleteScreen({
                                kind: 'content',
                                screenId: activeScreen.id,
                                screenLabel: getScreenDeleteLabel(activeScreen),
                              })
                            }
                            fullCanvas={designLayoutStyle === 'fullCanvas'}
                            cardColor={hexToRgba(designCardColor, designCardOpacity)}
                            cardImage={designCardImage}
                            ctaConfig={{ ctaButtonLabel, ctaButtonSize, ctaButtonStyle, ctaCornerRadius, ctaShowIcon, ctaHeadingSize, ctaBodySize, ctaFontWeight, ctaTextAlign, ctaPadding, ctaTextColor, ctaBtnColor, ctaLabelColor, ctaContentWidth }}
                            headingConfig={{ headingText, subHeading, headingRequired, headingHidden, headingLevel, headingTextSize, headingAlignment, headingFontWeight, isEditingCard: isEditingHeadingCard, onEditToggle: () => setIsEditingHeadingCard(p => !p), setHeadingText, setSubHeading, headingAnswerText, setHeadingAnswerText }}
                            descriptionConfig={{ descriptionContent, descriptionHidden, descriptionShowCharCount, descriptionCharLimit, descriptionFormatting, descriptionTextSize, descriptionAlignment }}
                            imageConfig={{ imageHidden, imagePreview, imageAltText, imageCaption, imageLinkOnClick, imageLinkUrl, imageOpenInNewTab, imageAlignment, imageWidth, imageCornerRadius, imageQuestion, imageDescription, onRemoveImage: () => { setImagePreview(null); setImageFileName(''); } }}
                            imageFileInputRef={imageFileInputRef}
                            videoConfig={{ videoUrl, videoCaption, videoWidth, videoAspectRatio, videoCornerRadius, videoQuestion, videoDescription, videoRequired, videoHidden, videoLoop, videoAutoplay, videoShowControls, videoSource }}
                            contactConfig={{ contactQuestion, contactHelperText, contactFields, contactRequired }}
                            addressConfig={{ addressQuestion, addressHelperText, addressFields, addressRequired }}
                            workConfig={{ workQuestion, workHelperText, workFields, workRequired }}
                            shortTextConfig={{ shortTextQuestion, shortTextHelperText, shortTextPlaceholder, shortTextMaxChars, shortTextMinChars, shortTextValidation, shortTextAlign, shortTextSize, shortTextRequired, shortTextHidden }}
                            longTextConfig={{ longTextQuestion, longTextHelperText, longTextPlaceholder, longTextMaxChars, longTextMinChars, longTextValidation, longTextAlign, longTextSize, longTextRequired, longTextHidden }}
                            responseQualityConfig={{ enabled: responseQualityEnabled, options: responseQualityOptions }}
                            singleConfig={{ singleQuestion, singleHelperText, singleOptions, singleLayout, singleOptionHeight, singleRequired, singleAllowOther, singleRandomize, singleMultipleSelect, singleMinChoices, singleMaxChoices, singleShowKeyboardHints, onOpenPanel: () => { closeAllRightPanels(); setTimeout(() => setShowSingleConfigPanel(true), 300); } }}
                            multipleConfig={{ multipleQuestion, multipleHelperText, multipleOptions, multipleLayout, multipleRequired, multipleAllowOther, multipleRandomize, multipleMultipleSelect, multipleMinChoices, multipleMaxChoices, multipleShowKeyboardHints, multipleOptionHeight, onOpenPanel: () => { closeAllRightPanels(); setTimeout(() => setShowMultipleConfigPanel(true), 300); } }}
                            mediaConfig={{ mediaQuestion, mediaHelperText, mediaOptions, mediaAllowMultiple, mediaRequired, mediaRandomiseOrder, mediaMinChoices, mediaMaxChoices, mediaLayout, mediaOptionHeight }}
                            mapConfig={{
                                mapQuestion,
                                mapHelperText,
                                mapType,
                                mapZoom,
                                mapDefaultLat,
                                mapDefaultLng,
                                mapDefaultAddress,
                                mapAllowPinMovement,
                                mapShowSearchBar,
                                mapRestrictRadius,
                                mapRestrictRadiusKm,
                                mapPinLabel,
                                mapHeight,
                                mapRequired,
                                mapHidden,
                              }}
                            captchaConfig={{ captchaProvider, captchaSiteKey, captchaEnabled, captchaVisibility }}
                            multiImageConfig={{ question: multiImageQuestion, helperText: multiImageHelperText, maxFiles: multiImageMaxFiles, required: multiImageRequired, multipleFiles: multiImageMultipleFiles, maxFileSize: multiImageMaxFileSize }}
                            uploadConfig={{ question: uploadQuestion, helperText: uploadHelperText, maxFileSize: uploadMaxFileSize }}
                            ratingConfig={{ ratingQuestion, ratingRequired, ratingUseScale, ratingUseSlider, ratingMaxRating, ratingStyle, ratingLowLabel, ratingHighLabel, ratingShowLabels, ratingIconSize }}
                            dateConfig={{ dateQuestion, dateHelperText, dateRequired }}
                            timeConfig={{
                              timeQuestion,
                              timeHelperText,
                              timeRequired,
                              timeUse12h,
                              timeShowSeconds,
                              timeMinTime,
                              timeMaxTime,
                            }}
                            isPreviewMode={isPreview}
                            onPreviewAdvance={goPreviewNext}
                            previewStepNav={previewStepNavEl}
                            previewScreenValidatorRef={previewScreenValidatorRef}
                            onPreviewSnapChange={handlePreviewSnapChange}
                            previewScreenId={activeScreen.id}
                          />
                        </div>
                      </motion.div>
                ) : activeScreen?.type === 'end' ? (
                      /* â”€â”€ End screen card â”€â”€ */
                      <motion.div
                        key="end-screen"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={`h-full flex flex-col ${deviceView === 'mobile' ? 'p-3' : 'p-5'}`}
                      >
                        <motion.div
                          layout
                          className={`flex-1 flex flex-col w-full overflow-hidden ${designLayoutStyle === 'fullCanvas' ? '' : 'rounded-[20px]'}`}
                          style={designLayoutStyle === 'fullCanvas' ? {} : {
                            background: hexToRgba(designCardColor, designCardOpacity),
                            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.05), 0px 8px 32px 0px rgba(0,0,0,0.07)',
                            border: '1px solid rgba(0,0,0,0.07)',
                          }}
                        >
                          {/* Card body */}
                          <div className={`flex-1 flex flex-col items-center justify-center gap-4 ${deviceView === 'mobile' ? 'px-[32px] py-[28px]' : 'px-[52px] py-[44px]'}`}>
                            {/* Green checkmark badge */}
                            <div className="w-[36px] h-[36px] rounded-[10px] bg-[#1a9e4a] flex items-center justify-center shrink-0">
                              <RiCheckLine size={18} className="text-white" />
                            </div>

                            {/* Title */}
                            {isEditingEndScreen ? (
                              <input
                                type="text"
                                value={draftEndTitle}
                                onChange={(e) => setDraftEndTitle(e.target.value)}
                                className={`text-[#111] ${deviceView === 'mobile' ? 'text-[28px] leading-[33.6px]' : 'text-[24px] leading-[28.8px]'} font-bold text-center bg-transparent border-b border-[#c8c6c0] outline-none w-full max-w-[360px] pb-[2px] focus:border-[#18181a] transition-colors tracking-[-0.56px]`}
                                placeholder="Thank you title"
                              />
                            ) : (
                              <p className={`text-[#111] ${deviceView === 'mobile' ? 'text-[28px] leading-[33.6px]' : 'text-[24px] leading-[28.8px]'} font-bold text-center tracking-[-0.56px]`}>{endScreenTitle}</p>
                            )}

                            {/* Description */}
                            {isEditingEndScreen ? (
                              <textarea
                                value={draftEndDescription}
                                onChange={(e) => setDraftEndDescription(e.target.value)}
                                rows={3}
                                className="text-[#888] text-[15px] font-light text-center bg-transparent border-b border-[#c8c6c0] outline-none w-full max-w-[320px] resize-none pb-[2px] focus:border-[#18181a] transition-colors leading-normal"
                                placeholder="Thank you description"
                              />
                            ) : (
                              <p className="text-[#888] text-[15px] font-light text-center max-w-[320px] leading-[1.65]">{endScreenDescription}</p>
                            )}

                            {/* Done button */}
                            {isEditingEndScreen ? (
                              <input
                                type="text"
                                value={draftEndButtonText}
                                onChange={(e) => setDraftEndButtonText(e.target.value)}
                                className={`bg-[#1a1a1a] text-white ${deviceView === 'mobile' ? 'text-[16px] px-[28px] py-[12px]' : 'text-[14px] px-[28px] py-[12px]'} font-medium rounded-[10px] outline-none text-center`}
                                placeholder="Button label"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={
                                  isPreview
                                    ? () => {
                                        const intro = screens.find((s) => s.type === 'intro');
                                        setIsPreview(false);
                                        if (intro) setActiveScreenId(intro.id);
                                      }
                                    : undefined
                                }
                                className={`bg-[#1a1a1a] text-white flex items-center gap-[7px] ${deviceView === 'mobile' ? 'text-[16px] px-[28px] py-[12px]' : 'text-[14px] px-[28px] py-[12px]'} font-medium rounded-[10px] cursor-pointer hover:bg-[#2c2c2c] transition-colors`}
                              >
                                {endScreenButtonText}
                                <RiCheckLine size={12} className="shrink-0" />
                              </button>
                            )}
                          </div>

                          {/* Card footer */}
                          {!isPreview && (
                          <div className="border-t border-[rgba(0,0,0,0.1)] flex items-center gap-2 px-[20px] py-[10px] shrink-0">
                            <button
                              onClick={() =>
                                requestDeleteScreen({
                                  kind: 'end',
                                  screenLabel: getScreenDeleteLabel(activeScreen),
                                })
                              }
                              className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,245,245,0.7)] border border-[rgba(200,50,50,0.2)] text-[#d63030] text-[12px] font-normal cursor-pointer hover:bg-[rgba(255,235,235,0.9)] transition-colors whitespace-nowrap"
                            >
                              <RiDeleteBin6Line size={12} className="shrink-0" />
                              Delete
                            </button>
                            {!isEditingEndScreen ? (
                              <button
                                onClick={handleEditEndScreen}
                                className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,255,255,0.7)] border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] font-normal cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
                              >
                                <RiPencilLine size={12} className="shrink-0" />
                                Edit
                              </button>
                            ) : (
                              <button
                                onClick={() => setIsEditingEndScreen(false)}
                                className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-[rgba(255,255,255,0.7)] border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] font-normal cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
                              >
                                <RiArrowLeftLine size={12} className="shrink-0" aria-hidden />
                                Back
                              </button>
                            )}
                            <div className="flex-1" />
                            <button
                              onClick={handleSaveEndScreen}
                              disabled={!hasEndScreenChanges}
                              className={`flex items-center gap-[5px] px-[16px] py-[8px] rounded-[8px] text-[12px] font-medium transition-colors whitespace-nowrap ${
                                hasEndScreenChanges
                                  ? 'bg-[#111] text-white cursor-pointer hover:bg-[#2c2c2c]'
                                  : 'bg-[#d4d2cc] text-[#a0a09a] cursor-not-allowed'
                              }`}
                            >
                              <RiCheckLine size={11} className="shrink-0" />
                              Save
                            </button>
                          </div>
                          )}
                        </motion.div>
                      </motion.div>
                ) : null}
              </AnimatePresence>
              </div>{/* end scaled frame */}

              {/* â”€â”€ Viewport / Preview toggle (floating top-right) â”€â”€ */}
              <div className="absolute top-[10px] right-[12px] z-10">
                <div
                  className="inline-flex items-center bg-white border border-[#e4e2dc] rounded-[8px] p-[3px] gap-[2px]"
                  style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}
                >
                  <button
                    onClick={() => setDeviceView('desktop')}
                    title="Desktop view"
                    className={`flex items-center justify-center w-[30px] h-[26px] rounded-[5px] transition-colors cursor-pointer ${deviceView === 'desktop' ? 'bg-[#1a1a1a] text-white' : 'text-[#9a9a92] hover:text-[#555] hover:bg-[#f4f3ef]'}`}
                  >
                    <RiComputerLine size={14} />
                  </button>
                  <button
                    onClick={() => setDeviceView('mobile')}
                    title="Mobile view"
                    className={`flex items-center justify-center w-[30px] h-[26px] rounded-[5px] transition-colors cursor-pointer ${deviceView === 'mobile' ? 'bg-[#1a1a1a] text-white' : 'text-[#9a9a92] hover:text-[#555] hover:bg-[#f4f3ef]'}`}
                  >
                    <RiSmartphoneLine size={14} />
                  </button>
                  <button
                    onClick={() => setIsPreview(p => !p)}
                    title="Preview"
                    className={`flex items-center justify-center w-[30px] h-[26px] rounded-[5px] transition-colors cursor-pointer ${isPreview ? 'bg-[#1a1a1a] text-white' : 'text-[#9a9a92] hover:text-[#555] hover:bg-[#f4f3ef]'}`}
                  >
                    <RiEyeLine size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer â€” screen navigation (hidden on Logic tab; preview uses in-card Back/Next) */}
          {!isPreview && activeTab !== 'logic' && (
          <div className="h-[51px] shrink-0 border-t border-[#e4e2dc] flex items-center px-6 bg-white">
            {hasScreens ? (
              <>
                <button
                  type="button"
                  onClick={() => prevScreen && setActiveScreenId(prevScreen.id)}
                  disabled={!prevScreen}
                  className={`inline-flex items-center gap-1.5 px-[15px] py-[8px] bg-white border border-[#e4e2dc] rounded-[8px] text-[11px] font-medium transition-colors whitespace-nowrap ${
                    prevScreen ? 'text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer' : 'text-[#ccc] cursor-not-allowed'
                  }`}
                >
                  <RiArrowLeftLine size={13} className={`shrink-0 ${prevScreen ? 'text-[#1a1a1a]' : 'text-[#ccc]'}`} aria-hidden />
                  Previous
                </button>
                <span className="flex-1 text-center text-[12px] font-normal text-[#7a7a72]">
                  Screen {activeScreenIdx + 1} of {screens.length}
                </span>
                <button
                  type="button"
                  onClick={() => nextScreen && setActiveScreenId(nextScreen.id)}
                  disabled={!nextScreen}
                  className={`inline-flex items-center gap-1.5 px-[15px] py-[8px] bg-white border border-[#e4e2dc] rounded-[8px] text-[11px] font-medium transition-colors whitespace-nowrap ${
                    nextScreen ? 'text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer' : 'text-[#ccc] cursor-not-allowed'
                  }`}
                >
                  Next
                  <RiArrowRightLine size={13} className={`shrink-0 ${nextScreen ? 'text-[#1a1a1a]' : 'text-[#ccc]'}`} aria-hidden />
                </button>
              </>
            ) : (
              <span className="flex-1 text-center text-[12px] font-normal text-[#7a7a72]">
                No screens added yet
              </span>
            )}
          </div>
          )}

          {/* â”€â”€ Theme selection overlay â”€â”€ */}
          <AnimatePresence>
            {showThemeOverlay && (
              <motion.div
                key="theme-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.32)' }}
                onClick={() => setShowThemeOverlay(false)}
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.96, opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-[12px] w-[580px] max-h-[88vh] flex flex-col overflow-hidden"
                  style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)' }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.1)] shrink-0">
                    <span className="text-[14px] font-normal text-[#4c414e]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Theme
                    </span>
                    <button
                      onClick={() => setShowThemeOverlay(false)}
                      className="w-[24px] h-[24px] flex items-center justify-center rounded-[6px] text-[#7a7a72] text-[16px] cursor-pointer hover:bg-[#f4f3ef] transition-colors"
                    >
                      Ã—
                    </button>
                  </div>

                  {/* Theme grid */}
                  <div className="overflow-y-auto">
                    <div className="p-5 grid grid-cols-2 gap-5">
                      {THEMES.map((theme) => {
                        const isActive = activeThemeId === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => handleSelectTheme(theme)}
                            className="text-left cursor-pointer group"
                            style={{
                              background: 'white',
                              border: isActive ? '2px solid #1a1a1a' : '1px solid #d4d4d4',
                              borderRadius: 16,
                              overflow: 'hidden',
                              transition: 'border-color 0.15s ease',
                            }}
                          >
                            {/* Preview area */}
                            <div className="h-[160px] overflow-hidden" style={{ borderRadius: '14px 14px 0 0' }}>
                              <img
                                src={theme.previewImg}
                                alt={theme.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Name row */}
                            <div className="px-4 py-3 flex items-center justify-between bg-white">
                              <span className="text-[10.5px] font-medium text-black" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {theme.name}
                              </span>
                              {isActive && <RiCheckLine size={13} className="text-[#1a1a1a] shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

        {/* â”€â”€ Configure panel (right) â”€â”€ */}
        {!isPreview && <>
        <AnimatePresence>
        {showConfigPanel && (
          <motion.div
            key="config-panel"
            initial={{ width: 0 }}
            animate={{ width: 280 }}
            exit={{ width: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="shrink-0 overflow-hidden"
          >
          <div
            className="w-[280px] h-full bg-[#f7f7f8] border-l border-[#e5e3dc] flex flex-col"
            style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}
          >
            {/* Header */}
            <div className="h-[41px] border-b border-[#e5e3dc] flex items-center justify-between px-4 shrink-0">
              <span className="text-[14px] font-semibold text-black">Configure</span>
              <button
                onClick={() => setShowConfigPanel(false)}
                className="w-[22px] h-[22px] bg-[#f4f3ef] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e9e7e0] transition-colors"
              >
                <RiCloseLine size={14} className="text-[#6a6a6a]" aria-hidden />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Essentials section */}
              <div className="p-[14px] flex flex-col gap-4">
                {/* Section heading */}
                <button
                  onClick={() => toggleSection('essentials')}
                  className="flex items-center justify-between w-full cursor-pointer"
                >
                  <span className="text-[#414141] text-[10px] font-semibold tracking-[0.7px] uppercase">
                    Essentials
                  </span>
                  <motion.span
                    animate={{ rotate: sections.essentials ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="flex items-center shrink-0"
                  >
                    <RiArrowDownSLine size={16} className="text-[#414141]" />
                  </motion.span>
                </button>

                {/* Essentials grid */}
                <AnimatePresence initial={false}>
                  {sections.essentials && (
                    <motion.div
                      key="essentials-grid"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <motion.div
                        className="grid grid-cols-3 gap-2 pb-[2px]"
                        variants={{ show: { transition: { staggerChildren: 0.035 } }, hidden: {} }}
                        initial="hidden"
                        animate="show"
                      >
                        {ESSENTIALS.map(({ label, Icon }) => {
                          const isActive = activeScreen?.type === 'intro' && introEssential === label;
                          return (
                            <motion.button
                              key={label}
                              variants={{
                                hidden: { opacity: 0, y: 5 },
                                show: { opacity: 1, y: 0 },
                              }}
                              transition={{ duration: 0.15, ease: 'easeOut' }}
                              onClick={() => {
                                if (activeScreen?.type === 'intro')
                                  setIntroEssential((prev) => (prev === label ? null : label));
                              }}
                              className={`rounded-[8px] flex flex-col items-center justify-center gap-[5px] pt-[15px] pb-[14px] px-[5px] min-h-[64px] cursor-pointer transition-colors border ${
                                isActive
                                  ? 'bg-[#eef2ff] border-indigo-300'
                                  : 'bg-white border-[#e5e3dc] hover:bg-[#f9f8f6]'
                              }`}
                            >
                              <Icon size={16} className={`shrink-0 ${isActive ? 'text-indigo-500' : 'text-[#6a6a6a]'}`} />
                              <span className={`text-[10px] leading-[12px] text-center ${isActive ? 'text-indigo-600 font-medium' : 'text-[#6a6a6a]'}`}>
                                {label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion sections */}
              {ACCORDION_SECTIONS.filter(({ key }) =>
                !(activeScreen?.type === 'intro' && key === 'questionTemplates')
              ).map(({ key, label }) => (
                <div key={key} className="border-t border-[rgba(0,0,0,0.09)]">
                  <button
                    onClick={() => toggleSection(key)}
                    className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                  >
                    <span className="text-[#686868] text-[9.5px] font-semibold tracking-[1.235px] uppercase">
                      {label}
                    </span>
                    <motion.span
                      animate={{ rotate: sections[key] ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="flex items-center shrink-0"
                    >
                      <RiArrowDownSLine size={12} className="text-[#686868]" />
                    </motion.span>
                  </button>

                  {/* Question Templates expanded content */}
                  <AnimatePresence initial={false}>
                    {key === 'questionTemplates' && sections.questionTemplates && (
                      <motion.div
                        key="qt-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="pb-2">
                          {QUESTION_TEMPLATE_CATEGORIES.map(({ label: catLabel, items }, idx) => (
                            <div key={catLabel}>
                              {idx > 0 && (
                                <div className="h-px bg-[#e5e3dc] mx-[14px]" />
                              )}
                              <div className="p-[14px] flex flex-col gap-4">
                                <span className="text-[#414141] text-[10px] font-semibold tracking-[0.7px] uppercase leading-normal">
                                  {catLabel}
                                </span>
                                <motion.div
                                  className="grid grid-cols-3 gap-2"
                                  variants={{ show: { transition: { staggerChildren: 0.04 } }, hidden: {} }}
                                  initial="hidden"
                                  animate="show"
                                >
                                  {items.map(({ label: itemLabel, Icon }) => {
                                    const isSelected = selectedTemplate === `${catLabel}:${itemLabel}`;
                                    return (
                                      <motion.button
                                        key={itemLabel}
                                        variants={{
                                          hidden: { opacity: 0, y: 5 },
                                          show: { opacity: 1, y: 0 },
                                        }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setSelectedTemplate(isSelected ? null : `${catLabel}:${itemLabel}`)}
                                        className={`flex flex-col items-center justify-center gap-[5px] pt-[15px] pb-[14px] px-[5px] min-h-[64px] rounded-[8px] border cursor-pointer transition-colors ${
                                          isSelected
                                            ? 'bg-[#ebeaff] border-[#a39eff]'
                                            : 'bg-white border-[#e5e3dc] hover:bg-[#f9f8f6]'
                                        }`}
                                      >
                                        <Icon
                                          size={16}
                                          className={`shrink-0 ${isSelected ? 'text-[#5b55e8]' : 'text-[#6a6a6a]'}`}
                                        />
                                        <span
                                          className={`text-[10px] leading-[12px] text-center ${
                                            isSelected ? 'text-black font-medium' : 'text-[#6a6a6a] font-normal'
                                          }`}
                                        >
                                          {itemLabel}
                                        </span>
                                      </motion.button>
                                    );
                                  })}
                                </motion.div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Field Settings expanded content */}
                    {key === 'fieldSettings' && sections.fieldSettings && (
                      <motion.div
                        key="fs-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="flex flex-col gap-3 px-4 pt-[6px] pb-[14px]">
                          {/* Required toggle */}
                          {[
                            { label: 'Required', value: welcomeRequired, setter: setWelcomeRequired },
                            { label: 'Hidden', value: welcomeHidden, setter: setWelcomeHidden },
                            { label: 'Read-only', value: welcomeReadOnly, setter: setWelcomeReadOnly },
                          ].map(({ label: toggleLabel, value, setter }) => (
                            <div key={toggleLabel} className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444] font-normal">{toggleLabel}</span>
                              <button
                                onClick={() => setter((p) => !p)}
                                className={`relative w-[34px] h-[20px] rounded-[10px] transition-colors cursor-pointer shrink-0 appearance-none border-0 p-0 ${value ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}
                              >
                                <span
                                  className={`absolute top-[3px] w-[14px] h-[14px] bg-white rounded-[7px] transition-all duration-200 ${value ? 'left-[17px]' : 'left-[3px]'}`}
                                />
                              </button>
                            </div>
                          ))}

                          {/* Divider */}
                          <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                          {/* Placeholder text */}
                          <div className="flex flex-col gap-[6px]">
                            <span className="text-[12px] text-[#444] font-normal">Placeholder text</span>
                            <div className="bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.15)] rounded-[7px] px-[11px] py-[7px]">
                              <input
                                type="text"
                                value={welcomePlaceholder}
                                onChange={(e) => setWelcomePlaceholder(e.target.value)}
                                className="w-full text-[12px] text-[#111] bg-transparent outline-none font-normal leading-normal"
                                placeholder="Type your answer hereâ€¦"
                              />
                            </div>
                          </div>

                          {/* Helper text */}
                          <div className="flex flex-col gap-[6px]">
                            <span className="text-[12px] text-[#444] font-normal">Helper text</span>
                            <div className="bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.15)] rounded-[7px] px-[11px] py-[9px] min-h-[60px]">
                              <textarea
                                value={welcomeHelperText}
                                onChange={(e) => setWelcomeHelperText(e.target.value)}
                                rows={3}
                                className="w-full text-[12px] text-[#111] bg-transparent outline-none resize-none font-normal leading-[18.6px]"
                                placeholder="Press Enter to continue"
                              />
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                          {/* Min length */}
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#444] font-normal">Min length</span>
                            <div className="bg-[rgba(0,0,0,0.04)] flex gap-[6px] items-center px-[6px] py-[4px] rounded-[7px]">
                              <button
                                onClick={() => setWelcomeMinLength((v) => Math.max(0, v - 1))}
                                className="bg-[rgba(255,255,255,0.8)] w-[20px] h-[20px] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-white transition-colors text-[14px] text-[#555] font-medium leading-none"
                              >âˆ’</button>
                              <span className="min-w-[28px] text-center text-[13px] font-medium text-[#111]">{welcomeMinLength}</span>
                              <button
                                onClick={() => setWelcomeMinLength((v) => Math.min(welcomeMaxLength, v + 1))}
                                className="bg-[rgba(255,255,255,0.8)] w-[20px] h-[20px] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-white transition-colors text-[14px] text-[#555] font-medium leading-none"
                              >+</button>
                            </div>
                          </div>

                          {/* Max length */}
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#444] font-normal">Max length</span>
                            <div className="bg-[rgba(0,0,0,0.04)] flex gap-[6px] items-center px-[6px] py-[4px] rounded-[7px]">
                              <button
                                onClick={() => setWelcomeMaxLength((v) => Math.max(welcomeMinLength, v - 1))}
                                className="bg-[rgba(255,255,255,0.8)] w-[20px] h-[20px] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-white transition-colors text-[14px] text-[#555] font-medium leading-none"
                              >âˆ’</button>
                              <span className="min-w-[28px] text-center text-[13px] font-medium text-[#111]">{welcomeMaxLength}</span>
                              <button
                                onClick={() => setWelcomeMaxLength((v) => v + 1)}
                                className="bg-[rgba(255,255,255,0.8)] w-[20px] h-[20px] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-white transition-colors text-[14px] text-[#555] font-medium leading-none"
                              >+</button>
                            </div>
                          </div>

                          {/* Input type dropdown */}
                          <div className="flex flex-col gap-[6px]" ref={welcomeInputTypeRef}>
                            <span className="text-[12px] text-[#444] font-normal">Input type</span>
                            <div>
                              <button
                                onClick={() => setWelcomeInputTypeOpen((p) => !p)}
                                className={`w-full flex items-center justify-between bg-white border border-[rgba(0,0,0,0.2)] pl-[11px] pr-[10px] py-[9px] cursor-pointer transition-colors ${welcomeInputTypeOpen ? 'rounded-t-[6px]' : 'rounded-[6px]'}`}
                              >
                                <span className="text-[12.5px] text-[#1a1a1a] font-normal">{welcomeInputType}</span>
                                <RiArrowDownSLine size={14} className={`text-[#666] transition-transform duration-200 ${welcomeInputTypeOpen ? 'rotate-180' : ''}`} />
                              </button>
                              <AnimatePresence>
                                {welcomeInputTypeOpen && (
                                  <motion.div
                                    key="input-type-dropdown"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
                                    style={{ overflow: 'hidden' }}
                                    className="w-full bg-white border border-[#b0b0ae] border-t-0 rounded-b-[6px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)]"
                                  >
                                    {['Free text', 'Number', 'Email', 'URL', 'Phone', 'Password'].map((option) => (
                                      <button
                                        key={option}
                                        onClick={() => { setWelcomeInputType(option); setWelcomeInputTypeOpen(false); }}
                                        className={`w-full text-left px-[10px] py-[8px] text-[12.5px] cursor-pointer transition-colors ${
                                          option === welcomeInputType
                                            ? 'bg-[#ebebea] font-medium text-[#1a1a1a]'
                                            : 'font-normal text-[#1a1a1a] hover:bg-[#f5f5f5]'
                                        }`}
                                      >
                                        {option}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Appearance expanded content */}
                    {key === 'appearance' && sections.appearance && (
                      <motion.div
                        key="appearance-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="flex flex-col gap-3 px-4 pt-[6px] pb-[14px]">
                          {/* Text size */}
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#444] font-normal">Text size</span>
                            <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-3 gap-[2px] h-[31px] p-[2px] rounded-[7px] w-[140px]">
                              {['S', 'M', 'L'].map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setWelcomeTextSize(size)}
                                  className={`flex items-center justify-center rounded-[5px] text-[11.5px] cursor-pointer transition-colors ${
                                    welcomeTextSize === size
                                      ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                      : 'text-[#777] font-normal hover:text-[#444]'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Alignment */}
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#444] font-normal">Alignment</span>
                            <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-3 gap-[2px] h-[29px] p-[2px] rounded-[7px] w-[140px]">
                              {[
                                { alignKey: 'left', Icon: RiAlignLeft },
                                { alignKey: 'center', Icon: RiAlignCenter },
                                { alignKey: 'right', Icon: RiAlignRight },
                              ].map(({ alignKey, Icon: AlignIcon }) => (
                                <button
                                  key={alignKey}
                                  onClick={() => setWelcomeAlignment(alignKey)}
                                  className={`flex items-center justify-center rounded-[5px] cursor-pointer transition-colors ${
                                    welcomeAlignment === alignKey
                                      ? 'bg-white border border-[rgba(0,0,0,0.09)] shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                      : 'hover:bg-[rgba(255,255,255,0.5)]'
                                  }`}
                                >
                                  <AlignIcon size={13} className={welcomeAlignment === alignKey ? 'text-[#111]' : 'text-[#777]'} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* â”€â”€ Content panel (right) â€“ shown when Add Screen is clicked after intro â”€â”€ */}
        <AnimatePresence>
          {showContentPanel && (
            <motion.div
              key="content-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
            <div
              className="w-[280px] h-full bg-[#f7f7f8] border-l border-[#e5e3dc] flex flex-col"
              style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.1)' }}
            >
              {/* Header */}
              <div className="h-[41px] border-b border-[#e5e3dc] flex items-center justify-between px-4 shrink-0">
                <span
                  className="text-[14px] font-semibold text-black"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
                >
                  Content
                </span>
                <button
                  onClick={() => setShowContentPanel(false)}
                  className="w-[22px] h-[22px] bg-[#f4f3ef] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e9e7e0] transition-colors"
                >
                  <RiCloseLine size={14} className="text-[#6a6a6a] shrink-0" aria-hidden />
                </button>
              </div>

              {/* Scrollable sections */}
              <div className="flex-1 overflow-y-auto">
                {CONTENT_SECTIONS.map(({ key, label, items }, index) => (
                  <div key={key}>
                    {index > 0 && (
                      <div className="h-px bg-[#e5e3dc] mx-[6px]" />
                    )}
                    <div className="p-[14px] flex flex-col gap-[16px]">
                      {/* Section header row */}
                      <button
                        onClick={() => toggleContentSection(key)}
                        className="flex items-center justify-between w-full cursor-pointer px-[2px]"
                      >
                        <span
                          className="text-[#414141] text-[10px] font-semibold tracking-[0.7px] uppercase leading-normal"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
                        >
                          {label}
                        </span>
                        <motion.span
                          animate={{ rotate: openContentSections[key] ? 0 : 180 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="flex items-center shrink-0"
                        >
                          <PiCaretCircleUp size={16} className="text-[#414141]" />
                        </motion.span>
                      </button>

                      {/* Items grid */}
                      <AnimatePresence initial={false}>
                        {openContentSections[key] && (
                          <motion.div
                            key={`${key}-grid`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <motion.div
                              className="grid grid-cols-3 gap-2 pb-[2px]"
                              variants={{
                                show: { transition: { staggerChildren: 0.04 } },
                                hidden: {},
                              }}
                              initial="hidden"
                              animate="show"
                            >
                              {items.map(({ label: itemLabel, Icon }) => (
                                <motion.button
                                  key={itemLabel}
                                  variants={{
                                    hidden: { opacity: 0, y: 6 },
                                    show: { opacity: 1, y: 0 },
                                  }}
                                  transition={{ duration: 0.15, ease: 'easeOut' }}
                                  whileHover={{ scale: 1.04 }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => addContentScreen(key, itemLabel)}
                                  className="flex flex-col items-center justify-center gap-[5px] pt-[15px] pb-[14px] px-[5px] min-h-[64px] rounded-[8px] border cursor-pointer transition-colors bg-white border-[#e5e3dc] hover:bg-[#f4f3ef] active:bg-[#ebeaff] active:border-[#a39eff]"
                                >
                                  <Icon size={16} className="shrink-0 text-[#6a6a6a]" />
                                  {itemLabel.length > 13 ? (
                                    <div
                                      className="label-marquee text-[10px] leading-[12px] text-[#6a6a6a] font-normal"
                                      style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
                                    >
                                      <span>{itemLabel}</span>
                                    </div>
                                  ) : (
                                    <span
                                      className="text-[10px] leading-[12px] text-center whitespace-nowrap text-[#6a6a6a] font-normal"
                                      style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
                                    >
                                      {itemLabel}
                                    </span>
                                  )}
                                </motion.button>
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ CTA Configure panel (right) â”€â”€ */}
        <AnimatePresence>
          {showCtaConfigPanel && (
            <motion.div
              key="cta-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div
                className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col"
                style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}
              >
                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span
                    className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Configure
                  </span>
                  <button
                    onClick={() => setShowCtaConfigPanel(false)}
                    className="w-[20px] h-[20px] bg-[#f0eeea] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors"
                  >
                    <RiCloseLine size={10} className="text-[#6a6a6a] shrink-0" aria-hidden />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ BUTTON section â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setCtaSections((p) => ({ ...p, button: !p.button }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span
                        className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        BUTTON
                      </span>
                      <motion.span
                        animate={{ rotate: ctaSections.button ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {ctaSections.button && (
                        <motion.div
                          key="cta-btn-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col gap-3 px-4 pt-[6px] pb-[14px]">

                            {/* Preview */}
                            <div className="flex flex-col gap-[10px]">
                              <span
                                className="text-[10px] font-semibold tracking-[0.9px] uppercase text-[#8c8c8a]"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                PREVIEW
                              </span>
                              <div>
                                <button
                                  className="flex items-center justify-center gap-[6px] px-4 py-2 text-[13px] font-medium"
                                  style={{
                                    background:
                                      ctaButtonStyle === 'Filled'
                                        ? ctaBtnColor
                                        : 'transparent',
                                    color:
                                      ctaButtonStyle === 'Ghost'
                                        ? ctaBtnColor
                                        : (ctaTextColor ?? (ctaLabelColor === 'black' ? '#111' : '#fff')),
                                    borderRadius: `${ctaCornerRadius}px`,
                                    border:
                                      ctaButtonStyle === 'Outline' || ctaButtonStyle === 'Ghost'
                                        ? `1.5px solid ${ctaBtnColor}`
                                        : 'none',
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  <span>{ctaButtonLabel || 'Get started'}</span>
                                  {ctaShowIcon && <RiArrowRightLine size={14} className="shrink-0" aria-hidden />}
                                </button>
                              </div>
                            </div>

                            {/* Button label */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Button label
                              </span>
                              <input
                                type="text"
                                value={ctaButtonLabel}
                                onChange={(e) => setCtaButtonLabel(e.target.value)}
                                className="w-full bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.15)] rounded-[7px] px-[11px] py-[7px] text-[12px] text-[#111] outline-none focus:border-[rgba(0,0,0,0.3)]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                            {/* Button size */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Button size
                              </span>
                              <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-4 gap-[2px] p-[2px] rounded-[7px]">
                                {['S', 'M', 'L', 'XL'].map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setCtaButtonSize(size)}
                                    className={`flex items-center justify-center py-[6px] rounded-[5px] text-[11.5px] transition-colors cursor-pointer ${
                                      ctaButtonSize === size
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] shadow-[0px_1px_1px_rgba(0,0,0,0.08)] text-[#111] font-medium'
                                        : 'text-[#777] font-normal hover:text-[#444]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Button style */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Button style
                              </span>
                              <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-3 gap-[2px] p-[2px] rounded-[7px]">
                                {['Filled', 'Outline', 'Ghost'].map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => setCtaButtonStyle(s)}
                                    className={`flex items-center justify-center py-[6px] rounded-[5px] text-[11.5px] transition-colors cursor-pointer ${
                                      ctaButtonStyle === s
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] shadow-[0px_1px_1px_rgba(0,0,0,0.08)] text-[#111] font-medium'
                                        : 'text-[#777] font-normal hover:text-[#444]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Corner radius */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Corner radius
                              </span>
                              <div className="flex items-center gap-[10px]">
                                <input
                                  type="range"
                                  min={0}
                                  max={50}
                                  value={ctaCornerRadius}
                                  onChange={(e) => setCtaCornerRadius(Number(e.target.value))}
                                  className="cta-slider flex-1"
                                  style={{
                                    background: `linear-gradient(to right, #111 ${(ctaCornerRadius / 50) * 100}%, #ddd ${(ctaCornerRadius / 50) * 100}%)`,
                                  }}
                                />
                                <span
                                  className="text-[11px] font-medium text-[#111] min-w-[20px] text-right shrink-0"
                                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                  {ctaCornerRadius}
                                </span>
                              </div>
                            </div>

                            {/* Button color picker */}
                            <div className="bg-[#fafaf9] border border-[#e5e5e3] rounded-[12px] overflow-hidden">
                              <div className="px-[11px] pt-[11px] pb-[9px] flex flex-col gap-2">
                                <span
                                  className="text-[10px] font-semibold tracking-[0.9px] uppercase text-[#8c8c8a]"
                                  style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                  BUTTON COLOR
                                </span>
                                {/* Quick swatches */}
                                <div className="flex items-center gap-2 pt-[2px]">
                                  {['#1a1a1a', '#3b82f6', '#ffffff'].map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => setCtaBtnColor(color)}
                                      className="rounded-full shrink-0 cursor-pointer"
                                      style={{
                                        width: 28,
                                        height: 28,
                                        background: color,
                                        border: color === '#ffffff' ? '1px solid #e5e5e3' : 'none',
                                        outline: ctaBtnColor === color ? '2px solid #111' : 'none',
                                        outlineOffset: 2,
                                      }}
                                    />
                                  ))}
                                  <button
                                    onClick={() => setCtaBtnColorGridOpen((v) => !v)}
                                    className="w-[28px] h-[28px] rounded-full border border-dashed border-[#c0c0be] flex items-center justify-center text-[#9a9a9a] text-[14px] leading-none cursor-pointer hover:bg-white/50"
                                  >
                                    +
                                  </button>
                                </div>
                                {/* Color grid â€“ shown only after clicking + */}
                                <AnimatePresence initial={false}>
                                  {ctaBtnColorGridOpen && (
                                    <motion.div
                                      key="cta-btn-color-grid"
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                                      style={{ overflow: 'hidden' }}
                                    >
                                      <div className="bg-white border border-[#e5e5e3] rounded-[8px] p-[11px] flex flex-col gap-2">
                                        <div className="grid grid-cols-8 gap-1">
                                          {CTA_COLOR_PALETTE.flat().map((color, idx) => (
                                            <button
                                              key={idx}
                                              onClick={() => {
                                                setCtaBtnColor(color);
                                                setCtaBtnColorGridOpen(false);
                                              }}
                                              className="aspect-square rounded-[3px] cursor-pointer hover:scale-110 transition-transform"
                                              style={{
                                                background: color,
                                                border:
                                                  idx === 0
                                                    ? '1px solid #d8d8d6'
                                                    : '1px solid rgba(0,0,0,0.07)',
                                                outline: ctaBtnColor === color ? '2px solid #1a1a1a' : 'none',
                                                outlineOffset: 1,
                                              }}
                                            />
                                          ))}
                                        </div>
                                        {/* Hex input row */}
                                        <div className="border-t border-[#ebebea] pt-[9px] flex items-center gap-[6px]">
                                          <div
                                            className="w-[22px] h-[22px] rounded-[4px] border border-[#d8d8d6] shrink-0"
                                            style={{ background: ctaBtnColor }}
                                          />
                                          <span
                                            className="text-[11.5px] text-[#9a9a9a] shrink-0"
                                            style={{ fontFamily: 'Courier New, monospace' }}
                                          >
                                            #
                                          </span>
                                          <input
                                            type="text"
                                            value={ctaBtnColor.replace('#', '').toUpperCase()}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                                                setCtaBtnColor('#' + val);
                                              }
                                            }}
                                            className="flex-1 text-[11.5px] text-[#9a9a9a] uppercase outline-none bg-transparent min-w-0"
                                            style={{ fontFamily: 'Courier New, monospace' }}
                                            maxLength={6}
                                          />
                                          <button className="px-2 py-1 border border-[#e0e0de] rounded-[4px] text-[10.5px] text-[#9a9a9a] shrink-0 cursor-pointer hover:bg-[#f5f5f5] transition-colors">
                                            Custom
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            {/* Text color picker */}
                            <div className="bg-[#fafaf9] border border-[#e5e5e3] rounded-[12px] overflow-hidden">
                              <div className="px-[11px] pt-[11px] pb-[9px] flex flex-col gap-2">
                                <span
                                  className="text-[10px] font-semibold tracking-[0.9px] uppercase text-[#8c8c8a]"
                                  style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                  TEXT COLOR
                                </span>
                                {/* Quick swatches */}
                                <div className="flex items-center gap-2 pt-[2px]">
                                  {['#3b82f6', '#1a1a1a', '#ffffff'].map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => setCtaTextColor(color)}
                                      className="rounded-full shrink-0 cursor-pointer"
                                      style={{
                                        width: 28,
                                        height: 28,
                                        background: color,
                                        border: color === '#ffffff' ? '1px solid #e5e5e3' : 'none',
                                        outline: ctaTextColor === color ? '2px solid #111' : 'none',
                                        outlineOffset: 2,
                                      }}
                                    />
                                  ))}
                                  <button
                                    onClick={() => setCtaColorGridOpen((v) => !v)}
                                    className="w-[28px] h-[28px] rounded-full border border-dashed border-[#c0c0be] flex items-center justify-center text-[#9a9a9a] text-[14px] leading-none cursor-pointer hover:bg-white/50"
                                  >
                                    +
                                  </button>
                                </div>
                                {/* Color grid â€“ shown only after clicking + */}
                                <AnimatePresence initial={false}>
                                  {ctaColorGridOpen && (
                                    <motion.div
                                      key="cta-color-grid"
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                                      style={{ overflow: 'hidden' }}
                                    >
                                      <div className="bg-white border border-[#e5e5e3] rounded-[8px] p-[11px] flex flex-col gap-2">
                                        <div className="grid grid-cols-8 gap-1">
                                          {CTA_COLOR_PALETTE.flat().map((color, idx) => (
                                            <button
                                              key={idx}
                                              onClick={() => {
                                                setCtaTextColor(color);
                                                setCtaColorGridOpen(false);
                                              }}
                                              className="aspect-square rounded-[3px] cursor-pointer hover:scale-110 transition-transform"
                                              style={{
                                                background: color,
                                                border:
                                                  idx === 0
                                                    ? '1px solid #d8d8d6'
                                                    : '1px solid rgba(0,0,0,0.07)',
                                                outline: ctaTextColor === color ? '2px solid #1a1a1a' : 'none',
                                                outlineOffset: 1,
                                              }}
                                            />
                                          ))}
                                        </div>
                                        {/* Hex input row */}
                                        <div className="border-t border-[#ebebea] pt-[9px] flex items-center gap-[6px]">
                                          <div
                                            className="w-[22px] h-[22px] rounded-[4px] border border-[#d8d8d6] shrink-0"
                                            style={{ background: ctaTextColor }}
                                          />
                                          <span
                                            className="text-[11.5px] text-[#9a9a9a] shrink-0"
                                            style={{ fontFamily: 'Courier New, monospace' }}
                                          >
                                            #
                                          </span>
                                          <input
                                            type="text"
                                            value={ctaTextColor.replace('#', '').toUpperCase()}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                                                setCtaTextColor('#' + val);
                                              }
                                            }}
                                            className="flex-1 text-[11.5px] text-[#9a9a9a] uppercase outline-none bg-transparent min-w-0"
                                            style={{ fontFamily: 'Courier New, monospace' }}
                                            maxLength={6}
                                          />
                                          <button className="px-2 py-1 border border-[#e0e0de] rounded-[4px] text-[10.5px] text-[#9a9a9a] shrink-0 cursor-pointer hover:bg-[#f5f5f5] transition-colors">
                                            Custom
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            {/* Label color */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Label color
                              </span>
                              <div className="flex items-center gap-[6px]">
                                {[
                                  { id: 'white', bg: '#ffffff', shadow: 'inset 0 0 0 2px rgba(0,0,0,0.12)' },
                                  { id: 'black', bg: '#111111', shadow: 'none' },
                                ].map(({ id, bg, shadow }) => (
                                  <button
                                    key={id}
                                    onClick={() => setCtaLabelColor(id)}
                                    className="rounded-full shrink-0 cursor-pointer"
                                    style={{
                                      width: 22,
                                      height: 22,
                                      background: bg,
                                      boxShadow: shadow,
                                      outline: ctaLabelColor === id ? '1.5px solid #111' : 'none',
                                      outlineOffset: 3,
                                    }}
                                  />
                                ))}
                                <button className="w-[22px] h-[22px] rounded-full border border-dashed border-[rgba(0,0,0,0.15)] flex items-center justify-center text-[#bbb] text-[14px] leading-none cursor-pointer hover:bg-[#f0eeea]">
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Show icon */}
                            <div className="flex items-center justify-between">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Show icon
                              </span>
                              <button
                                onClick={() => setCtaShowIcon((v) => !v)}
                                className="relative shrink-0 cursor-pointer transition-colors"
                                style={{
                                  width: 34,
                                  height: 20,
                                  borderRadius: 10,
                                  background: ctaShowIcon ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF,
                                }}
                              >
                                <div
                                  className="absolute top-[3px] bg-white rounded-[7px]"
                                  style={{
                                    width: 14,
                                    height: 14,
                                    left: ctaShowIcon ? 17 : 3,
                                    transition: 'left 0.15s ease',
                                  }}
                                />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ TYPOGRAPHY section â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setCtaSections((p) => ({ ...p, typography: !p.typography }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span
                        className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        TYPOGRAPHY
                      </span>
                      <motion.span
                        animate={{ rotate: ctaSections.typography ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {ctaSections.typography && (
                        <motion.div
                          key="cta-typo-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col gap-3 px-4 pt-[6px] pb-[14px]">

                            {/* Heading size */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Heading size
                              </span>
                              <div className="flex items-center gap-[10px]">
                                <input
                                  type="range"
                                  min={12}
                                  max={60}
                                  value={ctaHeadingSize}
                                  onChange={(e) => setCtaHeadingSize(Number(e.target.value))}
                                  className="cta-slider flex-1"
                                  style={{
                                    background: `linear-gradient(to right, #111 ${((ctaHeadingSize - 12) / 48) * 100}%, #ddd ${((ctaHeadingSize - 12) / 48) * 100}%)`,
                                  }}
                                />
                                <span
                                  className="text-[11px] font-medium text-[#111] min-w-[20px] text-right shrink-0"
                                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                  {ctaHeadingSize}
                                </span>
                              </div>
                            </div>

                            {/* Body size */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Body size
                              </span>
                              <div className="flex items-center gap-[10px]">
                                <input
                                  type="range"
                                  min={8}
                                  max={32}
                                  value={ctaBodySize}
                                  onChange={(e) => setCtaBodySize(Number(e.target.value))}
                                  className="cta-slider flex-1"
                                  style={{
                                    background: `linear-gradient(to right, #111 ${((ctaBodySize - 8) / 24) * 100}%, #ddd ${((ctaBodySize - 8) / 24) * 100}%)`,
                                  }}
                                />
                                <span
                                  className="text-[11px] font-medium text-[#111] min-w-[20px] text-right shrink-0"
                                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                  {ctaBodySize}
                                </span>
                              </div>
                            </div>

                            {/* Font weight */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Font weight
                              </span>
                              <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-3 gap-[2px] p-[2px] rounded-[7px]">
                                {[
                                  { label: 'Light', weight: 300 },
                                  { label: 'Regular', weight: 400 },
                                  { label: 'Bold', weight: 700 },
                                ].map(({ label, weight }) => (
                                  <button
                                    key={label}
                                    onClick={() => setCtaFontWeight(label)}
                                    className={`flex items-center justify-center py-[6px] rounded-[5px] text-[11.5px] transition-colors cursor-pointer ${
                                      ctaFontWeight === label
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] shadow-[0px_1px_1px_rgba(0,0,0,0.08)] text-[#111]'
                                        : 'text-[#777] hover:text-[#444]'
                                    }`}
                                    style={{
                                      fontFamily: "'DM Sans', sans-serif",
                                      fontWeight: weight,
                                    }}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Text align */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Text align
                              </span>
                              <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-3 gap-[2px] p-[2px] rounded-[7px]">
                                {[
                                  { id: 'left', Icon: RiAlignLeft },
                                  { id: 'center', Icon: RiAlignCenter },
                                  { id: 'right', Icon: RiAlignRight },
                                ].map(({ id, Icon }) => (
                                  <button
                                    key={id}
                                    onClick={() => setCtaTextAlign(id)}
                                    className={`flex items-center justify-center py-[6px] rounded-[5px] transition-colors cursor-pointer ${
                                      ctaTextAlign === id
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                        : 'hover:bg-white/30'
                                    }`}
                                  >
                                    <Icon
                                      size={13}
                                      className={ctaTextAlign === id ? 'text-[#111]' : 'text-[#777]'}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ SPACING section â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setCtaSections((p) => ({ ...p, spacing: !p.spacing }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span
                        className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        SPACING
                      </span>
                      <motion.span
                        animate={{ rotate: ctaSections.spacing ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {ctaSections.spacing && (
                        <motion.div
                          key="cta-spacing-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col gap-4 px-4 pt-[6px] pb-[14px]">

                            {/* Padding */}
                            <div className="flex flex-col gap-[6px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Padding
                              </span>
                              <div className="flex items-center gap-[10px]">
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={ctaPadding}
                                  onChange={(e) => setCtaPadding(Number(e.target.value))}
                                  className="cta-slider flex-1"
                                  style={{
                                    background: `linear-gradient(to right, #111 ${ctaPadding}%, #ddd ${ctaPadding}%)`,
                                  }}
                                />
                                <span
                                  className="text-[11px] font-medium text-[#111] min-w-[20px] text-right shrink-0"
                                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                  {ctaPadding}
                                </span>
                              </div>
                            </div>

                            {/* Content width */}
                            <div className="flex flex-col gap-[8px]">
                              <span
                                className="text-[12px] font-normal text-[#444]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Content width
                              </span>
                              <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-3 gap-[2px] p-[2px] rounded-[7px]">
                                {['Narrow', 'Default', 'Wide'].map((w) => (
                                  <button
                                    key={w}
                                    onClick={() => setCtaContentWidth(w)}
                                    className={`flex items-center justify-center py-[6px] rounded-[5px] text-[11.5px] transition-colors cursor-pointer ${
                                      ctaContentWidth === w
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] shadow-[0px_1px_1px_rgba(0,0,0,0.08)] text-[#111] font-medium'
                                        : 'text-[#777] font-normal hover:text-[#444]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {w}
                                  </button>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Heading Configure panel (right) â”€â”€ */}
        <AnimatePresence>
          {showHeadingConfigPanel && (
            <motion.div
              key="heading-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div
                className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col"
                style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}
              >
                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Configure
                  </span>
                  <button
                    onClick={() => setShowHeadingConfigPanel(false)}
                    className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors"
                  >
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>

                {/* Card type label */}
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    HEADING
                  </span>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ FIELD SETTINGS â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setHeadingSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        FIELD SETTINGS
                      </span>
                      <motion.span
                        animate={{ rotate: headingSections.fieldSettings ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {headingSections.fieldSettings && (
                        <motion.div
                          key="heading-field-settings"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col px-4 pt-[4px] pb-[14px] gap-0">

                            {/* Required toggle */}
                            <div className="flex items-center justify-between py-[9px] border-b border-[#f5f5f5]">
                              <span className="text-[13px] text-[#222]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Required</span>
                              <button
                                onClick={() => setHeadingRequired((v) => !v)}
                                className="relative shrink-0 cursor-pointer"
                                style={{ width: 36, height: 20 }}
                              >
                                <div
                                  className="absolute inset-0 rounded-[10px] transition-colors duration-200"
                                  style={{ background: headingRequired ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: headingRequired ? 18 : 2,
                                  }}
                                />
                              </button>
                            </div>

                            {/* Hidden toggle */}
                            <div className="flex items-center justify-between py-[9px] border-b border-[#f5f5f5]">
                              <span className="text-[13px] text-[#222]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hidden</span>
                              <button
                                onClick={() => setHeadingHidden((v) => !v)}
                                className="relative shrink-0 cursor-pointer"
                                style={{ width: 36, height: 20 }}
                              >
                                <div
                                  className="absolute inset-0 rounded-[10px] transition-colors duration-200"
                                  style={{ background: headingHidden ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: headingHidden ? 18 : 2,
                                  }}
                                />
                              </button>
                            </div>

                            {/* Heading text input */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Heading text</span>
                              <input
                                type="text"
                                value={headingText}
                                onChange={(e) => setHeadingText(e.target.value)}
                                placeholder="Enter your heading..."
                                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                            {/* Heading level */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Heading level</span>
                              <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-4 gap-[2px] p-[3px] rounded-[8px]">
                                {['H1', 'H2', 'H3', 'H4'].map((lvl) => (
                                  <button
                                    key={lvl}
                                    onClick={() => setHeadingLevel(lvl)}
                                    className={`flex items-center justify-center py-[5px] rounded-[6px] text-[12px] transition-colors cursor-pointer ${
                                      headingLevel === lvl
                                        ? 'bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.1)] text-[#111] font-medium'
                                        : 'text-[#777] font-normal hover:text-[#444]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {lvl}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Sub-heading */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sub-heading</span>
                              <input
                                type="text"
                                value={subHeading}
                                onChange={(e) => setSubHeading(e.target.value)}
                                placeholder="Optional sub-heading..."
                                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ CONDITIONAL LOGIC â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setHeadingSections((p) => ({ ...p, conditionalLogic: !p.conditionalLogic }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        CONDITIONAL LOGIC
                      </span>
                      <motion.span
                        animate={{ rotate: headingSections.conditionalLogic ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {headingSections.conditionalLogic && (
                        <motion.div
                          key="heading-cond-logic"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="px-4 pb-[15px]">
                            <div className="bg-[#f8f8f8] rounded-[8px] px-3 py-[10px] flex flex-col gap-[6px]">
                              <span className="text-[10px] font-bold tracking-[0.55px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                SHOW THIS BLOCK IF
                              </span>
                              <button className="flex items-center gap-[5px] cursor-pointer hover:opacity-70 transition-opacity">
                                <RiAddLine size={14} className="text-[#555] shrink-0" />
                                <span className="text-[12px] text-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Add condition</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ APPEARANCE â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setHeadingSections((p) => ({ ...p, appearance: !p.appearance }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        APPEARANCE
                      </span>
                      <motion.span
                        animate={{ rotate: headingSections.appearance ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {headingSections.appearance && (
                        <motion.div
                          key="heading-appearance"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col gap-[12px] px-4 pt-[4px] pb-[14px]">

                            {/* Text size */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Text size</span>
                              <div className="flex items-center gap-[6px]">
                                {['S', 'M', 'L', 'XL'].map((sz) => (
                                  <button
                                    key={sz}
                                    onClick={() => setHeadingTextSize(sz)}
                                    className={`w-8 h-7 flex items-center justify-center rounded-[6px] border text-[12px] transition-colors cursor-pointer ${
                                      headingTextSize === sz
                                        ? 'bg-white border-[#111] text-[#111] font-medium'
                                        : 'bg-white border-[#e0e0e0] text-[#777] hover:border-[#bbb]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Alignment */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Alignment</span>
                              <div className="flex items-center gap-[6px]">
                                {[
                                  { id: 'left', Icon: RiAlignLeft },
                                  { id: 'center', Icon: RiAlignCenter },
                                  { id: 'right', Icon: RiAlignRight },
                                ].map(({ id, Icon }) => (
                                  <button
                                    key={id}
                                    onClick={() => setHeadingAlignment(id)}
                                    className={`w-8 h-7 flex items-center justify-center rounded-[6px] border transition-colors cursor-pointer ${
                                      headingAlignment === id
                                        ? 'bg-white border-[#111]'
                                        : 'bg-white border-[#e0e0e0] hover:border-[#bbb]'
                                    }`}
                                  >
                                    <Icon size={14} className={headingAlignment === id ? 'text-[#111]' : 'text-[#777]'} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Font weight */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Font weight</span>
                              <div className="bg-[rgba(0,0,0,0.04)] grid grid-cols-3 gap-[2px] p-[3px] rounded-[8px]">
                                {['Light', 'Regular', 'Bold'].map((w) => (
                                  <button
                                    key={w}
                                    onClick={() => setHeadingFontWeight(w)}
                                    className={`flex items-center justify-center py-[5px] rounded-[6px] text-[11.5px] transition-colors cursor-pointer ${
                                      headingFontWeight === w
                                        ? 'bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.1)] text-[#111] font-medium'
                                        : 'text-[#777] font-normal hover:text-[#444]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {w}
                                  </button>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Description Configure panel (right) â”€â”€ */}
        <AnimatePresence>
          {showDescriptionConfigPanel && (
            <motion.div
              key="description-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div
                className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col"
                style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}
              >
                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Configure
                  </span>
                  <button
                    onClick={() => setShowDescriptionConfigPanel(false)}
                    className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors"
                  >
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>

                {/* Card type label */}
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    DESCRIPTION
                  </span>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ FIELD SETTINGS â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setDescriptionSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        FIELD SETTINGS
                      </span>
                      <motion.span
                        animate={{ rotate: descriptionSections.fieldSettings ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {descriptionSections.fieldSettings && (
                        <motion.div
                          key="desc-field-settings"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col px-4 pt-[4px] pb-[14px] gap-0">

                            {/* Hidden toggle */}
                            <div className="flex items-center justify-between py-[9px] border-b border-[#f5f5f5]">
                              <span className="text-[13px] text-[#222]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hidden</span>
                              <button
                                onClick={() => setDescriptionHidden((v) => !v)}
                                className="relative shrink-0 cursor-pointer"
                                style={{ width: 36, height: 20 }}
                              >
                                <div
                                  className="absolute inset-0 rounded-[10px] transition-colors duration-200"
                                  style={{ background: descriptionHidden ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: descriptionHidden ? 18 : 2,
                                  }}
                                />
                              </button>
                            </div>

                            {/* Content textarea */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Content</span>
                              <textarea
                                value={descriptionContent}
                                onChange={(e) => setDescriptionContent(e.target.value)}
                                placeholder="Enter description text..."
                                rows={4}
                                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors resize-none"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                            {/* Formatting */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Formatting</span>
                              <div className="flex flex-wrap gap-[6px]">
                                {[
                                  { key: 'bold', label: 'Bold' },
                                  { key: 'italic', label: 'Italic' },
                                  { key: 'underline', label: 'Underline' },
                                  { key: 'link', label: 'Link' },
                                  { key: 'list', label: 'List' },
                                ].map(({ key, label }) => (
                                  <button
                                    key={key}
                                    onClick={() => setDescriptionFormatting((prev) => ({ ...prev, [key]: !prev[key] }))}
                                    className={`px-[11px] py-[5px] rounded-[20px] text-[11.5px] transition-colors cursor-pointer border ${
                                      descriptionFormatting[key]
                                        ? 'bg-[#111] border-[#111] text-white'
                                        : 'bg-[#f2f2f2] border-[#e8e8e8] text-[#555] hover:bg-[#e8e8e8]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Show character count toggle */}
                            <div className="flex items-center justify-between py-[9px] border-b border-[#f5f5f5] mt-[8px]">
                              <span className="text-[13px] text-[#222]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Show character count</span>
                              <button
                                onClick={() => setDescriptionShowCharCount((v) => !v)}
                                className="relative shrink-0 cursor-pointer"
                                style={{ width: 36, height: 20 }}
                              >
                                <div
                                  className="absolute inset-0 rounded-[10px] transition-colors duration-200"
                                  style={{ background: descriptionShowCharCount ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: descriptionShowCharCount ? 18 : 2,
                                  }}
                                />
                              </button>
                            </div>

                            {/* Character limit */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Character limit</span>
                              <input
                                type="number"
                                value={descriptionCharLimit}
                                onChange={(e) => setDescriptionCharLimit(e.target.value)}
                                placeholder="No limit"
                                min={1}
                                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ CONDITIONAL LOGIC â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setDescriptionSections((p) => ({ ...p, conditionalLogic: !p.conditionalLogic }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        CONDITIONAL LOGIC
                      </span>
                      <motion.span
                        animate={{ rotate: descriptionSections.conditionalLogic ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {descriptionSections.conditionalLogic && (
                        <motion.div
                          key="desc-cond-logic"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="px-4 pb-[15px]">
                            <div className="bg-[#f8f8f8] rounded-[8px] px-3 py-[10px] flex flex-col gap-[6px]">
                              <span className="text-[10px] font-bold tracking-[0.55px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                SHOW THIS BLOCK IF
                              </span>
                              <button className="flex items-center gap-[5px] cursor-pointer hover:opacity-70 transition-opacity">
                                <RiAddLine size={14} className="text-[#555] shrink-0" />
                                <span className="text-[12px] text-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Add condition</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ APPEARANCE â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setDescriptionSections((p) => ({ ...p, appearance: !p.appearance }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        APPEARANCE
                      </span>
                      <motion.span
                        animate={{ rotate: descriptionSections.appearance ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {descriptionSections.appearance && (
                        <motion.div
                          key="desc-appearance"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col gap-[12px] px-4 pt-[4px] pb-[14px]">

                            {/* Text size */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Text size</span>
                              <div className="flex items-center gap-[6px]">
                                {['S', 'M', 'L'].map((sz) => (
                                  <button
                                    key={sz}
                                    onClick={() => setDescriptionTextSize(sz)}
                                    className={`w-8 h-7 flex items-center justify-center rounded-[6px] border text-[12px] transition-colors cursor-pointer ${
                                      descriptionTextSize === sz
                                        ? 'bg-white border-[#111] text-[#111] font-medium'
                                        : 'bg-white border-[#e0e0e0] text-[#777] hover:border-[#bbb]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Alignment */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Alignment</span>
                              <div className="flex items-center gap-[6px]">
                                {[
                                  { id: 'left', Icon: RiAlignLeft },
                                  { id: 'center', Icon: RiAlignCenter },
                                  { id: 'right', Icon: RiAlignRight },
                                ].map(({ id, Icon }) => (
                                  <button
                                    key={id}
                                    onClick={() => setDescriptionAlignment(id)}
                                    className={`w-8 h-7 flex items-center justify-center rounded-[6px] border transition-colors cursor-pointer ${
                                      descriptionAlignment === id
                                        ? 'bg-white border-[#111]'
                                        : 'bg-white border-[#e0e0e0] hover:border-[#bbb]'
                                    }`}
                                  >
                                    <Icon size={14} className={descriptionAlignment === id ? 'text-[#111]' : 'text-[#777]'} />
                                  </button>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Image Configure panel (right) â”€â”€ */}
        <AnimatePresence>
          {showImageConfigPanel && (
            <motion.div
              key="image-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 300 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div
                className="w-[300px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col"
                style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}
              >
                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Configure
                  </span>
                  <button
                    onClick={() => setShowImageConfigPanel(false)}
                    className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors"
                  >
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>

                {/* Card type label */}
                <div className="px-4 pt-[8px] pb-[6px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    IMAGES
                  </span>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ FIELD SETTINGS â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setImageSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        FIELD SETTINGS
                      </span>
                      <motion.span
                        animate={{ rotate: imageSections.fieldSettings ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {imageSections.fieldSettings && (
                        <motion.div
                          key="image-field-settings"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col px-4 pt-[4px] pb-[14px] gap-0">

                            {/* Hidden toggle */}
                            <div className="flex items-center justify-between py-[9px] border-b border-[#f5f5f5]">
                              <span className="text-[13px] text-[#222]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hidden</span>
                              <button
                                onClick={() => setImageHidden((v) => !v)}
                                className="relative shrink-0 cursor-pointer"
                                style={{ width: 36, height: 20 }}
                              >
                                <div
                                  className="absolute inset-0 rounded-[10px] transition-colors duration-200"
                                  style={{ background: imageHidden ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: imageHidden ? 18 : 2,
                                  }}
                                />
                              </button>
                            </div>

                            {/* Image upload area */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Image</span>
                              {imagePreview ? (
                                <div className="relative rounded-[8px] overflow-hidden border border-[#e8e8e8]">
                                  <img src={imagePreview} alt="Preview" className="w-full h-[80px] object-cover" />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => imageFileInputRef.current && imageFileInputRef.current.click()}
                                      className="bg-white text-[#444] text-[11px] px-[10px] py-[5px] rounded-[6px] cursor-pointer hover:bg-gray-100 transition-colors font-medium"
                                    >
                                      Replace
                                    </button>
                                    <button
                                      onClick={() => { setImagePreview(null); setImageFileName(''); }}
                                      className="bg-white text-[#d63030] text-[11px] px-[10px] py-[5px] rounded-[6px] cursor-pointer hover:bg-red-50 transition-colors font-medium"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  {imageFileName && (
                                    <div className="px-[10px] py-[6px] bg-white border-t border-[#e8e8e8]">
                                      <p className="text-[11px] text-[#666] truncate">{imageFileName}</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => imageFileInputRef.current && imageFileInputRef.current.click()}
                                  className="w-full bg-[#fafafa] border border-dashed border-[#d0d0d0] rounded-[8px] flex flex-col items-center justify-center py-[17px] gap-[4px] cursor-pointer hover:bg-[#f2f2f2] transition-colors"
                                >
                                  <ImagesCardIcon size={16} className="text-[#999]" />
                                  <p className="text-[12px] text-[#777] text-center">
                                    <span className="font-medium text-[#555]">Click to upload</span>
                                    {' '}or drag & drop
                                  </p>
                                  <p className="text-[11px] text-[#aaa]">PNG, JPG, GIF, WebP</p>
                                </button>
                              )}
                            </div>

                            {/* Alt text */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Alt text</span>
                              <input
                                type="text"
                                value={imageAltText}
                                onChange={(e) => setImageAltText(e.target.value)}
                                placeholder="Describe the image..."
                                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                            {/* Caption */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Caption</span>
                              <input
                                type="text"
                                value={imageCaption}
                                onChange={(e) => setImageCaption(e.target.value)}
                                placeholder="Optional caption..."
                                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                            {/* Link on click toggle */}
                            <div className="flex items-center justify-between py-[9px] border-b border-[#f5f5f5] mt-[8px]">
                              <span className="text-[13px] text-[#222]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Link on click</span>
                              <button
                                onClick={() => setImageLinkOnClick((v) => !v)}
                                className="relative shrink-0 cursor-pointer"
                                style={{ width: 36, height: 20 }}
                              >
                                <div
                                  className="absolute inset-0 rounded-[10px] transition-colors duration-200"
                                  style={{ background: imageLinkOnClick ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: imageLinkOnClick ? 18 : 2,
                                  }}
                                />
                              </button>
                            </div>

                            {/* URL input (visible when link on click is on) */}
                            <AnimatePresence initial={false}>
                              {imageLinkOnClick && (
                                <motion.div
                                  key="image-link-url"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <div className="pt-[8px] pb-[4px]">
                                    <input
                                      type="url"
                                      value={imageLinkUrl}
                                      onChange={(e) => setImageLinkUrl(e.target.value)}
                                      placeholder="https://..."
                                      className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors"
                                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Open in new tab toggle */}
                            <div className="flex items-center justify-between py-[9px] border-b border-[#f5f5f5]">
                              <span className="text-[13px] text-[#222]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Open in new tab</span>
                              <button
                                onClick={() => setImageOpenInNewTab((v) => !v)}
                                className="relative shrink-0 cursor-pointer"
                                style={{ width: 36, height: 20 }}
                              >
                                <div
                                  className="absolute inset-0 rounded-[10px] transition-colors duration-200"
                                  style={{ background: imageOpenInNewTab ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: imageOpenInNewTab ? 18 : 2,
                                  }}
                                />
                              </button>
                            </div>

                            {/* Question text */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Question</span>
                              <input
                                type="text"
                                value={imageQuestion}
                                onChange={(e) => setImageQuestion(e.target.value)}
                                placeholder="What do you see in this image?"
                                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                            {/* Description text */}
                            <div className="flex flex-col gap-[5px] pt-[12px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Description</span>
                              <input
                                type="text"
                                value={imageDescription}
                                onChange={(e) => setImageDescription(e.target.value)}
                                placeholder="Describe what's happening in the photo above."
                                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[13px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.25)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ CONDITIONAL LOGIC â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setImageSections((p) => ({ ...p, conditionalLogic: !p.conditionalLogic }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        CONDITIONAL LOGIC
                      </span>
                      <motion.span
                        animate={{ rotate: imageSections.conditionalLogic ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {imageSections.conditionalLogic && (
                        <motion.div
                          key="image-cond-logic"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="px-4 pt-[4px] pb-[14px]">
                            <div className="bg-[#f8f8f8] rounded-[8px] px-[12px] py-[10px] flex flex-col gap-[6px]">
                              <span className="text-[10px] font-bold tracking-[0.55px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                SHOW THIS BLOCK IF
                              </span>
                              <button className="flex items-center gap-[5px] text-[12px] text-[#555] cursor-pointer hover:text-[#111] transition-colors">
                                <RiAddLine size={14} className="shrink-0" />
                                Add condition
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ APPEARANCE â”€â”€ */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button
                      onClick={() => setImageSections((p) => ({ ...p, appearance: !p.appearance }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        APPEARANCE
                      </span>
                      <motion.span
                        animate={{ rotate: imageSections.appearance ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#999]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {imageSections.appearance && (
                        <motion.div
                          key="image-appearance"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="flex flex-col gap-[12px] px-4 pt-[4px] pb-[14px]">

                            {/* Alignment */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Alignment</span>
                              <div className="flex items-center gap-[6px]">
                                {[
                                  { id: 'left', Icon: RiAlignLeft },
                                  { id: 'center', Icon: RiAlignCenter },
                                  { id: 'right', Icon: RiAlignRight },
                                ].map(({ id, Icon }) => (
                                  <button
                                    key={id}
                                    onClick={() => setImageAlignment(id)}
                                    className={`w-8 h-7 flex items-center justify-center rounded-[6px] border transition-colors cursor-pointer ${
                                      imageAlignment === id
                                        ? 'bg-white border-[#111]'
                                        : 'bg-white border-[#e0e0e0] hover:border-[#bbb]'
                                    }`}
                                  >
                                    <Icon size={14} className={imageAlignment === id ? 'text-[#111]' : 'text-[#777]'} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Width */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Width</span>
                              <div className="bg-[rgba(0,0,0,0.04)] flex gap-[2px] p-[3px] rounded-[8px]">
                                {['Fit', 'Full', 'Custom'].map((w) => (
                                  <button
                                    key={w}
                                    onClick={() => setImageWidth(w)}
                                    className={`flex-1 flex items-center justify-center py-[5px] rounded-[6px] text-[12px] transition-colors cursor-pointer ${
                                      imageWidth === w
                                        ? 'bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.1)] text-[#111] font-medium'
                                        : 'text-[#777] font-normal hover:text-[#444]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {w}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Corner radius */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Corner radius</span>
                              <div className="flex items-center gap-[10px]">
                                <input
                                  type="range"
                                  min={0}
                                  max={24}
                                  value={imageCornerRadius}
                                  onChange={(e) => setImageCornerRadius(Number(e.target.value))}
                                  className="flex-1 h-[3px] accent-[#111] cursor-pointer"
                                />
                                <span className="text-[12px] text-[#555] min-w-[20px] text-right" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                  {imageCornerRadius}
                                </span>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Video Configure panel â”€â”€ */}
        <AnimatePresence>
          {showVideoConfigPanel && (
            <motion.div
              key="video-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowVideoConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>VIDEO</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  {/* Field Settings */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setVideoSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: videoSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {videoSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            {/* Question */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={videoQuestion} onChange={(e) => setVideoQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            {/* Description */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Description</label>
                              <textarea value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} rows={2}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors resize-none" />
                            </div>
                            {/* Video Source */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Video Source</label>
                              <select value={videoSource} onChange={(e) => setVideoSource(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors">
                                <option value="youtube">YouTube</option>
                                <option value="vimeo">Vimeo</option>
                              </select>
                            </div>
                            {/* Video URL */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Video URL</label>
                              <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Paste YouTube or Vimeo URL"
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            {/* Caption */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Caption</label>
                              <input type="text" value={videoCaption} onChange={(e) => setVideoCaption(e.target.value)} placeholder="Optional caption"
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            {/* Toggles */}
                            {[
                              { label: 'Required', val: videoRequired, set: setVideoRequired },
                              { label: 'Hidden', val: videoHidden, set: setVideoHidden },
                              { label: 'Loop', val: videoLoop, set: setVideoLoop },
                              { label: 'Autoplay', val: videoAutoplay, set: setVideoAutoplay },
                              { label: 'Show controls', val: videoShowControls, set: setVideoShowControls },
                            ].map(({ label, val, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]">{label}</span>
                                <button onClick={() => set(!val)} className={`w-8 h-[18px] rounded-full transition-colors relative appearance-none border-0 p-0 ${val ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                  <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Appearance */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setVideoSections((p) => ({ ...p, appearance: !p.appearance }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>APPEARANCE</span>
                      <motion.span animate={{ rotate: videoSections.appearance ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {videoSections.appearance && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            {/* Width */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Width</label>
                              <div className="flex gap-1">
                                {['Full', 'Wide', 'Medium', 'Small'].map((w) => (
                                  <button key={w} onClick={() => setVideoWidth(w)}
                                    className={`flex-1 text-[11px] py-[6px] rounded-[5px] border transition-colors ${videoWidth === w ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    {w}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Aspect ratio */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Aspect Ratio</label>
                              <div className="flex gap-1">
                                {['16:9', '4:3', '1:1'].map((r) => (
                                  <button key={r} onClick={() => setVideoAspectRatio(r)}
                                    className={`flex-1 text-[11px] py-[6px] rounded-[5px] border transition-colors ${videoAspectRatio === r ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    {r}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Corner Radius */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-[6px]">Corner Radius: {videoCornerRadius}px</label>
                              <input type="range" min={0} max={24} value={videoCornerRadius} onChange={(e) => setVideoCornerRadius(Number(e.target.value))} className="w-full accent-[#111]" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Contact Configure panel â”€â”€ */}
        <AnimatePresence>
          {showContactConfigPanel && (
            <motion.div
              key="contact-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowContactConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>CONTACT</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  {/* Field Settings */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setContactSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: contactSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {contactSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={contactQuestion} onChange={(e) => setContactQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={contactHelperText} onChange={(e) => setContactHelperText(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Required</span>
                              <button onClick={() => setContactRequired(!contactRequired)} className={`w-8 h-[18px] rounded-full transition-colors relative appearance-none border-0 p-0 ${contactRequired ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${contactRequired ? 'left-[18px]' : 'left-[2px]'}`} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fields */}
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setContactSections((p) => ({ ...p, fields: !p.fields }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELDS</span>
                      <motion.span animate={{ rotate: contactSections.fields ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {contactSections.fields && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-2">
                            {[
                              { key: 'firstName', label: 'First Name' },
                              { key: 'lastName', label: 'Last Name' },
                              { key: 'email', label: 'Email Address' },
                              { key: 'phone', label: 'Phone' },
                              { key: 'company', label: 'Company' },
                            ].map(({ key, label }) => (
                              <div key={key} className="flex items-center justify-between py-[6px] border-b border-[rgba(0,0,0,0.05)] last:border-0">
                                <span className="text-[12px] text-[#333]">{label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-[#aaa]">Req</span>
                                  <button onClick={() => setContactFields((p) => ({ ...p, [key]: { ...p[key], required: !p[key].required } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative appearance-none border-0 p-0 ${contactFields[key]?.required ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-all ${contactFields[key]?.required ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                  <span className="text-[10px] text-[#aaa]">Show</span>
                                  <button onClick={() => setContactFields((p) => ({ ...p, [key]: { ...p[key], visible: !p[key].visible } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative appearance-none border-0 p-0 ${contactFields[key]?.visible !== false ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-all ${contactFields[key]?.visible !== false ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Address Configure panel â”€â”€ */}
        <AnimatePresence>
          {showAddressConfigPanel && (
            <motion.div
              key="address-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowAddressConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>ADDRESS</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setAddressSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: addressSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {addressSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={addressQuestion} onChange={(e) => setAddressQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={addressHelperText} onChange={(e) => setAddressHelperText(e.target.value)} placeholder="Optional helper text"
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Required</span>
                              <button onClick={() => setAddressRequired(!addressRequired)} className={`w-8 h-[18px] rounded-full transition-colors relative appearance-none border-0 p-0 ${addressRequired ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${addressRequired ? 'left-[18px]' : 'left-[2px]'}`} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setAddressSections((p) => ({ ...p, fields: !p.fields }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELDS</span>
                      <motion.span animate={{ rotate: addressSections.fields ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {addressSections.fields && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-2">
                            {[
                              { key: 'street', label: 'Street Address' },
                              { key: 'city', label: 'City' },
                              { key: 'state', label: 'State / Region' },
                              { key: 'postal', label: 'Postal Code' },
                              { key: 'country', label: 'Country' },
                            ].map(({ key, label }) => (
                              <div key={key} className="flex items-center justify-between py-[6px] border-b border-[rgba(0,0,0,0.05)] last:border-0">
                                <span className="text-[12px] text-[#333]">{label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-[#aaa]">Req</span>
                                  <button onClick={() => setAddressFields((p) => ({ ...p, [key]: { ...p[key], required: !p[key].required } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative appearance-none border-0 p-0 ${addressFields[key]?.required ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-all ${addressFields[key]?.required ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                  <span className="text-[10px] text-[#aaa]">Show</span>
                                  <button onClick={() => setAddressFields((p) => ({ ...p, [key]: { ...p[key], visible: !p[key].visible } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative appearance-none border-0 p-0 ${addressFields[key]?.visible !== false ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-all ${addressFields[key]?.visible !== false ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Work Info Configure panel â”€â”€ */}
        <AnimatePresence>
          {showWorkConfigPanel && (
            <motion.div
              key="work-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowWorkConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>WORK INFO</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setWorkSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: workSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {workSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={workQuestion} onChange={(e) => setWorkQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={workHelperText} onChange={(e) => setWorkHelperText(e.target.value)} placeholder="Optional helper text"
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Required</span>
                              <button onClick={() => setWorkRequired(!workRequired)} className={`w-8 h-[18px] rounded-full transition-colors relative appearance-none border-0 p-0 ${workRequired ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${workRequired ? 'left-[18px]' : 'left-[2px]'}`} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setWorkSections((p) => ({ ...p, fields: !p.fields }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELDS</span>
                      <motion.span animate={{ rotate: workSections.fields ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {workSections.fields && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-2">
                            {[
                              { key: 'company', label: 'Company' },
                              { key: 'title', label: 'Job Title' },
                              { key: 'industry', label: 'Industry' },
                              { key: 'teamSize', label: 'Team Size' },
                            ].map(({ key, label }) => (
                              <div key={key} className="flex items-center justify-between py-[6px] border-b border-[rgba(0,0,0,0.05)] last:border-0">
                                <span className="text-[12px] text-[#333]">{label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-[#aaa]">Req</span>
                                  <button onClick={() => setWorkFields((p) => ({ ...p, [key]: { ...p[key], required: !p[key].required } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative appearance-none border-0 p-0 ${workFields[key]?.required ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-all ${workFields[key]?.required ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                  <span className="text-[10px] text-[#aaa]">Show</span>
                                  <button onClick={() => setWorkFields((p) => ({ ...p, [key]: { ...p[key], visible: !p[key].visible } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative appearance-none border-0 p-0 ${workFields[key]?.visible !== false ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white transition-all ${workFields[key]?.visible !== false ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Date Configure panel â”€â”€ */}
        <AnimatePresence>
          {showDateConfigPanel && (
            <motion.div
              key="date-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowDateConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>DATE</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setDateSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: dateSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {dateSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={dateQuestion} onChange={(e) => setDateQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={dateHelperText} onChange={(e) => setDateHelperText(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Required</span>
                              <button onClick={() => setDateRequired(!dateRequired)} className={`w-8 h-[18px] rounded-full transition-colors relative appearance-none border-0 p-0 ${dateRequired ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${dateRequired ? 'left-[18px]' : 'left-[2px]'}`} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Time Configure panel â”€â”€ */}
        <AnimatePresence>
          {showTimeConfigPanel && (
            <motion.div
              key="time-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <TimeConfigurePanel
                onClose={() => setShowTimeConfigPanel(false)}
                sections={timeSections}
                setSections={setTimeSections}
                timeRequired={timeRequired}
                setTimeRequired={setTimeRequired}
                timeUse12h={timeUse12h}
                setTimeUse12h={setTimeUse12h}
                timeShowSeconds={timeShowSeconds}
                setTimeShowSeconds={setTimeShowSeconds}
                timeMinTime={timeMinTime}
                setTimeMinTime={setTimeMinTime}
                timeMaxTime={timeMaxTime}
                setTimeMaxTime={setTimeMaxTime}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Short Text Configure panel â”€â”€ */}
        <AnimatePresence>
          {showShortTextConfigPanel && (
            <motion.div
              key="shorttext-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowShortTextConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>SHORT TEXT</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setShortTextSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: shortTextSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {shortTextSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={shortTextQuestion} onChange={(e) => setShortTextQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={shortTextHelperText} onChange={(e) => setShortTextHelperText(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Placeholder</label>
                              <input type="text" value={shortTextPlaceholder} onChange={(e) => setShortTextPlaceholder(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Min chars</label>
                                <input type="number" min={0} value={shortTextMinChars} onChange={(e) => setShortTextMinChars(Number(e.target.value))}
                                  className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Max chars</label>
                                <input type="number" min={1} value={shortTextMaxChars} onChange={(e) => setShortTextMaxChars(Number(e.target.value))}
                                  className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Validation</label>
                              <select value={shortTextValidation} onChange={(e) => setShortTextValidation(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors">
                                {['None', 'Email', 'URL', 'Number', 'Phone'].map((v) => <option key={v}>{v}</option>)}
                              </select>
                            </div>
                            {[
                              { label: 'Required', val: shortTextRequired, set: setShortTextRequired },
                              { label: 'Hidden', val: shortTextHidden, set: setShortTextHidden },
                            ].map(({ label, val, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]">{label}</span>
                                <button onClick={() => set(!val)} className={`w-8 h-[18px] rounded-full transition-colors relative appearance-none border-0 p-0 ${val ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                  <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setShortTextSections((p) => ({ ...p, appearance: !p.appearance }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>APPEARANCE</span>
                      <motion.span animate={{ rotate: shortTextSections.appearance ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {shortTextSections.appearance && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Size</label>
                              <div className="flex gap-1">
                                {['S', 'M', 'L'].map((s) => (
                                  <button key={s} onClick={() => setShortTextSize(s)}
                                    className={`flex-1 text-[11px] py-[6px] rounded-[5px] border transition-colors ${shortTextSize === s ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Alignment</label>
                              <div className="flex gap-1">
                                {[{ v: 'left', Icon: RiAlignLeft }, { v: 'center', Icon: RiAlignCenter }, { v: 'right', Icon: RiAlignRight }].map(({ v, Icon }) => (
                                  <button key={v} onClick={() => setShortTextAlign(v)}
                                    className={`flex-1 text-[14px] py-[5px] rounded-[5px] border transition-colors ${shortTextAlign === v ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    <Icon size={14} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Long Text Configure panel â”€â”€ */}
        <AnimatePresence>
          {showLongTextConfigPanel && (
            <motion.div
              key="longtext-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowLongTextConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>LONG TEXT</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setLongTextSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: longTextSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {longTextSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={longTextQuestion} onChange={(e) => setLongTextQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={longTextHelperText} onChange={(e) => setLongTextHelperText(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Placeholder</label>
                              <input type="text" value={longTextPlaceholder} onChange={(e) => setLongTextPlaceholder(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Min chars</label>
                                <input type="number" min={0} value={longTextMinChars} onChange={(e) => setLongTextMinChars(Number(e.target.value))}
                                  className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                              </div>
                              <div>
                                <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Max chars</label>
                                <input type="number" min={1} value={longTextMaxChars} onChange={(e) => setLongTextMaxChars(Number(e.target.value))}
                                  className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Validation</label>
                              <select value={longTextValidation} onChange={(e) => setLongTextValidation(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors">
                                {['None', 'Email', 'URL'].map((v) => <option key={v}>{v}</option>)}
                              </select>
                            </div>
                            {[
                              { label: 'Required', val: longTextRequired, set: setLongTextRequired },
                              { label: 'Hidden', val: longTextHidden, set: setLongTextHidden },
                            ].map(({ label, val, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]">{label}</span>
                                <button onClick={() => set(!val)} className={`w-8 h-[18px] rounded-full transition-colors relative appearance-none border-0 p-0 ${val ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                  <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setLongTextSections((p) => ({ ...p, appearance: !p.appearance }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>APPEARANCE</span>
                      <motion.span animate={{ rotate: longTextSections.appearance ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {longTextSections.appearance && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Size</label>
                              <div className="flex gap-1">
                                {['S', 'M', 'L'].map((s) => (
                                  <button key={s} onClick={() => setLongTextSize(s)}
                                    className={`flex-1 text-[11px] py-[6px] rounded-[5px] border transition-colors ${longTextSize === s ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Alignment</label>
                              <div className="flex gap-1">
                                {[{ v: 'left', Icon: RiAlignLeft }, { v: 'center', Icon: RiAlignCenter }, { v: 'right', Icon: RiAlignRight }].map(({ v, Icon }) => (
                                  <button key={v} onClick={() => setLongTextAlign(v)}
                                    className={`flex-1 text-[14px] py-[5px] rounded-[5px] border transition-colors ${longTextAlign === v ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    <Icon size={14} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setLongTextSections((p) => ({ ...p, responseQuality: !p.responseQuality }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>RESPONSE QUALITY SCORING</span>
                      <motion.span animate={{ rotate: longTextSections.responseQuality ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {longTextSections.responseQuality && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden w-full">
                          <div className="w-full">
                            <ResponseQualityScoringCard
                              enabled={responseQualityEnabled}
                              onEnabledChange={setResponseQualityEnabled}
                              options={responseQualityOptions}
                              onOptionsChange={setResponseQualityOptions}
                              onSave={() => {}}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Single Choice Configure panel â”€â”€ */}
        <AnimatePresence>
          {showSingleConfigPanel && (
            <motion.div
              key="single-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowSingleConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* FIELD SETTINGS section */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button onClick={() => setSingleSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: singleSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {singleSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 pt-[6px] flex flex-col gap-3">
                            {/* Question */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={singleQuestion} onChange={(e) => setSingleQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            {/* Helper text */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={singleHelperText} onChange={(e) => setSingleHelperText(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            {/* Options */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Options</label>
                              <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-[2px]">
                                {singleOptions.map((opt, i) => (
                                  <div key={i} className="flex gap-1 items-center">
                                    <input type="text" value={opt}
                                      onChange={(e) => setSingleOptions((prev) => prev.map((o, idx) => idx === i ? e.target.value : o))}
                                      className="flex-1 border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[6px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                                    <button onClick={() => setSingleOptions((prev) => prev.filter((_, idx) => idx !== i))}
                                      className="text-[#d63030] text-[16px] leading-none px-1 cursor-pointer hover:text-[#b02020] shrink-0">Ã—</button>
                                  </div>
                                ))}
                              </div>
                              <button onClick={() => setSingleOptions((prev) => [...prev, `Option ${prev.length + 1}`])}
                                className="w-full text-[11px] text-[#555] border border-dashed border-[rgba(0,0,0,0.15)] rounded-[6px] py-[6px] mt-1 cursor-pointer hover:border-[#999] transition-colors">
                                + Add option
                              </button>
                            </div>
                            {/* Toggles */}
                            {[
                              { label: 'Required', val: singleRequired, set: setSingleRequired },
                              { label: 'Multiple select', val: singleMultipleSelect, set: setSingleMultipleSelect },
                              { label: 'Randomise order', val: singleRandomize, set: setSingleRandomize },
                              { label: 'Allow "Other"', val: singleAllowOther, set: setSingleAllowOther },
                            ].map(({ label, val, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                                <button
                                  onClick={() => set(!val)}
                                  className="relative shrink-0 transition-colors"
                                  style={{ width: 34, height: 20, borderRadius: 10, background: val ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF, padding: 3, display: 'flex', alignItems: 'center', justifyContent: val ? 'flex-end' : 'flex-start' }}
                                >
                                  <span style={{ width: 14, height: 14, borderRadius: 7, background: 'white', display: 'block' }} />
                                </button>
                              </div>
                            ))}
                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />
                            {/* Min / Max choices */}
                            {[
                              { label: 'Min choices', val: singleMinChoices, set: setSingleMinChoices, isInfinite: false },
                              { label: 'Max choices', val: singleMaxChoices, set: setSingleMaxChoices, isInfinite: true },
                            ].map(({ label, val, set, isInfinite }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                                <div className="flex items-center gap-[6px] bg-[rgba(0,0,0,0.04)] rounded-[7px] px-[6px] py-[4px]">
                                  <button
                                    onClick={() => set((p) => {
                                      if (isInfinite && p === null) return singleOptions.length;
                                      return Math.max(0, (p ?? 0) - 1);
                                    })}
                                    className="w-[20px] h-[20px] bg-[rgba(255,255,255,0.8)] rounded-[5px] flex items-center justify-center text-[#444] text-[14px] leading-none cursor-pointer hover:bg-white transition-colors shrink-0"
                                  >âˆ’</button>
                                  <span className="min-w-[28px] text-center text-[13px] font-medium text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {isInfinite && val === null ? 'âˆž' : val}
                                  </span>
                                  <button
                                    onClick={() => set((p) => {
                                      if (isInfinite && p === null) return null;
                                      const next = (p ?? 0) + 1;
                                      if (isInfinite && next > singleOptions.length + 2) return null;
                                      return next;
                                    })}
                                    className="w-[20px] h-[20px] bg-[rgba(255,255,255,0.8)] rounded-[5px] flex items-center justify-center text-[#444] text-[14px] leading-none cursor-pointer hover:bg-white transition-colors shrink-0"
                                  >+</button>
                                </div>
                              </div>
                            ))}
                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />
                            {/* Show keyboard hints */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Show keyboard hints</span>
                              <button
                                onClick={() => setSingleShowKeyboardHints(!singleShowKeyboardHints)}
                                className="relative shrink-0 transition-colors"
                                style={{ width: 34, height: 20, borderRadius: 10, background: singleShowKeyboardHints ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF, padding: 3, display: 'flex', alignItems: 'center', justifyContent: singleShowKeyboardHints ? 'flex-end' : 'flex-start' }}
                              >
                                <span style={{ width: 14, height: 14, borderRadius: 7, background: 'white', display: 'block' }} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* APPEARANCE section */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button onClick={() => setSingleSections((p) => ({ ...p, appearance: !p.appearance }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>APPEARANCE</span>
                      <motion.span animate={{ rotate: singleSections.appearance ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {singleSections.appearance && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 pt-[6px] flex flex-col gap-3">
                            {/* Layout */}
                            <div>
                              <label className="text-[12px] text-[#444] block mb-[6px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Layout</label>
                              <div className="bg-[rgba(0,0,0,0.04)] p-[2px] rounded-[7px] grid grid-cols-3 gap-[2px]">
                                {['List', '2 col', '3 col'].map((l) => {
                                  const val = l === '2 col' ? '2col' : l === '3 col' ? '3col' : 'List';
                                  const active = singleLayout === val;
                                  return (
                                    <button key={l} onClick={() => setSingleLayout(val)}
                                      className={`text-[11.5px] py-[6px] rounded-[5px] transition-colors ${active ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-sm' : 'text-[#777]'}`}
                                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                      {l}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            {/* Option height */}
                            <div className="flex items-center justify-between">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Option height</label>
                              <div className="bg-[rgba(0,0,0,0.04)] p-[2px] rounded-[7px] grid grid-cols-3 gap-[2px] w-[108px]">
                                {['S', 'M', 'L'].map((s) => {
                                  const active = singleOptionHeight === s;
                                  return (
                                    <button key={s} onClick={() => setSingleOptionHeight(s)}
                                      className={`text-[11.5px] py-[6px] rounded-[5px] transition-colors ${active ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-sm' : 'text-[#777]'}`}
                                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                      {s}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Multiple Choice Configure panel â”€â”€ */}
        <AnimatePresence>
          {showMultipleConfigPanel && (
            <motion.div
              key="multiple-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>

                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button
                    onClick={() => setShowMultipleConfigPanel(false)}
                    className="w-[20px] h-[20px] bg-[#f0eeea] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors"
                  >
                    <RiCloseLine size={11} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ FIELD SETTINGS â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setMultipleSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span
                        animate={{ rotate: multipleSections.fieldSettings ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {multipleSections.fieldSettings && (
                        <motion.div
                          key="multiple-field-settings"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="px-4 pt-[6px] pb-[14px] flex flex-col gap-[12px]">

                            {/* Toggle rows */}
                            {[
                              { label: 'Required', val: multipleRequired, set: setMultipleRequired },
                              { label: 'Multiple select', val: multipleMultipleSelect, set: setMultipleMultipleSelect },
                              { label: 'Randomise order', val: multipleRandomize, set: setMultipleRandomize },
                              { label: 'Allow "Other"', val: multipleAllowOther, set: setMultipleAllowOther },
                            ].map(({ label, val, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                                <button
                                  onClick={() => set(!val)}
                                  className="relative shrink-0 transition-colors"
                                  style={{ width: 34, height: 20, borderRadius: 10, background: val ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF, padding: 3, display: 'flex', alignItems: 'center', justifyContent: val ? 'flex-end' : 'flex-start' }}
                                >
                                  <span style={{ width: 14, height: 14, borderRadius: 7, background: 'white', display: 'block' }} />
                                </button>
                              </div>
                            ))}

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Min / Max choices steppers */}
                            {[
                              { label: 'Min choices', val: multipleMinChoices, set: setMultipleMinChoices, isInfinite: false },
                              { label: 'Max choices', val: multipleMaxChoices, set: setMultipleMaxChoices, isInfinite: true },
                            ].map(({ label, val, set, isInfinite }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                                <div className="flex items-center gap-[6px] bg-[rgba(0,0,0,0.04)] rounded-[7px] px-[6px] py-[4px]">
                                  <button
                                    onClick={() => set((p) => {
                                      if (isInfinite && p === null) return multipleOptions.length;
                                      return Math.max(0, (p ?? 0) - 1);
                                    })}
                                    className="w-[20px] h-[20px] bg-[rgba(255,255,255,0.8)] rounded-[5px] flex items-center justify-center text-[#444] text-[14px] leading-none cursor-pointer hover:bg-white transition-colors shrink-0"
                                  >âˆ’</button>
                                  <span className="min-w-[28px] text-center text-[13px] font-medium text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {isInfinite && val === null ? 'âˆž' : val}
                                  </span>
                                  <button
                                    onClick={() => set((p) => {
                                      if (isInfinite && p === null) return null;
                                      const next = (p ?? 0) + 1;
                                      if (isInfinite && next > multipleOptions.length + 2) return null;
                                      return next;
                                    })}
                                    className="w-[20px] h-[20px] bg-[rgba(255,255,255,0.8)] rounded-[5px] flex items-center justify-center text-[#444] text-[14px] leading-none cursor-pointer hover:bg-white transition-colors shrink-0"
                                  >+</button>
                                </div>
                              </div>
                            ))}

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Show keyboard hints */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Show keyboard hints</span>
                              <button
                                onClick={() => setMultipleShowKeyboardHints(!multipleShowKeyboardHints)}
                                className="relative shrink-0 transition-colors"
                                style={{ width: 34, height: 20, borderRadius: 10, background: multipleShowKeyboardHints ? TOGGLE_TRACK_ON : TOGGLE_TRACK_OFF, padding: 3, display: 'flex', alignItems: 'center', justifyContent: multipleShowKeyboardHints ? 'flex-end' : 'flex-start' }}
                              >
                                <span style={{ width: 14, height: 14, borderRadius: 7, background: 'white', display: 'block' }} />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ OPTIONS â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setMultipleSections((p) => ({ ...p, options: !p.options }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>OPTIONS</span>
                      <motion.span
                        animate={{ rotate: multipleSections.options ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {multipleSections.options && (
                        <motion.div
                          key="multiple-options"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="px-4 pt-[6px] pb-[14px] flex flex-col gap-[8px]">
                            {/* Question */}
                            <div className="flex flex-col gap-[5px]">
                              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Question</label>
                              <input
                                type="text"
                                value={multipleQuestion}
                                onChange={(e) => setMultipleQuestion(e.target.value)}
                                className="w-full bg-white border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] text-[#111] outline-none focus:border-[rgba(0,0,0,0.3)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>
                            {/* Helper text */}
                            <div className="flex flex-col gap-[5px]">
                              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Helper text</label>
                              <input
                                type="text"
                                value={multipleHelperText}
                                onChange={(e) => setMultipleHelperText(e.target.value)}
                                placeholder="Optional helper text"
                                className="w-full bg-white border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] text-[#111] placeholder-[#bbb] outline-none focus:border-[rgba(0,0,0,0.3)] transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>
                            {/* Options list â€“ scrollable */}
                            <div className="flex flex-col gap-[6px] max-h-[200px] overflow-y-auto pr-[2px]">
                              {multipleOptions.map((opt, i) => (
                                <div key={i} className="flex gap-[6px] items-center">
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => setMultipleOptions((prev) => prev.map((o, idx) => idx === i ? e.target.value : o))}
                                    className="flex-1 bg-white border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[6px] text-[12px] text-[#111] outline-none focus:border-[rgba(0,0,0,0.3)] transition-colors"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  />
                                  <button
                                    onClick={() => setMultipleOptions((prev) => prev.filter((_, idx) => idx !== i))}
                                    className="w-[22px] h-[22px] flex items-center justify-center text-[#bbb] text-[15px] leading-none cursor-pointer hover:text-[#d63030] transition-colors shrink-0"
                                  >Ã—</button>
                                </div>
                              ))}
                            </div>
                            {/* Add option button */}
                            <button
                              onClick={() => setMultipleOptions((prev) => [...prev, `Option ${prev.length + 1}`])}
                              className="w-full text-[11.5px] text-[#555] border border-dashed border-[rgba(0,0,0,0.15)] rounded-[6px] py-[7px] cursor-pointer hover:border-[rgba(0,0,0,0.3)] hover:text-[#111] transition-colors"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              + Add option
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ APPEARANCE â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setMultipleSections((p) => ({ ...p, appearance: !p.appearance }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>APPEARANCE</span>
                      <motion.span
                        animate={{ rotate: multipleSections.appearance ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex items-center shrink-0"
                      >
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {multipleSections.appearance && (
                        <motion.div
                          key="multiple-appearance"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="px-4 pt-[6px] pb-[14px] flex flex-col gap-[12px]">

                            {/* Layout */}
                            <div className="flex flex-col gap-[8px]">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Layout</label>
                              <div className="bg-[rgba(0,0,0,0.04)] p-[2px] rounded-[7px] grid grid-cols-3 gap-[2px]">
                                {[
                                  { label: 'List', val: 'List' },
                                  { label: '2 col', val: '2col' },
                                  { label: '3 col', val: '3col' },
                                ].map(({ label, val }) => {
                                  const active = multipleLayout === val;
                                  return (
                                    <button
                                      key={val}
                                      onClick={() => setMultipleLayout(val)}
                                      className={`text-[11.5px] py-[6px] rounded-[5px] transition-colors ${active ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-sm' : 'text-[#777]'}`}
                                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Option height */}
                            <div className="flex items-center justify-between">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Option height</label>
                              <div className="bg-[rgba(0,0,0,0.04)] p-[2px] rounded-[7px] grid grid-cols-3 gap-[2px] w-[108px]">
                                {['S', 'M', 'L'].map((s) => {
                                  const active = multipleOptionHeight === s;
                                  return (
                                    <button
                                      key={s}
                                      onClick={() => setMultipleOptionHeight(s)}
                                      className={`text-[11.5px] py-[6px] rounded-[5px] transition-colors ${active ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-sm' : 'text-[#777]'}`}
                                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    >
                                      {s}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Media Choices Configure panel â”€â”€ */}
        <AnimatePresence>
          {showMediaConfigPanel && (
            <motion.div
              key="media-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 300 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[300px] h-full bg-white border-l border-[#f0f0f0] flex flex-col" style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.08), 0px 0px 0px 1px rgba(0,0,0,0.06)' }}>
                {/* Header */}
                <div className="border-b border-[#f0f0f0] flex items-center justify-between px-4 py-[15px] shrink-0">
                  <span className="text-[14px] font-bold text-[#111] tracking-[-0.14px]" style={{ fontFamily: 'Arial, sans-serif' }}>Configure</span>
                  <button onClick={() => setShowMediaConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e8e8e8] transition-colors">
                    <RiCloseLine size={12} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>
                {/* Section label */}
                <div className="px-4 pt-[6px] pb-[10px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: 'Arial, sans-serif' }}>MEDIA CHOICE</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ FIELD SETTINGS â”€â”€ */}
                  <div className="border-t border-[#f0f0f0]">
                    <button onClick={() => setMediaSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[10px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: 'Arial, sans-serif' }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: mediaSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {mediaSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pt-1 pb-4 flex flex-col">
                            {/* Toggles */}
                            {[
                              { label: 'Required', val: mediaRequired, set: setMediaRequired },
                              { label: 'Multiple select', val: mediaAllowMultiple, set: setMediaAllowMultiple },
                              { label: 'Randomise order', val: mediaRandomiseOrder, set: setMediaRandomiseOrder },
                            ].map(({ label, val, set }, idx, arr) => (
                              <div key={label} className={`flex items-center justify-between py-[8px] ${idx < arr.length - 1 ? 'border-b border-[#f5f5f5]' : ''}`}>
                                <span className="text-[13px] text-[#222]" style={{ fontFamily: 'Arial, sans-serif' }}>{label}</span>
                                <button onClick={() => set(!val)} className={`w-9 h-5 rounded-[10px] transition-colors relative shrink-0 ${val ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                  <span className={`absolute top-[2px] w-4 h-4 rounded-[8px] bg-white transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
                                </button>
                              </div>
                            ))}
                            {/* Question */}
                            <div className="flex flex-col gap-[5px] pt-3">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Question</label>
                              <input type="text" value={mediaQuestion} onChange={(e) => setMediaQuestion(e.target.value)}
                                placeholder="Which image do you prefer?"
                                className="w-full border border-[#e8e8e8] rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#fafafa] outline-none focus:border-[#111] transition-colors" style={{ fontFamily: 'Arial, sans-serif' }} />
                            </div>
                            {/* Helper text */}
                            <div className="flex flex-col gap-[5px] pt-3">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Helper text</label>
                              <input type="text" value={mediaHelperText} onChange={(e) => setMediaHelperText(e.target.value)}
                                placeholder="Press Enter to continue"
                                className="w-full border border-[#e8e8e8] rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#fafafa] outline-none focus:border-[#111] transition-colors" style={{ fontFamily: 'Arial, sans-serif' }} />
                            </div>
                            {/* Min choices */}
                            <div className="flex flex-col gap-[5px] pt-3">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Min choices</label>
                              <div className="flex items-center gap-[10px]">
                                <button onClick={() => setMediaMinChoices((v) => Math.max(1, v - 1))}
                                  className="w-[26px] h-[26px] border border-[#e0e0e0] rounded-[6px] bg-white flex items-center justify-center text-[#555] text-[16px] leading-none cursor-pointer hover:border-[#999] transition-colors">âˆ’</button>
                                <span className="text-[13px] text-[#222] text-center min-w-[24px]" style={{ fontFamily: 'Arial, sans-serif' }}>{mediaMinChoices}</span>
                                <button onClick={() => setMediaMinChoices((v) => mediaMaxChoices === null ? v + 1 : Math.min(mediaMaxChoices, v + 1))}
                                  className="w-[26px] h-[26px] border border-[#e0e0e0] rounded-[6px] bg-white flex items-center justify-center text-[#555] text-[16px] leading-none cursor-pointer hover:border-[#999] transition-colors">+</button>
                              </div>
                            </div>
                            {/* Max choices */}
                            <div className="flex flex-col gap-[5px] pt-3">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Max choices</label>
                              <div className="flex items-center gap-[10px]">
                                <button onClick={() => setMediaMaxChoices((v) => v === null ? mediaOptions.length : Math.max(mediaMinChoices, v - 1))}
                                  className="w-[26px] h-[26px] border border-[#e0e0e0] rounded-[6px] bg-white flex items-center justify-center text-[#555] text-[16px] leading-none cursor-pointer hover:border-[#999] transition-colors">âˆ’</button>
                                <span className="text-[13px] text-[#222] text-center min-w-[24px]" style={{ fontFamily: 'Arial, sans-serif' }}>{mediaMaxChoices === null ? 'âˆž' : mediaMaxChoices}</span>
                                <button onClick={() => setMediaMaxChoices((v) => v === null ? null : (v >= mediaOptions.length ? null : v + 1))}
                                  className="w-[26px] h-[26px] border border-[#e0e0e0] rounded-[6px] bg-white flex items-center justify-center text-[#555] text-[16px] leading-none cursor-pointer hover:border-[#999] transition-colors">+</button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ OPTIONS â”€â”€ */}
                  <div className="border-t border-[#f0f0f0]">
                    <button onClick={() => setMediaSections((p) => ({ ...p, options: !p.options }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[10px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: 'Arial, sans-serif' }}>OPTIONS</span>
                      <motion.span animate={{ rotate: mediaSections.options ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {mediaSections.options && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pt-1 pb-4 flex flex-col gap-2">
                            {mediaOptions.map((opt, i) => (
                              <div key={i} className="border border-[#ebebeb] rounded-[8px] p-[11px] flex flex-col gap-2">
                                {/* Image upload area */}
                                <label className="block cursor-pointer">
                                  <input type="file" accept="image/*" className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const url = URL.createObjectURL(file);
                                        setMediaOptions((prev) => prev.map((o, idx) => idx === i ? { ...o, image: url } : o));
                                      }
                                      e.target.value = '';
                                    }} />
                                  {opt.image ? (
                                    <div className="relative rounded-[8px] overflow-hidden border border-[#d0d0d0]">
                                      <img src={opt.image} alt={opt.label} className="w-full object-cover" style={{ aspectRatio: '16/4' }} />
                                      <button
                                        onClick={(e) => { e.preventDefault(); setMediaOptions((prev) => prev.map((o, idx) => idx === i ? { ...o, image: null } : o)); }}
                                        className="absolute top-1 right-1 w-[18px] h-[18px] bg-black/50 rounded-full flex items-center justify-center text-white text-[10px] hover:bg-black/70 transition-colors">Ã—</button>
                                    </div>
                                  ) : (
                                    <div className="bg-[#fafafa] border border-dashed border-[#d0d0d0] rounded-[8px] py-[12px] flex items-center justify-center hover:border-[#999] hover:bg-[#f5f5f5] transition-colors">
                                      <span className="text-[13px] text-[#ccc]" style={{ fontFamily: 'Arial, sans-serif' }}>ðŸ–¼ Upload image</span>
                                    </div>
                                  )}
                                </label>
                                {/* Label input + delete */}
                                <div className="flex items-center gap-2">
                                  <input type="text" value={opt.label}
                                    onChange={(e) => setMediaOptions((prev) => prev.map((o, idx) => idx === i ? { ...o, label: e.target.value } : o))}
                                    placeholder="Option label..."
                                    className="flex-1 border border-[#e8e8e8] rounded-[7px] px-[11px] py-[9px] text-[13px] bg-[#fafafa] outline-none focus:border-[#111] transition-colors" style={{ fontFamily: 'Arial, sans-serif' }} />
                                  {mediaOptions.length > 1 && (
                                    <button onClick={() => setMediaOptions((prev) => prev.filter((_, idx) => idx !== i))}
                                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[#d63030] hover:bg-red-50 transition-colors shrink-0 text-[14px] leading-none">Ã—</button>
                                  )}
                                </div>
                              </div>
                            ))}
                            <button onClick={() => setMediaOptions((prev) => [...prev, { label: '', image: null }])}
                              className="border border-dashed border-[#d0d0d0] rounded-[7px] py-[10px] text-[12px] text-[#888] text-center cursor-pointer hover:border-[#999] hover:text-[#555] transition-colors w-full" style={{ fontFamily: 'Arial, sans-serif' }}>
                              + Add option
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ CONDITIONAL LOGIC â”€â”€ */}
                  <div className="border-t border-[#f0f0f0]">
                    <button onClick={() => setMediaSections((p) => ({ ...p, conditionalLogic: !p.conditionalLogic }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[10px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: 'Arial, sans-serif' }}>CONDITIONAL LOGIC</span>
                      <motion.span animate={{ rotate: mediaSections.conditionalLogic ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {mediaSections.conditionalLogic && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pt-1 pb-4">
                            <div className="bg-[#f8f8f8] rounded-[8px] px-3 py-[10px] flex flex-col gap-[6px]">
                              <span className="text-[11px] font-bold tracking-[0.55px] uppercase text-[#aaa]" style={{ fontFamily: 'Arial, sans-serif' }}>SHOW THIS BLOCK IF</span>
                              <button className="flex items-center gap-[5px] text-[12px] text-[#555] cursor-pointer hover:text-[#111] transition-colors" style={{ fontFamily: 'Arial, sans-serif' }}>
                                <span className="text-[14px] leading-none">âŠ•</span>
                                <span>Add condition</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ APPEARANCE â”€â”€ */}
                  <div className="border-t border-[#f0f0f0]">
                    <button onClick={() => setMediaSections((p) => ({ ...p, appearance: !p.appearance }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[10px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: 'Arial, sans-serif' }}>APPEARANCE</span>
                      <motion.span animate={{ rotate: mediaSections.appearance ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {mediaSections.appearance && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pt-1 pb-4 flex flex-col gap-3">
                            {/* Layout picker */}
                            <div className="flex flex-col gap-[5px]">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Layout</label>
                              <div className="flex gap-2">
                                {/* List */}
                                <button onClick={() => setMediaLayout('list')}
                                  className={`flex-1 flex flex-col items-center gap-1 py-[9px] px-2 rounded-[7px] border transition-colors ${mediaLayout === 'list' ? 'border-[#111]' : 'border-[#e0e0e0]'}`}>
                                  <div className="flex flex-col gap-[3px] w-full">
                                    {[0,1,2].map((k) => <div key={k} className={`h-1 rounded-[2px] w-full ${mediaLayout === 'list' ? 'bg-[#bbb]' : 'bg-[#e0e0e0]'}`} />)}
                                  </div>
                                  <span className={`text-[10px] ${mediaLayout === 'list' ? 'text-[#111]' : 'text-[#888]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>List</span>
                                </button>
                                {/* 2 col */}
                                <button onClick={() => setMediaLayout('2col')}
                                  className={`flex-1 flex flex-col items-center gap-1 py-[9px] px-2 rounded-[7px] border transition-colors ${mediaLayout === '2col' ? 'border-[#111]' : 'border-[#e0e0e0]'}`}>
                                  <div className="grid grid-cols-2 gap-[3px] w-full">
                                    {[0,1,2,3].map((k) => <div key={k} className={`h-3 rounded-[2px] ${mediaLayout === '2col' ? 'bg-[#bbb]' : 'bg-[#e0e0e0]'}`} />)}
                                  </div>
                                  <span className={`text-[10px] ${mediaLayout === '2col' ? 'text-[#111]' : 'text-[#888]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>2 col</span>
                                </button>
                                {/* 3 col */}
                                <button onClick={() => setMediaLayout('3col')}
                                  className={`flex-1 flex flex-col items-center gap-1 py-[9px] px-2 rounded-[7px] border transition-colors ${mediaLayout === '3col' ? 'border-[#111]' : 'border-[#e0e0e0]'}`}>
                                  <div className="grid grid-cols-3 gap-[3px] w-full">
                                    {[0,1,2,3,4,5].map((k) => <div key={k} className={`h-3 rounded-[2px] ${mediaLayout === '3col' ? 'bg-[#bbb]' : 'bg-[#e0e0e0]'}`} />)}
                                  </div>
                                  <span className={`text-[10px] ${mediaLayout === '3col' ? 'text-[#111]' : 'text-[#888]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>3 col</span>
                                </button>
                              </div>
                            </div>
                            {/* Option height */}
                            <div className="flex flex-col gap-[5px]">
                              <label className="text-[12px] text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Option height</label>
                              <div className="flex gap-[6px]">
                                {['S', 'M', 'L'].map((size) => (
                                  <button key={size} onClick={() => setMediaOptionHeight(size)}
                                    className={`w-8 h-[28px] border rounded-[6px] text-[12px] transition-colors ${mediaOptionHeight === size ? 'border-[#111] text-[#111]' : 'border-[#e0e0e0] text-[#777] hover:border-[#999]'}`}
                                    style={{ fontFamily: 'Arial, sans-serif' }}>
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Map Configure panel â”€â”€ */}
        <AnimatePresence>
          {showMapConfigPanel && (
            <motion.div
              key="map-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <MapConfigurePanel
                onClose={() => setShowMapConfigPanel(false)}
                sections={mapSections}
                setSections={setMapSections}
                mapRequired={mapRequired}
                setMapRequired={setMapRequired}
                mapHidden={mapHidden}
                setMapHidden={setMapHidden}
                mapQuestion={mapQuestion}
                setMapQuestion={setMapQuestion}
                mapHelperText={mapHelperText}
                setMapHelperText={setMapHelperText}
                mapDefaultLat={mapDefaultLat}
                setMapDefaultLat={setMapDefaultLat}
                mapDefaultLng={mapDefaultLng}
                setMapDefaultLng={setMapDefaultLng}
                mapDefaultAddress={mapDefaultAddress}
                setMapDefaultAddress={setMapDefaultAddress}
                mapZoom={mapZoom}
                setMapZoom={setMapZoom}
                mapAllowPinMovement={mapAllowPinMovement}
                setMapAllowPinMovement={setMapAllowPinMovement}
                mapShowSearchBar={mapShowSearchBar}
                setMapShowSearchBar={setMapShowSearchBar}
                mapRestrictRadius={mapRestrictRadius}
                setMapRestrictRadius={setMapRestrictRadius}
                mapPinLabel={mapPinLabel}
                setMapPinLabel={setMapPinLabel}
                mapHeight={mapHeight}
                setMapHeight={setMapHeight}
                mapType={mapType}
                setMapType={setMapType}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Captcha Configure panel â”€â”€ */}
        <AnimatePresence>
          {showCaptchaConfigPanel && (
            <motion.div
              key="captcha-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>

                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowCaptchaConfigPanel(false)} className="w-[20px] h-[20px] bg-[#f0eeea] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={12} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ FIELD SETTINGS â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setCaptchaSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: captchaSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {captchaSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-[14px] pt-[2px] flex flex-col gap-3">

                            {/* Enabled toggle */}
                            <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-[10px]">
                              <span className="text-[12px] text-[#222]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Enabled</span>
                              <button
                                onClick={() => setCaptchaEnabled((v) => !v)}
                                className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors appearance-none border-0 p-0 ${captchaEnabled ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}
                              >
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white transition-all ${captchaEnabled ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                            {/* Provider radio list */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Provider</span>
                              {[
                                { id: 'Google reCAPTCHA v3', subtitle: 'Invisible, score-based' },
                                { id: 'Google reCAPTCHA v2', subtitle: 'Checkbox "I\'m not a robot"' },
                                { id: 'hCaptcha', subtitle: 'Privacy-friendly alternative' },
                                { id: 'Cloudflare Turnstile', subtitle: 'Invisible, no challenges' },
                              ].map(({ id, subtitle }) => {
                                const selected = captchaProvider === id;
                                return (
                                  <button
                                    key={id}
                                    onClick={() => setCaptchaProvider(id)}
                                    className={`flex items-center gap-[10px] px-[13px] py-[10px] rounded-[8px] border text-left w-full cursor-pointer transition-colors ${
                                      selected
                                        ? 'bg-[#fafafa] border-[#111]'
                                        : 'bg-transparent border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.25)]'
                                    }`}
                                  >
                                    {/* Radio dot */}
                                    <div className={`w-[14px] h-[14px] rounded-[4px] border shrink-0 flex items-center justify-center transition-colors ${
                                      selected ? 'border-[#111]' : 'border-[#ccc]'
                                    }`}>
                                      {selected && <div className="w-[6px] h-[6px] rounded-[2px] bg-[#111]" />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[12px] text-[#222] leading-[1.3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{id}</span>
                                      <span className="text-[10.5px] text-[#aaa] leading-[1.3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{subtitle}</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.07)]" />

                            {/* Site key */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Site key</span>
                              <input
                                type="text"
                                value={captchaSiteKey}
                                onChange={(e) => setCaptchaSiteKey(e.target.value)}
                                placeholder="Enter your site key..."
                                className="w-full border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[12px] bg-[#fafafa] outline-none focus:border-[#111] focus:bg-white transition-colors placeholder:text-[#bbb]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                            {/* Secret key */}
                            <div className="flex flex-col gap-[5px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Secret key</span>
                              <input
                                type="password"
                                value={captchaSecretKey}
                                onChange={(e) => setCaptchaSecretKey(e.target.value)}
                                placeholder="Enter your secret key..."
                                className="w-full border border-[#e8e8e8] rounded-[7px] px-[11px] py-[8px] text-[12px] bg-[#fafafa] outline-none focus:border-[#111] focus:bg-white transition-colors placeholder:text-[#bbb]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              />
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ BEHAVIOUR â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setCaptchaSections((p) => ({ ...p, behaviour: !p.behaviour }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>BEHAVIOUR</span>
                      <motion.span animate={{ rotate: captchaSections.behaviour ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {captchaSections.behaviour && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-[14px] pt-[6px] flex flex-col gap-3">

                            {/* Visibility mode segmented */}
                            <div className="flex flex-col gap-[6px]">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Visibility mode</span>
                              <div className="bg-[rgba(0,0,0,0.04)] rounded-[7px] p-[2px] grid grid-cols-2 gap-[2px]">
                                {['invisible', 'visible'].map((v) => (
                                  <button
                                    key={v}
                                    onClick={() => setCaptchaVisibility(v)}
                                    className={`py-[6px] rounded-[5px] text-[11.5px] capitalize text-center cursor-pointer transition-colors ${
                                      captchaVisibility === v
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                        : 'text-[#777] hover:text-[#444]'
                                    }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {v.charAt(0).toUpperCase() + v.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.07)]" />

                            {/* Show badge toggle */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Show badge</span>
                              <button
                                onClick={() => setCaptchaShowBadge((v) => !v)}
                                className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors appearance-none border-0 p-0 ${captchaShowBadge ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}
                              >
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white transition-all ${captchaShowBadge ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                            {/* Badge position â€” only visible when badge is shown */}
                            <AnimatePresence initial={false}>
                              {captchaShowBadge && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden flex flex-col gap-[6px]">
                                  <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Badge position</span>
                                  <div className="bg-[rgba(0,0,0,0.04)] rounded-[7px] p-[2px] grid grid-cols-3 gap-[2px]">
                                    {[
                                      { id: 'bottom-right', label: 'Bottom right' },
                                      { id: 'bottom-left',  label: 'Bottom left' },
                                      { id: 'inline',       label: 'Inline' },
                                    ].map(({ id, label }) => (
                                      <button
                                        key={id}
                                        onClick={() => setCaptchaBadgePosition(id)}
                                        className={`py-[6px] rounded-[5px] text-[10.5px] text-center cursor-pointer transition-colors ${
                                          captchaBadgePosition === id
                                            ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                            : 'text-[#777] hover:text-[#444]'
                                        }`}
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                      >
                                        {label}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.07)]" />

                            {/* Block on failure toggle */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Block on failure</span>
                              <button
                                onClick={() => setCaptchaBlockOnFailure((v) => !v)}
                                className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors appearance-none border-0 p-0 ${captchaBlockOnFailure ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}
                              >
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white transition-all ${captchaBlockOnFailure ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ CONDITIONAL LOGIC â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setCaptchaSections((p) => ({ ...p, conditionalLogic: !p.conditionalLogic }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>CONDITIONAL LOGIC</span>
                      <motion.span animate={{ rotate: captchaSections.conditionalLogic ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={12} className="text-[#bbb]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {captchaSections.conditionalLogic && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-[14px] pt-[6px] flex flex-col gap-[10px]">
                            <span className="text-[9.5px] font-semibold tracking-[1.235px] uppercase text-[#bbb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>SHOW THIS BLOCK IF</span>
                            <button className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-[7px] border border-dashed border-[rgba(0,0,0,0.2)] text-[#666] text-[12px] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors w-full">
                              <RiAddLine size={13} className="shrink-0" />
                              Add condition
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Multi-image upload Configure panel â”€â”€ */}
        <AnimatePresence>
          {showMultiImageConfigPanel && (
            <motion.div
              key="multi-image-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>

                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]">Configure</span>
                  <button onClick={() => setShowMultiImageConfigPanel(false)} className="w-[20px] h-[20px] bg-[#f0eeea] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={12} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ FIELD SETTINGS â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setMultiImageSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-semibold tracking-[1.2px] uppercase text-[#bbb]">FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: multiImageSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#bbb]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {multiImageSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">

                            {/* Question */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={configureIsUpload ? uploadQuestion : multiImageQuestion} onChange={(e) => (configureIsUpload ? setUploadQuestion : setMultiImageQuestion)(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>

                            {/* Helper text */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={configureIsUpload ? uploadHelperText : multiImageHelperText} onChange={(e) => (configureIsUpload ? setUploadHelperText : setMultiImageHelperText)(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Required toggle */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Required</span>
                              <button onClick={() => setMultiImageRequired(p => !p)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors appearance-none border-0 p-0 ${multiImageRequired ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white transition-all ${multiImageRequired ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                            {/* Multiple files toggle */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Multiple files</span>
                              <button onClick={() => setMultiImageMultipleFiles(p => !p)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors appearance-none border-0 p-0 ${multiImageMultipleFiles ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white transition-all ${multiImageMultipleFiles ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Max files stepper */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Max files</span>
                              <div className="flex items-center gap-[6px] bg-[rgba(0,0,0,0.04)] rounded-[7px] px-[6px] py-[4px]">
                                <button
                                  onClick={() => setMultiImageMaxFiles(p => Math.max(1, p - 1))}
                                  disabled={multiImageMaxFiles <= 1}
                                  className={`w-[20px] h-[20px] rounded-[5px] bg-[rgba(255,255,255,0.8)] flex items-center justify-center transition-colors text-[14px] leading-none font-light select-none ${multiImageMaxFiles <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-white text-[#111]'}`}
                                >âˆ’</button>
                                <span className="text-[13px] font-medium text-[#111] min-w-[28px] text-center">{multiImageMaxFiles}</span>
                                <button
                                  onClick={() => setMultiImageMaxFiles(p => Math.min(9, p + 1))}
                                  disabled={multiImageMaxFiles >= 9}
                                  className={`w-[20px] h-[20px] rounded-[5px] bg-[rgba(255,255,255,0.8)] flex items-center justify-center transition-colors text-[14px] leading-none font-light select-none ${multiImageMaxFiles >= 9 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-white text-[#111]'}`}
                                >+</button>
                              </div>
                            </div>

                            {/* Max file size dropdown */}
                            <div className="flex flex-col gap-[6px]">
                              <span className="text-[12px] text-[#444]">Max file size</span>
                              <div className="relative">
                                <button
                                  onClick={() => setMultiImageSizeDropdownOpen(p => !p)}
                                  className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-[11px] py-[9px] text-[12.5px] text-[#1a1a1a] bg-white flex items-center justify-between cursor-pointer hover:border-[#999] transition-colors"
                                  style={{ borderRadius: multiImageSizeDropdownOpen ? '6px 6px 0 0' : '6px', borderColor: multiImageSizeDropdownOpen ? '#888' : undefined }}
                                >
                                  <span>{configureMaxFileSize}</span>
                                  <RiArrowDownSLine size={14} className={`text-[#888] transition-transform ${multiImageSizeDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {multiImageSizeDropdownOpen && (
                                  <div className="absolute z-20 left-0 right-0 bg-white border border-t-0 border-[#b0b0ae] rounded-b-[6px] overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.1)]">
                                    {['1 MB', '5 MB', '10 MB', '25 MB', '50 MB', '100 MB', 'No limit'].map(opt => (
                                      <button
                                        key={opt}
                                        onClick={() => { setConfigureMaxFileSize(opt); setMultiImageSizeDropdownOpen(false); }}
                                        className={`w-full flex items-center justify-between px-[10px] py-[8px] text-[12.5px] cursor-pointer transition-colors ${configureMaxFileSize === opt ? 'bg-[#ebebea] font-medium' : 'hover:bg-[#f5f4f0]'} text-[#1a1a1a]`}
                                      >
                                        <span>{opt}</span>
                                        {configureMaxFileSize === opt && <span className="text-[11px]">âœ“</span>}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Accepted types pill toggles */}
                            <div className="flex flex-col gap-[10px]">
                              <span className="text-[12px] text-[#444]">Accepted types</span>
                              <div className="flex flex-wrap gap-[6px]">
                                {['PDF', 'PNG', 'JPG', 'DOCX', 'XLSX', 'MP4', 'ZIP', 'Any'].map(type => {
                                  const isOn = multiImageAcceptedTypes.includes(type);
                                  return (
                                    <button
                                      key={type}
                                      onClick={() => {
                                        if (type === 'Any') {
                                          setMultiImageAcceptedTypes(['Any']);
                                        } else {
                                          setMultiImageAcceptedTypes(prev => {
                                            const without = prev.filter(t => t !== 'Any');
                                            return without.includes(type) ? without.filter(t => t !== type) : [...without, type];
                                          });
                                        }
                                      }}
                                      className={`px-[10px] py-[5px] rounded-[20px] text-[11px] border cursor-pointer transition-colors ${
                                        isOn
                                          ? 'bg-[#111] border-[#111] text-white'
                                          : 'bg-[rgba(0,0,0,0.04)] border-[rgba(0,0,0,0.15)] text-[#444] hover:border-[#999]'
                                      }`}
                                    >{type}</button>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ APPEARANCE â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button
                      onClick={() => setMultiImageSections((p) => ({ ...p, appearance: !p.appearance }))}
                      className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer"
                    >
                      <span className="text-[9.5px] font-semibold tracking-[1.2px] uppercase text-[#bbb]">APPEARANCE</span>
                      <motion.span animate={{ rotate: multiImageSections.appearance ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#bbb]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {multiImageSections.appearance && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">

                            {/* Upload zone size segmented control */}
                            <div className="flex flex-col gap-[8px]">
                              <span className="text-[12px] text-[#444]">Upload zone size</span>
                              <div className="bg-[rgba(0,0,0,0.04)] rounded-[7px] p-[2px] grid grid-cols-3 gap-[2px]">
                                {['Compact', 'Default', 'Large'].map(size => (
                                  <button
                                    key={size}
                                    onClick={() => setMultiImageUploadZoneSize(size)}
                                    className={`py-[6px] rounded-[5px] text-[11.5px] text-center cursor-pointer transition-colors ${
                                      multiImageUploadZoneSize === size
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                        : 'text-[#777] hover:text-[#444]'
                                    }`}
                                  >{size}</button>
                                ))}
                              </div>
                            </div>

                            {/* Show preview toggle */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Show preview</span>
                              <button onClick={() => setMultiImageShowPreview(p => !p)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors appearance-none border-0 p-0 ${multiImageShowPreview ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white transition-all ${multiImageShowPreview ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ Rating Configure panel â”€â”€ */}
        <AnimatePresence>
          {showRatingConfigPanel && (
            <motion.div
              key="rating-config-panel"
              initial={{ width: 0 }}
              animate={{ width: 280 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>

                {/* Header */}
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowRatingConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <RiCloseLine size={13} className="text-[#666] shrink-0" aria-hidden />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">

                  {/* â”€â”€ FIELD SETTINGS section â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button onClick={() => setRatingSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-semibold tracking-[1.2px] uppercase text-[#bbb]">FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: ratingSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#bbb]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {ratingSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-4">

                            <div className="flex flex-col gap-[8px]">
                              <span className="text-[12px] text-[#444]">Question</span>
                              <input
                                type="text"
                                value={ratingQuestion}
                                onChange={(e) => setRatingQuestion(e.target.value)}
                                className="w-full bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.15)] rounded-[7px] px-[11px] py-[7px] text-[12px] text-[#111] outline-none focus:border-[#111] transition-colors"
                              />
                            </div>

                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Toggles: Required, Use scale, Use slider */}
                            {[
                              { label: 'Required', val: ratingRequired, set: setRatingRequired },
                              { label: 'Use scale', val: ratingUseScale, set: setRatingUseScale },
                              { label: 'Use slider', val: ratingUseSlider, set: setRatingUseSlider },
                            ].map(({ label, val, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]">{label}</span>
                                <button onClick={() => set(!val)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors appearance-none border-0 p-0 ${val ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                  <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white transition-all ${val ? 'left-[17px]' : 'left-[3px]'}`} />
                                </button>
                              </div>
                            ))}

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Max rating stepper */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Max rating</span>
                              <div className="flex items-center gap-[6px] bg-[rgba(0,0,0,0.04)] rounded-[7px] px-[6px] py-[4px]">
                                <button
                                  onClick={() => setRatingMaxRating((p) => Math.max(ratingStyle === '1-10' ? 10 : 2, p - 1))}
                                  className="w-[20px] h-[20px] bg-[rgba(255,255,255,0.8)] rounded-[5px] flex items-center justify-center text-[14px] text-[#444] cursor-pointer hover:bg-white transition-colors leading-none"
                                >âˆ’</button>
                                <span className="text-[13px] font-medium text-[#111] min-w-[28px] text-center">{ratingStyle === '1-10' ? 10 : ratingMaxRating}</span>
                                <button
                                  onClick={() => { if (ratingStyle !== '1-10') setRatingMaxRating((p) => Math.min(10, p + 1)); }}
                                  className={`w-[20px] h-[20px] bg-[rgba(255,255,255,0.8)] rounded-[5px] flex items-center justify-center text-[14px] text-[#444] leading-none transition-colors ${ratingStyle === '1-10' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-white'}`}
                                >+</button>
                              </div>
                            </div>

                            {/* Rating style segmented control */}
                            <div className="flex flex-col gap-[8px]">
                              <span className="text-[12px] text-[#444]">Rating style</span>
                              <div className="bg-[rgba(0,0,0,0.04)] rounded-[7px] p-[2px] grid grid-cols-3 gap-[2px]">
                                {[
                                  { val: 'Stars', icon: <RiStarLine size={14} /> },
                                  { val: 'Hearts', icon: <RiHeartLine size={14} /> },
                                  { val: '1-10', icon: null },
                                ].map(({ val, icon }) => (
                                  <button
                                    key={val}
                                    onClick={() => {
                                      setRatingStyle(val);
                                      if (val === '1-10') setRatingMaxRating(10);
                                    }}
                                    className={`flex items-center justify-center gap-[4px] py-[6px] rounded-[5px] text-[11.5px] text-center cursor-pointer transition-colors ${
                                      ratingStyle === val
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                        : 'text-[#777] hover:text-[#444]'
                                    }`}
                                  >
                                    <Icon size={14} />
                                    {val}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Low label */}
                            <div className="flex flex-col gap-[8px]">
                              <span className="text-[12px] text-[#444]">Low label</span>
                              <input
                                type="text"
                                value={ratingLowLabel}
                                onChange={(e) => setRatingLowLabel(e.target.value)}
                                className="w-full bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.15)] rounded-[7px] px-[11px] py-[7px] text-[12px] text-[#111] outline-none focus:border-[#111] transition-colors"
                              />
                            </div>

                            {/* High label */}
                            <div className="flex flex-col gap-[8px]">
                              <span className="text-[12px] text-[#444]">High label</span>
                              <input
                                type="text"
                                value={ratingHighLabel}
                                onChange={(e) => setRatingHighLabel(e.target.value)}
                                className="w-full bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.15)] rounded-[7px] px-[11px] py-[7px] text-[12px] text-[#111] outline-none focus:border-[#111] transition-colors"
                              />
                            </div>

                            {/* Show labels toggle */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Show labels</span>
                              <button onClick={() => setRatingShowLabels((p) => !p)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors appearance-none border-0 p-0 ${ratingShowLabels ? 'bg-[#2a9d6e]' : 'bg-[#e4e2dc]'}`}>
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white transition-all ${ratingShowLabels ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* â”€â”€ APPEARANCE section â”€â”€ */}
                  <div className="border-b border-[rgba(0,0,0,0.09)]">
                    <button onClick={() => setRatingSections((p) => ({ ...p, appearance: !p.appearance }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-semibold tracking-[1.2px] uppercase text-[#bbb]">APPEARANCE</span>
                      <motion.span animate={{ rotate: ratingSections.appearance ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#bbb]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {ratingSections.appearance && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">

                            {/* Icon size */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Icon size</span>
                              <div className="bg-[rgba(0,0,0,0.04)] rounded-[7px] p-[2px] grid grid-cols-3 gap-[2px] w-[145px]">
                                {['S', 'M', 'L'].map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => setRatingIconSize(s)}
                                    className={`py-[6px] rounded-[5px] text-[11.5px] text-center cursor-pointer transition-colors ${
                                      ratingIconSize === s
                                        ? 'bg-white border border-[rgba(0,0,0,0.09)] text-[#111] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                        : 'text-[#777] hover:text-[#444]'
                                    }`}
                                  >{s}</button>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* â”€â”€ If / Then Logic panel (Logic tab) â”€â”€ */}
        <AnimatePresence>
          {ifThenLogicPanelEdge != null && ifThenDraft && activeTab === 'logic' && (() => {
            const { from, to } = ifThenLogicPanelEdge;
            const logicScreen = screens.find((s) => s.id === from);
            if (!logicScreen) return null;
            const fromLabel = logicScreen.label || logicScreen.name || 'Screen';
            const toScreen = to != null ? screens.find((s) => s.id === to) : null;
            const toLabel = toScreen
              ? getLogicCardQuestionText(toScreen) || toScreen.name || toScreen.label || 'Screen'
              : null;
            const screenSubtitle =
              toLabel != null ? `${fromLabel} â†’ ${toLabel}` : `${fromLabel} Screen`;
            return (
              <motion.div
                key="if-then-logic-panel"
                initial={{ width: 0 }}
                animate={{ width: 320 }}
                exit={{ width: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="shrink-0 overflow-visible h-full"
              >
                <IfThenLogicPanel
                  screenSubtitle={screenSubtitle}
                  fieldOptions={getLogicFieldOptionsForScreen(logicScreen)}
                  fixedThenScreenId={to}
                  destinationOptions={[
                    ...screens
                      .filter((s) => s.type === 'content' && s.id !== from)
                      .map((s) => ({
                        id: s.id,
                        label: getLogicCardQuestionText(s) || s.name || s.label || 'Screen',
                      })),
                    ...(screens.find((s) => s.type === 'end')
                      ? [{ id: screens.find((s) => s.type === 'end').id, label: 'End screen' }]
                      : []),
                  ]}
                  draft={ifThenDraft}
                  onDraftChange={setIfThenDraft}
                  onClose={closeIfThenLogicPanel}
                  onCancel={cancelIfThenLogicPanel}
                  onSave={saveIfThenLogic}
                />
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* â”€â”€ Design / Customization panel (right) â”€â”€ */}
        <AnimatePresence>
        {showDesignPanel && (
          <motion.div
            key="design-panel"
            initial={{ width: 0 }}
            animate={{ width: 280 }}
            exit={{ width: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="shrink-0 overflow-hidden"
          >
          <div
            className="w-[280px] h-full bg-[#f7f7f8] border-l border-[#e4e2dc] flex flex-col"
            style={{ boxShadow: '-2px 2px 5px rgba(0,0,0,0.1)' }}
          >
            {/* Header */}
            <div className="h-[40px] border-b border-[#e4e2dc] flex items-center justify-between px-4 shrink-0">
              <span className="text-[14px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Customization
              </span>
              <button
                onClick={() => { setShowDesignPanel(false); setActiveTab('content'); }}
                className="flex items-center justify-center cursor-pointer text-[#7a7a72] text-[18px] leading-none hover:text-[#1a1a1a] transition-colors"
              >
                Ã—
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">

              {/* â”€â”€ LAYOUT STYLE â”€â”€ */}
              <div className="border-b border-[#e4e2dc] flex flex-col gap-3 px-4 py-4">
                <span className="text-[10px] font-semibold tracking-[0.6px] uppercase text-[#7a7a72]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Layout Style
                </span>
                <div className="bg-[#f1f1f1] rounded-[8px] p-[3px] grid grid-cols-2 gap-1">
                  {[
                    { id: 'withCard', label: 'With card' },
                    { id: 'fullCanvas', label: 'Full Canvas' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setDesignLayoutStyle(id)}
                      className={`py-[7px] rounded-[6px] text-[12px] font-medium text-center cursor-pointer transition-colors ${
                        designLayoutStyle === id
                          ? 'bg-white text-black shadow-[0px_4px_2px_rgba(0,0,0,0.1)]'
                          : 'text-[#7a7a72] hover:text-[#1a1a1a]'
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* â”€â”€ BACKGROUND â”€â”€ */}
              <div className="border-b border-[#e3e1da] flex flex-col gap-2 px-4 py-[13px]">
                {/* Theme preview card â€” clickable to open overlay */}
                <button
                  onClick={() => setShowThemeOverlay(true)}
                  className="bg-white border border-[rgba(81,76,84,0.15)] rounded-[12px] overflow-hidden w-full text-left hover:border-[rgba(81,76,84,0.35)] transition-colors cursor-pointer"
                >
                  <div
                    className="h-[80px] p-4 flex items-start transition-colors duration-300"
                    style={designCardImage
                      ? { backgroundImage: `url(${designCardImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { backgroundColor: hexToRgba(designCardColor, designCardOpacity) }}
                  >
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[#262627] text-[13px] leading-5" style={{ fontFamily: "'Inter', sans-serif" }}>Question</span>
                      <span className="text-[#262627] text-[13px] leading-5" style={{ fontFamily: "'Inter', sans-serif" }}>Answer</span>
                      <div className="mt-1 bg-[#262627] rounded-[4px] h-[14px] w-[34px]" />
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-[#3c323e] text-[13px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {THEMES.find(t => t.id === activeThemeId)?.name ?? 'Custom'}
                    </span>
                    <RiArrowRightLine size={14} className="text-[#9a9a92] shrink-0" />
                  </div>
                </button>

                <span className="text-[10px] font-bold tracking-[0.76px] uppercase text-[#8c8a84]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Background
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { color: '#f7edfc', border: '#111', isOutline: true },
                    { color: '#f0eee8', border: '#e3e1da', isOutline: false },
                    { color: '#111111', border: 'transparent', isOutline: false },
                  ].map(({ color, border, isOutline }) => (
                    <button
                      key={color}
                      onClick={() => setDesignBackground(color)}
                      className="h-[48px] rounded-[8px] cursor-pointer transition-all relative"
                      style={{
                        backgroundColor: color,
                        border: designBackground === color
                          ? `2px solid #1a1a1a`
                          : isOutline ? `1px solid ${border}` : `1px solid ${border}`,
                        outline: designBackground === color ? '2px solid rgba(26,26,26,0.2)' : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* â”€â”€ CARD COLOR â”€â”€ */}
              <div className="border-b border-[#e4e2dc] flex flex-col gap-3 px-4 py-4">
                <span className="text-[10px] font-semibold tracking-[0.6px] uppercase text-[#7a7a72]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Card Color
                </span>
                <div className="flex items-center gap-[6px]">
                  {['#f9f9fa', '#1a1a2e', '#4a5568'].map((color) => (
                    <button
                      key={color}
                      onClick={() => { setDesignCardColor(color); setDesignCardImage(null); setActiveThemeId(null); }}
                      className="w-[28px] h-[28px] rounded-full cursor-pointer transition-transform hover:scale-110"
                      style={{
                        background: color,
                        border: color === '#f9f9fa' ? '1px solid #e5e5e3' : 'none',
                        outline: designCardColor === color ? '2px solid #111' : 'none',
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                  <button
                    onClick={() => setDesignCardColorGridOpen((v) => !v)}
                    className="w-[28px] h-[28px] rounded-full border border-dashed border-[#c0c0be] flex items-center justify-center text-[#9a9a9a] text-[14px] leading-none cursor-pointer hover:bg-white/50"
                  >
                    +
                  </button>
                </div>
                {/* Color grid */}
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: designCardColorGridOpen ? '400px' : '0',
                    opacity: designCardColorGridOpen ? 1 : 0,
                    transition: 'max-height 0.25s ease, opacity 0.2s ease',
                  }}
                >
                  <div className="bg-white border border-[#e5e5e3] rounded-[8px] p-[11px] flex flex-col gap-2 mb-1">
                    <div className="grid grid-cols-8 gap-1">
                      {CTA_COLOR_PALETTE.flat().map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDesignCardColor(color);
                            setDesignCardImage(null);
                            setActiveThemeId(null);
                            setDesignCardColorGridOpen(false);
                          }}
                          className="aspect-square rounded-[3px] cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            background: color,
                            border: idx === 0 ? '1px solid #d8d8d6' : '1px solid rgba(0,0,0,0.07)',
                            outline: designCardColor === color ? '2px solid #1a1a1a' : 'none',
                            outlineOffset: 1,
                          }}
                        />
                      ))}
                    </div>
                    {/* Hex input row */}
                    <div className="border-t border-[#ebebea] pt-[9px] flex items-center gap-[6px]">
                      <div
                        className="w-[22px] h-[22px] rounded-[4px] border border-[#d8d8d6] shrink-0"
                        style={{ background: designCardColor }}
                      />
                      <span className="text-[11.5px] text-[#9a9a9a] shrink-0" style={{ fontFamily: 'Courier New, monospace' }}>#</span>
                      <input
                        type="text"
                        value={designCardColor.replace('#', '').toUpperCase()}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[0-9A-Fa-f]{0,6}$/.test(val)) { setDesignCardColor('#' + val); setDesignCardImage(null); setActiveThemeId(null); }
                        }}
                        className="flex-1 text-[11.5px] text-[#9a9a9a] uppercase outline-none bg-transparent min-w-0"
                        style={{ fontFamily: 'Courier New, monospace' }}
                        maxLength={6}
                      />
                      <button className="px-2 py-1 border border-[#e0e0de] rounded-[4px] text-[10.5px] text-[#9a9a9a] shrink-0 cursor-pointer hover:bg-[#f5f5f5] transition-colors">
                        Custom
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* â”€â”€ CARD OPACITY â”€â”€ */}
              <div className="border-b border-[#e4e2dc] flex flex-col gap-2 px-4 py-4">
                <span className="text-[9.5px] font-medium tracking-[1.235px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Card Opacity
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Transparent</span>
                    <span className="text-[10px] text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Opaque</span>
                  </div>
                  <div className="relative h-[3px] rounded-full w-full" style={{ background: `linear-gradient(to right, #1a1a1a ${designCardOpacity}%, #e0ddd8 ${designCardOpacity}%)` }}>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={designCardOpacity}
                      onChange={(e) => setDesignCardOpacity(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-[14px] -top-[5px]"
                    />
                    <div
                      className="absolute w-[14px] h-[14px] bg-[#1a1a1a] rounded-full -top-[5.5px] -translate-x-1/2 pointer-events-none"
                      style={{
                        left: `${designCardOpacity}%`,
                        boxShadow: '0 0 0 2.5px white, 0 0 0 4px rgba(0,0,0,0.15)',
                      }}
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] font-medium text-[#1a1a1a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{designCardOpacity}%</span>
                  </div>
                </div>
              </div>

              {/* â”€â”€ TEXT COLOR â”€â”€ */}
              <div className="border-b border-[#e4e2dc] flex flex-col gap-3 px-4 py-4">
                <span className="text-[10px] font-semibold tracking-[0.6px] uppercase text-[#7a7a72]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Text Color
                </span>
                <div className="flex items-center gap-[6px]">
                  {[
                    { color: '#198eea' },
                    { color: '#3d3d3d' },
                    { color: '#ffffff', border: '#e4e2dc' },
                  ].map(({ color, border }) => (
                    <button
                      key={color}
                      onClick={() => setDesignTextColor(color)}
                      className="w-[32px] h-[32px] rounded-full cursor-pointer transition-all"
                      style={{
                        backgroundColor: color,
                        border: designTextColor === color
                          ? `2px solid transparent`
                          : border ? `1px solid ${border}` : `2px solid transparent`,
                        outline: designTextColor === color ? '2px solid rgba(0,0,0,0.3)' : 'none',
                        outlineOffset: '1.5px',
                      }}
                    />
                  ))}
                  <button className="w-[32px] h-[32px] rounded-full bg-white border border-dashed border-[#e4e2dc] flex items-center justify-center cursor-pointer hover:bg-[#f5f4f0] transition-colors">
                    <span className="text-[#1a1a1a] text-[16px] leading-none font-light">+</span>
                  </button>
                </div>
              </div>

              {/* â”€â”€ TYPOGRAPHY â”€â”€ */}
              <div className="border-b border-[#e4e2dc] flex flex-col gap-2 px-4 py-4">
                <span className="text-[10px] font-semibold tracking-[0.6px] uppercase text-[#7a7a72]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Typography
                </span>
                <div className="flex flex-col">
                  {[
                    { id: 'default', label: 'Default', preview: 'The quick brown fox', fontFamily: "'DM Sans', sans-serif", fontFamilyPreview: "'DM Sans', sans-serif" },
                    { id: 'serif', label: 'Serif', preview: 'The quick brown fox', fontFamily: 'Georgia, serif', fontFamilyPreview: 'Georgia, serif' },
                    { id: 'monospace', label: 'Monospace', preview: 'The quick brown fox', fontFamily: 'Consolas, monospace', fontFamilyPreview: 'Consolas, monospace' },
                  ].map(({ id, label, preview, fontFamily, fontFamilyPreview }) => (
                    <button
                      key={id}
                      onClick={() => setDesignTypography(id)}
                      className={`flex items-center justify-between px-[10px] py-[8px] rounded-[6px] w-full text-left cursor-pointer transition-colors ${
                        designTypography === id ? 'bg-[#f5f4f0]' : 'hover:bg-[#f5f4f0]/60'
                      }`}
                    >
                      <div className="flex flex-col gap-[2px]">
                        <span className="text-[13px] font-medium text-[#1a1a1a]" style={{ fontFamily }}>
                          {label}
                        </span>
                        <span className="text-[11px] text-[#7a7a72]" style={{ fontFamily: fontFamilyPreview }}>
                          {preview}
                        </span>
                      </div>
                      {designTypography === id && (
                        <RiCheckLine size={14} className="text-[#1a1a1a] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
          </motion.div>
        )}
        </AnimatePresence>
        </>}

      </div>
      </LayoutGroup>

      <DeleteScreenModal
        open={Boolean(pendingScreenDelete)}
        screenLabel={pendingScreenDelete?.screenLabel}
        onCancel={closeDeleteScreenModal}
        onConfirm={confirmScreenDelete}
      />

      <PublishFormModal
        open={publishModalOpen}
        onCancel={() => setPublishModalOpen(false)}
        onConfirm={() => {
          setPublishModalOpen(false);
          setIsPublishView(true);
        }}
      />
    </div>
  );
};

export default FormBuilderPage;

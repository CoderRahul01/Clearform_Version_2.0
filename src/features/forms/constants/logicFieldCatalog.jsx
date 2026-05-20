import {
  RiIdCardLine,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiStarLine,
  RiCalendarLine,
  RiHashtag,
  RiFileUploadLine,
  RiCheckboxLine,
  RiImageLine,
  RiBarChartLine,
  RiListOrdered,
  RiPlayCircleLine,
} from 'react-icons/ri';

/** Figma field-picker badge colors (node 2608:4942) */
export const LOGIC_FIELD_BADGE = {
  pink: '#f8cdd8',
  blue: '#bdddf9',
  purple: '#ddd6fa',
  green: '#c4e3ba',
  yellow: '#fbe19d',
};

const shortTextIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
    <path
      d="M2 5.33398H15.5M2 8.33398H9.5"
      stroke="currentColor"
      strokeWidth="1.125"
      strokeLinecap="round"
    />
  </svg>
);

const longTextIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
    <path
      d="M2 4H15.5M2 7H15.5M2 10H15.5M2 13H11"
      stroke="currentColor"
      strokeWidth="1.125"
      strokeLinecap="round"
    />
  </svg>
);

/** Full catalog — order matches Figma listbox */
export const LOGIC_FIELD_CATALOG = [
  { id: 'contact-info', label: 'Contact Info', badgeBg: LOGIC_FIELD_BADGE.pink, Icon: RiIdCardLine },
  { id: 'address', label: 'Address', badgeBg: LOGIC_FIELD_BADGE.pink, Icon: RiMapPinLine },
  { id: 'phone-number', label: 'Phone Number', badgeBg: LOGIC_FIELD_BADGE.pink, Icon: RiPhoneLine },
  { id: 'short-text', label: 'Short Text', badgeBg: LOGIC_FIELD_BADGE.blue, Icon: shortTextIcon },
  { id: 'long-text', label: 'Long Text', badgeBg: LOGIC_FIELD_BADGE.blue, Icon: longTextIcon },
  { id: 'video-audio', label: 'Video and Audio', badgeBg: LOGIC_FIELD_BADGE.blue, Icon: RiPlayCircleLine },
  { id: 'picture-choice', label: 'Picture Choice', badgeBg: LOGIC_FIELD_BADGE.purple, Icon: RiImageLine },
  { id: 'ranking', label: 'Ranking', badgeBg: LOGIC_FIELD_BADGE.green, Icon: RiListOrdered },
  { id: 'email', label: 'Email', badgeBg: LOGIC_FIELD_BADGE.pink, Icon: RiMailLine },
  { id: 'opinion-scale', label: 'Opinion Scale', badgeBg: LOGIC_FIELD_BADGE.green, Icon: RiBarChartLine },
  { id: 'rating', label: 'Rating', badgeBg: LOGIC_FIELD_BADGE.green, Icon: RiStarLine },
  { id: 'date', label: 'Date', badgeBg: LOGIC_FIELD_BADGE.yellow, Icon: RiCalendarLine },
  { id: 'number', label: 'Number', badgeBg: LOGIC_FIELD_BADGE.yellow, Icon: RiHashtag },
  { id: 'file-upload', label: 'File Upload', badgeBg: LOGIC_FIELD_BADGE.yellow, Icon: RiFileUploadLine },
  { id: 'multiple-choice', label: 'Multiple Choice', badgeBg: LOGIC_FIELD_BADGE.purple, Icon: RiCheckboxLine },
];

const catalogById = Object.fromEntries(LOGIC_FIELD_CATALOG.map((f) => [f.id, f]));

/** Which logic fields are available per screen label in the builder */
export const SCREEN_LOGIC_FIELD_IDS = {
  Contact: ['contact-info', 'email', 'phone-number'],
  Address: ['address'],
  'Work Info': ['contact-info', 'short-text', 'long-text'],
  'Short text': ['short-text'],
  'Long text': ['long-text'],
  Video: ['video-audio'],
  Images: ['picture-choice'],
  Media: ['picture-choice', 'file-upload'],
  Single: ['multiple-choice'],
  Multiple: ['multiple-choice'],
  Rating: ['rating', 'opinion-scale', 'ranking'],
  Date: ['date'],
  Time: ['number', 'date'],
  Maps: ['address'],
  Upload: ['file-upload'],
  'Multi-image upload': ['file-upload', 'picture-choice'],
  Heading: ['short-text'],
  Description: ['long-text'],
  CTA: ['short-text'],
  Captcha: ['short-text'],
};

export const getLogicFieldsForScreenLabel = (screenLabel) => {
  const ids = SCREEN_LOGIC_FIELD_IDS[screenLabel];
  if (ids?.length) return ids.map((id) => catalogById[id]).filter(Boolean);
  const fallbackId =
    screenLabel === 'Rating'
      ? 'rating'
      : screenLabel
        ? `field-${String(screenLabel).toLowerCase().replace(/\s+/g, '-')}`
        : 'short-text';
  const known = catalogById[fallbackId];
  if (known) return [known];
  return [
    {
      id: fallbackId,
      label: screenLabel || 'Field',
      badgeBg: LOGIC_FIELD_BADGE.blue,
      Icon: shortTextIcon,
    },
  ];
};

export const getLogicFieldById = (id) => catalogById[id];

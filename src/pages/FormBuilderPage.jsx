import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import {
  RiAddLine,
  RiFileTextLine,
  RiPaintBrushLine,
  RiGitBranchLine,
  RiSettings3Line,
  RiCursorLine,
  RiH1,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiInputMethodLine,
  RiImageLine,
  RiVideoLine,
  RiRobot2Line,
  RiArrowDownSLine,
  RiIdCardLine,
  RiMapPinLine,
  RiBriefcaseLine,
  RiAlignJustify,
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
} from 'react-icons/ri';
import { PiCaretCircleUp } from 'react-icons/pi';
import clearformLogo from '../assets/clearform-high-resolution-logo-transparent.png';
import Sidebar from '../components/common/Sidebar';

/* ── Step bar ── */
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
          <span className="text-[#e4e2dc] text-[16px] font-normal leading-none">›</span>
        )}
      </div>
    ))}
  </div>
);

/* ── Tab bar ── */
const TABS = [
  { id: 'content', label: 'Content', icon: RiFileTextLine },
  { id: 'design', label: 'Design', icon: RiPaintBrushLine },
  { id: 'logic', label: 'Logic', icon: RiGitBranchLine },
  { id: 'settings', label: 'Settings', icon: RiSettings3Line },
];

/* ── Configure panel: essentials grid items ── */
const ESSENTIALS = [
  { label: 'CTA', Icon: RiCursorLine },
  { label: 'Heading', Icon: RiH1 },
  { label: 'Description', Icon: RiAlignLeft },
  { label: 'Text Box', Icon: RiInputMethodLine },
  { label: 'Images', Icon: RiImageLine },
  { label: 'Video', Icon: RiVideoLine },
  { label: 'Captcha', Icon: RiRobot2Line },
];

/* ── Configure panel: collapsible sections ── */
const ACCORDION_SECTIONS = [
  { key: 'questionTemplates', label: 'Question Templates' },
  { key: 'fieldSettings', label: 'Field Settings' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'responseQuality', label: 'Response Quality Scoring' },
];

/* ── Question template categories ── */
const QUESTION_TEMPLATE_CATEGORIES = [
  {
    label: 'Building Blocks',
    items: [
      { label: 'CTA', Icon: RiCursorLine },
      { label: 'Heading', Icon: RiH1 },
      { label: 'Description', Icon: RiAlignLeft },
      { label: 'Images', Icon: RiImageLine },
      { label: 'Video', Icon: RiVideoLine },
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
      { label: 'Short text', Icon: RiInputMethodLine },
      { label: 'Long text', Icon: RiAlignJustify },
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

/* ── Content panel sections (shown when Add Screen is clicked after intro) ── */
const CONTENT_SECTIONS = [
  {
    key: 'buildingBlocks',
    label: 'Building Blocks',
    items: [
      { label: 'CTA', Icon: RiCursorLine },
      { label: 'Heading', Icon: RiH1 },
      { label: 'Description', Icon: RiAlignLeft },
      { label: 'Images', Icon: RiImageLine },
      { label: 'Video', Icon: RiVideoLine },
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
      { label: 'Short text', Icon: RiInputMethodLine },
      { label: 'Long text', Icon: RiAlignJustify },
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

/* ── Typography font map ── */
const TYPOGRAPHY_FONTS = {
  default:   "'DM Sans', sans-serif",
  serif:     "Georgia, 'Times New Roman', serif",
  monospace: "'Consolas', 'Courier New', monospace",
};

/* ── Hex → rgba helper ── */
const hexToRgba = (hex, opacity) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
};

/* ── CTA configure panel – text-color palette (6 rows × 8 cols) ── */
const CTA_COLOR_PALETTE = [
  ['#ffffff', '#ffffff', '#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#111827'],
  ['#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#7f1d1d'],
  ['#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#713f12'],
  ['#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d'],
  ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e3a8a'],
  ['#fae8ff', '#f5d0fe', '#e879f9', '#d946ef', '#a855f7', '#9333ea', '#7e22ce', '#581c87'],
];

/* ── Content card helpers ── */

const CardShell = ({ children, fullCanvas = false, cardColor = '#f7f6f4' }) => (
  <div
    className={`overflow-hidden flex-1 flex flex-col justify-between transition-colors duration-300 ${
      fullCanvas ? '' : 'border border-[rgba(0,0,0,0.07)] rounded-[20px]'
    }`}
    style={fullCanvas ? {} : {
      backgroundColor: cardColor,
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.05), 0px 8px 32px 0px rgba(0,0,0,0.07)',
    }}
  >
    {children}
  </div>
);

const SectionBadge = ({ num, label }) => (
  <div className="flex gap-[7px] items-center">
    <div className="bg-[#111] w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0">
      <span className="text-white text-[10px] font-semibold leading-none">{num}</span>
    </div>
    <span className="text-[#888] text-[10.5px] tracking-[0.42px]">{label}</span>
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

const FileUploadCard = ({ blockNum, onDelete }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const newFiles = selected.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      let prog = 0;
      const tick = () => {
        prog = Math.min(100, prog + Math.random() * 18 + 6);
        setUploadedFiles(prev =>
          prev.map(f => f.id === file.id ? { ...f, progress: Math.round(prog) } : f)
        );
        if (prog < 100) setTimeout(tick, 80);
      };
      setTimeout(tick, 80);
    });

    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (dt?.files) {
      handleFileSelect({ target: { files: dt.files }, preventDefault: () => {} });
    }
  };

  const handleRemove = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <>
      <div className="flex flex-col px-14 pt-11 pb-5">
        <SectionBadge num={blockNum} label="File upload" />
        <div className="pt-[9px]">
          <p className="font-medium text-[#111] tracking-[-0.52px] leading-tight" style={{ fontSize: '26px' }}>Upload your supporting documents</p>
        </div>
        <p className="text-[#888] text-[13px] font-light mt-[2px] mb-5 leading-[1.6]">Attach any files that help us understand your request better.</p>

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

        <div
          className="bg-[rgba(255,255,255,0.4)] border border-dashed border-[rgba(0,0,0,0.16)] rounded-[12px] flex flex-col items-center gap-[10px] pt-[34px] pb-[50px] px-[25px] mt-[5px] mb-5 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
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
            onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="bg-[rgba(255,255,255,0.8)] border border-[rgba(0,0,0,0.16)] rounded-[8px] flex items-center gap-[6px] px-[19px] py-[9px] cursor-pointer hover:bg-white transition-colors"
          >
            <RiAddLine size={13} className="text-[#444] shrink-0" />
            <span className="font-medium text-[#444] text-[12.5px]">Browse files</span>
          </button>
          <span className="text-[11px] text-black text-center pointer-events-none">PDF, DOCX, PNG, JPG · Max 25 MB per file</span>
        </div>
      </div>
      <ContentCardFooter onDelete={onDelete} variant="field" />
    </>
  );
};

const MultiImageUploadCard = ({ blockNum, onDelete, config, fullCanvas = false, cardColor = '#f7f6f4' }) => {
  const question   = config?.question   || 'Upload photos of the issue';
  const helperText = config?.helperText || 'Add up to 9 images. Drag to reorder.';
  const maxImages  = config?.maxFiles   || 9;

  const [images, setImages]       = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOver, setDragOver]   = useState(null);
  const [addHovered, setAddHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = maxImages - images.length;
    const toAdd = files.slice(0, remaining).map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
    }));
    setImages(prev => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const handleRemove = (id) => {
    setImages(prev => {
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter(img => img.id !== id);
    });
  };

  /* ── Drag-to-reorder handlers ── */
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
  const showAddButton = true; // always render; disabled state handled below

  return (
    <CardShell fullCanvas={fullCanvas} cardColor={cardColor}>
      <div className="flex flex-col px-14 pt-11 pb-4">
        <SectionBadge num={blockNum} label="Multi-image upload" />
        <div className="pt-[9px]">
          <p className="font-medium text-[#111] tracking-[-0.52px] leading-tight" style={{ fontSize: '26px' }}>{question}</p>
        </div>
        <p className="text-[#888] text-[13px] font-light mt-[2px] leading-[1.6]">{helperText}</p>

        {/* Counter + drag hint — only show once images exist */}
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

        {/* Image grid — 4 per row, scrollable so card never expands */}
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
                  <span className="text-white text-[9px] leading-none">×</span>
                </button>
              </div>
            ))}

            {/* Add photo slot — always visible; disabled + tooltip when at max */}
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
      <ContentCardFooter onDelete={onDelete} variant="field" />
    </CardShell>
  );
};

const ContentCard = ({ block, blockNum, onDelete, ctaConfig, headingConfig, descriptionConfig, imageConfig, imageFileInputRef, videoConfig, contactConfig, addressConfig, workConfig, shortTextConfig, longTextConfig, singleConfig, multipleConfig, mediaConfig, mapConfig, captchaConfig, multiImageConfig, ratingConfig, fullCanvas = false, cardColor = '#f7f6f4' }) => {
  const { section, label } = block;
  const cardKey = `${section}:${label}`;

  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);

  let content;

  if (cardKey === 'buildingBlocks:CTA') {
    const cc = ctaConfig || {};
    const btnLabel     = cc.ctaButtonLabel  ?? 'Get started';
    const btnSize      = cc.ctaButtonSize   ?? 'M';
    const btnStyle     = cc.ctaButtonStyle  ?? 'Filled';
    const btnRadius    = cc.ctaCornerRadius ?? 10;
    const showIcon     = cc.ctaShowIcon     ?? true;
    const headingSize  = cc.ctaHeadingSize  ?? 32;
    const bodySize     = cc.ctaBodySize     ?? 16;
    const fontWeight   = cc.ctaFontWeight   ?? 'Regular';
    const textAlign    = cc.ctaTextAlign    ?? 'center';
    const padding      = cc.ctaPadding      ?? 44;

    const btnSizePxMap  = { S: { px: '14px', py: '8px', text: '14px' }, M: { px: '28px', py: '12px', text: '15px' }, L: { px: '36px', py: '14px', text: '16px' }, XL: { px: '44px', py: '16px', text: '18px' } };
    const { px: bPx, py: bPy, text: bText } = btnSizePxMap[btnSize] || btnSizePxMap['M'];
    const fontWeightMap = { Light: '300', Regular: '500', Bold: '700' };
    const textAlignClass = textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left';

    const isFilled  = btnStyle === 'Filled';
    const isOutline = btnStyle === 'Outline';
    const btnBg     = isFilled ? (cc.ctaBtnColor ?? '#111') : 'transparent';
    const btnColor  = cc.ctaTextColor ?? (isFilled ? '#fff' : '#111');
    const btnBorder = isOutline ? `1.5px solid ${cc.ctaBtnColor ?? '#111'}` : 'none';

    content = (
      <>
        <div
          className={`flex-1 flex flex-col items-center justify-center gap-[9px] px-14 ${textAlignClass}`}
          style={{ paddingTop: padding, paddingBottom: padding }}
        >
          <div className="bg-[#111] w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0">
            <RiCursorLine size={18} className="text-white" />
          </div>
          <div className="pt-[11px] w-full">
            <p
              className={`text-[#111] tracking-[-0.56px] leading-[1.3] ${textAlignClass}`}
              style={{ fontSize: headingSize, fontWeight: fontWeightMap[fontWeight] }}
            >
              Welcome to our survey
            </p>
          </div>
          <div className={`max-w-[320px] ${textAlignClass}`}>
            <p className={`text-[#888] font-light leading-[1.6] ${textAlignClass}`} style={{ fontSize: bodySize }}>
              Please fill out this form to help us improve. It only takes a couple of minutes and your feedback matters.
            </p>
          </div>
          <div
            className="flex gap-[7px] items-center mt-2"
            style={{
              background: btnBg,
              color: btnColor,
              border: btnBorder,
              borderRadius: `${btnRadius}px`,
              paddingLeft: bPx,
              paddingRight: bPx,
              paddingTop: bPy,
              paddingBottom: bPy,
            }}
          >
            <span style={{ fontSize: bText, fontWeight: '500' }}>{btnLabel}</span>
            {showIcon && <RiArrowRightLine size={12} style={{ color: btnColor }} />}
          </div>
          <div className="flex gap-[5px] items-center justify-center pt-[5px]">
            <RiTimeLine size={12} className="text-black" />
            <span className="text-[12px] text-black">Takes ~3 minutes</span>
          </div>
        </div>
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
      </>
    );
  } else if (cardKey === 'buildingBlocks:Heading') {
    const hc = headingConfig || {};
    const hText = hc.headingText || 'Tell us about yourself';
    const hSub = hc.subHeading || 'This section covers your professional background and preferences. All information is kept confidential and used only to improve your experience.';
    const hLevel = hc.headingLevel || 'H2';
    const hSize = hc.headingTextSize || 'M';
    const hAlign = hc.headingAlignment || 'left';
    const hWeight = hc.headingFontWeight || 'Regular';
    const isEditingHeading = hc.isEditingCard || false;
    const textAlignClass = hAlign === 'center' ? 'text-center' : hAlign === 'right' ? 'text-right' : 'text-left';
    // Heading level controls the heading title size
    const headingLevelSizeMap = { H1: '40px', H2: '32px', H3: '26px', H4: '20px' };
    const headingLevelWeightMap = { H1: '700', H2: '600', H3: '600', H4: '500' };
    // Text size controls the answer textarea font size
    const answerTextSizeMap = { S: '15px', M: '17px', L: '20px', XL: '24px' };
    const fontWeightMap = { Light: '300', Regular: '500', Bold: '700' };
    content = (
      <>
        <div className="flex-1 flex flex-col px-14 pt-11 pb-5 gap-3">
          {/* Badge label — driven by Sub-heading field in Configure panel */}
          <p className={`text-[#888] text-[15px] tracking-[0.42px] uppercase ${textAlignClass}`}>
            {hc.subHeading || 'SECTION HEADING'}
          </p>

          {/* Heading title — size driven by Heading Level; editable in edit mode */}
          {isEditingHeading ? (
            <input
              type="text"
              value={hc.headingText || ''}
              onChange={(e) => hc.setHeadingText?.(e.target.value)}
              className={`text-[#111] tracking-[-0.52px] leading-[1.3] bg-transparent border-b border-[#c8c6c0] outline-none w-full focus:border-[#111] transition-colors pb-1 ${textAlignClass}`}
              style={{ fontSize: headingLevelSizeMap[hLevel], fontWeight: headingLevelWeightMap[hLevel] }}
              placeholder="Tell us about yourself"
            />
          ) : (
            <p
              className={`text-[#111] tracking-[-0.52px] leading-[1.3] ${textAlignClass}`}
              style={{ fontSize: headingLevelSizeMap[hLevel], fontWeight: headingLevelWeightMap[hLevel] }}
            >
              {hText}
            </p>
          )}

          {/* Answer area — size driven by Text Size; pinned to bottom, grows upward as content fills */}
          <div className="flex-1 flex flex-col justify-end pb-2 pt-4">
            {isEditingHeading ? (
              <textarea
                value={hc.headingAnswerText || ''}
                onChange={(e) => hc.setHeadingAnswerText?.(e.target.value)}
                rows={1}
                className={`text-[#555] font-light leading-[1.6] bg-transparent border-b border-[#111] outline-none w-full resize-none transition-colors pb-[11px] pt-[10px] ${textAlignClass}`}
                style={{ fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', fontSize: answerTextSizeMap[hSize] }}
                placeholder="Type your answer here…"
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
            ) : (
              <div className="border-b border-[#111] pb-[11px] pt-[10px]">
                <p
                  className={`font-light ${hc.headingAnswerText ? 'text-[#333]' : 'text-[#aaa]'}`}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: answerTextSizeMap[hSize] }}
                >
                  {hc.headingAnswerText || 'Type your answer here…'}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-[rgba(0,0,0,0.1)] flex items-center gap-2 px-14 py-[19px]">
          {isEditingHeading ? (
            <button
              onClick={hc.onEditToggle}
              className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
            >
              ← Back
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
      </>
    );
  } else if (cardKey === 'buildingBlocks:Description') {
    const dc = descriptionConfig || {};
    const dcContent = dc.descriptionContent || 'This field is required only if you are currently employed full time. If not, you can skip ahead to the next section.';
    const dcSize = dc.descriptionTextSize || 'M';
    const dcAlign = dc.descriptionAlignment || 'left';
    const dcFormatting = dc.descriptionFormatting || {};
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
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col px-[28px] pt-[32px] pb-[20px] gap-[8px]">
          {/* Block type label */}
          <span
            className="text-[13px] font-semibold tracking-[1.4px] uppercase text-black"
            style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
          >
            Description
          </span>
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
            <p
              className={`text-[#6b6860] leading-[23px] ${textAlignClass}`}
              style={{ ...contentStyle, fontFamily: "'Geist', sans-serif" }}
            >
              {dcContent}
            </p>
          </div>
        </div>
        {/* Input area + gray line just above footer */}
        <div className="px-[28px] pt-[4px] pb-[0px]">
          <div className="border-b border-[#111] pb-[11px]">
            <p
              className="text-black text-[17px] font-light"
              style={{ fontFamily: "'DM Sans', sans-serif", fontVariationSettings: "'opsz' 14" }}
            >
              Type your answer here…
            </p>
          </div>
          {dcShowCharCount && (
            <div className="flex justify-end mt-[4px]">
              <span className="text-[#bbb] text-[11px]">
                0{dcCharLimit ? ` / ${dcCharLimit}` : ''}
              </span>
            </div>
          )}
          <div className="h-px bg-[#e4e2dc] mt-[14px]" />
        </div>
        {/* Footer */}
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
        {/* File info bar */}
        <div className="bg-[rgba(0,0,0,0.03)] border-t border-[rgba(0,0,0,0.1)] px-[12px] py-[8px]">
          <p className="text-[11px] text-black font-light">
            {imgCaption || 'image.jpg · uploaded'}
          </p>
        </div>
      </div>
    ) : (
      <button
        onClick={() => imageFileInputRef && imageFileInputRef.current && imageFileInputRef.current.click()}
        className={`bg-[#eceae6] overflow-hidden cursor-pointer hover:bg-[#e4e2de] transition-colors`}
        style={{ borderRadius: imgCornerRadius, ...imgWidthStyle }}
      >
        <div className="flex flex-col items-center justify-center py-[90px] gap-[10px]">
          <RiImageLine size={32} className="text-[#aaa]" />
          <p className="text-[12px] text-black font-light">Image preview</p>
        </div>
        <div className="bg-[rgba(0,0,0,0.03)] border-t border-[rgba(0,0,0,0.1)] px-[12px] py-[8px]">
          <p className="text-[11px] text-black font-light">Click to upload an image</p>
        </div>
      </button>
    );

    content = (
      <div className={`flex flex-col px-14 pt-11 pb-5`}>
        <SectionBadge num={blockNum} label="Short text + Image" />
        <div className={`flex flex-col pt-[10px] ${alignClass}`}>
          {imageArea}
        </div>
        <div className="pt-[15px]">
          <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{imgQuestion}</p>
        </div>
        <p className="text-[#888] text-[13px] font-light mt-[1px] mb-[19.8px] leading-[20.8px]">{imgDescription}</p>
        <div className="border-b border-[rgba(0,0,0,0.16)] pb-[11px] pt-[10px]">
          <p className="text-black text-[15px] font-light">{imgAnswerText || 'Type your answer here…'}</p>
        </div>
        <div className="flex items-center justify-between pt-[4px] pb-[18px]">
          <span className="text-[11px] text-black font-light">Press Enter ↵ to continue</span>
          <span className="text-[11px] text-black">0 / 200</span>
        </div>
        <div className="border-t border-[rgba(0,0,0,0.1)] flex gap-[7px] items-center pt-[19px]">
          <button
            onClick={() => imageFileInputRef && imageFileInputRef.current && imageFileInputRef.current.click()}
            className="flex items-center gap-[5px] px-[14px] py-[8px] rounded-[8px] bg-white/70 border border-[rgba(0,0,0,0.16)] text-[#444] text-[12px] cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-colors whitespace-nowrap"
          >
            <RiImageLine size={12} className="shrink-0" />
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
      </div>
    );
  } else if (cardKey === 'buildingBlocks:Video') {
    const vc = videoConfig || {};
    const vUrl = vc.videoUrl || '';
    const vQuestion = vc.videoQuestion || 'After watching the video, what are your thoughts?';
    const vDescription = vc.videoDescription || 'Share your honest feedback about the product demo.';
    const vCaption = vc.videoCaption || '';
    const vCornerRadius = vc.videoCornerRadius ?? 8;
    const getEmbedUrl = (url) => {
      if (!url) return null;
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (url.includes('vimeo.com')) {
        const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
      }
      return null;
    };
    const embedUrl = getEmbedUrl(vUrl);
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Video with question" />
          <div className="pt-[10px] mb-4">
            <div className="overflow-hidden" style={{ borderRadius: vCornerRadius, border: '1px solid rgba(0,0,0,0.1)' }}>
              {embedUrl ? (
                <>
                  <iframe
                    src={embedUrl}
                    className="w-full"
                    style={{ aspectRatio: '16/9', display: 'block' }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="bg-[rgba(0,0,0,0.02)] border-t border-[rgba(0,0,0,0.07)] px-3 py-[7px]">
                    <p className="text-[11px] text-[#888]">{vCaption || 'Video'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#eceae6] flex flex-col items-center justify-center py-16 gap-3">
                    <RiVideoLine size={28} className="text-[#aaa]" />
                    <p className="text-[#888] text-[13px]">Paste a YouTube or Vimeo URL</p>
                  </div>
                  <div className="bg-[rgba(0,0,0,0.02)] border-t border-[rgba(0,0,0,0.07)] px-3 py-[7px]">
                    <p className="text-[11px] text-[#888]">{vCaption || 'Click to configure video'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="pt-[4px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{vQuestion}</p>
          </div>
          <p className="text-[#888] text-[13px] font-light mt-[1px] mb-[15px]">{vDescription}</p>
          <div className="border border-[rgba(0,0,0,0.1)] rounded-[8px] px-4 py-3 min-h-[80px] mb-3">
            <p className="text-[#bbb] text-[14px] font-light">Type your answer here…</p>
          </div>
          <div className="flex justify-between items-center pb-[14px]">
            <span className="text-[11px] text-[#bbb]">Press Enter ↵ to continue</span>
            <span className="text-[11px] text-[#bbb]">0 / 500</span>
          </div>
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'basicInfo:Contact') {
    const cc = contactConfig || {};
    const cQuestion = cc.contactQuestion || 'How can we get in touch?';
    const cHelperText = cc.contactHelperText || "We'll only reach out if we have a follow-up question.";
    const cFields = cc.contactFields || { firstName: { visible: true }, lastName: { visible: true }, email: { visible: true }, phone: { visible: true }, company: { visible: false } };
    const showFirst = cFields.firstName?.visible !== false;
    const showLast = cFields.lastName?.visible !== false;
    const showEmail = cFields.email?.visible !== false;
    const showPhone = cFields.phone?.visible !== false;
    const showCompany = cFields.company?.visible !== false;
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Contact" />
          <div className="pt-[9px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{cQuestion}</p>
          </div>
          {cHelperText && (
            <p className="text-[#888] text-[13px] font-light mt-[1px] mb-[19px]">{cHelperText}</p>
          )}
          {(showFirst || showLast) && (
            <div className="grid grid-cols-2 gap-4">
              {showFirst && <FormField label={`FIRST NAME${cFields.firstName?.required ? ' *' : ''}`} value="Jane" />}
              {showLast && <FormField label={`LAST NAME${cFields.lastName?.required ? ' *' : ''}`} value="Smith" />}
            </div>
          )}
          {showEmail && (
            <div className="mt-[9px]">
              <FormField label={`EMAIL ADDRESS${cFields.email?.required ? ' *' : ''}`} value="jane@example.com" />
            </div>
          )}
          {showPhone && (
            <div className="mt-[9px]">
              <FormField label={`PHONE${cFields.phone?.required ? ' *' : ' (OPTIONAL)'}`} value="+1 (555) 000-0000" />
            </div>
          )}
          {showCompany && (
            <div className="mt-[9px]">
              <FormField label={`COMPANY${cFields.company?.required ? ' *' : ''}`} value="Acme Inc." />
            </div>
          )}
          <div className="pb-[17px]" />
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'basicInfo:Address') {
    const ac = addressConfig || {};
    const aQuestion = ac.addressQuestion || "What's your mailing address?";
    const aHelperText = ac.addressHelperText || '';
    const aFields = ac.addressFields || { street: { visible: true }, city: { visible: true }, state: { visible: true }, postal: { visible: true }, country: { visible: true } };
    const showStreet = aFields.street?.visible !== false;
    const showCity = aFields.city?.visible !== false;
    const showState = aFields.state?.visible !== false;
    const showPostal = aFields.postal?.visible !== false;
    const showCountry = aFields.country?.visible !== false;
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Address" />
          <div className="pt-[9px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{aQuestion}</p>
          </div>
          {aHelperText && <p className="text-[#888] text-[13px] font-light mt-[1px]">{aHelperText}</p>}
          {showStreet && (
            <div className="mt-[19px]">
              <FormField label={`STREET ADDRESS${aFields.street?.required ? ' *' : ''}`} value="123 Main Street" />
            </div>
          )}
          {(showCity || showState) && (
            <div className="grid grid-cols-2 gap-4 mt-[9px]">
              {showCity && <FormField label={`CITY${aFields.city?.required ? ' *' : ''}`} value="San Francisco" />}
              {showState && <FormField label={`STATE / REGION${aFields.state?.required ? ' *' : ''}`} value="California" />}
            </div>
          )}
          {(showPostal || showCountry) && (
            <div className="grid grid-cols-2 gap-4 mt-[9px] pb-[17px]">
              {showPostal && <FormField label={`POSTAL CODE${aFields.postal?.required ? ' *' : ''}`} value="94103" />}
              {showCountry && <FormField label={`COUNTRY${aFields.country?.required ? ' *' : ''}`} value="United States" />}
            </div>
          )}
          {!showPostal && !showCountry && <div className="pb-[17px]" />}
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'basicInfo:Work Info') {
    const wc = workConfig || {};
    const wQuestion = wc.workQuestion || 'Tell us about your role';
    const wHelperText = wc.workHelperText || '';
    const wFields = wc.workFields || { company: { visible: true }, title: { visible: true }, industry: { visible: true }, teamSize: { visible: true } };
    const showWCompany = wFields.company?.visible !== false;
    const showTitle = wFields.title?.visible !== false;
    const showIndustry = wFields.industry?.visible !== false;
    const showTeamSize = wFields.teamSize?.visible !== false;
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Work Info" />
          <div className="pt-[9px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{wQuestion}</p>
          </div>
          {wHelperText && <p className="text-[#888] text-[13px] font-light mt-[1px]">{wHelperText}</p>}
          {(showWCompany || showTitle) && (
            <div className="grid grid-cols-2 gap-4 mt-[19px]">
              {showWCompany && <FormField label={`COMPANY${wFields.company?.required ? ' *' : ''}`} value="Acme Inc." />}
              {showTitle && <FormField label={`JOB TITLE${wFields.title?.required ? ' *' : ''}`} value="Product Manager" />}
            </div>
          )}
          {(showIndustry || showTeamSize) && (
            <div className="grid grid-cols-2 gap-4 mt-[9px] pb-[17px]">
              {showIndustry && <FormField label={`INDUSTRY${wFields.industry?.required ? ' *' : ''}`} value="Technology" />}
              {showTeamSize && <FormField label={`TEAM SIZE${wFields.teamSize?.required ? ' *' : ''}`} value="11–50 people" />}
            </div>
          )}
          {!showIndustry && !showTeamSize && <div className="pb-[17px]" />}
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'qualitative:Short text') {
    const stc = shortTextConfig || {};
    const stQuestion = stc.shortTextQuestion || "What's your name?";
    const stHelper = stc.shortTextHelperText || 'Please enter your full name as it appears on official documents.';
    const stPlaceholder = stc.shortTextPlaceholder || 'Type your answer here…';
    const stMaxChars = stc.shortTextMaxChars ?? 100;
    const stAlign = stc.shortTextAlign || 'left';
    const stSize = stc.shortTextSize || 'M';
    const stFontSize = { S: '16px', M: '20px', L: '24px' }[stSize] || '20px';
    const stTextAlign = stAlign === 'center' ? 'text-center' : stAlign === 'right' ? 'text-right' : 'text-left';
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Short text" />
          <div className="pt-[9px]">
            <p className={`font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] ${stTextAlign}`} style={{ fontSize: stFontSize, fontWeight: '600' }}>{stQuestion}</p>
          </div>
          {stHelper && (
            <p className={`text-[#888] text-[13px] font-light mt-[1px] ${stTextAlign}`}>{stHelper}</p>
          )}
          <div className="mt-[19px]">
            <div className="border-b-2 border-[rgba(0,0,0,0.12)] pb-[10px] pt-[8px]">
              <p className={`text-[#bbb] text-[14px] font-light ${stTextAlign}`}>{stPlaceholder}</p>
            </div>
            <div className="flex justify-between items-center pt-[11px] pb-[9px]">
              <p className="text-[#bbb] text-[11px]">Short answer</p>
              <p className="text-[#bbb] text-[11px]">0 / {stMaxChars}</p>
            </div>
          </div>
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'qualitative:Long text') {
    const ltc = longTextConfig || {};
    const ltQuestion = ltc.longTextQuestion || 'Tell us about your experience';
    const ltHelper = ltc.longTextHelperText || "Share as much or as little as you'd like.";
    const ltPlaceholder = ltc.longTextPlaceholder || 'Type your answer here…';
    const ltMaxChars = ltc.longTextMaxChars ?? 500;
    const ltAlign = ltc.longTextAlign || 'left';
    const ltSize = ltc.longTextSize || 'M';
    const ltFontSize = { S: '16px', M: '20px', L: '24px' }[ltSize] || '20px';
    const ltTextAlign = ltAlign === 'center' ? 'text-center' : ltAlign === 'right' ? 'text-right' : 'text-left';
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Long text" />
          <div className="pt-[9px]">
            <p className={`font-semibold text-[#111] tracking-[-0.52px] leading-[1.3] ${ltTextAlign}`} style={{ fontSize: ltFontSize, fontWeight: '600' }}>{ltQuestion}</p>
          </div>
          {ltHelper && (
            <p className={`text-[#888] text-[13px] font-light mt-[1px] ${ltTextAlign}`}>{ltHelper}</p>
          )}
          <div className="mt-[19px]">
            <div className="border border-[rgba(0,0,0,0.1)] rounded-[8px] px-4 py-3 min-h-[120px]">
              <p className={`text-[#bbb] text-[14px] font-light ${ltTextAlign}`}>{ltPlaceholder}</p>
            </div>
            <div className="flex justify-between items-center pt-[11px] pb-[9px]">
              <p className="text-[#bbb] text-[11px]">Long answer</p>
              <p className="text-[#bbb] text-[11px]">0 / {ltMaxChars}</p>
            </div>
          </div>
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'choiceBased:Single') {
    const sc = singleConfig || {};
    const sQuestion = sc.singleQuestion || 'How did you hear about us?';
    const sHelper = sc.singleHelperText || 'Choose the option that best describes your experience.';
    const sOpts = sc.singleOptions || ['Social media', 'Search engine', 'Friend / colleague', 'Advertisement'];
    const sLayout = sc.singleLayout || 'List';
    const sAllowOther = sc.singleAllowOther ?? true;
    const sHeight = sc.singleOptionHeight || 'M';
    const sHeightPy = sHeight === 'S' ? 'py-[8px]' : sHeight === 'L' ? 'py-[18px]' : 'py-[13px]';
    const allOpts = sAllowOther ? [...sOpts, 'Other'] : sOpts;
    const isList = sLayout === 'List';
    const is2col = sLayout === '2col';
    const onOpenPanel = sc.onOpenPanel;
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5 min-h-0 flex-1">
          <SectionBadge num={blockNum} label="Single choice" />
          <div className="pt-[9px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{sQuestion}</p>
          </div>
          {sHelper && <p className="text-[#888] text-[13px] font-light mt-[1px] mb-[19px]">{sHelper}</p>}
          <div className={`mb-5 overflow-y-auto max-h-[320px] ${isList ? 'flex flex-col' : is2col ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-3 gap-2'}`}>
            {allOpts.map((opt, i) => {
              const isOther = sAllowOther && i === allOpts.length - 1;
              if (isList) {
                return (
                  <div
                    key={opt}
                    className={`flex items-center gap-4 px-4 ${sHeightPy} border-x border-b ${i === 0 ? 'border-t rounded-t-[8px]' : ''} ${i === allOpts.length - 1 ? 'rounded-b-[8px]' : ''} ${isOther ? 'border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.01)]' : 'border-[rgba(0,0,0,0.08)]'}`}
                  >
                    <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 shrink-0 border-[rgba(0,0,0,0.2)]" />
                    <span className={`text-[14px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                  </div>
                );
              }
              return (
                <div
                  key={opt}
                  className={`flex items-center gap-3 px-3 ${sHeightPy} border rounded-[8px] border-[rgba(0,0,0,0.08)] ${isOther ? 'bg-[rgba(0,0,0,0.01)]' : ''}`}
                >
                  <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 shrink-0 border-[rgba(0,0,0,0.2)]" />
                  <span className={`text-[13px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
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
      </>
    );
  } else if (cardKey === 'choiceBased:Multiple') {
    const mc = multipleConfig || {};
    const mQuestion = mc.multipleQuestion || 'Which features do you use most?';
    const mHelper = mc.multipleHelperText || 'Select all that apply.';
    const mOpts = mc.multipleOptions || ['Dashboard', 'Reports', 'Integrations', 'Analytics'];
    const mLayout = mc.multipleLayout || 'List';
    const mAllowOther = mc.multipleAllowOther ?? false;
    const mMultipleSelect = mc.multipleMultipleSelect ?? false;
    const mHeight = mc.multipleOptionHeight || 'M';
    const mHeightPy = mHeight === 'S' ? 'py-[8px]' : mHeight === 'L' ? 'py-[18px]' : 'py-[13px]';
    const mOnOpenPanel = mc.onOpenPanel;
    const allMOpts = mAllowOther ? [...mOpts, 'Other'] : mOpts;
    const isMList = mLayout === 'List';
    const isM2col = mLayout === '2col';
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5 min-h-0 flex-1">
          <SectionBadge num={blockNum} label="Multiple choice" />
          <div className="pt-[9px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{mQuestion}</p>
          </div>
          {mHelper && <p className="text-[#888] text-[13px] font-light mt-[1px] mb-[19px]">{mHelper}</p>}
          <div className={`mb-5 overflow-y-auto max-h-[320px] ${isMList ? 'flex flex-col' : isM2col ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-3 gap-2'}`}>
            {allMOpts.map((opt, i) => {
              const isOther = mAllowOther && i === allMOpts.length - 1;
              if (isMList) {
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 px-4 ${mHeightPy} border-x border-b ${i === 0 ? 'border-t rounded-t-[8px]' : ''} ${i === allMOpts.length - 1 ? 'rounded-b-[8px]' : ''} ${isOther ? 'border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.01)]' : 'border-[rgba(0,0,0,0.08)]'}`}
                  >
                    <div className={`flex items-center justify-center shrink-0 border-2 border-[rgba(0,0,0,0.2)] ${mMultipleSelect ? 'w-[20px] h-[20px] rounded-[4px]' : 'w-[22px] h-[22px] rounded-full'}`} />
                    <span className={`text-[14px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 ${mHeightPy} border rounded-[8px] border-[rgba(0,0,0,0.08)] ${isOther ? 'bg-[rgba(0,0,0,0.01)]' : ''}`}
                >
                  <div className={`flex items-center justify-center shrink-0 border-2 border-[rgba(0,0,0,0.2)] ${mMultipleSelect ? 'w-[18px] h-[18px] rounded-[4px]' : 'w-[20px] h-[20px] rounded-full'}`} />
                  <span className={`text-[13px] ${isOther ? 'text-[#aaa] italic' : 'text-[#111]'}`}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
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
      </>
    );
  } else if (cardKey === 'choiceBased:Media') {
    const mec = mediaConfig || {};
    const meQuestion = mec.mediaQuestion || 'Choose an image option';
    const meHelper = mec.mediaHelperText || 'Select the image that best represents your answer.';
    const meOpts = mec.mediaOptions || [{ label: 'Option A', image: null }, { label: 'Option B', image: null }, { label: 'Option C', image: null }, { label: 'Option D', image: null }];
    const meAllowMultiple = mec.mediaAllowMultiple || false;
    const meLayout = mec.mediaLayout || '2col';
    const meOptHeight = mec.mediaOptionHeight || 'M';
    const meGridCols = meLayout === 'list' ? 'grid-cols-1' : meLayout === '3col' ? 'grid-cols-3' : 'grid-cols-2';
    const meImgRatio = meOptHeight === 'S' ? '16/4' : meOptHeight === 'L' ? '16/7' : '16/5';
    content = (
      <>
        <div className="flex flex-col px-14 pt-6">
          <SectionBadge num={blockNum} label="Media choice" />
          <div className="pt-[6px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '26px', fontWeight: '600' }}>{meQuestion}</p>
          </div>
          {meHelper && <p className="text-[#888] text-[13px] font-light mt-px mb-[10px]">{meHelper}</p>}
        </div>
        <div className="overflow-y-auto px-14 pb-3" style={{ maxHeight: '290px' }}>
          <div className={`grid ${meGridCols} gap-2`}>
            {meOpts.map((opt, i) => (
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
            ))}
          </div>
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'interactive:Maps') {
    const mapc = mapConfig || {};
    const mapQ = mapc.mapQuestion || 'Where are you located?';
    const mapH = mapc.mapHelperText || 'Click on the map to drop a pin';
    const mapT = mapc.mapType || 'roadmap';
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Maps" />
          <div className="pt-[9px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{mapQ}</p>
          </div>
          {mapH && <p className="text-[#888] text-[13px] font-light mt-[1px] mb-[15px]">{mapH}</p>}
          <div className="border border-[rgba(0,0,0,0.1)] rounded-[12px] overflow-hidden mb-5 bg-[rgba(0,0,0,0.02)]">
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-[#e8e6e0] flex items-center justify-center">
                <RiCompassLine size={22} className="text-[#888]" />
              </div>
              <div className="text-center">
                <p className="text-[#555] text-[13px] font-medium">Map preview</p>
                <p className="text-[#aaa] text-[11px] mt-[3px]">
                  {mapT === 'satellite' ? 'Satellite view' : mapT === 'terrain' ? 'Terrain view' : 'Road map view'}
                </p>
              </div>
            </div>
            <div className="border-t border-[rgba(0,0,0,0.07)] px-4 py-2 flex items-center gap-2">
              <RiCompassLine size={12} className="text-[#bbb]" />
              <span className="text-[11px] text-[#bbb]">Select location on map</span>
            </div>
          </div>
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'interactive:Upload') {
    content = <FileUploadCard blockNum={blockNum} onDelete={onDelete} />;
  } else if (cardKey === 'interactive:Multi-image upload') {
    return <MultiImageUploadCard blockNum={blockNum} onDelete={onDelete} config={multiImageConfig} fullCanvas={fullCanvas} cardColor={cardColor} />;
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
          <div className="pt-[9px]">
            <p className="font-medium text-[#111] tracking-[-0.52px] leading-[32.5px]" style={{ fontSize: '26px' }}>One last check before we submit</p>
          </div>
          <p className="text-[#888] text-[13px] font-light mt-px mb-[19px] leading-[20.8px]">Please confirm you're not a robot.</p>
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
              <span className="text-[16px] leading-none">🔒</span>
              <span className="text-[8px] text-black leading-none">{capLabel}</span>
            </div>
          </div>
        </div>
        <ContentCardFooter onDelete={onDelete} />
      </>
    );
  } else if (cardKey === 'numeric:Rating') {
    const rc = ratingConfig || {};
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
          <div className="pt-[9px]">
            <p className="font-medium text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '26px' }}>How would you rate your overall experience?</p>
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
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'numeric:Time') {
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Time" />
          <div className="pt-[9px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>What time works best for you?</p>
          </div>
          <p className="text-[#888] text-[13px] font-light mt-[1px] mb-[19px]">Select a time that suits your schedule.</p>
          <div className="flex items-center gap-3 mb-5">
            <div className="border border-[rgba(0,0,0,0.12)] rounded-[8px] px-5 py-3 flex items-center gap-2">
              <RiTimeLine size={16} className="text-[#888]" />
              <span className="text-[18px] font-light text-[#111] tracking-[2px]">10:30</span>
            </div>
            <div className="border border-[rgba(0,0,0,0.12)] rounded-[8px] px-4 py-3">
              <span className="text-[14px] text-[#888]">AM</span>
            </div>
          </div>
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else if (cardKey === 'numeric:Date') {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekendIdx = new Set([4, 5, 11, 12, 18, 19, 25, 26]);
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label="Date" />
          <div className="pt-[9px]">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>When's the best date for you?</p>
          </div>
          <p className="text-[#888] text-[13px] font-light mt-[1px] mb-[19px]">Pick a date from the calendar.</p>
          <div className="border border-[rgba(0,0,0,0.12)] rounded-[10px] overflow-hidden mb-5">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(0,0,0,0.07)]">
              <span className="text-[13px] font-medium text-[#111]">May 2026</span>
              <div className="flex gap-3">
                <span className="text-[#888] text-[16px] cursor-pointer leading-none">‹</span>
                <span className="text-[#888] text-[16px] cursor-pointer leading-none">›</span>
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
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  } else {
    content = (
      <>
        <div className="flex flex-col px-14 pt-11 pb-5">
          <SectionBadge num={blockNum} label={label} />
          <div className="pt-[9px] pb-5">
            <p className="font-semibold text-[#111] tracking-[-0.52px] leading-[1.3]" style={{ fontSize: '32px', fontWeight: '600' }}>{label}</p>
          </div>
          <p className="text-[#888] text-[13px] font-light pb-5">
            This is a {label.toLowerCase()} field for collecting respondent data.
          </p>
        </div>
        <ContentCardFooter onDelete={onDelete} variant="field" />
      </>
    );
  }

  const isImageCard = cardKey === 'buildingBlocks:Images';

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {isImageCard ? (
        <div className="flex-1 flex flex-col gap-[6px]">
          <div className="flex gap-[14px] items-center pb-[8px] pt-[6px]">
            <span className="text-[9.5px] font-semibold tracking-[1.52px] uppercase text-black whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              IMAGE WITH QUESTION
            </span>
            <div className="flex-1 h-px bg-[rgba(0,0,0,0.1)]" />
          </div>
          <CardShell fullCanvas={fullCanvas} cardColor={cardColor}>{content}</CardShell>
        </div>
      ) : (
        <CardShell fullCanvas={fullCanvas} cardColor={cardColor}>{content}</CardShell>
      )}
    </motion.div>
  );
};

/* ── Essentials → ContentCard block mapping (for intro screen) ── */
const ESSENTIAL_TO_BLOCK = {
  'CTA':         { section: 'buildingBlocks', label: 'CTA' },
  'Heading':     { section: 'buildingBlocks', label: 'Heading' },
  'Description': { section: 'buildingBlocks', label: 'Description' },
  'Text Box':    { section: 'qualitative',    label: 'Short text' },
  'Images':      { section: 'buildingBlocks', label: 'Images' },
  'Video':       { section: 'buildingBlocks', label: 'Video' },
  'Captcha':     { section: 'interactive',    label: 'Captcha' },
};

/* ── Form Builder Page ── */
const FormBuilderPage = () => {
  const navigate = useNavigate();
  const [deviceView, setDeviceView] = useState('desktop');
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [screens, setScreens] = useState([]);
  const [activeScreenId, setActiveScreenId] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sections, setSections] = useState({
    essentials: true,
    questionTemplates: false,
    fieldSettings: false,
    appearance: false,
    responseQuality: false,
  });

  /* ── Content panel state ── */
  const [showContentPanel, setShowContentPanel] = useState(false);

  /* ── Design (Customization) panel state ── */
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [designLayoutStyle, setDesignLayoutStyle] = useState('withCard');
  const [designBackground, setDesignBackground] = useState('#f0eee8');
  const [designCardColor, setDesignCardColor] = useState('#f9f9fa');
  const [designCardColorGridOpen, setDesignCardColorGridOpen] = useState(false);
  const [designCardOpacity, setDesignCardOpacity] = useState(74);
  const [designTextColor, setDesignTextColor] = useState('#198eea');
  const [designTypography, setDesignTypography] = useState('default');

  /* ── CTA configure panel state ── */
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
  const [ctaBodySize, setCtaBodySize] = useState(14);
  const [ctaFontWeight, setCtaFontWeight] = useState('Regular');
  const [ctaTextAlign, setCtaTextAlign] = useState('center');
  const [ctaPadding, setCtaPadding] = useState(44);
  const [ctaContentWidth, setCtaContentWidth] = useState('Default');
  const [ctaSections, setCtaSections] = useState({ button: true, typography: true, spacing: true });

  /* ── Heading configure panel state ── */
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

  /* ── Description configure panel state ── */
  const [showDescriptionConfigPanel, setShowDescriptionConfigPanel] = useState(false);
  const [descriptionContent, setDescriptionContent] = useState('');
  const [descriptionHidden, setDescriptionHidden] = useState(false);
  const [descriptionShowCharCount, setDescriptionShowCharCount] = useState(false);
  const [descriptionCharLimit, setDescriptionCharLimit] = useState('');
  const [descriptionFormatting, setDescriptionFormatting] = useState({ bold: false, italic: false, underline: false, link: false, list: false });
  const [descriptionTextSize, setDescriptionTextSize] = useState('M');
  const [descriptionAlignment, setDescriptionAlignment] = useState('left');
  const [descriptionSections, setDescriptionSections] = useState({ fieldSettings: true, conditionalLogic: true, appearance: true });

  /* ── Image configure panel state ── */
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

  /* ── Video configure panel state ── */
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

  /* ── Contact configure panel state ── */
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

  /* ── Address configure panel state ── */
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

  /* ── Work configure panel state ── */
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

  /* ── Short text configure panel state ── */
  const [showShortTextConfigPanel, setShowShortTextConfigPanel] = useState(false);
  const [shortTextRequired, setShortTextRequired] = useState(false);
  const [shortTextHidden, setShortTextHidden] = useState(false);
  const [shortTextQuestion, setShortTextQuestion] = useState("What's your name?");
  const [shortTextHelperText, setShortTextHelperText] = useState('Please enter your full name as it appears on official documents.');
  const [shortTextPlaceholder, setShortTextPlaceholder] = useState('Type your answer here…');
  const [shortTextMinChars, setShortTextMinChars] = useState(0);
  const [shortTextMaxChars, setShortTextMaxChars] = useState(100);
  const [shortTextValidation, setShortTextValidation] = useState('None');
  const [shortTextSize, setShortTextSize] = useState('M');
  const [shortTextAlign, setShortTextAlign] = useState('left');
  const [shortTextSections, setShortTextSections] = useState({ fieldSettings: true, appearance: true, conditionalLogic: false });

  /* ── Long text configure panel state ── */
  const [showLongTextConfigPanel, setShowLongTextConfigPanel] = useState(false);
  const [longTextRequired, setLongTextRequired] = useState(false);
  const [longTextHidden, setLongTextHidden] = useState(false);
  const [longTextQuestion, setLongTextQuestion] = useState('Tell us about your experience');
  const [longTextHelperText, setLongTextHelperText] = useState("Share as much or as little as you'd like.");
  const [longTextPlaceholder, setLongTextPlaceholder] = useState('Type your answer here…');
  const [longTextMinChars, setLongTextMinChars] = useState(0);
  const [longTextMaxChars, setLongTextMaxChars] = useState(500);
  const [longTextValidation, setLongTextValidation] = useState('None');
  const [longTextSize, setLongTextSize] = useState('M');
  const [longTextAlign, setLongTextAlign] = useState('left');
  const [longTextSections, setLongTextSections] = useState({ fieldSettings: true, appearance: true, conditionalLogic: false });

  /* ── Multiple choice configure panel state ── */
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

  /* ── Single choice configure panel state ── */
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

  /* ── Media choices configure panel state ── */
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

  /* ── Map configure panel state ── */
  const [showMapConfigPanel, setShowMapConfigPanel] = useState(false);
  const [mapRequired, setMapRequired] = useState(false);
  const [mapHidden, setMapHidden] = useState(false);
  const [mapQuestion, setMapQuestion] = useState('Where are you located?');
  const [mapHelperText, setMapHelperText] = useState('Click on the map to drop a pin');
  const [mapType, setMapType] = useState('roadmap');
  const [mapZoom, setMapZoom] = useState(10);
  const [mapSections, setMapSections] = useState({ fieldSettings: true, appearance: true, conditionalLogic: false });

  /* ── Captcha configure panel state ── */
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

  /* ── Multi-image upload configure panel state ── */
  const [showMultiImageConfigPanel, setShowMultiImageConfigPanel] = useState(false);
  const [multiImageQuestion, setMultiImageQuestion] = useState('Upload photos of the issue');
  const [multiImageHelperText, setMultiImageHelperText] = useState('Add up to 9 images. Drag to reorder.');
  const [multiImageRequired, setMultiImageRequired] = useState(false);
  const [multiImageMultipleFiles, setMultiImageMultipleFiles] = useState(true);
  const [multiImageMaxFiles, setMultiImageMaxFiles] = useState(5);
  const [multiImageMaxFileSize, setMultiImageMaxFileSize] = useState('25 MB');
  const [multiImageSizeDropdownOpen, setMultiImageSizeDropdownOpen] = useState(false);
  const [multiImageAcceptedTypes, setMultiImageAcceptedTypes] = useState(['PDF', 'PNG', 'JPG', 'DOCX']);
  const [multiImageUploadZoneSize, setMultiImageUploadZoneSize] = useState('Default');
  const [multiImageShowPreview, setMultiImageShowPreview] = useState(true);
  const [multiImageSections, setMultiImageSections] = useState({ fieldSettings: true, appearance: true });

  /* ── Rating configure panel state ── */
  const [showRatingConfigPanel, setShowRatingConfigPanel] = useState(false);
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

  /* ── Add/remove content screens ── */
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
    setScreens((prev) => [...prev, newScreen]);
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
    } else if (itemLabel === 'Multi-image upload') {
      setShowMultiImageConfigPanel(true);
    }
  };

  const removeContentScreen = (screenId) => {
    if (activeScreenId === screenId) {
      closeAllRightPanels();
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

  /* ── Intro essential variant (null = show default welcome card) ── */
  const [introEssential, setIntroEssential] = useState(null);

  /* ── Default welcome card content state ── */
  const [introTitle, setIntroTitle] = useState('Title');
  const [introDescription, setIntroDescription] = useState('Add the purpose of form here');
  const [introButtonText, setIntroButtonText] = useState('Start →');
  const [logoImage, setLogoImage] = useState(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [draftTitle, setDraftTitle] = useState('Title');
  const [draftDescription, setDraftDescription] = useState('Add the purpose of form here');
  const [draftButtonText, setDraftButtonText] = useState('Start →');
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
    setShowDesignPanel(false);
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
      const newScreen = { id: 1, name: 'Start Screen', type: 'intro' };
      setScreens([newScreen]);
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

  const handleDeleteScreen = () => {
    setScreens([]);
    setActiveScreenId(null);
    closeAllRightPanels();
    setIntroEssential(null);
    setIsEditingContent(false);
    setLogoImage(null);
    setIntroTitle('Title');
    setIntroDescription('Add the purpose of form here');
    setIntroButtonText('Start →');
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
  const contentScreens = screens.filter((s) => s.type === 'content');
  const contentBlockNum = contentScreens.findIndex((s) => s.id === activeScreenId) + 1;
  const activeScreenIdx = screens.findIndex((s) => s.id === activeScreenId);
  const prevScreen = activeScreenIdx > 0 ? screens[activeScreenIdx - 1] : null;
  const nextScreen = activeScreenIdx < screens.length - 1 ? screens[activeScreenIdx + 1] : null;

  /* ── Responsive canvas scaling ── */
  // Base "design" resolution the form is authored at
  const CANVAS_BASE_W = deviceView === 'mobile' ? 390 : 820;
  const CANVAS_BASE_H = deviceView === 'mobile' ? 780 : 560;
  const CANVAS_PAD = 40; // px gap around the scaled frame

  const canvasContainerRef = useRef(null);
  const [canvasScale, setCanvasScale] = useState(0);

  const updateScale = useCallback(() => {
    const el = canvasContainerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* ── Topbar ── */}
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
          <button className="px-[15px] py-[8px] bg-[#1a1a1a] border border-[#1a1a1a] rounded-[8px] text-[12px] font-medium text-white hover:bg-[#2c2c2c] transition-colors cursor-pointer whitespace-nowrap">
            continue →
          </button>
        </div>
      </header>
      )}

      {/* ── Body: Sidebar + Screens Panel + Content + Config Panel ── */}
      <LayoutGroup>
      <div className="flex flex-1 overflow-hidden">
        {/* ── Icon sidebar (collapsible) ── */}
        {!isPreview && <Sidebar hideLogo />}

        {/* ── Screens panel (visible after first screen is added) ── */}
        {!isPreview && hasScreens && (
          <motion.div
            key="screens-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="shrink-0 bg-[#f7f7f8] border-r border-[#e4e2dc] flex flex-col overflow-hidden"
            style={{ width: 200 }}
          >
            <div className="w-[200px] flex flex-col h-full overflow-hidden">
              {/* Add screen button - sticky at top */}
              <div className="px-[15px] py-4 shrink-0">
                <button
                  onClick={handleAddScreen}
                  className="w-full flex items-center gap-1 bg-[#272727] text-white text-[12px] font-normal px-3 py-[8px] rounded-[6px] justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                >
                  <RiAddLine size={12} className="shrink-0" />
                  Add screen
                </button>
              </div>

              {/* Screen list - scrollable */}
              <div className="flex flex-col flex-1 overflow-y-auto">
                {screens.map((screen, idx) => (
                  <button
                    key={screen.id}
                    onClick={() => {
                      const LABEL_TO_PANEL = {
                        'CTA': 'ctaConfig',
                        'Heading': 'headingConfig',
                        'Description': 'descriptionConfig',
                        'Images': 'imageConfig',
                        'Video': 'videoConfig',
                        'Contact': 'contactConfig',
                        'Address': 'addressConfig',
                        'Work Info': 'workConfig',
                        'Short text': 'shortTextConfig',
                        'Long text': 'longTextConfig',
                        'Single': 'singleConfig',
                        'Multiple': 'multipleConfig',
                        'Media': 'mediaConfig',
                        'Maps': 'mapConfig',
                        'Captcha': 'captchaConfig',
                        'Multi-image upload': 'multiImageConfig',
                        'Rating': 'ratingConfig',
                      };
                      const PANEL_OPEN_STATE = {
                        'ctaConfig': showCtaConfigPanel,
                        'headingConfig': showHeadingConfigPanel,
                        'descriptionConfig': showDescriptionConfigPanel,
                        'imageConfig': showImageConfigPanel,
                        'videoConfig': showVideoConfigPanel,
                        'contactConfig': showContactConfigPanel,
                        'addressConfig': showAddressConfigPanel,
                        'workConfig': showWorkConfigPanel,
                        'shortTextConfig': showShortTextConfigPanel,
                        'longTextConfig': showLongTextConfigPanel,
                        'singleConfig': showSingleConfigPanel,
                        'multipleConfig': showMultipleConfigPanel,
                        'mediaConfig': showMediaConfigPanel,
                        'mapConfig': showMapConfigPanel,
                        'captchaConfig': showCaptchaConfigPanel,
                        'multiImageConfig': showMultiImageConfigPanel,
                        'ratingConfig': showRatingConfigPanel,
                        'config': showConfigPanel,
                      };

                      const isSameCard = activeScreenId === screen.id;
                      setActiveScreenId(screen.id);

                      const targetPanel = screen.type === 'intro' ? 'config' : LABEL_TO_PANEL[screen.label] || null;
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
                    }}
                    className={`flex items-center gap-2 px-[14px] py-[9px] w-full text-left transition-colors cursor-pointer ${
                      activeScreenId === screen.id
                        ? 'bg-white/60'
                        : 'hover:bg-white/40'
                    }`}
                  >
                    <div
                      className={`w-[30px] h-[30px] rounded-[7px] flex items-center justify-center shrink-0 text-[10px] font-semibold ${
                        screen.type === 'intro'
                          ? 'bg-[#eef2ff] text-indigo-500'
                          : 'bg-[#f0fdf4] text-emerald-600'
                      }`}
                    >
                      {screen.type === 'intro' ? (
                        <RiFileTextLine size={15} />
                      ) : (
                        <span>{idx}</span>
                      )}
                    </div>
                    <span className="text-[#1a1a1c] text-[12px] font-medium leading-none truncate">
                      {screen.name}
                    </span>
                  </button>
                ))}
              </div>
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

        {/* ── Main content area ── */}
        <motion.div
          layout
          transition={{ layout: { duration: 0.25, ease: [0.32, 0.72, 0, 1] } }}
          className={`flex-1 flex flex-col overflow-hidden min-w-0 ${isPreview ? 'bg-[#f5f4f0]' : 'bg-white'}`}
        >
          {/* Tab bar */}
          {!isPreview && (
          <div className="bg-white border-b border-[rgba(226,232,240,0.8)] flex items-center gap-[6px] px-[7px] h-[40px] shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'design') {
                    closeAllRightPanels();
                    setShowDesignPanel(true);
                  } else {
                    setShowDesignPanel(false);
                  }
                }}
                className={`h-full flex items-center gap-2 px-4 text-[14px] cursor-pointer transition-colors whitespace-nowrap ${
                  tab.id === activeTab
                    ? 'border-b-2 border-black text-black font-normal'
                    : 'text-[#8c8a84] font-medium hover:text-[#1a1a1a] border-b-2 border-transparent'
                }`}
              >
                <tab.icon size={16} className="shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
          )}

          {/* Canvas */}
          {!hasScreens ? (
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
          ) : (
            /* ── Scaled preview canvas ── */
            <motion.div
              layout
              ref={canvasContainerRef}
              className="flex-1 overflow-hidden relative flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: isPreview ? '#f5f4f0' : designBackground }}
            >
              {/* Scaled form frame — transparent, just a scaling container */}
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
                {showContentPanel ? (
                  /* ── Empty state while user selects a content block ── */
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
                        /* ── Essential selected: show matching ContentCard ── */
                        <motion.div
                          key={`intro-essential-${introEssential}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="h-full p-5 flex flex-col"
                        >
                          <div className="w-full flex-1 flex flex-col">
                            <ContentCard
                              block={ESSENTIAL_TO_BLOCK[introEssential]}
                              blockNum={1}
                              onDelete={handleDeleteScreen}
                              fullCanvas={designLayoutStyle === 'fullCanvas'}
                              cardColor={hexToRgba(designCardColor, designCardOpacity)}
                              ctaConfig={{ ctaButtonLabel, ctaButtonSize, ctaButtonStyle, ctaCornerRadius, ctaShowIcon, ctaHeadingSize, ctaBodySize, ctaFontWeight, ctaTextAlign, ctaPadding, ctaTextColor, ctaBtnColor }}
                              headingConfig={{ headingText, subHeading, headingRequired, headingHidden, headingLevel, headingTextSize, headingAlignment, headingFontWeight, isEditingCard: isEditingHeadingCard, onEditToggle: () => setIsEditingHeadingCard(p => !p), setHeadingText, setSubHeading, headingAnswerText, setHeadingAnswerText }}
                              descriptionConfig={{ descriptionContent, descriptionHidden, descriptionShowCharCount, descriptionCharLimit, descriptionFormatting, descriptionTextSize, descriptionAlignment }}
                              imageConfig={{ imageHidden, imagePreview, imageAltText, imageCaption, imageLinkOnClick, imageLinkUrl, imageOpenInNewTab, imageAlignment, imageWidth, imageCornerRadius, imageQuestion, imageDescription, onRemoveImage: () => { setImagePreview(null); setImageFileName(''); } }}
                              imageFileInputRef={imageFileInputRef}
                              videoConfig={{ videoUrl, videoCaption, videoWidth, videoAspectRatio, videoCornerRadius, videoQuestion, videoDescription, videoRequired, videoHidden, videoLoop, videoAutoplay, videoShowControls, videoSource }}
                              contactConfig={{ contactQuestion, contactHelperText, contactFields, contactRequired }}
                              addressConfig={{ addressQuestion, addressHelperText, addressFields, addressRequired }}
                              workConfig={{ workQuestion, workHelperText, workFields, workRequired }}
                              shortTextConfig={{ shortTextQuestion, shortTextHelperText, shortTextPlaceholder, shortTextMaxChars, shortTextAlign, shortTextSize, shortTextRequired, shortTextHidden }}
                              longTextConfig={{ longTextQuestion, longTextHelperText, longTextPlaceholder, longTextMaxChars, longTextAlign, longTextSize, longTextRequired, longTextHidden }}
                              singleConfig={{ singleQuestion, singleHelperText, singleOptions, singleLayout, singleOptionHeight, singleRequired, singleAllowOther, singleRandomize, singleMultipleSelect, singleMinChoices, singleMaxChoices, singleShowKeyboardHints, onOpenPanel: () => { closeAllRightPanels(); setTimeout(() => setShowSingleConfigPanel(true), 300); } }}
                              multipleConfig={{ multipleQuestion, multipleHelperText, multipleOptions, multipleLayout, multipleRequired, multipleAllowOther, multipleRandomize, multipleMultipleSelect, multipleMinChoices, multipleMaxChoices, multipleShowKeyboardHints, multipleOptionHeight, onOpenPanel: () => { closeAllRightPanels(); setTimeout(() => setShowMultipleConfigPanel(true), 300); } }}
                              mediaConfig={{ mediaQuestion, mediaHelperText, mediaOptions, mediaAllowMultiple, mediaRequired, mediaRandomiseOrder, mediaMinChoices, mediaMaxChoices, mediaLayout, mediaOptionHeight }}
                              mapConfig={{ mapQuestion, mapHelperText, mapType, mapZoom, mapRequired, mapHidden }}
                              captchaConfig={{ captchaProvider, captchaSiteKey, captchaEnabled, captchaVisibility }}
                              multiImageConfig={{ question: multiImageQuestion, helperText: multiImageHelperText, maxFiles: multiImageMaxFiles, required: multiImageRequired, multipleFiles: multiImageMultipleFiles }}
                              ratingConfig={{ ratingRequired, ratingUseScale, ratingUseSlider, ratingMaxRating, ratingStyle, ratingLowLabel, ratingHighLabel, ratingShowLabels, ratingIconSize }}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        /* ── Default welcome card ── */
                        <motion.div
                          key="intro-screen"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="h-full p-5 flex flex-col"
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
                              background: hexToRgba(designCardColor, designCardOpacity),
                              boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.05), 0px 8px 32px 0px rgba(0,0,0,0.07)',
                              border: '1px solid rgba(0,0,0,0.07)',
                            }}
                          >
                            {/* Card body */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-[52px] py-[44px]">
                              {/* Logo upload */}
                              <button
                                onClick={() => isEditingContent && logoInputRef.current?.click()}
                                title={isEditingContent ? 'Click to upload logo' : ''}
                                className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center shrink-0 transition-colors overflow-hidden ${
                                  isEditingContent ? 'cursor-pointer hover:bg-[#2c2c2c]' : 'cursor-default'
                                } ${!draftLogo && !logoImage ? 'bg-[#18181a]' : ''}`}
                                style={(isEditingContent ? draftLogo : logoImage) ? { padding: 0 } : {}}
                              >
                                {(isEditingContent ? draftLogo : logoImage) ? (
                                  <img src={isEditingContent ? draftLogo : logoImage} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                  <RiAddLine size={20} className="text-white" />
                                )}
                              </button>

                              {isEditingContent ? (
                                <input
                                  type="text"
                                  value={draftTitle}
                                  onChange={(e) => setDraftTitle(e.target.value)}
                                  className="text-[#18181a] text-[24px] font-bold leading-[28.8px] text-center bg-transparent border-b border-[#c8c6c0] outline-none w-full max-w-[320px] pb-[2px] focus:border-[#18181a] transition-colors"
                                  placeholder="Title"
                                />
                              ) : (
                                <p className="text-[#18181a] text-[24px] font-bold leading-[28.8px] text-center">{introTitle}</p>
                              )}

                              {isEditingContent ? (
                                <textarea
                                  value={draftDescription}
                                  onChange={(e) => setDraftDescription(e.target.value)}
                                  rows={2}
                                  className="text-[#8c8a84] text-[13px] font-normal text-center bg-transparent border-b border-[#c8c6c0] outline-none w-full max-w-[360px] resize-none pb-[2px] focus:border-[#18181a] transition-colors leading-normal"
                                  placeholder="Add the purpose of form here"
                                />
                              ) : (
                                <p className="text-[#8c8a84] text-[13px] font-normal text-center">{introDescription}</p>
                              )}

                              {isEditingContent ? (
                                <div className="flex items-center gap-2 w-full max-w-[280px]">
                                  <input
                                    type="text"
                                    value={draftButtonText}
                                    onChange={(e) => setDraftButtonText(e.target.value)}
                                    className="bg-[#18181a] text-white text-[14px] font-bold px-[24px] py-[10px] rounded-[8px] outline-none text-center w-full opacity-80"
                                    placeholder="Button label"
                                  />
                                </div>
                              ) : (
                                <button className="bg-[#18181a] text-white text-[14px] font-bold px-[36px] py-[11px] rounded-[8px] cursor-pointer hover:bg-[#2c2c2c] transition-colors whitespace-nowrap">
                                  {introButtonText}
                                </button>
                              )}
                            </div>

                            {/* Card footer */}
                            <div className="border-t border-[rgba(0,0,0,0.1)] flex items-center gap-2 px-[20px] py-[10px] shrink-0">
                              <button
                                onClick={handleDeleteScreen}
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
                                  ← Back
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
                          </motion.div>
                        </motion.div>
                      )
                    ) : activeScreen?.type === 'content' ? (
                      /* ── Content screen card ── */
                      <motion.div
                        key={`content-${activeScreen.id}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="h-full p-5 flex flex-col"
                      >
                        <div className="w-full flex-1 flex flex-col">
                          <ContentCard
                            block={activeScreen}
                            blockNum={contentBlockNum}
                            onDelete={() => removeContentScreen(activeScreen.id)}
                            fullCanvas={designLayoutStyle === 'fullCanvas'}
                            cardColor={hexToRgba(designCardColor, designCardOpacity)}
                            ctaConfig={{ ctaButtonLabel, ctaButtonSize, ctaButtonStyle, ctaCornerRadius, ctaShowIcon, ctaHeadingSize, ctaBodySize, ctaFontWeight, ctaTextAlign, ctaPadding, ctaTextColor, ctaBtnColor }}
                            headingConfig={{ headingText, subHeading, headingRequired, headingHidden, headingLevel, headingTextSize, headingAlignment, headingFontWeight, isEditingCard: isEditingHeadingCard, onEditToggle: () => setIsEditingHeadingCard(p => !p), setHeadingText, setSubHeading, headingAnswerText, setHeadingAnswerText }}
                            descriptionConfig={{ descriptionContent, descriptionHidden, descriptionShowCharCount, descriptionCharLimit, descriptionFormatting, descriptionTextSize, descriptionAlignment }}
                            imageConfig={{ imageHidden, imagePreview, imageAltText, imageCaption, imageLinkOnClick, imageLinkUrl, imageOpenInNewTab, imageAlignment, imageWidth, imageCornerRadius, imageQuestion, imageDescription, onRemoveImage: () => { setImagePreview(null); setImageFileName(''); } }}
                            imageFileInputRef={imageFileInputRef}
                            videoConfig={{ videoUrl, videoCaption, videoWidth, videoAspectRatio, videoCornerRadius, videoQuestion, videoDescription, videoRequired, videoHidden, videoLoop, videoAutoplay, videoShowControls, videoSource }}
                            contactConfig={{ contactQuestion, contactHelperText, contactFields, contactRequired }}
                            addressConfig={{ addressQuestion, addressHelperText, addressFields, addressRequired }}
                            workConfig={{ workQuestion, workHelperText, workFields, workRequired }}
                            shortTextConfig={{ shortTextQuestion, shortTextHelperText, shortTextPlaceholder, shortTextMaxChars, shortTextAlign, shortTextSize, shortTextRequired, shortTextHidden }}
                            longTextConfig={{ longTextQuestion, longTextHelperText, longTextPlaceholder, longTextMaxChars, longTextAlign, longTextSize, longTextRequired, longTextHidden }}
                            singleConfig={{ singleQuestion, singleHelperText, singleOptions, singleLayout, singleOptionHeight, singleRequired, singleAllowOther, singleRandomize, singleMultipleSelect, singleMinChoices, singleMaxChoices, singleShowKeyboardHints, onOpenPanel: () => { closeAllRightPanels(); setTimeout(() => setShowSingleConfigPanel(true), 300); } }}
                            multipleConfig={{ multipleQuestion, multipleHelperText, multipleOptions, multipleLayout, multipleRequired, multipleAllowOther, multipleRandomize, multipleMultipleSelect, multipleMinChoices, multipleMaxChoices, multipleShowKeyboardHints, multipleOptionHeight, onOpenPanel: () => { closeAllRightPanels(); setTimeout(() => setShowMultipleConfigPanel(true), 300); } }}
                            mediaConfig={{ mediaQuestion, mediaHelperText, mediaOptions, mediaAllowMultiple, mediaRequired, mediaRandomiseOrder, mediaMinChoices, mediaMaxChoices, mediaLayout, mediaOptionHeight }}
                            mapConfig={{ mapQuestion, mapHelperText, mapType, mapZoom, mapRequired, mapHidden }}
                            captchaConfig={{ captchaProvider, captchaSiteKey, captchaEnabled, captchaVisibility }}
                            multiImageConfig={{ question: multiImageQuestion, helperText: multiImageHelperText, maxFiles: multiImageMaxFiles, required: multiImageRequired, multipleFiles: multiImageMultipleFiles }}
                            ratingConfig={{ ratingRequired, ratingUseScale, ratingUseSlider, ratingMaxRating, ratingStyle, ratingLowLabel, ratingHighLabel, ratingShowLabels, ratingIconSize }}
                          />
                        </div>
                      </motion.div>
                ) : null}
              </AnimatePresence>
              </div>{/* end scaled frame */}

              {/* ── Viewport / Preview toggle (floating top-right) ── */}
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

          {/* Footer */}
          {!isPreview && (
          <div className="h-[51px] shrink-0 bg-white border-t border-[#e4e2dc] flex items-center px-6">
            {hasScreens ? (
              <>
                <button
                  onClick={() => prevScreen && setActiveScreenId(prevScreen.id)}
                  disabled={!prevScreen}
                  className={`px-[15px] py-[8px] bg-white border border-[#e4e2dc] rounded-[8px] text-[11px] font-medium transition-colors whitespace-nowrap ${
                    prevScreen ? 'text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer' : 'text-[#ccc] cursor-not-allowed'
                  }`}
                >
                  ← Previous
                </button>
                <span className="flex-1 text-center text-[12px] font-normal text-[#7a7a72]">
                  Screen {activeScreenIdx + 1} of {screens.length}
                </span>
                <button
                  onClick={() => nextScreen && setActiveScreenId(nextScreen.id)}
                  disabled={!nextScreen}
                  className={`px-[15px] py-[8px] bg-white border border-[#e4e2dc] rounded-[8px] text-[11px] font-medium transition-colors whitespace-nowrap ${
                    nextScreen ? 'text-[#1a1a1a] hover:bg-[#f4f3ef] cursor-pointer' : 'text-[#ccc] cursor-not-allowed'
                  }`}
                >
                  Next →
                </button>
              </>
            ) : (
              <span className="flex-1 text-center text-[12px] font-normal text-[#7a7a72]">
                No screens added yet
              </span>
            )}
          </div>
          )}

        </motion.div>

        {/* ── Configure panel (right) ── */}
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
                <span className="text-[#6a6a6a] text-[14px] leading-none select-none">×</span>
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
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* ── Content panel (right) – shown when Add Screen is clicked after intro ── */}
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
                  <span className="text-[#6a6a6a] text-[14px] leading-none select-none">×</span>
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

        {/* ── CTA Configure panel (right) ── */}
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
                    <span className="text-[#6a6a6a] text-[10px] leading-none select-none">×</span>
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">

                  {/* ── BUTTON section ── */}
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
                                    color: ctaTextColor,
                                    borderRadius: `${ctaCornerRadius}px`,
                                    border:
                                      ctaButtonStyle === 'Outline'
                                        ? `1.5px solid ${ctaBtnColor}`
                                        : 'none',
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  <span>{ctaButtonLabel || 'Get started'}</span>
                                  {ctaShowIcon && <span>→</span>}
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
                                {/* Color grid – shown only after clicking + */}
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
                                {/* Color grid – shown only after clicking + */}
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
                                  background: ctaShowIcon ? '#111' : '#d0cec8',
                                }}
                              >
                                <div
                                  className="absolute top-[3px] bg-white rounded-[7px]"
                                  style={{
                                    width: 14,
                                    height: 14,
                                    left: ctaShowIcon ? 17 : 3,
                                    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)',
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

                  {/* ── TYPOGRAPHY section ── */}
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

                  {/* ── SPACING section ── */}
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

        {/* ── Heading Configure panel (right) ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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

                  {/* ── FIELD SETTINGS ── */}
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
                                  style={{ background: headingRequired ? '#111' : '#d9d9d9' }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: headingRequired ? 18 : 2,
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.2)',
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
                                  style={{ background: headingHidden ? '#111' : '#d9d9d9' }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: headingHidden ? 18 : 2,
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.2)',
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

                  {/* ── CONDITIONAL LOGIC ── */}
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

                  {/* ── APPEARANCE ── */}
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

        {/* ── Description Configure panel (right) ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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

                  {/* ── FIELD SETTINGS ── */}
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
                                  style={{ background: descriptionHidden ? '#111' : '#d9d9d9' }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: descriptionHidden ? 18 : 2,
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.2)',
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
                                  style={{ background: descriptionShowCharCount ? '#111' : '#d9d9d9' }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: descriptionShowCharCount ? 18 : 2,
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.2)',
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

                  {/* ── CONDITIONAL LOGIC ── */}
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

                  {/* ── APPEARANCE ── */}
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

        {/* ── Image Configure panel (right) ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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

                  {/* ── FIELD SETTINGS ── */}
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
                                  style={{ background: imageHidden ? '#111' : '#d9d9d9' }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: imageHidden ? 18 : 2,
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.2)',
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
                                  <RiImageLine size={16} className="text-[#999]" />
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
                                  style={{ background: imageLinkOnClick ? '#111' : '#d9d9d9' }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: imageLinkOnClick ? 18 : 2,
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.2)',
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
                                  style={{ background: imageOpenInNewTab ? '#111' : '#d9d9d9' }}
                                />
                                <div
                                  className="absolute top-[2px] rounded-[8px] bg-white transition-all duration-200"
                                  style={{
                                    width: 16,
                                    height: 16,
                                    left: imageOpenInNewTab ? 18 : 2,
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.2)',
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

                  {/* ── CONDITIONAL LOGIC ── */}
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

                  {/* ── APPEARANCE ── */}
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

        {/* ── Video Configure panel ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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
                                <button onClick={() => set(!val)} className={`w-8 h-[18px] rounded-full transition-colors relative ${val ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                  <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
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

        {/* ── Contact Configure panel ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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
                              <button onClick={() => setContactRequired(!contactRequired)} className={`w-8 h-[18px] rounded-full transition-colors relative ${contactRequired ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all ${contactRequired ? 'left-[18px]' : 'left-[2px]'}`} />
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
                                    className={`w-7 h-[16px] rounded-full transition-colors relative ${contactFields[key]?.required ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white shadow-sm transition-all ${contactFields[key]?.required ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                  <span className="text-[10px] text-[#aaa]">Show</span>
                                  <button onClick={() => setContactFields((p) => ({ ...p, [key]: { ...p[key], visible: !p[key].visible } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative ${contactFields[key]?.visible !== false ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white shadow-sm transition-all ${contactFields[key]?.visible !== false ? 'left-[16px]' : 'left-[2px]'}`} />
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

        {/* ── Address Configure panel ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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
                              <button onClick={() => setAddressRequired(!addressRequired)} className={`w-8 h-[18px] rounded-full transition-colors relative ${addressRequired ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all ${addressRequired ? 'left-[18px]' : 'left-[2px]'}`} />
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
                                    className={`w-7 h-[16px] rounded-full transition-colors relative ${addressFields[key]?.required ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white shadow-sm transition-all ${addressFields[key]?.required ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                  <span className="text-[10px] text-[#aaa]">Show</span>
                                  <button onClick={() => setAddressFields((p) => ({ ...p, [key]: { ...p[key], visible: !p[key].visible } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative ${addressFields[key]?.visible !== false ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white shadow-sm transition-all ${addressFields[key]?.visible !== false ? 'left-[16px]' : 'left-[2px]'}`} />
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

        {/* ── Work Info Configure panel ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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
                              <button onClick={() => setWorkRequired(!workRequired)} className={`w-8 h-[18px] rounded-full transition-colors relative ${workRequired ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all ${workRequired ? 'left-[18px]' : 'left-[2px]'}`} />
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
                                    className={`w-7 h-[16px] rounded-full transition-colors relative ${workFields[key]?.required ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white shadow-sm transition-all ${workFields[key]?.required ? 'left-[16px]' : 'left-[2px]'}`} />
                                  </button>
                                  <span className="text-[10px] text-[#aaa]">Show</span>
                                  <button onClick={() => setWorkFields((p) => ({ ...p, [key]: { ...p[key], visible: !p[key].visible } }))}
                                    className={`w-7 h-[16px] rounded-full transition-colors relative ${workFields[key]?.visible !== false ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                    <span className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white shadow-sm transition-all ${workFields[key]?.visible !== false ? 'left-[16px]' : 'left-[2px]'}`} />
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

        {/* ── Short Text Configure panel ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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
                                <button onClick={() => set(!val)} className={`w-8 h-[18px] rounded-full transition-colors relative ${val ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                  <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
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
                                {[{ v: 'left', icon: '⬅' }, { v: 'center', icon: '↔' }, { v: 'right', icon: '➡' }].map(({ v, icon }) => (
                                  <button key={v} onClick={() => setShortTextAlign(v)}
                                    className={`flex-1 text-[14px] py-[5px] rounded-[5px] border transition-colors ${shortTextAlign === v ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    {icon}
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

        {/* ── Long Text Configure panel ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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
                                <button onClick={() => set(!val)} className={`w-8 h-[18px] rounded-full transition-colors relative ${val ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                  <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
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
                                {[{ v: 'left', icon: '⬅' }, { v: 'center', icon: '↔' }, { v: 'right', icon: '➡' }].map(({ v, icon }) => (
                                  <button key={v} onClick={() => setLongTextAlign(v)}
                                    className={`flex-1 text-[14px] py-[5px] rounded-[5px] border transition-colors ${longTextAlign === v ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    {icon}
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

        {/* ── Single Choice Configure panel ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
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
                                      className="text-[#d63030] text-[16px] leading-none px-1 cursor-pointer hover:text-[#b02020] shrink-0">×</button>
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
                                  style={{ width: 34, height: 20, borderRadius: 10, background: val ? '#111' : 'rgba(0,0,0,0.15)', padding: 3, display: 'flex', alignItems: 'center', justifyContent: val ? 'flex-end' : 'flex-start' }}
                                >
                                  <span style={{ width: 14, height: 14, borderRadius: 7, background: 'white', boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)', display: 'block' }} />
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
                                  >−</button>
                                  <span className="min-w-[28px] text-center text-[13px] font-medium text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {isInfinite && val === null ? '∞' : val}
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
                                style={{ width: 34, height: 20, borderRadius: 10, background: singleShowKeyboardHints ? '#111' : 'rgba(0,0,0,0.15)', padding: 3, display: 'flex', alignItems: 'center', justifyContent: singleShowKeyboardHints ? 'flex-end' : 'flex-start' }}
                              >
                                <span style={{ width: 14, height: 14, borderRadius: 7, background: 'white', boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)', display: 'block' }} />
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

        {/* ── Multiple Choice Configure panel ── */}
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
                    <span className="text-[#666] text-[11px] leading-none select-none font-medium">×</span>
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">

                  {/* ── FIELD SETTINGS ── */}
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
                                  style={{ width: 34, height: 20, borderRadius: 10, background: val ? '#111' : 'rgba(0,0,0,0.15)', padding: 3, display: 'flex', alignItems: 'center', justifyContent: val ? 'flex-end' : 'flex-start' }}
                                >
                                  <span style={{ width: 14, height: 14, borderRadius: 7, background: 'white', boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)', display: 'block' }} />
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
                                  >−</button>
                                  <span className="min-w-[28px] text-center text-[13px] font-medium text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {isInfinite && val === null ? '∞' : val}
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
                                style={{ width: 34, height: 20, borderRadius: 10, background: multipleShowKeyboardHints ? '#111' : 'rgba(0,0,0,0.15)', padding: 3, display: 'flex', alignItems: 'center', justifyContent: multipleShowKeyboardHints ? 'flex-end' : 'flex-start' }}
                              >
                                <span style={{ width: 14, height: 14, borderRadius: 7, background: 'white', boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2)', display: 'block' }} />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── OPTIONS ── */}
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
                            {/* Options list – scrollable */}
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
                                  >×</button>
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

                  {/* ── APPEARANCE ── */}
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

        {/* ── Media Choices Configure panel ── */}
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
                    <span className="text-[#666] text-[12px] leading-none select-none">✕</span>
                  </button>
                </div>
                {/* Section label */}
                <div className="px-4 pt-[6px] pb-[10px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: 'Arial, sans-serif' }}>MEDIA CHOICE</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  {/* ── FIELD SETTINGS ── */}
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
                                <button onClick={() => set(!val)} className={`w-9 h-5 rounded-[10px] transition-colors relative shrink-0 ${val ? 'bg-[#111]' : 'bg-[#d9d9d9]'}`}>
                                  <span className={`absolute top-[2px] w-4 h-4 rounded-[8px] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.2)] transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
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
                                  className="w-[26px] h-[26px] border border-[#e0e0e0] rounded-[6px] bg-white flex items-center justify-center text-[#555] text-[16px] leading-none cursor-pointer hover:border-[#999] transition-colors">−</button>
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
                                  className="w-[26px] h-[26px] border border-[#e0e0e0] rounded-[6px] bg-white flex items-center justify-center text-[#555] text-[16px] leading-none cursor-pointer hover:border-[#999] transition-colors">−</button>
                                <span className="text-[13px] text-[#222] text-center min-w-[24px]" style={{ fontFamily: 'Arial, sans-serif' }}>{mediaMaxChoices === null ? '∞' : mediaMaxChoices}</span>
                                <button onClick={() => setMediaMaxChoices((v) => v === null ? null : (v >= mediaOptions.length ? null : v + 1))}
                                  className="w-[26px] h-[26px] border border-[#e0e0e0] rounded-[6px] bg-white flex items-center justify-center text-[#555] text-[16px] leading-none cursor-pointer hover:border-[#999] transition-colors">+</button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── OPTIONS ── */}
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
                                        className="absolute top-1 right-1 w-[18px] h-[18px] bg-black/50 rounded-full flex items-center justify-center text-white text-[10px] hover:bg-black/70 transition-colors">×</button>
                                    </div>
                                  ) : (
                                    <div className="bg-[#fafafa] border border-dashed border-[#d0d0d0] rounded-[8px] py-[12px] flex items-center justify-center hover:border-[#999] hover:bg-[#f5f5f5] transition-colors">
                                      <span className="text-[13px] text-[#ccc]" style={{ fontFamily: 'Arial, sans-serif' }}>🖼 Upload image</span>
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
                                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[#d63030] hover:bg-red-50 transition-colors shrink-0 text-[14px] leading-none">×</button>
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

                  {/* ── CONDITIONAL LOGIC ── */}
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
                                <span className="text-[14px] leading-none">⊕</span>
                                <span>Add condition</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── APPEARANCE ── */}
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

        {/* ── Map Configure panel ── */}
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
              <div className="w-[280px] h-full bg-[#f7f6f4] border-l border-[#e5e3dc] flex flex-col" style={{ boxShadow: '-2px 2px 10px 0px rgba(0,0,0,0.08)' }}>
                <div className="border-b border-[rgba(0,0,0,0.09)] flex items-center justify-between py-[13px] px-4 shrink-0">
                  <span className="text-[13px] font-semibold text-[#111] tracking-[-0.13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Configure</span>
                  <button onClick={() => setShowMapConfigPanel(false)} className="w-[22px] h-[22px] bg-[#f2f2f2] rounded-[11px] flex items-center justify-center cursor-pointer hover:bg-[#e5e3dc] transition-colors">
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
                  </button>
                </div>
                <div className="px-4 pt-[10px] pb-[8px] shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>MAP</span>
                </div>
                <div className="flex-1 overflow-y-auto">

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setMapSections((p) => ({ ...p, fieldSettings: !p.fieldSettings }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FIELD SETTINGS</span>
                      <motion.span animate={{ rotate: mapSections.fieldSettings ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {mapSections.fieldSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Question</label>
                              <input type="text" value={mapQuestion} onChange={(e) => setMapQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={mapHelperText} onChange={(e) => setMapHelperText(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>
                            {[
                              { label: 'Required', val: mapRequired, set: setMapRequired },
                              { label: 'Hidden', val: mapHidden, set: setMapHidden },
                            ].map(({ label, val, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]">{label}</span>
                                <button onClick={() => set(!val)} className={`w-8 h-[18px] rounded-full transition-colors relative ${val ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                  <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all ${val ? 'left-[18px]' : 'left-[2px]'}`} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-[rgba(0,0,0,0.06)]">
                    <button onClick={() => setMapSections((p) => ({ ...p, appearance: !p.appearance }))} className="flex items-center justify-between w-full px-4 py-[10px] cursor-pointer">
                      <span className="text-[9.5px] font-bold tracking-[0.7px] uppercase text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>APPEARANCE</span>
                      <motion.span animate={{ rotate: mapSections.appearance ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center shrink-0">
                        <RiArrowDownSLine size={14} className="text-[#999]" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {mapSections.appearance && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 flex flex-col gap-3">
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Map Type</label>
                              <div className="flex flex-col gap-1">
                                {[
                                  { v: 'roadmap', label: 'Road Map' },
                                  { v: 'satellite', label: 'Satellite' },
                                  { v: 'terrain', label: 'Terrain' },
                                ].map(({ v, label }) => (
                                  <button key={v} onClick={() => setMapType(v)}
                                    className={`flex items-center gap-2 px-3 py-[7px] rounded-[6px] border transition-colors text-[12px] ${mapType === v ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[rgba(0,0,0,0.12)] hover:border-[#999]'}`}>
                                    <RiCompassLine size={13} />
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-[6px]">Default Zoom: {mapZoom}</label>
                              <input type="range" min={1} max={20} value={mapZoom} onChange={(e) => setMapZoom(Number(e.target.value))} className="w-full accent-[#111]" />
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

        {/* ── Captcha Configure panel ── */}
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
                    <span className="text-[#666] text-[12px] leading-none select-none">×</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">

                  {/* ── FIELD SETTINGS ── */}
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
                                className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors ${captchaEnabled ? 'bg-[#111]' : 'bg-[#ddd]'}`}
                              >
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all ${captchaEnabled ? 'left-[17px]' : 'left-[3px]'}`} />
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

                  {/* ── BEHAVIOUR ── */}
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
                                className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors ${captchaShowBadge ? 'bg-[#111]' : 'bg-[#ddd]'}`}
                              >
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all ${captchaShowBadge ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                            {/* Badge position — only visible when badge is shown */}
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
                                className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors ${captchaBlockOnFailure ? 'bg-[#111]' : 'bg-[#ddd]'}`}
                              >
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all ${captchaBlockOnFailure ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── CONDITIONAL LOGIC ── */}
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

        {/* ── Multi-image upload Configure panel ── */}
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
                    <span className="text-[#666] text-[12px] leading-none select-none">×</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">

                  {/* ── FIELD SETTINGS ── */}
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
                              <input type="text" value={multiImageQuestion} onChange={(e) => setMultiImageQuestion(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>

                            {/* Helper text */}
                            <div>
                              <label className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.5px] block mb-1">Helper Text</label>
                              <input type="text" value={multiImageHelperText} onChange={(e) => setMultiImageHelperText(e.target.value)}
                                className="w-full border border-[rgba(0,0,0,0.12)] rounded-[6px] px-3 py-[7px] text-[12px] bg-white outline-none focus:border-[#111] transition-colors" />
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[rgba(0,0,0,0.09)]" />

                            {/* Required toggle */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Required</span>
                              <button onClick={() => setMultiImageRequired(p => !p)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors ${multiImageRequired ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all ${multiImageRequired ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                            {/* Multiple files toggle */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] text-[#444]">Multiple files</span>
                              <button onClick={() => setMultiImageMultipleFiles(p => !p)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors ${multiImageMultipleFiles ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all ${multiImageMultipleFiles ? 'left-[17px]' : 'left-[3px]'}`} />
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
                                >−</button>
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
                                  <span>{multiImageMaxFileSize}</span>
                                  <RiArrowDownSLine size={14} className={`text-[#888] transition-transform ${multiImageSizeDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {multiImageSizeDropdownOpen && (
                                  <div className="absolute z-20 left-0 right-0 bg-white border border-t-0 border-[#b0b0ae] rounded-b-[6px] overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.1)]">
                                    {['1 MB', '5 MB', '10 MB', '25 MB', '50 MB', '100 MB', 'No limit'].map(opt => (
                                      <button
                                        key={opt}
                                        onClick={() => { setMultiImageMaxFileSize(opt); setMultiImageSizeDropdownOpen(false); }}
                                        className={`w-full flex items-center justify-between px-[10px] py-[8px] text-[12.5px] cursor-pointer transition-colors ${multiImageMaxFileSize === opt ? 'bg-[#ebebea] font-medium' : 'hover:bg-[#f5f4f0]'} text-[#1a1a1a]`}
                                      >
                                        <span>{opt}</span>
                                        {multiImageMaxFileSize === opt && <span className="text-[11px]">✓</span>}
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

                  {/* ── APPEARANCE ── */}
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
                              <button onClick={() => setMultiImageShowPreview(p => !p)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors ${multiImageShowPreview ? 'bg-[#111]' : 'bg-[#ddd]'}`}>
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all ${multiImageShowPreview ? 'left-[17px]' : 'left-[3px]'}`} />
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

        {/* ── Rating Configure panel ── */}
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
                    <span className="text-[#666] text-[13px] leading-none select-none">×</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">

                  {/* ── FIELD SETTINGS section ── */}
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

                            {/* Toggles: Required, Use scale, Use slider */}
                            {[
                              { label: 'Required', val: ratingRequired, set: setRatingRequired },
                              { label: 'Use scale', val: ratingUseScale, set: setRatingUseScale },
                              { label: 'Use slider', val: ratingUseSlider, set: setRatingUseSlider },
                            ].map(({ label, val, set }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-[12px] text-[#444]">{label}</span>
                                <button onClick={() => set(!val)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors ${val ? 'bg-[#111]' : 'bg-[rgba(0,0,0,0.15)]'}`}>
                                  <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all ${val ? 'left-[17px]' : 'left-[3px]'}`} />
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
                                >−</button>
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
                                    {icon}
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
                              <button onClick={() => setRatingShowLabels((p) => !p)} className={`w-[34px] h-[20px] rounded-[10px] relative transition-colors ${ratingShowLabels ? 'bg-[#111]' : 'bg-[rgba(0,0,0,0.15)]'}`}>
                                <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-[7px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all ${ratingShowLabels ? 'left-[17px]' : 'left-[3px]'}`} />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── APPEARANCE section ── */}
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

        {/* ── Design / Customization panel (right) ── */}
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
                ×
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">

              {/* ── LAYOUT STYLE ── */}
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

              {/* ── BACKGROUND ── */}
              <div className="border-b border-[#e3e1da] flex flex-col gap-2 px-4 py-[13px]">
                {/* Theme preview card */}
                <div className="bg-white border border-[rgba(81,76,84,0.15)] rounded-[12px] overflow-hidden w-full">
                  <div className="bg-[#f7f6f4] h-[80px] p-4 flex items-start">
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[#262627] text-[13px] leading-5" style={{ fontFamily: "'Inter', sans-serif" }}>Question</span>
                      <span className="text-[#262627] text-[13px] leading-5" style={{ fontFamily: "'Inter', sans-serif" }}>Answer</span>
                      <div className="mt-1 bg-[#262627] rounded-[4px] h-[14px] w-[34px]" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-[#3c323e] text-[13px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Eixample</span>
                  </div>
                </div>

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

              {/* ── CARD COLOR ── */}
              <div className="border-b border-[#e4e2dc] flex flex-col gap-3 px-4 py-4">
                <span className="text-[10px] font-semibold tracking-[0.6px] uppercase text-[#7a7a72]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Card Color
                </span>
                <div className="flex items-center gap-[6px]">
                  {['#f9f9fa', '#1a1a2e', '#4a5568'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setDesignCardColor(color)}
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
                          if (/^[0-9A-Fa-f]{0,6}$/.test(val)) setDesignCardColor('#' + val);
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

              {/* ── CARD OPACITY ── */}
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

              {/* ── TEXT COLOR ── */}
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

              {/* ── TYPOGRAPHY ── */}
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
    </div>
  );
};

export default FormBuilderPage;

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RiSearchLine, RiCloseLine, RiTimeLine, RiFileAddLine } from 'react-icons/ri';
import TemplatesSkeleton from '../components/ui/TemplatesSkeleton';

const FILTER_TABS = ['All', 'HR & Recruitment', 'Support', 'Research', 'Education', 'Legal'];

const RECENT_SEARCHES = ['feedback survey', 'HR onboarding', 'NPS'];

const TEMPLATES = [
  {
    id: 1,
    icon: '💼',
    title: 'Job Applications — High-Quality Roles',
    description:
      'Streamline your hiring process for competitive positions with structured evaluation criteria that ensure fairness and depth in candidate assessment.',
    tag: 'HR & RECRUITMENT',
    filter: 'HR & Recruitment',
  },
  {
    id: 2,
    icon: '🎓',
    title: 'Grant & Scholarship Applications',
    description:
      'Built for foundations, universities, and NGOs running competitive, high-value funding programs — where fairness and depth both matter.',
    tag: 'EDUCATION & FUNDING',
    filter: 'Education',
  },
  {
    id: 3,
    icon: '🛠️',
    title: 'Customer Support — Complex & Technical Issues',
    description:
      'Capture detailed information about complex technical problems, enabling your support team to provide more effective solutions faster.',
    tag: 'SUPPORT',
    filter: 'Support',
  },
  {
    id: 4,
    icon: '📋',
    title: 'Consulting & Service Client Intake',
    description:
      'Professional client onboarding forms that gather comprehensive project requirements and expectations from the start.',
    tag: 'PROFESSIONAL SERVICES',
    filter: 'Legal',
  },
  {
    id: 5,
    icon: '⚖️',
    title: 'Compliance, Legal & Financial Submissions',
    description:
      'Secure and thorough forms for handling sensitive compliance, legal documentation, and financial information submissions.',
    tag: 'COMPLIANCE',
    filter: 'Legal',
  },
  {
    id: 6,
    icon: '📊',
    title: 'Performance Reviews & Internal Evaluations',
    description:
      'Comprehensive employee performance review templates that encourage thoughtful feedback and meaningful professional development.',
    tag: 'HR & MANAGEMENT',
    filter: 'HR & Recruitment',
  },
  {
    id: 7,
    icon: '🔬',
    title: 'Research Studies with Incentives',
    description:
      'Perfect for academic researchers, UX teams, and market researchers who need high-quality qualitative responses — not just completed forms.',
    tag: 'RESEARCH',
    filter: 'Research',
  },
  {
    id: 8,
    icon: '📝',
    title: 'RFP & Vendor Submissions (Procurement)',
    description:
      'Structured request for proposal templates that help you collect detailed vendor responses and make informed procurement decisions.',
    tag: 'PROCUREMENT',
    filter: 'Legal',
  },
  {
    id: 9,
    icon: '💡',
    title: 'EdTech & Learning Assessment',
    description:
      'Designed for online learning platforms, bootcamps, and educators collecting reflective assignments — where the quality of thinking matters more than the volume of words.',
    tag: 'EDUCATION',
    filter: 'Education',
  },
];

/* ── Template Card ── */
const TemplateCard = ({ template }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ borderColor: '#d4d2cb' }}
    transition={{ duration: 0.15 }}
    className="bg-white border border-[#e8e7e2] rounded-[12px] p-[25px] flex flex-col gap-0 cursor-pointer"
  >
    <div className="flex gap-4 items-start">
      {/* Icon */}
      <div className="w-[48px] h-[48px] shrink-0 bg-[#f7f6f3] rounded-[8px] flex items-center justify-center text-[24px]">
        {template.icon}
      </div>
      {/* Content */}
      <div className="flex flex-col gap-0 flex-1 min-w-0">
        <h3 className="text-[16px] font-bold text-[#111110] leading-[22.4px] tracking-[-0.1px] mb-[8px]" style={{ fontFamily: 'Arimo, sans-serif' }}>
          {template.title}
        </h3>
        <p className="text-[14px] font-normal text-[#656565] leading-[22.4px] mb-[16px]">
          {template.description}
        </p>
        {/* Category tag */}
        <span className="inline-flex items-center self-start bg-[#f0efe9] rounded-[4px] px-[12px] py-[4px] text-[11px] font-medium text-[#656565] tracking-[0.5px] uppercase leading-[16.5px] whitespace-nowrap">
          {template.tag}
        </span>
      </div>
    </div>
  </motion.div>
);

/* ── Search Result Card ── */
const SearchResultCard = ({ template }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-4 px-4 py-3 hover:bg-[#f7f6f3] cursor-pointer border-b border-[#e8e7e2] last:border-b-0"
  >
    <div className="w-8 h-8 shrink-0 bg-[#f7f6f3] rounded-[6px] border border-[#e8e7e2] flex items-center justify-center text-[16px]">
      {template.icon}
    </div>
    <div className="flex flex-col gap-0 flex-1 min-w-0">
      <span className="text-[14px] font-medium text-[#111110] leading-[18px]">{template.title}</span>
      <span className="text-[13px] font-normal text-[#a8a6a0] leading-[17px]">{template.filter}</span>
    </div>
    <span className="inline-flex items-center bg-[#f0efe9] rounded-[4px] px-[8px] py-[2px] text-[10px] font-medium text-[#656565] tracking-[0.4px] uppercase whitespace-nowrap">
      {template.tag}
    </span>
  </motion.div>
);

const TemplatesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  /* Click outside to close dropdown */
  useEffect(() => {
    const handleClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) setActiveFilter('All');
  };

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleRecentSearch = (term) => {
    setSearchQuery(term);
    setSearchFocused(false);
  };

  /* Filter templates */
  const filterByCategory = (templates) => {
    if (activeFilter === 'All') return templates;
    return templates.filter((t) => t.filter === activeFilter);
  };

  const filterBySearch = (templates) => {
    if (!searchQuery.trim()) return templates;
    const q = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q) ||
        t.filter.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  };

  const isSearchActive = searchQuery.trim().length > 0;
  const displayedTemplates = isSearchActive
    ? filterBySearch(TEMPLATES)
    : filterByCategory(TEMPLATES);

  /* Show recent searches dropdown when focused and no query */
  const showRecentDropdown = searchFocused && !isSearchActive;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full min-h-full"
        >
          <TemplatesSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
          className="w-full min-h-full"
        >
    <div className="bg-white min-h-full w-full">
      <div className="max-w-[1200px] w-full px-[32px] py-[32px]">

        {/* ── Header ── */}
        <div className="flex flex-col gap-[8px] mb-[32px]">
          <h1 className="text-[28px] font-semibold text-[#111110] leading-[42px] tracking-[-0.56px]">
            Form Templates
          </h1>
          <p className="text-[15px] font-normal text-[#656565] leading-[24px]">
            Choose from professionally designed templates optimized for high-quality responses and meaningful data collection.
          </p>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-[27px]" ref={searchContainerRef}>
          <div className={`relative flex items-center bg-[#f7f6f3] border rounded-[7px] transition-colors ${searchFocused || isSearchActive ? 'border-[#c9c7bf]' : 'border-[#e8e7e2]'}`}>
            {/* Search icon */}
            <div className="absolute left-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
              <RiSearchLine size={16} className="text-[#aeada6]" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search templates by name, category, or use case..."
              className="w-full bg-transparent pl-[48px] pr-[44px] py-[14px] text-[14px] font-normal text-[#111110] leading-[18px] outline-none placeholder:text-[#aeada6]"
            />
            {/* Clear button */}
            <AnimatePresence>
              {isSearchActive && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] flex items-center justify-center rounded-full hover:bg-[#e8e7e2] transition-colors cursor-pointer"
                >
                  <RiCloseLine size={14} className="text-[#6b6966]" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Recent Searches Dropdown ── */}
          <AnimatePresence>
            {showRecentDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-[#e8e7e2] rounded-[8px] z-20 overflow-hidden"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
              >
                <div className="px-4 py-[10px] border-b border-[#e8e7e2]">
                  <span className="text-[10px] font-semibold text-[#a8a6a0] tracking-[0.7px] uppercase leading-[15px]">
                    RECENT SEARCHES
                  </span>
                </div>
                {RECENT_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onMouseDown={() => handleRecentSearch(term)}
                    className="w-full flex items-center gap-[10px] px-4 py-[10px] hover:bg-[#f7f6f3] transition-colors cursor-pointer"
                  >
                    <RiTimeLine size={16} className="text-[#a8a6a0] shrink-0" />
                    <span className="text-[13px] font-normal text-[#6b6966] leading-[18px]">{term}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Category Filters (only when not in search mode) ── */}
        <AnimatePresence>
          {!isSearchActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-[4px] flex-wrap mb-[20px]"
            >
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`h-[29px] flex items-center px-[9px] rounded-[999px] text-[10px] font-medium leading-[15px] cursor-pointer transition-colors whitespace-nowrap ${
                    activeFilter === tab
                      ? 'bg-[#1a1a1c] text-white border border-[#1a1a1c]'
                      : 'bg-white text-[#6b6966] border border-[#e5e3dc] hover:bg-[#f4f3ef]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── "Can't find what you need?" Banner (only when not in search mode) ── */}
        <AnimatePresence>
          {!isSearchActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#f7f6f3] border border-[#e8e7e2] rounded-[12px] px-[25px] py-[25px] mb-[26px] flex items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-[4px]">
                <h3 className="text-[16px] font-bold text-[#111110] leading-[24px]" style={{ fontFamily: 'Arimo, sans-serif' }}>
                  Can't find what you need?
                </h3>
                <p className="text-[14px] font-normal text-[#656565] leading-[21px]">
                  Start from scratch or request a custom template
                </p>
              </div>
              <button className="shrink-0 bg-[#111110] text-white text-[13px] font-medium leading-[19.5px] px-[24px] py-[12px] rounded-[7px] hover:bg-[#2c2c2e] transition-colors cursor-pointer whitespace-nowrap">
                Create Custom Form
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Search Results Header ── */}
        <AnimatePresence>
          {isSearchActive && displayedTemplates.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-[16px]"
            >
              <p className="text-[13px] font-normal text-[#a8a6a0] leading-[17px]">
                {displayedTemplates.length} template{displayedTemplates.length !== 1 ? 's' : ''} found
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── No Results State ── */}
        <AnimatePresence>
          {isSearchActive && displayedTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-[64px] gap-0"
            >
              <div className="w-[40px] h-[40px] flex items-center justify-center mb-[16px]">
                <RiSearchLine size={32} className="text-[#c9c7bf]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#111110] leading-[24px] mb-[8px]">
                No templates found for "{searchQuery}"
              </h3>
              <p className="text-[14px] font-normal text-[#656565] leading-[20px] mb-[20px] text-center max-w-[400px]">
                Try a broader search term, or browse all templates by clearing the search.
              </p>
              <div className="flex flex-col items-center gap-[8px]">
                <button className="bg-[#111110] text-white text-[13px] font-medium px-[24px] py-[10px] rounded-[7px] hover:bg-[#2c2c2e] transition-colors cursor-pointer">
                  Create custom form
                </button>
                <button
                  onClick={clearSearch}
                  className="text-[13px] font-normal text-[#a8a6a0] leading-[18px] hover:text-[#6b6966] transition-colors cursor-pointer"
                >
                  or clear search to browse all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Search Results: List view ── */}
        {isSearchActive && displayedTemplates.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-[#e8e7e2] rounded-[8px] overflow-hidden mb-[24px]"
          >
            {displayedTemplates.map((t) => (
              <SearchResultCard key={t.id} template={t} />
            ))}
          </motion.div>
        )}

        {/* ── Template Cards Grid (non-search mode) ── */}
        {!isSearchActive && displayedTemplates.length > 0 && (
          <div className="grid grid-cols-2 gap-[20px]">
            {displayedTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <TemplateCard template={template} />
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Empty Category State ── */}
        {!isSearchActive && displayedTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-[64px] gap-0"
          >
            <div className="w-[48px] h-[48px] bg-[#f4f3ef] border border-[#e5e3dc] rounded-[12px] flex items-center justify-center mb-[16px]">
              <RiFileAddLine size={16} className="text-[#a8a6a0]" />
            </div>
            <p className="text-[16px] font-medium text-[#1a1a1c] leading-[20.8px] mb-[4px]">
              No templates in this category
            </p>
            <p className="text-[14px] font-normal text-[#6b6966] leading-[21px]">
              Try another category or browse all templates.
            </p>
          </motion.div>
        )}
      </div>
    </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplatesPage;

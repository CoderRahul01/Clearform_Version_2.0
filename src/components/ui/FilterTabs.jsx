import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiFilter3Line, RiTimeLine, RiLayoutGridLine, RiMenuLine, RiSettings3Line, RiCheckLine, RiArrowUpDownLine } from 'react-icons/ri';
import { setActiveFilter, setViewMode, setSortOrder } from '../../redux/slices/formsSlice';
import { openWorkspaceContextMenu } from '../../redux/slices/uiSlice';
import { FILTER_TABS } from '../../constants';

const SORT_OPTIONS = [
  { id: 'recent',           label: 'Recent',           icon: RiTimeLine },
  { id: 'oldest',           label: 'Oldest',           icon: RiTimeLine },
  { id: 'most_responses',   label: 'Most responses',   icon: RiArrowUpDownLine },
  { id: 'fewest_responses', label: 'Fewest responses', icon: RiArrowUpDownLine },
  { id: 'name_az',          label: 'Name A → Z',       icon: RiArrowUpDownLine },
  { id: 'name_za',          label: 'Name Z → A',       icon: RiArrowUpDownLine },
];

const shimmer = 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)]';
const Sk = ({ className }) => <div className={`bg-[#ece9e3] ${shimmer} ${className}`} />;

const FilterTabs = () => {
  const dispatch = useDispatch();
  const { activeFilter, viewMode, isLoading, activeWorkspace, sortOrder } = useSelector((state) => state.forms);

  const [sortOpen, setSortOpen] = useState(false);
  const sortBtnRef = useRef(null);
  const sortMenuRef = useRef(null);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.id === sortOrder)?.label ?? 'Recent';

  // Close dropdown when clicking outside
  const handleSortButtonClick = () => setSortOpen((v) => !v);

  const handleSortSelect = (id) => {
    dispatch(setSortOrder(id));
    setSortOpen(false);
  };

  // Close on outside click
  const handleBlur = (e) => {
    if (
      !sortBtnRef.current?.contains(e.relatedTarget) &&
      !sortMenuRef.current?.contains(e.relatedTarget)
    ) {
      setSortOpen(false);
    }
  };

  const handleSettingsClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dispatch(openWorkspaceContextMenu({
      workspaceId: activeWorkspace,
      x: rect.left,
      y: rect.bottom + 4,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-1 py-3">
          {[64, 52, 72, 58].map((w, i) => (
            <Sk key={i} className="h-[14px] rounded-[4px] mx-3" style={{ width: w }} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Sk className="h-[32px] w-[74px] rounded-[8px]" />
          <Sk className="h-[32px] w-[100px] rounded-[8px]" />
          <Sk className="h-[32px] w-[58px] rounded-[8px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6">
      {/* Tabs */}
      <div className="flex items-center">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveFilter(tab.id))}
              className={`px-4 py-3 text-[13px] font-medium leading-[19.5px] border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#1a1a1c] border-[#1a1a1c]'
                  : 'text-[#6b6966] border-transparent hover:text-[#1a1a1c]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sort & view controls */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 bg-white border border-[#e5e3dc] rounded-lg px-[13px] py-[7px] hover:bg-[#f4f3ef] transition-colors cursor-pointer">
          <RiFilter3Line size={13} className="text-[#6b6966]" />
          <span className="text-[12px] font-medium text-[#6b6966] leading-normal">
            Filter
          </span>
        </button>

        {/* Sort dropdown */}
        <div className="relative" onBlur={handleBlur}>
          <button
            ref={sortBtnRef}
            onClick={handleSortButtonClick}
            className={`flex items-center gap-1 bg-white border rounded-lg px-[13px] py-[7px] transition-colors cursor-pointer ${
              sortOpen ? 'border-[#7c3aed] ring-1 ring-[#7c3aed]/30' : 'border-[#e5e3dc] hover:bg-[#f4f3ef]'
            }`}
          >
            <RiTimeLine size={13} className="text-[#6b6966]" />
            <span className="text-[12px] font-medium text-[#6b6966] leading-normal">
              Sort: {activeSortLabel}
            </span>
          </button>

          {sortOpen && (
            <div
              ref={sortMenuRef}
              tabIndex={-1}
              className="absolute right-0 top-[calc(100%+6px)] z-50 bg-white border border-[#e5e3dc] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-[5px] min-w-[180px] outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSortSelect(opt.id)}
                  className="w-full flex items-center justify-between gap-2 px-[13px] py-[8px] text-[12.5px] font-medium text-[#1a1a1c] hover:bg-[#f4f3ef] transition-colors cursor-pointer text-left"
                >
                  <span>{opt.label}</span>
                  {sortOrder === opt.id && (
                    <RiCheckLine size={13} className="text-[#7c3aed] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-start border border-[#e5e3dc] rounded-lg overflow-hidden p-px">
          <button
            onClick={() => dispatch(setViewMode('grid'))}
            className={`flex items-center justify-center px-[9px] py-[6px] border-r border-[#e5e3dc] cursor-pointer transition-colors ${
              viewMode === 'grid' ? 'bg-[#f4f3ef]' : 'bg-white hover:bg-[#f4f3ef]'
            }`}
          >
            <RiLayoutGridLine size={14} className="text-[#6b6966]" />
          </button>
          <button
            onClick={() => dispatch(setViewMode('list'))}
            className={`flex items-center justify-center px-[9px] py-[6px] cursor-pointer transition-colors ${
              viewMode === 'list' ? 'bg-[#f4f3ef]' : 'bg-white hover:bg-[#f4f3ef]'
            }`}
          >
            <RiMenuLine size={14} className="text-[#6b6966]" />
          </button>
        </div>

        {/* Workspace settings — only visible when a specific workspace is selected */}
        {activeWorkspace !== 'all' && (
          <button
            onClick={handleSettingsClick}
            className="flex items-center justify-center w-[32px] h-[32px] bg-white border border-[#e5e3dc] rounded-lg hover:bg-[#f4f3ef] transition-colors cursor-pointer"
            title="Workspace settings"
          >
            <RiSettings3Line size={14} className="text-[#6b6966]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterTabs;

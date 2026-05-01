import { useDispatch, useSelector } from 'react-redux';
import { RiFilter3Line, RiTimeLine, RiLayoutGridLine, RiMenuLine } from 'react-icons/ri';
import { setActiveFilter, setViewMode } from '../../redux/slices/formsSlice';
import { FILTER_TABS } from '../../constants';

const FilterTabs = () => {
  const dispatch = useDispatch();
  const { activeFilter, viewMode } = useSelector((state) => state.forms);

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

        <button className="flex items-center gap-1 bg-white border border-[#e5e3dc] rounded-lg px-[13px] py-[7px] hover:bg-[#f4f3ef] transition-colors cursor-pointer">
          <RiTimeLine size={13} className="text-[#6b6966]" />
          <span className="text-[12px] font-medium text-[#6b6966] leading-normal">
            Sort: Recent
          </span>
        </button>

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
      </div>
    </div>
  );
};

export default FilterTabs;

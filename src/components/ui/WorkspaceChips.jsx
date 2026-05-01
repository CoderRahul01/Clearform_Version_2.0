import { useDispatch, useSelector } from 'react-redux';
import { setActiveWorkspace } from '../../redux/slices/formsSlice';

const ALL_CHIP = { id: 'all', label: 'All workspaces', color: null, count: null };

const WorkspaceChips = () => {
  const dispatch = useDispatch();
  const { activeWorkspace, workspaces } = useSelector((state) => state.forms);
  const chips = [ALL_CHIP, ...workspaces];

  return (
    <div className="flex items-center gap-2 px-6 py-3 flex-wrap">
      {chips.map((ws) => {
        const isActive = activeWorkspace === ws.id;
        return (
          <button
            key={ws.id}
            onClick={() => dispatch(setActiveWorkspace(ws.id))}
            className={`flex items-center gap-1 px-[11px] py-[5px] rounded-full text-[12px] font-semibold leading-[18px] transition-colors cursor-pointer border ${
              isActive
                ? 'bg-[#1a1a1c] text-white border-transparent'
                : 'bg-[#f4f3ef] text-[#6b6966] border-[#e5e3dc] hover:border-[#c9c7bf]'
            }`}
          >
            {ws.color && (
              <div
                className="w-[6px] h-[6px] rounded-[3px] shrink-0"
                style={{ backgroundColor: ws.color }}
              />
            )}
            <span>{ws.label}</span>
            {ws.count !== null && (
              <span className="opacity-60">{ws.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default WorkspaceChips;

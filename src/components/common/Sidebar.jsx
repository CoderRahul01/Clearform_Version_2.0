import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import {
  RiLayoutGridLine,
  RiAddLine,
  RiLayoutMasonryLine,
  RiBarChartLine,
  RiUserLine,
  RiQuestionLine,
} from 'react-icons/ri';
import { setActiveWorkspace } from '../../redux/slices/formsSlice';
import { openCreateWorkspaceModal } from '../../redux/slices/uiSlice';
import clearformLogo from '../../assets/clearform-high-resolution-logo-transparent.png';

const NavItem = ({ icon: Icon, label, badge, active, onClick }) => (
  <motion.button
    whileHover={{ backgroundColor: '#f4f3ef' }}
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors ${
      active ? 'bg-[#f4f3ef]' : ''
    }`}
  >
    <div className="flex items-center gap-2">
      {Icon && <Icon size={16} className="text-[#6b6966] shrink-0" />}
      <span
        className={`text-[13px] font-medium leading-[19.5px] ${
          active ? 'text-[#1a1a1c]' : 'text-[#6b6966]'
        }`}
      >
        {label}
      </span>
    </div>
    {badge !== undefined && (
      <span className="text-[12px] font-medium text-[#a8a6a0] leading-[18px]">
        {badge}
      </span>
    )}
  </motion.button>
);

const WorkspaceItem = ({ workspace, active, onClick }) => (
  <motion.button
    whileHover={{ backgroundColor: '#f4f3ef' }}
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors ${
      active ? 'bg-[#f4f3ef]' : ''
    }`}
  >
    <div className="flex items-center gap-2">
      <div
        className="w-2 h-2 rounded-[4px] shrink-0"
        style={{ backgroundColor: workspace.color }}
      />
      <span className={`text-[13px] font-medium leading-[19.5px] ${
        active ? 'text-[#1a1a1c]' : 'text-[#6b6966]'
      }`}>
        {workspace.label}
      </span>
    </div>
    <span className="text-[12px] font-medium text-[#a8a6a0] leading-[18px]">
      {workspace.count}
    </span>
  </motion.button>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const { activeWorkspace, workspaces } = useSelector((state) => state.forms);
  const totalForms = useSelector((state) => state.forms.forms.length);

  return (
    <aside className="w-[196px] shrink-0 bg-white border-r border-[#e5e3dc] flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="h-[52px] shrink-0 border-b border-[#e5e3dc] flex items-center px-4">
        <img
          src={clearformLogo}
          alt="Clearform"
          className="h-[26px] w-auto object-contain"
        />
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-[13px] px-2 flex flex-col gap-0">
        {/* All Forms */}
        <NavItem
          icon={RiLayoutGridLine}
          label="All forms"
          badge={totalForms}
          active={activeWorkspace === 'all'}
          onClick={() => dispatch(setActiveWorkspace('all'))}
        />

        {/* Divider */}
        <div className="h-px bg-[#e5e3dc] mx-1 my-[9px]" />

        {/* Workspace list */}
        {workspaces.map((ws) => (
          <WorkspaceItem
            key={ws.id}
            workspace={ws}
            active={activeWorkspace === ws.id}
            onClick={() => dispatch(setActiveWorkspace(ws.id))}
          />
        ))}

        {/* New workspace */}
        <motion.button
          whileHover={{ backgroundColor: '#f4f3ef' }}
          onClick={() => dispatch(openCreateWorkspaceModal())}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <RiAddLine size={13} className="text-[#6b6966] shrink-0" />
          <span className="text-[13px] font-medium text-[#6b6966] leading-[19.5px]">
            New workspace
          </span>
        </motion.button>

        {/* Divider */}
        <div className="h-px bg-[#e5e3dc] mx-1 my-[9px]" />

        {/* Templates */}
        <NavItem icon={RiLayoutMasonryLine} label="Templates" />

        {/* Intelligence section */}
        <div className="px-4 pt-4 pb-1">
          <span className="text-[10px] font-semibold text-[#a8a6a0] tracking-[0.7px] uppercase leading-[15px]">
            INTELLIGENCE
          </span>
        </div>

        {/* Analytics */}
        <NavItem icon={RiBarChartLine} label="Analytics" />
      </div>

      {/* Utility corner */}
      <div className="border-t border-[#e5e3dc] px-2 py-[14px] flex flex-col gap-px shrink-0">
        <NavItem icon={RiUserLine} label="Profile" />
        <NavItem icon={RiQuestionLine} label="Help & Support" />
      </div>
    </aside>
  );
};

export default Sidebar;

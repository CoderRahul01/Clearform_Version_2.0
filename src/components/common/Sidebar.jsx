import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  RiLayoutGridLine,
  RiAddLine,
  RiLayoutMasonryLine,
  RiBarChartLine,
  RiUserLine,
  RiQuestionLine,
  RiArrowLeftSLine,
} from 'react-icons/ri';
import { setActiveWorkspace } from '../../redux/slices/formsSlice';
import { openCreateWorkspaceModal, openWorkspaceContextMenu } from '../../redux/slices/uiSlice';
import clearformLogo from '../../assets/clearform-high-resolution-logo-transparent.png';
// eslint-disable-next-line import/no-unresolved
import clearformLogoIcon from '../../assets/clearform-high-resolution-logo-transparent (1).png';
import SidebarSkeleton from '../ui/SidebarSkeleton';

const SKELETON_DURATION = 1200;

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

const WorkspaceItem = ({ workspace, active, onClick, onContextMenu }) => (
  <motion.button
    whileHover={{ backgroundColor: '#f4f3ef' }}
    onClick={onClick}
    onContextMenu={onContextMenu}
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

const CollapsedIconBtn = ({ icon: Icon, active, onClick, title }) => (
  <motion.button
    whileHover={{ backgroundColor: '#eceae4' }}
    onClick={onClick}
    title={title}
    className="w-full flex items-center justify-center px-2 py-[7px] rounded-[6px] transition-colors"
  >
    <div className={`p-[3px] rounded-[4px] transition-colors ${active ? 'bg-[#d8d8d8]' : ''}`}>
      <Icon size={16} className="text-[#6b6966]" />
    </div>
  </motion.button>
);

const Sidebar = ({ hideLogo = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeWorkspace, workspaces } = useSelector((state) => state.forms);

  const handleWorkspaceContextMenu = (e, wsId) => {
    e.preventDefault();
    dispatch(openWorkspaceContextMenu({ workspaceId: wsId, x: e.clientX, y: e.clientY }));
  };
  const totalForms = useSelector((state) => state.forms.forms.length);

  const isTemplatesActive = location.pathname === '/dashboard/templates';
  const isDashboardActive = !isTemplatesActive;

  const isFormBuilder = location.pathname.startsWith('/dashboard/form-builder');

  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(isFormBuilder);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), SKELETON_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 60 : 196 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative shrink-0 bg-white border-r border-[rgba(0,0,0,0.08)] flex flex-col h-full"
    >
      {/* Collapse / expand button — sits on the right border, aligned with "All Forms" */}
      {!loading && (
        <button
          onClick={() => setIsCollapsed((v) => !v)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`absolute -right-[10px] z-20 h-5 w-5 rounded-full bg-white border border-[#e9e7e0] shadow-sm flex items-center justify-center hover:bg-[#f4f3ef] transition-colors ${hideLogo ? 'top-[22px]' : 'top-[75px]'}`}
        >
          <RiArrowLeftSLine
            size={12}
            className={`text-[#6b6966] transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      )}
      <AnimatePresence mode="sync" initial={false}>
        {loading ? (
          <motion.div
            key="skeleton"
            className="flex flex-col h-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <SidebarSkeleton />
          </motion.div>
        ) : isCollapsed ? (
          /* ── Collapsed sidebar ── */
          <motion.div
            key="collapsed"
            className="flex flex-col h-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Logo header — only when logo is visible */}
            {!hideLogo && (
              <div className="h-[52px] shrink-0 border-b border-[rgba(0,0,0,0.08)] flex items-center px-[14px] bg-white">
                <img
                  src={clearformLogoIcon}
                  alt="Clearform"
                  className="h-[26px] w-auto object-contain"
                />
              </div>
            )}

            {/* Gray nav body */}
            <div className="flex-1 bg-[#f7f7f8] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto flex flex-col gap-[4px] px-[10px] py-3">
                {/* All Forms */}
                <CollapsedIconBtn
                  icon={RiLayoutGridLine}
                  active={isDashboardActive && activeWorkspace === 'all'}
                  title="All forms"
                  onClick={() => {
                    navigate('/dashboard');
                    dispatch(setActiveWorkspace('all'));
                  }}
                />

                {/* New workspace */}
                <CollapsedIconBtn
                  icon={RiAddLine}
                  title="New workspace"
                  onClick={() => dispatch(openCreateWorkspaceModal())}
                />

                {/* Templates */}
                <CollapsedIconBtn
                  icon={RiLayoutMasonryLine}
                  active={isTemplatesActive}
                  title="Templates"
                  onClick={() => navigate('/dashboard/templates')}
                />

                {/* Analytics */}
                <CollapsedIconBtn
                  icon={RiBarChartLine}
                  title="Analytics"
                  onClick={() => {}}
                />
              </div>

              {/* Footer */}
              <div className="border-t border-[rgba(0,0,0,0.08)] px-[10px] pb-[14px] pt-[11px] flex flex-col gap-[2px] shrink-0">
                <CollapsedIconBtn icon={RiUserLine} title="Profile" onClick={() => {}} />
                <CollapsedIconBtn icon={RiQuestionLine} title="Help & Support" onClick={() => {}} />
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Expanded sidebar ── */
          <motion.div
            key="expanded"
            className="flex flex-col h-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Logo header — only shown when logo is visible */}
            {!hideLogo && (
              <div className="h-[52px] shrink-0 border-b border-[#e5e3dc] flex items-center px-4">
                <img
                  src={clearformLogo}
                  alt="Clearform"
                  className="h-[26px] w-auto object-contain"
                />
              </div>
            )}

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-[13px] pl-2 pr-4 flex flex-col gap-0">
              {/* All Forms */}
              <NavItem
                icon={RiLayoutGridLine}
                label="All forms"
                badge={totalForms}
                active={isDashboardActive && activeWorkspace === 'all'}
                onClick={() => {
                  navigate('/dashboard');
                  dispatch(setActiveWorkspace('all'));
                }}
              />

              {/* Divider */}
              <div className="h-px bg-[#e5e3dc] mx-1 my-[9px]" />

              {/* Workspace list */}
              {workspaces.map((ws) => (
                <WorkspaceItem
                  key={ws.id}
                  workspace={ws}
                  active={isDashboardActive && activeWorkspace === ws.id}
                  onClick={() => {
                    navigate('/dashboard');
                    dispatch(setActiveWorkspace(ws.id));
                  }}
                  onContextMenu={(e) => handleWorkspaceContextMenu(e, ws.id)}
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
              <NavItem
                icon={RiLayoutMasonryLine}
                label="Templates"
                active={isTemplatesActive}
                onClick={() => navigate('/dashboard/templates')}
              />

              {/* Intelligence section */}
              <div className="px-4 pt-4 pb-1">
                <span className="text-[10px] font-semibold text-[#a8a6a0] tracking-[0.7px] uppercase leading-[15px]">
                  INTELLIGENCE
                </span>
              </div>

              {/* Analytics */}
              <NavItem
                icon={RiBarChartLine}
                label="Analytics"
                onClick={() => {}}
              />
            </div>

            {/* Utility corner */}
            <div className="border-t border-[#e5e3dc] px-2 py-[14px] flex flex-col gap-px shrink-0">
              <NavItem icon={RiUserLine} label="Profile" onClick={() => {}} />
              <NavItem icon={RiQuestionLine} label="Help & Support" onClick={() => {}} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default Sidebar;

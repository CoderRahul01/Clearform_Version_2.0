import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';
import {
  RiCloseLine,
  RiNotification3Line,
  RiTeamLine,
  RiShareForwardLine,
  RiCheckDoubleLine,
  RiFileChartLine,
} from 'react-icons/ri';
import { closeNotificationCenter } from '../../redux/slices/uiSlice';
import {
  markAllNotificationsRead,
  markNotificationRead,
  setNotificationTab,
} from '../../redux/slices/notificationsSlice';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'response', label: 'Response' },
  { id: 'team', label: 'Team' },
  { id: 'forms', label: 'Forms' },
];

const typeIconMap = {
  response_limit: RiFileChartLine,
  new_response: RiNotification3Line,
  team_invite: RiTeamLine,
  form_published: RiCheckDoubleLine,
  form_shared: RiShareForwardLine,
};

const NotificationItem = ({ item, onRead }) => {
  const Icon = typeIconMap[item.type] || RiNotification3Line;

  return (
    <motion.div
      whileHover={{ backgroundColor: '#faf9f6' }}
      onClick={onRead}
      className="w-full text-left p-3 border border-[#ece8de] rounded-[12px] bg-white transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-[8px] bg-[#f4f3ef] border border-[#ece8de] flex items-center justify-center shrink-0">
          <Icon size={15} className="text-[#6b6966]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {item.unread && <span className="w-[6px] h-[6px] rounded-full bg-[#d4522a] shrink-0" />}
            <p className="text-[12.5px] font-semibold text-[#1a1a1c] leading-[17px] truncate">{item.title}</p>
            {item.statusBadge && (
              <span className="px-[6px] py-[1px] rounded-[999px] bg-[#ebf5ee] text-[#2e7d52] text-[10px] font-semibold leading-[14px]">
                {item.statusBadge}
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] text-[#6b6966] leading-[17px]">{item.description}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-[#9b978d]">{item.timestamp}</span>
            {item.actionLabel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRead();
                }}
                className={`px-2 py-[3px] rounded-[6px] text-[11px] font-medium border transition-colors cursor-pointer ${
                  item.type === 'response_limit'
                    ? 'text-[#6d47c6] border-[#e2d7ff] bg-[#f7f3ff] hover:bg-[#efe9ff]'
                    : 'text-[#1a1a1c] border-[#e5e3dc] bg-white hover:bg-[#f4f3ef]'
                }`}
              >
                {item.actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.notificationCenter.open);
  const { activeTab, notifications } = useSelector((state) => state.notifications);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const groupedNotifications = useMemo(() => {
    const filtered = activeTab === 'all'
      ? notifications
      : notifications.filter((item) => item.category === activeTab);

    return filtered.reduce((acc, item) => {
      if (!acc[item.dateGroup]) acc[item.dateGroup] = [];
      acc[item.dateGroup].push(item);
      return acc;
    }, {});
  }, [activeTab, notifications]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeNotificationCenter())}
            className="fixed inset-0 z-30 bg-transparent cursor-default"
            aria-label="Close notifications"
          />

          <motion.aside
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 top-[62px] bottom-6 w-[372px] z-40 rounded-[14px] border border-[#e5e3dc] bg-[#fcfbf8] shadow-[0_12px_28px_rgba(26,25,22,0.14)] flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[#e9e6de] bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-[#1a1a1c]">Notifications</h3>
                  <span className="px-[7px] py-[1px] rounded-full bg-[#f0efe9] text-[#6b6966] text-[11px] font-semibold">
                    {unreadCount}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => dispatch(markAllNotificationsRead())}
                    className="px-2 py-1 text-[11px] text-[#6b6966] hover:text-[#1a1a1c] rounded-[6px] hover:bg-[#f4f3ef] transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={() => dispatch(closeNotificationCenter())}
                    className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[#6b6966] hover:bg-[#f4f3ef] transition-colors cursor-pointer"
                  >
                    <RiCloseLine size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1 bg-[#f4f3ef] p-1 rounded-[9px]">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => dispatch(setNotificationTab(tab.id))}
                    className={`px-3 py-[6px] rounded-[7px] text-[12px] font-medium leading-[14px] transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-[#1a1a1c] border border-[#e5e3dc]'
                        : 'text-[#6b6966] hover:text-[#1a1a1c]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {Object.keys(groupedNotifications).length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[13px] text-[#9b978d]">No notifications in this tab.</p>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(([dateGroup, items]) => (
                  <div key={dateGroup}>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.6px] text-[#9b978d] font-semibold">
                      {dateGroup}
                    </p>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <NotificationItem
                          key={item.id}
                          item={item}
                          onRead={() => dispatch(markNotificationRead(item.id))}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;

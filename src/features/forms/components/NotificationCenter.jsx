import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';
import { RiAlertLine, RiMessage2Line, RiCheckboxCircleLine } from 'react-icons/ri';
import { closeNotificationCenter } from '@/store/slices/uiSlice';
import {
  markAllNotificationsRead,
  markNotificationRead,
  setNotificationTab,
} from '@/store/slices/notificationsSlice';

const notifEase = [0.25, 0.1, 0.25, 1];

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'forms', label: 'Forms' },
];

const ACTION_STYLES = {
  dark: 'bg-[#1a1a1a] text-white',
  danger: 'bg-[#fde8e8] text-[#c0392b]',
  primary: 'bg-[#e8f0fe] text-[#2563eb]',
  outline: 'border border-[#d8d3cc] text-[#3a3a3a] bg-white',
};

const IconDisplay = ({ item }) => {
  if (item.iconType === 'emoji') {
    return <span className="text-[17px] leading-none select-none">{item.iconEmoji}</span>;
  }
  if (item.iconType === 'check') return <RiCheckboxCircleLine size={16} className="text-[#15803d]" />;
  if (item.iconType === 'warning') return <RiAlertLine size={16} className="text-[#b45309]" />;
  if (item.iconType === 'chat') return <RiMessage2Line size={16} className="text-[#0d9488]" />;
  return null;
};

const BodyText = ({ segments }) => (
  <p className="text-[12px] leading-[18px] m-0">
    {segments.map((seg, i) => (
      <span
        key={i}
        className={seg.bold ? 'font-medium text-[#3a3a3a]' : 'text-[#7a7670] font-normal'}
      >
        {seg.text}
      </span>
    ))}
  </p>
);

const NotificationItem = ({ item, onRead }) => (
  <div
    onClick={onRead}
    className="relative flex gap-3 items-start px-[18px] pt-[13px] pb-[14px] border-b border-[#f5f3f0] bg-[#fdfcfb] cursor-pointer hover:bg-[#f9f7f4] transition-colors"
  >
    {item.unread && (
      <div className="absolute left-[7px] top-[16px] w-[5px] h-[5px] rounded-[2.5px] bg-[#3b82b6]" />
    )}

    <div
      className="shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center"
      style={{ backgroundColor: item.iconBg }}
    >
      <IconDisplay item={item} />
    </div>

    <div className="flex-1 min-w-0 flex flex-col gap-[1.9px]">
      <div className="flex items-baseline justify-between gap-2">
        <span
          className="text-[12.5px] font-semibold leading-[16.88px]"
          style={{ color: item.titleColor || '#1a1a1a' }}
        >
          {item.title}
        </span>
        <span className="text-[10.5px] text-[#b0aba4] shrink-0 font-normal">{item.timestamp}</span>
      </div>

      <div className="pb-[5.1px]">
        <BodyText segments={item.bodySegments} />
      </div>

      {item.action && (
        <button
          onClick={(e) => { e.stopPropagation(); onRead(); }}
          className={`self-start px-[10px] py-[4px] rounded-[8px] text-[11px] font-semibold leading-[14px] cursor-pointer transition-opacity hover:opacity-85 ${ACTION_STYLES[item.action.style]}`}
        >
          {item.action.label}
        </button>
      )}

      {item.tag && (
        <div className="self-start flex items-center gap-1 px-2 py-[2px] rounded-[6px] bg-[#f5f3f0] border border-[#e2ded8]">
          <div className="w-[5px] h-[5px] rounded-[2.5px] shrink-0" style={{ backgroundColor: item.tag.color }} />
          <span className="text-[10.5px] font-medium text-[#5a5652] leading-[13px]">{item.tag.label}</span>
        </div>
      )}
    </div>
  </div>
);

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.notificationCenter.open);
  const { activeTab, notifications } = useSelector((state) => state.notifications);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const groupedNotifications = useMemo(() => {
    const filtered =
      activeTab === 'all'
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

          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: notifEase }}
            className="fixed right-4 top-[62px] w-[360px] z-40 rounded-[16px] border border-[#e2ded8] bg-white shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1),0px_1px_4px_0px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-[18px] pt-4 pb-[13px] border-b border-[#eceae5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#1a1a1a] leading-[18px]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-[6px] py-px rounded-[20px] bg-[#e8443a] text-white text-[10px] font-semibold leading-[16px] min-w-[18px] text-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => dispatch(markAllNotificationsRead())}
                className="text-[11.5px] font-medium text-[#3b82b6] cursor-pointer hover:opacity-75 transition-opacity leading-normal"
              >
                Mark all read
              </button>
            </div>

            {/* Tabs */}
            <div className="px-[14px] pt-[10px] pb-px border-b border-[#eceae5] flex items-start gap-[2px]">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setNotificationTab(tab.id))}
                  className={`px-3 pt-[6px] pb-[10px] text-[12px] font-medium leading-[16px] cursor-pointer border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#1a1a1a] text-[#1a1a1a]'
                      : 'border-transparent text-[#8c8880] hover:text-[#1a1a1a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable list */}
            <div className="max-h-[420px] overflow-y-auto">
              {Object.keys(groupedNotifications).length === 0 ? (
                <div className="h-[120px] flex items-center justify-center">
                  <p className="text-[13px] text-[#9b978d]">No notifications in this tab.</p>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(([dateGroup, items]) => (
                  <div key={dateGroup}>
                    <div className="px-[18px] pt-[10px] pb-[7px] bg-[#fafaf8] border-b border-[#eceae5]">
                      <span className="text-[10.5px] font-semibold text-[#b0aba4] tracking-[0.63px] uppercase">
                        {dateGroup}
                      </span>
                    </div>
                    {items.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.16, delay: idx * 0.025, ease: notifEase }}
                      >
                        <NotificationItem
                          item={item}
                          onRead={() => dispatch(markNotificationRead(item.id))}
                        />
                      </motion.div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#eceae5] bg-white px-[18px] pt-[13px] pb-3 flex items-center justify-center">
              <button className="text-[12px] font-medium text-[#3b82b6] cursor-pointer hover:opacity-75 transition-opacity leading-[16px]">
                View all notifications →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;

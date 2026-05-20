import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'all',
  notifications: [
    {
      id: 'n1',
      type: 'response_limit',
      category: 'alerts',
      dateGroup: 'Today',
      iconType: 'check',
      iconBg: '#ddffce',
      title: 'Response target achieved',
      titleColor: '#15803d',
      bodySegments: [
        { text: 'NPS Survey Q1 2026', bold: true },
        { text: ' hit its 500 response cap and stopped collecting.', bold: false },
      ],
      timestamp: '2h ago',
      unread: true,
      action: { label: 'View AI Insights', style: 'dark' },
    },
    {
      id: 'n2',
      type: 'approaching_limit',
      category: 'alerts',
      dateGroup: 'Today',
      iconType: 'warning',
      iconBg: '#fef3e2',
      title: 'Approaching limit',
      bodySegments: [
        { text: 'Bug Report Template', bold: true },
        { text: ' is at ', bold: false },
        { text: '480 / 500', bold: true },
        { text: ' responses — 96% full.', bold: false },
      ],
      timestamp: '5h ago',
      unread: true,
      action: { label: 'View form', style: 'danger' },
    },
    {
      id: 'n3',
      type: 'new_response',
      category: 'alerts',
      dateGroup: 'Today',
      iconType: 'chat',
      iconBg: '#e4f7f0',
      title: 'New response',
      bodySegments: [
        { text: 'Someone just submitted ', bold: false },
        { text: 'Onboarding Feedback', bold: true },
        { text: '.', bold: false },
      ],
      timestamp: '6h ago',
      unread: true,
      tag: { label: 'Marketing', color: '#10b981' },
    },
    {
      id: 'n4',
      type: 'new_response',
      category: 'alerts',
      dateGroup: 'Today',
      iconType: 'chat',
      iconBg: '#e4f7f0',
      title: 'New response',
      bodySegments: [
        { text: 'Someone just submitted ', bold: false },
        { text: 'Customer Satisfaction', bold: true },
        { text: '.', bold: false },
      ],
      timestamp: '6h ago',
      unread: true,
      tag: { label: 'Marketing', color: '#10b981' },
    },
    {
      id: 'n5',
      type: 'form_published',
      category: 'forms',
      dateGroup: 'Yesterday',
      iconType: 'emoji',
      iconEmoji: '🚀',
      iconBg: '#e4f7f0',
      title: 'Form published',
      bodySegments: [
        { text: 'Exit Interview', bold: true },
        { text: ' is now live and collecting responses.', bold: false },
      ],
      timestamp: '1d ago',
      unread: false,
      tag: { label: 'HR', color: '#3b82b6' },
    },
    {
      id: 'n6',
      type: 'form_shared',
      category: 'forms',
      dateGroup: 'Yesterday',
      iconType: 'emoji',
      iconEmoji: '🔗',
      iconBg: '#eee8fd',
      title: 'Form shared with you',
      bodySegments: [
        { text: 'Alex Kim', bold: true },
        { text: ' shared ', bold: false },
        { text: 'Q4 Customer Survey', bold: true },
        { text: ' with you.', bold: false },
      ],
      timestamp: '1d ago',
      unread: false,
      action: { label: 'Open form', style: 'primary' },
    },
    {
      id: 'n7',
      type: 'export_ready',
      category: 'forms',
      dateGroup: 'Yesterday',
      iconType: 'emoji',
      iconEmoji: '📄',
      iconBg: '#f0edea',
      title: 'Export ready',
      bodySegments: [
        { text: 'Your CSV export for ', bold: false },
        { text: 'NPS Survey Q4 2025', bold: true },
        { text: ' is ready to download.', bold: false },
      ],
      timestamp: '2d ago',
      unread: false,
      action: { label: '⬇ Download', style: 'outline' },
    },
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationTab(state, action) {
      state.activeTab = action.payload;
    },
    markNotificationRead(state, action) {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) item.unread = false;
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => {
        n.unread = false;
      });
    },
  },
});

export const {
  setNotificationTab,
  markNotificationRead,
  markAllNotificationsRead,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

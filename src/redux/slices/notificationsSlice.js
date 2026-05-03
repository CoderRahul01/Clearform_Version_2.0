import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'all',
  notifications: [
    {
      id: 'n1',
      type: 'response_limit',
      category: 'response',
      dateGroup: 'Today',
      title: 'NPS Survey Q1 2026',
      description: 'Response target achieved (500/500 responses)',
      timestamp: '2m ago',
      unread: true,
      actionLabel: 'View AI Insights',
    },
    {
      id: 'n2',
      type: 'new_response',
      category: 'response',
      dateGroup: 'Today',
      title: 'Onboarding Feedback',
      description: '3 new responses since your last check',
      timestamp: '25m ago',
      unread: true,
      statusBadge: 'New',
    },
    {
      id: 'n3',
      type: 'team_invite',
      category: 'team',
      dateGroup: 'Today',
      title: 'Product Workspace',
      description: 'Ananya invited you to collaborate on Product Workspace',
      timestamp: '1h ago',
      unread: false,
      actionLabel: 'Review',
    },
    {
      id: 'n4',
      type: 'form_published',
      category: 'forms',
      dateGroup: 'Yesterday',
      title: 'Bug Report Template',
      description: 'Form published and now accepting responses',
      timestamp: 'Yesterday · 6:42 PM',
      unread: false,
      actionLabel: 'Open form',
    },
    {
      id: 'n5',
      type: 'form_shared',
      category: 'forms',
      dateGroup: 'Yesterday',
      title: 'Retention Survey 2026',
      description: 'Shared with your team as editors',
      timestamp: 'Yesterday · 2:18 PM',
      unread: true,
      actionLabel: 'Manage access',
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

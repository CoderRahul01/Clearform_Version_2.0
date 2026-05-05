import { createSlice } from '@reduxjs/toolkit';
import { FORMS_DATA, NAV_WORKSPACES } from '../../constants';

// Convert a "Xm/Xh/Xd/Xw ago" string to milliseconds so we can sort by recency
function timeAgoToMs(timeAgo) {
  if (!timeAgo) return 0;
  const m = timeAgo.match(/^(\d+)([mhdw])/);
  if (!m) return 0;
  const n = parseInt(m[1]);
  const multipliers = { m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 };
  return n * (multipliers[m[2]] ?? 0);
}

const initialState = {
  forms: FORMS_DATA,
  workspaces: NAV_WORKSPACES,
  activeFilter: 'all',
  activeWorkspace: 'all',
  searchQuery: '',
  showTemplateBanner: true,
  viewMode: 'grid',    // 'grid' | 'list'
  sortOrder: 'recent', // 'recent' | 'oldest' | 'most_responses' | 'fewest_responses' | 'name_az' | 'name_za'
  isLoading: true,     // simulates initial data fetch
  advancedFilters: { status: [], responses: [] }, // status: ['live','draft','archived'], responses: ['has_responses','no_responses']
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setActiveFilter(state, action) {
      state.activeFilter = action.payload;
    },
    setActiveWorkspace(state, action) {
      state.activeWorkspace = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    dismissTemplateBanner(state) {
      state.showTemplateBanner = false;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    addForm(state, action) {
      state.forms.unshift(action.payload);
    },
    setFormPause(state, action) {
      const { formId, endLabel, endTimestamp, pauseType, viewYear, viewMonth, selDay, hour, minute, ampm } = action.payload;
      const form = state.forms.find((f) => f.id === formId);
      if (form) {
        form.pauseSettings = { confirmed: true, endLabel, endTimestamp: endTimestamp ?? null, pauseType, viewYear, viewMonth, selDay, hour, minute, ampm };
      }
    },
    clearFormPause(state, action) {
      const form = state.forms.find((f) => f.id === action.payload);
      if (form) {
        form.pauseSettings = null;
      }
    },
    addWorkspace(state, action) {
      const { id, label, color } = action.payload;
      state.workspaces.push({ id, label, color, count: 0 });
      state.activeWorkspace = id;
    },
    renameWorkspace(state, action) {
      const { workspaceId, newName } = action.payload;
      const ws = state.workspaces.find((w) => w.id === workspaceId);
      if (ws) ws.label = newName;
    },
    deleteWorkspace(state, action) {
      const workspaceId = action.payload;
      state.workspaces = state.workspaces.filter((w) => w.id !== workspaceId);
      if (state.activeWorkspace === workspaceId) state.activeWorkspace = 'all';
    },
    deleteForm(state, action) {
      state.forms = state.forms.filter((f) => f.id !== action.payload);
    },
    archiveForm(state, action) {
      const form = state.forms.find((f) => f.id === action.payload);
      if (form) form.status = 'archived';
    },
    unarchiveForm(state, action) {
      const form = state.forms.find((f) => f.id === action.payload);
      if (form) form.status = 'live';
    },
    setAdvancedFilters(state, action) {
      state.advancedFilters = action.payload;
    },
    clearAdvancedFilters(state) {
      state.advancedFilters = { status: [], responses: [] };
    },
  },
});

export const {
  setActiveFilter,
  setActiveWorkspace,
  setSearchQuery,
  dismissTemplateBanner,
  setViewMode,
  setSortOrder,
  setLoading,
  addForm,
  setFormPause,
  clearFormPause,
  addWorkspace,
  renameWorkspace,
  deleteWorkspace,
  deleteForm,
  archiveForm,
  unarchiveForm,
  setAdvancedFilters,
  clearAdvancedFilters,
} = formsSlice.actions;

export const selectFilteredForms = (state) => {
  const { forms, activeFilter, activeWorkspace, searchQuery, sortOrder, advancedFilters } = state.forms;

  let filtered = forms.filter((form) => {
    const matchesFilter = activeFilter === 'archived'
      ? form.status === 'archived'
      : (activeFilter === 'all' || form.status === activeFilter) && form.status !== 'archived';
    const matchesWorkspace =
      activeWorkspace === 'all' || form.workspace === activeWorkspace;
    const matchesSearch =
      !searchQuery ||
      form.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesWorkspace && matchesSearch;
  });

  if (advancedFilters.status.length > 0) {
    filtered = filtered.filter((f) => advancedFilters.status.includes(f.status));
  }

  if (advancedFilters.responses.length === 1) {
    if (advancedFilters.responses[0] === 'has_responses') {
      filtered = filtered.filter((f) => f.responses > 0);
    } else if (advancedFilters.responses[0] === 'no_responses') {
      filtered = filtered.filter((f) => f.responses === 0);
    }
  }

  return [...filtered].sort((a, b) => {
    switch (sortOrder) {
      case 'oldest':
        return timeAgoToMs(a.timeAgo) - timeAgoToMs(b.timeAgo);
      case 'most_responses':
        return b.responses - a.responses;
      case 'fewest_responses':
        return a.responses - b.responses;
      case 'name_az':
        return a.title.localeCompare(b.title);
      case 'name_za':
        return b.title.localeCompare(a.title);
      case 'recent':
      default:
        return timeAgoToMs(a.timeAgo) - timeAgoToMs(b.timeAgo);
    }
  });
};

export default formsSlice.reducer;

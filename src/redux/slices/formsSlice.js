import { createSlice } from '@reduxjs/toolkit';
import { FORMS_DATA, NAV_WORKSPACES } from '../../constants';

const initialState = {
  forms: FORMS_DATA,
  workspaces: NAV_WORKSPACES,
  activeFilter: 'all',
  activeWorkspace: 'all',
  searchQuery: '',
  showTemplateBanner: true,
  viewMode: 'grid', // 'grid' | 'list'
  isLoading: true,  // simulates initial data fetch
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
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    addForm(state, action) {
      state.forms.unshift(action.payload);
    },
    setFormPause(state, action) {
      const { formId, endLabel, viewYear, viewMonth, selDay } = action.payload;
      const form = state.forms.find((f) => f.id === formId);
      if (form) {
        form.pauseSettings = { confirmed: true, endLabel, viewYear, viewMonth, selDay };
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
    deleteForm(state, action) {
      state.forms = state.forms.filter((f) => f.id !== action.payload);
    },
    archiveForm(state, action) {
      const form = state.forms.find((f) => f.id === action.payload);
      if (form) form.status = 'archived';
    },
  },
});

export const {
  setActiveFilter,
  setActiveWorkspace,
  setSearchQuery,
  dismissTemplateBanner,
  setViewMode,
  setLoading,
  addForm,
  setFormPause,
  clearFormPause,
  addWorkspace,
  deleteForm,
  archiveForm,
} = formsSlice.actions;

export const selectFilteredForms = (state) => {
  const { forms, activeFilter, activeWorkspace, searchQuery } = state.forms;
  return forms.filter((form) => {
    const matchesFilter =
      activeFilter === 'all' || form.status === activeFilter;
    const matchesWorkspace =
      activeWorkspace === 'all' || form.workspace === activeWorkspace;
    const matchesSearch =
      !searchQuery ||
      form.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesWorkspace && matchesSearch;
  });
};

export default formsSlice.reducer;

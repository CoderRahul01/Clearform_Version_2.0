import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  isSubmitting: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setField(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setSubmitting(state, action) {
      state.isSubmitting = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    resetForm(state) {
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.password = '';
      state.error = null;
      state.isSubmitting = false;
    },
  },
});

export const { setField, setSubmitting, setError, setAuthenticated, resetForm } =
  authSlice.actions;

export default authSlice.reducer;

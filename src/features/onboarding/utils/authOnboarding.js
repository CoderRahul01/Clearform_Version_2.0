import { startOnboarding, dismissOnboardingSession } from '@/store/slices/onboardingSlice';
import { resetFormsForOnboarding } from '@/store/slices/formsSlice';

/** Sign-in: dashboard by default; honors deep-link return path from RequireAuth. */
export const resolveSignInNavigation = (dispatch, { returnTo } = {}) => {
  dispatch(dismissOnboardingSession());
  if (typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
    return returnTo;
  }
  return '/dashboard';
};

/** Sign-up: always start first-time template onboarding (not used on sign-in). */
export const resolveSignupNavigation = (dispatch) => {
  dispatch(startOnboarding());
  dispatch(resetFormsForOnboarding());
  return '/onboarding';
};

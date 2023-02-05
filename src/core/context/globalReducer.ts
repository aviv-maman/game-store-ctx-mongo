import { GlobalActionKeys } from './action';
import type { GlobalActionMap } from './action';
import type { GlobalContextState } from './initialContextState';

export const globalReducer = (state: GlobalContextState, action: GlobalActionMap): GlobalContextState => {
  switch (action.type) {
    case GlobalActionKeys.UpdateTheme:
      // localStorage.setItem('siteTheme', action.payload);
      // return { ...state, siteTheme: action.payload }; // This is the original code - save theme to separate state but not to user object
      if (state.user) {
        const newUser = { ...state.user, siteTheme: action.payload };
        localStorage.setItem('user', JSON.stringify(newUser));
        return { ...state, user: newUser };
      } else {
        localStorage.setItem('siteTheme', action.payload);
        return { ...state, siteTheme: action.payload };
      }
    case GlobalActionKeys.UpdateUser:
      if (action.payload !== null && action.payload !== undefined) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
      return { ...state, user: action.payload };
    case GlobalActionKeys.UpdateCurrency:
      // localStorage.setItem('currency', action.payload);
      // return { ...state, currency: action.payload };
      if (state.user) {
        const newUser = { ...state.user, currency: action.payload };
        localStorage.setItem('user', JSON.stringify(newUser));
        return { ...state, user: newUser };
      } else {
        localStorage.setItem('currency', action.payload);
        return { ...state, currency: action.payload };
      }
    default:
      return state;
  }
};

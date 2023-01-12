import { GlobalActionKeys } from './action';
import type { GlobalActionMap } from './action';
import type { GlobalContextState } from './initialContextState';

export const globalReducer = (state: GlobalContextState, action: GlobalActionMap): GlobalContextState => {
  switch (action.type) {
    case GlobalActionKeys.UpdateTheme:
      localStorage.setItem('siteTheme', action.payload);
      return { ...state, siteTheme: action.payload };
    case GlobalActionKeys.UpdateUser:
      if (action.payload !== null && action.payload !== undefined) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

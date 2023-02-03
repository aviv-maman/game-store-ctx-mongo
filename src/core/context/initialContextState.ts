import { useContext, createContext, Dispatch, useReducer } from 'react';
import type { GlobalActionMap } from './action';
import { english } from '../languages';
import type { Language } from '../languages';
import { globalReducer } from './globalReducer';

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  height: number;
  weight: number;
  photoURL: string;
  uid: string;
  isEmailVerified: boolean;
} | null;

export const initialContextState = {
  siteTheme: (localStorage.getItem('siteTheme') as 'dark' | 'light') ?? 'dark',
  user: JSON.parse(localStorage.getItem('user') as string) as null | User,
  isAuthenticated: false,
  language: (JSON.parse(localStorage.getItem('language') as string) as Language) ?? english,
};

export type GlobalContextState = typeof initialContextState;

export type GlobalStore = {
  state: GlobalContextState;
  dispatch: Dispatch<GlobalActionMap>;
};

export const GlobalContext = createContext<GlobalStore>({
  state: initialContextState,
  dispatch: () => undefined,
});

export const useGlobalContext = () => useContext(GlobalContext);
export const useGlobalReducer = () => useReducer(globalReducer, initialContextState);

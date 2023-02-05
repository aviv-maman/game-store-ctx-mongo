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
  dateOfBirth: Date;
  height: number;
  weight: number;
  photo: string;
  _id: string;
  isEmailVerified: boolean;
  siteTheme: Theme;
  currency: Currency;
  locale: string;
} | null;

export enum Theme {
  dark = 'Dark',
  light = 'Light',
}

export enum Currency {
  usd = 'USD',
  eur = 'EUR',
  nis = 'NIS',
  gbp = 'GBP',
  rub = 'RUB',
}

export const initialContextState = {
  siteTheme: (localStorage.getItem('siteTheme') as Theme) ?? Theme.dark,
  user: JSON.parse(localStorage.getItem('user') as string) as User | null,
  isAuthenticated: false,
  language: (JSON.parse(localStorage.getItem('language') as string) as Language) ?? english,
  currency: (localStorage.getItem('currency') as Currency) ?? Currency.usd,
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

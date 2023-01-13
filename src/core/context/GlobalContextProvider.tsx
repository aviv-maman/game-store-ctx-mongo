import { useMemo } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { GlobalContext, useGlobalReducer } from './initialContextState';

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useGlobalReducer();

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

import { useEffect, useMemo } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { GlobalContext, useGlobalReducer } from './initialContextState';
import { GlobalActionKeys } from './action';

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useGlobalReducer();
  const { user } = state;

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  // Listen for auth state changes (is user logged in or out)
  useEffect(() => {
    const unsubscribe = () => {
      dispatch({ type: GlobalActionKeys.UpdateUser, payload: user });
    };
    return () => unsubscribe();
  }, [dispatch, user]);

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

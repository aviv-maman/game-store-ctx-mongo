// Description: This hook is used to listen for auth state changes (is user logged in or out)
// and update the user state in the context.

//React
import { useCallback, useEffect } from 'react';
//Context
import { useGlobalContext } from '../core/context/initialContextState';
import { GlobalActionKeys } from '../core/context/action';
//Services
import { authAPI } from '../app/services/authAPI';

//API calls
const api = authAPI();

export const useAuth = () => {
  const { dispatch } = useGlobalContext();
  // Listen for auth state changes (is user logged in or out)
  const cachedFn = useCallback(
    async function checkToken() {
      try {
        const { user, status } = await api.getMe();
        if (status === 'success') {
          dispatch({ type: GlobalActionKeys.UpdateUser, payload: user });
        }
        console.log('user', user);
      } catch (error) {
        dispatch({ type: GlobalActionKeys.UpdateUser, payload: null });
        console.error('error', error);
      }
    },
    [dispatch]
  );

  // useEffect(() => {
  //   cachedFn();
  // }, [cachedFn]);
};

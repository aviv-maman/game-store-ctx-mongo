// Description: This hook is used to listen for auth state changes (is user logged in or out)
// and update the user state in the context.

//React
import { useCallback, useEffect, useMemo, useState } from 'react';
//Context
import { useGlobalContext } from '../core/context/initialContextState';
import { GlobalActionKeys } from '../core/context/action';
//Services
import { authAPI } from '../app/services/authAPI';

//API calls
const api = authAPI();

export const useAuth = () => {
  const { state, dispatch } = useGlobalContext();

  const getCookie = (name: string) => {
    const match = document.cookie.match(`(?:^|.*)${name}=(.+?)(?:$|[|;].*)`);
    return match ? match[1] : undefined;
  };

  // state for cookie existence
  const [token, setToken] = useState(getCookie('jwt'));

  // Listen for auth state changes (is user logged in or out)
  const cachedFn = useCallback(async function checkTokenExistence() {
    console.log('token', token);
    if (state.user === null && token) {
      // const { user, status } = await api.getMe();
      const { user, status } = {
        user: { email: 'a', firstName: 'a', lastName: 'a', phoneNumber: 'a', height: 1, weight: 2, photoURL: 'a', uid: 'a' },
        status: 'success',
      };
      console.log('user', user);
      if (status === 'success') {
        dispatch({ type: GlobalActionKeys.UpdateUser, payload: user });
      } else {
        dispatch({ type: GlobalActionKeys.UpdateUser, payload: null });
      }
    }
  }, []);

  //   const checkTokenExistence = async () => {
  //     console.log('token', token);
  //     if (state.user === null && token) {
  //       // const { user, status } = await api.getMe();
  //       const { user, status } = {
  //         user: { email: 'a', firstName: 'a', lastName: 'a', phoneNumber: 'a', height: 1, weight: 2, photoURL: 'a', uid: 'a' },
  //         status: 'success',
  //       };
  //       console.log('user', user);
  //       if (status === 'success') {
  //         dispatch({ type: GlobalActionKeys.UpdateUser, payload: user });
  //       } else {
  //         dispatch({ type: GlobalActionKeys.UpdateUser, payload: null });
  //       }
  //     }
  // };

  useEffect(() => {
    cachedFn();
  }, []);

  const { user } = state;
  return useMemo(() => ({ user }), [user]);
};

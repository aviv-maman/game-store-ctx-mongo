//React
import { useEffect } from 'react';
//React-Router-DOM
import { useActionData, useFetcher, useLocation, useNavigate, useNavigation, useSubmit } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
import type { VerifyEmail } from '../app/services/authAPI';
//Context
import { GlobalActionKeys } from '../core/context/action';
import { useGlobalContext } from '../core/context/initialContextState';
//PrimeReact
import { PrimeIcons } from 'primereact/api';

//API calls
const api = authAPI();

export default function EmailVerificationPage() {
  const { state } = useGlobalContext();
  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();

  //React-Router-DOM & Context
  const verifyActionData = useActionData() as VerifyEmail;
  const navigation = useNavigation();
  const submit = useSubmit();
  const fetcher = useFetcher();

  useEffect(() => {
    if (!state.user?.isEmailVerified) {
      console.log('useEffect.isEmailVerified', state.user?.isEmailVerified);
      // submit(null, {});
      fetcher.submit({}, { method: 'patch' });
    }
    // navigate('/profile');
    console.log('state.user?.isEmailVerified', state.user?.isEmailVerified);
  }, [state.user?.isEmailVerified, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      {navigation.state !== 'idle' && <p>{'navigation.state loading'}</p>}
      {navigation.state === 'idle' && verifyActionData?.code && <p>{verifyActionData.code}</p>}
      {navigation.state === 'idle' && verifyActionData?.message && <p>{verifyActionData.message}</p>}
    </div>
  );
}

//React
import { useEffect, useState } from 'react';
//React-Router-DOM
import { Form, useActionData, useFetcher, useLoaderData, useLocation, useNavigate, useNavigation, useSubmit } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
import type { SendVerificationEmail } from '../app/services/authAPI';
//Context
import { GlobalActionKeys } from '../core/context/action';
import { useGlobalContext } from '../core/context/initialContextState';
//PrimeReact
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { log } from 'console';

//API calls
const api = authAPI();

export async function changeEmailLoader({ request, params }: ActionFunctionArgs) {
  const newEmailToken = params.newEmailToken as string;
  try {
    const res = await api.changeEmail(newEmailToken);
    console.log(res);
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export default function ProfilePage() {
  const { state } = useGlobalContext();
  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();

  //React-Router-DOM & Context
  const verifyActionData = useActionData() as SendVerificationEmail;
  const navigation = useNavigation();
  const fetcher = useFetcher();

  const [initDisabled, setInitDisabled] = useState(true);

  const toggleInitDisabled = () => {
    setInitDisabled(!initDisabled);
  };

  const location = useLocation();
  const submit = useSubmit();
  const res = useLoaderData() as any;

  useEffect(() => {
    if (location.pathname.startsWith('/profile/new-email/')) {
      console.log(location.pathname.startsWith('/profile/new-email/'));
      console.log(res?.success);
      // submit(null, {});
    }
    navigate('/profile');
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <fetcher.Form method='post' action='send-verification-email'>
        <Button
          type='submit'
          label={!state.user?.isEmailVerified ? 'Send Verification Email' : 'Email Is Verified'}
          name='email'
          value={state.user?.email}
          disabled={fetcher.state !== 'idle' || navigation.state !== 'idle' || state.user?.isEmailVerified}
        />
      </fetcher.Form>
      <fetcher.Form method='post' action='send-new-email'>
        <label>
          <span>Email</span>
          <InputText id='email' name='newEmail' type='email' defaultValue={state.user?.email} disabled={initDisabled} />
        </label>
        {initDisabled ? (
          <Button type='button' label='Change' disabled={fetcher.state !== 'idle' || navigation.state !== 'idle'} onClick={toggleInitDisabled} />
        ) : (
          <>
            <Button
              type='submit'
              label='Confirm'
              name='currentEmail'
              value={state.user?.email}
              disabled={fetcher.state !== 'idle' || navigation.state !== 'idle'}
            />
            <Button type='button' label='Cancel' disabled={fetcher.state !== 'idle' || navigation.state !== 'idle'} onClick={toggleInitDisabled} />
            <label>
              <span>Enter Your Password</span>
              <InputText id='password' name='password' type='password' />
            </label>
          </>
        )}
      </fetcher.Form>
      {location.pathname.startsWith('/profile/new-email/') && <p>{res?.success ? 'true' : 'false'}</p>}
      {fetcher.state !== 'idle' && <p>{'fetcher.state loading'}</p>}
      {fetcher.state === 'idle' && fetcher.data?.code && <p>{fetcher.data?.code}</p>}
      {fetcher.state === 'idle' && fetcher.data?.message && <p>{fetcher.data?.message}</p>}
    </div>
  );
}

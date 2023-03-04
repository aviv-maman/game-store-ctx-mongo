//React
import { useEffect, useState } from 'react';
//React-Router-DOM
import { Form, useActionData, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
import type { SignUpForm, SignUpActionData } from '../app/services/authAPI';
//Context
import { GlobalActionKeys } from '../core/context/action';
import { useGlobalContext } from '../core/context/initialContextState';
//PrimeReact
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

//API calls
const api = authAPI();

export async function signUpAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData) as SignUpForm; //To get a single field: const firstName = formData.get("first");
  try {
    let response = {};
    if (updates.provider === 'username') {
      response = await api.signUp(updates);
    } else {
      response = await api.logInWithProvider(updates.provider, updates.idToken ?? '');
    }
    // const { user, message } = await api.signUp(updates);
    return response;
    // return redirect(`/`); can be done like this, but a better advanced option is in the useEffect
  } catch (error: any) {
    console.error(error);
    return { code: error.code, message: error.message };
  }
}

export default function SignUpPage() {
  const [provider, setProvider] = useState(''); //['username', 'google', 'facebook', 'twitter', 'github']
  const [idToken, setIdToken] = useState('');

  const { dispatch } = useGlobalContext(); //GlobalContext
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const actionData = useActionData() as SignUpActionData;
  const navigation = useNavigation(); //navigation.state === 'loading', 'submitting', 'idle'

  useEffect(() => {
    if (actionData && actionData.user) {
      dispatch({ type: GlobalActionKeys.UpdateUser, payload: actionData.user });
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    }
  }, [actionData, dispatch, navigate, from]);

  useEffect(() => {
    /* global google */
    window?.google?.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID as any,
      callback: async (response: any) => {
        const idToken = response.credential;
        setIdToken(idToken);
        try {
          const userCredential = await api.logInWithProvider('google', idToken);
          dispatch({ type: GlobalActionKeys.UpdateUser, payload: userCredential.user });
        } catch (error: any) {
          console.error(error);
          return { code: error.code, message: error.message };
        }
      },
    });
    window?.google?.accounts.id.renderButton(document.getElementById('signInDiv'), { theme: 'outline', size: 'large' });
    window?.google?.accounts.id.renderButton(document.getElementById('signUpWithGoogleUsingAction'), { theme: 'outline', size: 'large' });
  }, [dispatch]);

  return (
    <div>
      <h2>React-Router-DOM & Context Sign Up</h2>
      <Form method='post' id='sign_up-form'>
        <label>
          <span>First Name:</span>
          <input required={provider === 'username'} name='firstName' type='text' />
        </label>
        <label>
          <span>Last Name:</span>
          <input required={provider === 'username'} name='lastName' type='text' />
        </label>
        <label>
          <span>Email:</span>
          <input required={provider === 'username'} name='email' type='email' />
        </label>
        <label>
          <span>Password:</span>
          <input required={provider === 'username'} name='password' type='password' />
        </label>
        <label>
          <span>Password Confirm:</span>
          <input required={provider === 'username'} name='passwordConfirm' type='password' />
        </label>
        <Button
          name={provider === 'username' ? 'provider' : undefined}
          type='submit'
          icon={PrimeIcons.GLOBE}
          onClick={(e) => setProvider('username')}
          value={'username'}>
          Sign Up
        </Button>
        <Button
          id='signUpWithGoogleUsingAction'
          name={provider === 'google' ? 'provider' : undefined}
          type='submit'
          onClick={(e) => setProvider('google')}
          value={['google', idToken]}
        />

        <div id='signInDiv' />
      </Form>
      {navigation.state !== 'idle' && <p>{'navigation.state loading'}</p>}
      {actionData && actionData.code && <p>{actionData.code}</p>}
      {actionData && actionData.message && <p>{actionData.message}</p>}
    </div>
  );
}

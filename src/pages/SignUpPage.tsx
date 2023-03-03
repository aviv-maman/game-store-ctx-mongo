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
//JWT-Decode
import jwt_decode from 'jwt-decode';

//API calls
const api = authAPI();

export async function signUpAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData) as SignUpForm; //To get a single field: const firstName = formData.get("first");
  try {
    let response = {} as any;
    if (updates.provider === 'username') {
      response = await api.signUp(updates);
    } else {
      response = { user: {} };
      window.location.assign(`http://localhost:8000/api/v1/users/auth/${updates.provider}`);
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
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        const user = jwt_decode(response.credential);
        console.log(user);
        // dispatch({ type: GlobalActionKeys.UpdateUser, payload: user });
      },
    });

    window?.google?.accounts.id.renderButton(document.getElementById('signInDiv'), { theme: 'outline', size: 'large' });
  }, []);

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   try {
  //     await api.signUp({ email, password });
  //   } catch (error: any) {
  //     console.error(error);
  //     throw error;
  //   }
  // };

  // const handleSubmitProvider = async (provider: string) => {
  //   try {
  //     window.location.assign(`http://localhost:8000/api/v1/users/auth/${provider}`);
  //   } catch (error: any) {
  //     console.error(error);
  //     throw error;
  //   }
  // };

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
          name={provider === 'google' ? 'provider' : undefined}
          type='submit'
          icon={PrimeIcons.GOOGLE}
          onClick={(e) => setProvider('google')}
          value={'google'}>
          Continue with Google
        </Button>
        <div id='signInDiv' />
      </Form>
      {navigation.state !== 'idle' && <p>{'navigation.state loading'}</p>}
      {actionData && actionData.code && <p>{actionData.code}</p>}
      {actionData && actionData.message && <p>{actionData.message}</p>}
    </div>
  );
}

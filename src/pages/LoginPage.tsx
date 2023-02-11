//React
import { useEffect, useState } from 'react';
//React-Router-DOM
import { Form, useActionData, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
import type { LogInForm, LogInActionData } from '../app/services/authAPI';
//Context
import { GlobalActionKeys } from '../core/context/action';
import { useGlobalContext } from '../core/context/initialContextState';
//PrimeReact
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

//API calls
const api = authAPI();

export async function loginAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData) as LogInForm; //To get a single field: const firstName = formData.get("first");
  try {
    const actionData = await api.logIn(updates);
    return actionData;
    // return redirect(`/`); can be done like this, but a better advanced option is in the useEffect
  } catch (error: any) {
    console.error(error);
    const errorData = { code: error.code, message: error.message };
    return errorData;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  //React-Router-DOM & Context
  const actionData = useActionData() as LogInActionData;
  const navigation = useNavigation(); //navigation.state === 'loading', 'submitting', 'idle'

  useEffect(() => {
    if (actionData?.success && actionData?.user) {
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

  const handleLoginWithProvider = async (provider: string) => {
    try {
      // const { user } = await api.logInWithProvider(provider);
      // dispatch({ type: GlobalActionKeys.UpdateUser, payload: user });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div>
      <h2>React-Router-DOM & Context Login</h2>
      <Form method='post' id='login-form'>
        <label>
          <span>Email:</span>
          <input required name='email' type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
        </label>
        <label>
          <span>Password:</span>
          <input required name='password' type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
        </label>
        <Button type='submit'>Log In</Button>
        <Button
          type='button'
          onClick={() => {
            navigate('/forgot-password');
          }}>
          Forgot Password?
        </Button>
        <p>Or log in with:</p>
        <Button type='button' icon={PrimeIcons.GOOGLE} onClick={(e) => handleLoginWithProvider('google')}>
          Google
        </Button>
      </Form>
      {navigation.state !== 'idle' && <p>{'navigation.state loading'}</p>}
      {navigation.state === 'idle' && actionData?.success && <p>login successful</p>}
    </div>
  );
}

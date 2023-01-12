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
    const { user, message } = await api.signUp(updates);
    return user;
    // return redirect(`/`); can be done like this, but a better advanced option is in the useEffect
  } catch (error: any) {
    console.error(error);
    return { code: error.code, message: error.message };
  }
}

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

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

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   try {
  //     await api.signUp({ email, password });
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
          <span>Name:</span>
          <input required name='name' type='text' onChange={(e) => setName(e.target.value)} value={name} />
        </label>
        <label>
          <span>Email:</span>
          <input required name='email' type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
        </label>
        <label>
          <span>Password:</span>
          <input required name='password' type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
        </label>
        <label>
          <span>Password Confirm:</span>
          <input required name='passwordConfirm' type='password' onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm} />
        </label>
        <Button type='submit' icon={PrimeIcons.GLOBE}>
          Sign Up
        </Button>
      </Form>
      {navigation.state !== 'idle' && <p>{'navigation.state loading'}</p>}
      {actionData && actionData.code && <p>{actionData.code}</p>}
      {actionData && actionData.message && <p>{actionData.message}</p>}
    </div>
  );
}

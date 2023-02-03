//React
import { useEffect, useState } from 'react';
//React-Router-DOM
import { Form, useActionData, useFetcher, useLocation, useNavigate, useNavigation, useSearchParams, useSubmit } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
//PrimeReact
import { Button } from 'primereact/button';
import { useGlobalContext } from '../core/context/initialContextState';
import ForgotPasswordSuccess from '../components/ForgotPasswordSuccess';
//Assets
import { Mail28Regular } from '@fluentui/react-icons';

//API calls
const api = authAPI();

type ForgotPasswordAction = { success: boolean; code?: number; message: string };

export async function forgotPasswordAction({ request, params }: ActionFunctionArgs): Promise<ForgotPasswordAction> {
  const formData = await request.formData();
  const email = formData.get('email')?.toString() ?? '';
  try {
    // const res = await api.sendPasswordResetEmail(email);
    const res = { success: true, message: `Reset email was sent to ${email}` };
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(res);
      }, 3000);
    });
  } catch (error: any) {
    return { success: false, code: error.code, message: error.message };
  }
}

export default function ForgotPassword() {
  const actionData = useActionData() as ForgotPasswordAction;

  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');

  // To check if user is already logged in and prevent them from resetting password
  const { state } = useGlobalContext();
  const { user } = state;

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const navigation = useNavigation();

  const fetcher = useFetcher();

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    if (email) {
      fetcher.submit({ email }, { method: 'post' });
    }
  }, []);

  const handleForgetPasswordAction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const searchParams = new URLSearchParams([['email', email]]);
    const searchParamsString = searchParams.toString();
    window.history.pushState({}, '', `?${searchParamsString}`);
    fetcher.submit({ email }, { method: 'post' });
  };

  return (
    <div>
      <Form method='post' id='login-form'>
        <input name='email' type='email' value={email} className='p-hidden' readOnly />
        {!fetcher.data?.success ? (
          <>
            <h2>Sending of Reset Email</h2>
            <label>
              <span>Email:</span>
              <input required type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
            </label>
            <Button
              label='Send Reset Email'
              type='button'
              onClick={(e) => handleForgetPasswordAction(e)}
              loading={navigation.state !== 'idle'}
              disabled={navigation.state !== 'idle'}
              icon={<Mail28Regular />}
            />
          </>
        ) : (
          <ForgotPasswordSuccess handleForgetPasswordAction={handleForgetPasswordAction} />
        )}
      </Form>
      {navigation.state !== 'idle' && <p>{'navigation.state loading'}</p>}
      {fetcher.state !== 'idle' && <p>{'fetcher.state loading'}</p>}
      {actionData?.code && <p>{actionData.code}</p>}
      {actionData?.message && <p>{actionData.message}</p>}
    </div>
  );
}

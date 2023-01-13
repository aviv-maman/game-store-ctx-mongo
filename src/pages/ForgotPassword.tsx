//React
import { useEffect, useState } from 'react';
//React-Router-DOM
import { Form, useActionData, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
//PrimeReact
import { Button } from 'primereact/button';
import { useGlobalContext } from '../core/context/initialContextState';

//API calls
const api = authAPI();

type ForgotPasswordAction = { success: boolean; code: number; message: string };

export async function forgotPasswordAction({ request, params }: ActionFunctionArgs): Promise<ForgotPasswordAction> {
  const formData = await request.formData();
  const email = formData.get('email')?.toString() ?? '';
  try {
    ///
    // const response = await api.sendPasswordResetEmail(email);
    const response = { success: true, message: 'Password reset email sent' };
    ///
    return { success: response.success, code: 200, message: response.message };
  } catch (error: any) {
    return { success: false, code: error.code, message: error.message };
  }
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  // To check if user is already logged in and prevent them from resetting password
  const { state } = useGlobalContext();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const actionData = useActionData() as ForgotPasswordAction;
  const navigation = useNavigation();

  useEffect(() => {
    if (actionData?.success && !state?.user) {
      navigate(from, { replace: true });
    }
  }, [actionData, state, navigate, from]);

  return (
    <div>
      <h2>Sending of Reset Email</h2>
      <Form method='post' id='login-form'>
        <label>
          <span>Email:</span>
          <input required name='email' type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
        </label>
        <Button type='submit'>Send Reset Email</Button>
      </Form>
      {navigation.state !== 'idle' && <p>{'navigation.state loading'}</p>}
      {actionData && actionData.code && <p>{actionData.code}</p>}
      {actionData && actionData.message && <p>{actionData.message}</p>}
    </div>
  );
}

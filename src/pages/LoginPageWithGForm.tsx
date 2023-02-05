//React-Router-DOM
import { useLocation, useNavigate } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
import type { LogInForm } from '../app/services/authAPI';
//Context
import { GlobalActionKeys } from '../core/context/action';
import { useGlobalContext } from '../core/context/initialContextState';
//PrimeReact
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
//GForm
import { GForm, GInput } from 'gform-react';
import type { GFormState, GInputState, IForm } from 'gform-react';
import { Password } from 'primereact/password';
import { validators } from '../app/helpers/validators';

//API calls
const api = authAPI();

interface LoginForm extends IForm {
  email: GInputState<string>;
  password: GInputState<string>;
}

export default function LoginPageWithGForm() {
  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  async function loginAction(formState: GFormState<LoginForm>) {
    const formData = formState.toFormData();
    const updates = Object.fromEntries(formData) as LogInForm;
    try {
      const { user, message } = await api.logIn(updates);
      dispatch({ type: GlobalActionKeys.UpdateUser, payload: user });
      navigate(from, { replace: true });
      return user;
    } catch (error: any) {
      console.error(error);
      return { code: error.code, message: error.message };
    }
  }

  return (
    <div>
      <h2>GForm & Context Login</h2>
      <GForm<LoginForm> id='login-form' validators={validators} onSubmit={loginAction}>
        <GInput
          formKey={'email'}
          required
          element={(input, props) => (
            <div className='some-group'>
              <label htmlFor='email'>Email</label>
              <InputText {...props} id='email' aria-describedby='email-help' className={input.error ? 'p-invalid' : ''} />
              {input.error && (
                <small id='email-help' className='p-error'>
                  {input.errorText}
                </small>
              )}
            </div>
          )}
        />

        <GInput
          formKey={'password'}
          required
          minLength={8}
          element={(input, props) => (
            <div className='some-group'>
              <label htmlFor='password'>Password</label>
              <Password {...props} id='password' aria-describedby='password-help' className={input.error ? 'p-invalid' : ''} />
              {input.error && (
                <small id='password-help' className='p-error'>
                  {input.errorText}
                </small>
              )}
            </div>
          )}
        />
        <Button type='submit'>Log In</Button>
        <Button
          type='button'
          onClick={() => {
            navigate('/forgot-password');
          }}>
          Forgot Password?
        </Button>
      </GForm>
    </div>
  );
}

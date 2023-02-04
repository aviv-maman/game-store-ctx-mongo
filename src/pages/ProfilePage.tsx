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
import { Password } from 'primereact/password';

//API calls
const api = authAPI();

export default function ProfilePage() {
  const { state } = useGlobalContext();
  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();

  //React-Router-DOM & Context
  const verifyActionData = useActionData() as SendVerificationEmail;
  const navigation = useNavigation();
  const fetcher = useFetcher();

  const [initDisabled, setInitDisabled] = useState({ email: true, password: true });
  const toggleDisabled = (name: 'email' | 'password') => {
    setInitDisabled((prevState) => ({ ...prevState, [name]: !initDisabled[name] }));
  };

  const location = useLocation();
  const submit = useSubmit();
  const res = useLoaderData() as any;

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
      <h3>Login Details</h3>
      <div>
        <fetcher.Form method='post' action='send-new-email'>
          <label>
            <h4>Email</h4>
            <InputText id='email' name='newEmail' type='email' defaultValue={state.user?.email} disabled={initDisabled.email} />
          </label>
          {!initDisabled.email && (
            <>
              <span className='p-float-label'>
                <InputText id='password' name='password' type='password' />
                <label htmlFor='password'>Enter Password</label>
              </span>
              <Button
                type='submit'
                label='Confirm'
                name='currentEmail'
                value={state.user?.email}
                disabled={fetcher.state !== 'idle' || navigation.state !== 'idle'}
              />
            </>
          )}
          <Button
            type='button'
            label={initDisabled.email ? 'Change Email' : 'Cancel'}
            disabled={fetcher.state !== 'idle' || navigation.state !== 'idle'}
            onClick={() => toggleDisabled('email')}
          />
          {!initDisabled.email && <p>After clicking on confirm, an email will be sent to your current email to confirm the change</p>}
        </fetcher.Form>
      </div>
      <div>
        <fetcher.Form method='post' action='change-password'>
          <h4>Password</h4>
          {initDisabled.password ? (
            <Password inputId='password' disabled value='********' readOnly />
          ) : (
            <>
              <span className='p-float-label'>
                <Password name='currentPassword' inputId='currentPassword' feedback={false} />
                <label htmlFor='currentPassword'>Current Password</label>
              </span>
              <span className='p-float-label'>
                <Password name='newPassword' inputId='newPassword' />
                <label htmlFor='newPassword'>New Password</label>
              </span>
              <span className='p-float-label'>
                <Password name='newPasswordConfirm' inputId='newPasswordConfirm' feedback={false} />
                <label htmlFor='newPasswordConfirm'>New Password Confirmation</label>
              </span>
              <Button type='submit' label='Confirm' disabled={fetcher.state !== 'idle' || navigation.state !== 'idle'} />
            </>
          )}
          <Button
            type='button'
            label={initDisabled.password ? 'Change Password' : 'Cancel'}
            onClick={() => toggleDisabled('password')}
            disabled={fetcher.state !== 'idle' || navigation.state !== 'idle'}
          />
        </fetcher.Form>
        <div>
          <h3>Personal Details</h3>
          <fetcher.Form method='post' action='update-profile'>
            <label>
              <h4>Name</h4>
              <InputText id='name' name='name' type='text' defaultValue={state.user?.firstName.concat(' ', state.user?.lastName)} />
            </label>
          </fetcher.Form>
        </div>
      </div>
      {location.pathname.startsWith('/profile/new-email/') && <p>{res?.success ? 'true' : 'false'}</p>}
      {fetcher.state !== 'idle' && <p>{'fetcher.state loading'}</p>}
      {fetcher.state === 'idle' && fetcher.data?.code && <p>{fetcher.data?.code}</p>}
      {fetcher.state === 'idle' && fetcher.data?.message && <p>{fetcher.data?.message}</p>}
    </div>
  );
}

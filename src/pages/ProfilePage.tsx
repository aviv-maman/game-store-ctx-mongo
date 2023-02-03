//React
import { useEffect, useState } from 'react';
//React-Router-DOM
import { Form, useActionData, useFetcher, useLocation, useNavigate, useNavigation } from 'react-router-dom';
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

  return (
    <div>
      <h2>Profile</h2>
      <fetcher.Form method='post' action='send-verification-email'>
        <Button type='submit' label='Send Verification Email' name='email' value={state.user?.email} />
      </fetcher.Form>
      {fetcher.state !== 'idle' && <p>{'fetcher.state loading'}</p>}
      {fetcher.state === 'idle' && fetcher.data?.code && <p>{fetcher.data?.code}</p>}
      {fetcher.state === 'idle' && fetcher.data?.message && <p>{fetcher.data?.message}</p>}
    </div>
  );
}

//React
import { useState } from 'react';
//React-Router-DOM
import { useFetcher, useLoaderData, useLocation, useNavigation } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
//Context
import { GlobalActionKeys } from '../core/context/action';
import { Currency, Theme, useGlobalContext } from '../core/context/initialContextState';
//PrimeReact
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { languages } from '../core/languages';
import { Calendar } from 'primereact/calendar';

//API calls
const api = authAPI();

export default function ProfilePage() {
  const { state } = useGlobalContext();
  const { dispatch } = useGlobalContext();

  //React-Router-DOM & Context
  const navigation = useNavigation();
  const fetcher = useFetcher();

  const [initDisabled, setInitDisabled] = useState({ email: true, password: true });
  const toggleDisabled = (name: 'email' | 'password') => {
    setInitDisabled((prevState) => ({ ...prevState, [name]: !initDisabled[name] }));
  };

  const location = useLocation();
  const res = useLoaderData() as any;

  const [selectedLanguage, setSelectedLanguage] = useState(state.language ?? languages[0]);

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
          <fetcher.Form method='post' action='update-profile'>
            <div>
              <h3>Personal Details</h3>
              <div>
                <Avatar image='user.png' icon='pi pi-user' size='xlarge' />
                <h5>{state.user?.firstName.concat(' ', state.user?.lastName)}</h5>
              </div>
              <label>
                <h4>First Name</h4>
                <InputText id='firstName' name='firstName' type='text' defaultValue={state.user?.firstName} />
              </label>
              <label>
                <h4>Last Name</h4>
                <InputText id='lastName' name='lastName' type='text' defaultValue={state.user?.lastName} />
              </label>
              <label>
                <h4>Date of Birth</h4>
                <Calendar
                  id='dateOfBirth'
                  name='dateOfBirth'
                  dateFormat='dd/mm/yy'
                  maxDate={new Date('01-01-2023')}
                  value={state.user?.dateOfBirth}
                  showIcon
                />
              </label>
            </div>
            <div>
              <h3>Website Settings</h3>
              <label>
                <h4>Language</h4>
                <Dropdown
                  id='locale-dropdown'
                  value={selectedLanguage}
                  options={Array.from(Object.values(languages))}
                  onChange={(e) => setSelectedLanguage(e.value)}
                  optionLabel='nativeLabel'
                  filter
                  filterBy='nativeLabel'
                  placeholder='Select a Language'
                  // valueTemplate={selectedCountryTemplate}
                  // itemTemplate={countryOptionTemplate}
                />
                <InputText id='locale' name='locale' type='text' value={selectedLanguage.code} className='p-hidden' />
              </label>
              <label>
                <h4>Currency</h4>
                <Dropdown
                  id='currency-dropdown'
                  value={state.user?.currency ?? Currency.usd}
                  options={Object.values(Currency)}
                  onChange={(e) => dispatch({ type: GlobalActionKeys.UpdateCurrency, payload: e.value })}
                  placeholder='Select a Currency'
                  // valueTemplate={selectedCountryTemplate}
                  // itemTemplate={countryOptionTemplate}
                />
                <InputText id='currency' name='currency' type='text' value={state.user?.currency} className='p-hidden' />
              </label>
              <label>
                <h4>Theme</h4>
                <Dropdown
                  id='theme-dropdown'
                  value={state.user?.siteTheme ?? Theme.dark}
                  options={Object.values(Theme)}
                  onChange={(e) => dispatch({ type: GlobalActionKeys.UpdateTheme, payload: e.value })}
                  placeholder='Select a Theme'
                />
                <InputText id='siteTheme' name='siteTheme' type='text' value={state.user?.siteTheme} className='p-hidden' />
              </label>
            </div>
            <Button type='submit' label='Save' disabled={fetcher.state !== 'idle' || navigation.state !== 'idle'} />
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

//React
import { useEffect, useState } from 'react';
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
import { FileUpload } from 'primereact/fileupload';
import type { FileUploadHandlerEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { convertFileToBase64 } from '../app/helpers/convertFileToBase64';
import { customBase64Uploader } from './ProfileActionsAndLoaders';

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

  useEffect(() => {
    if (fetcher.data?.user && fetcher.data?.success && fetcher.state === 'idle') {
      dispatch({ type: GlobalActionKeys.UpdateUser, payload: fetcher.data.user });
    }
  }, [fetcher, dispatch]);

  const location = useLocation();
  const res = useLoaderData() as any;

  const [selectedLanguage, setSelectedLanguage] = useState(state.language ?? languages[0]);
  const [fileData, setFileData] = useState(state.user?.photo ?? '');

  async function handleFile(event: React.ChangeEvent<HTMLInputElement> | any) {
    const fileAsBase64 = (await convertFileToBase64(event.target.files[0])) as string;
    setFileData(fileAsBase64);
  }

  const customUploader = async (event: FileUploadHandlerEvent) => {
    const file = event.files[0];
    console.log('file', file);
    // try {
    //   const fileRes = await api.updateProfile({ photo: file });
    //   return res;
    // } catch (error: any) {
    //   console.error(error);
    //   return error;
    // }
  };

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
              {/* <FileUpload mode='basic' name='demo' accept='image/*' customUpload uploadHandler={customBase64Uploader} /> */}
              <FileUpload
                mode='basic'
                name='photo'
                accept='image/*'
                // uploadHandler={customUploader}
                url='http://localhost:8000/api/v1/users/updateMe'
                withCredentials
                onBeforeSend={(e) => {
                  e.xhr.open('PATCH', 'http://localhost:8000/api/v1/users/updateMe');
                }}
                onUpload={(e) => {
                  const res = JSON.parse(e.xhr.response);
                  dispatch({ type: GlobalActionKeys.UpdateUser, payload: res.user });
                }}
                // maxFileSize={1000000}
                // chooseLabel='Change Image'
                chooseOptions={{ label: 'Change Image', icon: 'pi pi-plus' }}
              />
              <div>
                <Avatar image={state.user?.photo} icon='pi pi-user' size='xlarge' />
                <h5>{state.user?.firstName.concat(' ', state.user?.lastName)}</h5>
                {/* <input type='file' onChange={(e) => handleFile(e)} accept='image/*' />
                <InputText id='photo' name='photo' type='text' value={fileData} className='p-hidden' /> */}
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
                <h4>Phone Number</h4>
                <InputText id='phoneNumber' name='phoneNumber' type='text' defaultValue={state.user?.phoneNumber} />
              </label>
              <label>
                <h4>Date of Birth</h4>
                <Calendar
                  id='dateOfBirth'
                  name='dateOfBirth'
                  dateFormat='dd/mm/yy'
                  minDate={new Date(`01-01-${new Date(Date.now()).getFullYear() - 100}`)}
                  maxDate={new Date(`01-01-${new Date(Date.now()).getFullYear()}`)}
                  value={new Date(state.user?.dateOfBirth ?? '')}
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

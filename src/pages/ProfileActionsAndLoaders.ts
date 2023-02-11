//React-Router-DOM
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';
//Services
import { authAPI, ChangePassword } from '../app/services/authAPI';
//Types
import type { SendNewEmail } from '../app/services/authAPI';
//Helpers
import { prepareDateToMongoDB } from '../app/helpers/prepareDateMongoDB';

//API calls
const api = authAPI();

export async function sendVerificationAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  try {
    const res = await api.sendVerificationEmail(email);
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export async function verifyEmailLoader({ request, params }: LoaderFunctionArgs) {
  const verificationToken = params.verificationToken as string;
  const url = new URL(request.url);
  const isPathMatches = url.pathname.startsWith('/profile/verify-email/');
  try {
    const res = isPathMatches ? await api.verifyEmail(verificationToken) : { success: false };
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export async function sendNewEmailAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const emailsAndPassword = Object.fromEntries(formData) as SendNewEmail;
  try {
    const res = await api.sendNewEmail(emailsAndPassword);
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export async function changeEmailLoader({ request, params }: LoaderFunctionArgs) {
  const newEmailToken = params.newEmailToken as string;
  const url = new URL(request.url);
  const isPathMatches = url.pathname.startsWith('/profile/new-email/');
  try {
    const res = isPathMatches ? await api.changeEmail(newEmailToken) : { success: false };
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export async function changePasswordAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const passwords = Object.fromEntries(formData) as ChangePassword;
  try {
    const res = await api.changePassword(passwords);
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export async function updateProfileAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const formattedDateOfBirth = prepareDateToMongoDB(updates.dateOfBirth as string);
  updates.dateOfBirth = formattedDateOfBirth;
  console.log(updates);
  try {
    const res = await api.updateProfile(updates);
    return res;
    // return { updates, success: true };
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export const customBase64Uploader = async (event: React.ChangeEvent<HTMLInputElement> | any) => {
  // convert file to base64 encoded
  const file = event.files[0];
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
  reader.readAsDataURL(blob);
  reader.onloadend = async function () {
    const base64data = reader.result as string;
    try {
      const res = await api.updateProfile({ photo: base64data });
      return res;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  };
};

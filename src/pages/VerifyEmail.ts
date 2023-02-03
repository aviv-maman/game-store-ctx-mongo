//React-Router-DOM
import type { ActionFunctionArgs } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';
//Types
import type { SendNewEmail } from '../app/services/authAPI';

//API calls
const api = authAPI();

export async function sendVerificationAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  try {
    const res = await api.sendVerificationEmail(email);
    console.log(res);
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export async function sendNewEmailAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const emails = Object.fromEntries(formData) as SendNewEmail;
  console.log(emails);
  try {
    const res = await api.sendNewEmail(emails);
    // const res = { success: true, message: 'A new email was successfully sent.' };
    console.log(res);
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export async function changeEmailAction({ request, params }: ActionFunctionArgs) {
  const newEmailToken = params.newEmailToken as string;
  try {
    const res = await api.changeEmail(newEmailToken);
    console.log(res);
    return res;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

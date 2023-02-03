//React-Router-DOM
import type { ActionFunctionArgs } from 'react-router-dom';
//Services
import { authAPI } from '../app/services/authAPI';

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

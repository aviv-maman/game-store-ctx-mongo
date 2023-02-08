import axios from 'axios';
import type { Currency, Theme, User } from '../../core/context/initialContextState';

export type ServerResponse = {
  message?: string;
  length: number;
  totalLength: number;
  page: number;
  totalPages: number;
};

export type Query = {
  q?: string;
  page?: number;
};

export type SignUpForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type LogInForm = {
  email: string;
  password: string;
};

export type SignUpActionData = {
  user: User;
  code: string;
  message: string;
};

export type LogInActionData = {
  user: User;
  code: string;
  message: string;
};

export type SendVerificationEmail = {
  email: string;
  code: string;
};

export type VerifyEmail = {
  code: string;
  message: string;
};

export type SendNewEmail = {
  currentEmail: string;
  newEmail: string;
  password: string;
};

export type ChangePassword = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type UpdateProfile = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  height?: number;
  weight?: number;
  photo?: string;
  siteTheme?: Theme;
  currency?: Currency;
  locale?: string;
};

export type FirebaseAuthAPI = {
  signUp: (formData: SignUpForm) => Promise<{ message: string; user: User }> | any;
  logOut: () => { message: string } | any;
  logIn: (formData: LogInForm) => Promise<{ message: string; user: User }> | any;
  // logInWithProvider: (provider: string) => Promise<{ message: string; user: any }> | any;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; message: string }> | any;
  getMe: () => Promise<{ message: string; user: User }> | any;
  sendVerificationEmail: (email: string) => Promise<{ success: boolean; message: string }> | any;
  verifyEmail: (verificationToken: string) => Promise<{ success: boolean; message: string }> | any;
  sendNewEmail: (formData: SendNewEmail) => Promise<{ success: boolean; message: string }> | any;
  changeEmail: (newEmailToken: string) => Promise<{ success: boolean; message: string }> | any;
  changePassword: (formData: ChangePassword) => Promise<{ success: boolean; message: string }> | any;
  updateProfile: (formData: UpdateProfile) => Promise<{ success: boolean; message: string }> | any;
};

export const authAPI = (): FirebaseAuthAPI => {
  return {
    signUp: async (formData: SignUpForm) => {
      const controller = new AbortController();
      try {
        const userCredential = await axios.post('http://localhost:8000/api/v1/users/signup', formData, { withCredentials: true });
        console.log(userCredential);
        return { message: 'A user was successfully signed up.', user: userCredential.data.user, token: userCredential.data.token };
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with signing up.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    logOut: async () => {
      const controller = new AbortController();
      try {
        await axios.get('http://localhost:8000/api/v1/users/logout', { withCredentials: true });
        return { message: 'A user was successfully logged out.' };
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with logging out.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    logIn: async (formData) => {
      const controller = new AbortController();
      try {
        const userCredential = await axios.post('http://localhost:8000/api/v1/users/login', formData, { withCredentials: true });
        return { message: 'A user was successfully logged in.', user: userCredential.data.user };
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with login.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    getMe: async () => {
      const controller = new AbortController();
      try {
        const userCredential = await axios.get('http://localhost:8000/api/v1/users/me', { withCredentials: true });
        console.log('getMe', userCredential);
        return { message: 'User information was successfully sent.', user: userCredential.data.doc, status: userCredential.data.status };
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with login.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    // logInWithProvider: async (provider) => {
    //   const controller = new AbortController();
    //   let chosenProvider = new GoogleAuthProvider();
    //   switch (provider) {
    //     case 'google':
    //       break;
    //     case 'facebook':
    //       chosenProvider = new FacebookAuthProvider();
    //       break;
    //     default:
    //       break;
    //   }
    //   try {
    //     const userCredential = await signInWithPopup(auth, chosenProvider);
    //     return { message: 'A user was successfully logged in.', user: userCredential.user };
    //   } catch (error: any) {
    //     if (controller.signal.aborted) {
    //       console.log('The request was cancelled:', controller.signal.reason);
    //     } else {
    //       console.log('There was a problem with login.');
    //       throw error;
    //     }
    //   }
    //   return () => controller.abort();
    // },
    sendPasswordResetEmail: async (email) => {
      const controller = new AbortController();
      try {
        const response = await axios.post('http://localhost:8000/api/v1/users/forgotPassword', { email });
        return response.data;
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with login.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    sendVerificationEmail: async (email) => {
      const controller = new AbortController();
      try {
        const response = await axios.post('http://localhost:8000/api/v1/users/send-verification-email', { email });
        return response.data;
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with login.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    verifyEmail: async (verificationToken) => {
      const controller = new AbortController();
      try {
        const response = await axios.patch(`http://localhost:8000/api/v1/users/verify-email/${verificationToken}`);
        return response.data;
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem verifying the email.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    sendNewEmail: async (formData) => {
      const controller = new AbortController();
      try {
        const response = await axios.post('http://localhost:8000/api/v1/users/send-new-email', formData, { withCredentials: true });
        return response.data;
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem with sending the email.');
          throw error;
        }
      }
      return () => controller.abort();
    },
    changeEmail: async (newEmailToken) => {
      const controller = new AbortController();
      try {
        const response = await axios.patch(`http://localhost:8000/api/v1/users/new-email/${newEmailToken}`, { withCredentials: true });
        return response.data;
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem changing the email.');
          return { ...error, success: false };
        }
      }
      return () => controller.abort();
    },
    changePassword: async (formData) => {
      const controller = new AbortController();
      try {
        const response = await axios.patch(`http://localhost:8000/api/v1/users/updateMyPassword`, formData, { withCredentials: true });
        return response.data;
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem changing the password.');
          return { ...error, success: false };
        }
      }
      return () => controller.abort();
    },
    updateProfile: async (formData) => {
      const controller = new AbortController();
      try {
        const response = await axios.patch(`http://localhost:8000/api/v1/users/updateMe`, formData, { withCredentials: true });
        return response.data;
      } catch (error: any) {
        if (controller.signal.aborted) {
          console.log('The request was cancelled:', controller.signal.reason);
        } else {
          console.log('There was a problem changing the password.');
          return { ...error, success: false };
        }
      }
      return () => controller.abort();
    },
  };
};

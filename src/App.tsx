// 3rd Party Imports
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
//Components
import AuthorizedRoute from './components/AuthorizedRoute';
import RootLayout from './components/layout/RootLayout';
import SpinnerChase from './components/spinners/SpinnerChase';
//Pages
import ErrorPage from './pages/ErrorPage';
import HomePage, { rootLoader } from './pages/HomePage';
import SignUpPage, { signUpAction } from './pages/SignUpPage';
import LoginPage, { loginAction } from './pages/LoginPage';
import ForgotPassword, { forgotPasswordAction } from './pages/ForgotPassword';
import ProductPage from './pages/ProductPage';
import SearchPage, { searchLoader } from './pages/SearchPage';
import AddProductPage, { addProductAction } from './pages/AddProductPage';
import EditProductPage, { editProductAction, editProductLoader } from './pages/EditProductPage';

import {
  changeEmailLoader,
  changePasswordAction,
  sendNewEmailAction,
  sendVerificationAction,
  updateProfileAction,
  verifyEmailLoader,
} from './pages/ProfileActionsAndLoaders';
//CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
//Init
import { useAuth } from './hooks/useAuth';
import SearchPageWithInfiniteScrolling, { searchWithInfiniteScrollingLoader } from './pages/SearchPageWithInfiniteScrolling';
import ProfilePage from './pages/ProfilePage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import LoginPageWithGForm from './pages/LoginPageWithGForm';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' id='root' element={<RootLayout />} loader={rootLoader} errorElement={<ErrorPage />}>
        <Route errorElement={<ErrorPage />}>
          <Route index element={<HomePage />} />
          <Route
            path='signup'
            element={
              <AuthorizedRoute requireGuest>
                <SignUpPage />
              </AuthorizedRoute>
            }
            action={signUpAction}
          />
          <Route
            path='login'
            element={
              <AuthorizedRoute requireGuest>
                <LoginPage />
              </AuthorizedRoute>
            }
            action={loginAction}
            // errorElement={<div>Oops! Login error. Line 60</div>}
          />
          <Route
            path='login-gform'
            element={
              <AuthorizedRoute requireGuest>
                <LoginPageWithGForm />
              </AuthorizedRoute>
            }
            // errorElement={<div>Oops! Login error. Line 69</div>}
          />
          <Route
            path='forgot-password'
            element={
              <AuthorizedRoute requireGuest>
                <ForgotPassword />
              </AuthorizedRoute>
            }
            action={forgotPasswordAction}
            // errorElement={<div>Oops! Login error. Line 79</div>}
          />
          <Route
            path='search'
            element={<SearchPageWithInfiniteScrolling />}
            loader={searchWithInfiniteScrollingLoader}
            errorElement={<div>Oops! Fetch error. Line 85</div>}
          />
          <Route
            path='product/:productId'
            element={<ProductPage />}
            // loader={productLoader}
            // action={productAction}
          />
          <Route
            path='product/:productId/edit'
            element={
              <AuthorizedRoute requireAuthorization>
                <EditProductPage />
              </AuthorizedRoute>
            }
            loader={editProductLoader}
            action={editProductAction}
          />
          <Route
            path='product/add'
            element={
              <AuthorizedRoute requireAuthorization>
                <AddProductPage />
              </AuthorizedRoute>
            }
            // loader={addProductLoader}
            action={addProductAction}
            errorElement={<div>Oops! ErrorElement Line 102</div>}
          />
          <Route
            path='profile'
            element={
              <AuthorizedRoute requireAuthorization>
                <ProfilePage />
              </AuthorizedRoute>
            }
            // loader={profileLoader}
            errorElement={<div>Oops! ErrorElement Line 112</div>}
          />
          <Route path='profile/send-verification-email' action={sendVerificationAction} errorElement={<div>Oops! ErrorElement Line 114</div>} />
          <Route
            path='profile/verify-email/:verificationToken'
            element={<EmailVerificationPage />}
            loader={verifyEmailLoader}
            errorElement={<div>Oops! ErrorElement Line 119</div>}
          />
          <Route path='profile/send-new-email' action={sendNewEmailAction} errorElement={<div>Oops! ErrorElement Line 121</div>} />
          <Route
            path='profile/new-email/:newEmailToken'
            element={<ProfilePage />}
            loader={changeEmailLoader}
            errorElement={<div>Oops! ErrorElement Line 126</div>}
          />
          <Route path='profile/change-password' action={changePasswordAction} errorElement={<div>Oops! ErrorElement Line 128</div>} />
          <Route path='profile/update-profile' action={updateProfileAction} errorElement={<div>Oops! ErrorElement Line 129</div>} />
          <Route path='*' element={<ErrorPage status={404} />} />
        </Route>
      </Route>
    )
  );

  useAuth();

  return <RouterProvider router={router} fallbackElement={<SpinnerChase />} />;
}

export default App;

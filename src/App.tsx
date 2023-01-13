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
//CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
//Init
import { useAuth } from './hooks/useAuth';

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
            // errorElement={<div>Oops! Login error. Line 33</div>}
          />
          <Route
            path='forgot-password'
            element={
              <AuthorizedRoute requireGuest>
                <ForgotPassword />
              </AuthorizedRoute>
            }
            action={forgotPasswordAction}
            // errorElement={<div>Oops! Login error. Line 33</div>}
          />
          <Route path='search' element={<SearchPage />} loader={searchLoader} errorElement={<div>Oops! Fetch error. Line 52</div>} />
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
            errorElement={<div>Oops! Fetch error. Line 81</div>}
          />
          <Route path='*' element={<ErrorPage status={404} />} />
        </Route>
      </Route>
    )
  );

  useAuth();

  return <RouterProvider router={router} fallbackElement={<SpinnerChase />} />;
}

export default App;

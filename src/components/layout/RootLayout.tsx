import { Outlet } from 'react-router-dom';
import MainNavBar from '../MainNavBar';

function RootLayout() {
  return (
    <>
      <MainNavBar />
      <Outlet />
    </>
  );
}

export default RootLayout;

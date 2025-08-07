import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <>
      <Header />
      <main className="main-content-wrapper">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;

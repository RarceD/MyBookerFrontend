import { lazy, Suspense, useState } from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { GetTokenId } from './api/auth'
import Footer from './components/Footer'
import HeaderRaad from './components/HeaderRaad'
import NoConnection from './pages/NoConnection'
import { convertNumberToType, PageType, PageTypeNumber } from './interfaces/pages'
import { responsiveCtr } from './util/responsiveService';
import { APP_NAME } from './api/request'
import { SendStatsInfo } from './api/actions'

const Comunity = lazy(() => import('./pages/Comunity'));
const Courts = lazy(() => import('./pages/Courts'));
const Profile = lazy(() => import('./pages/Profile'));
const Normative = lazy(() => import('./pages/Normative'));

const Login = lazy(() => import('./pages/Login'));
const ForgetCredentials = lazy(() => import('./pages/ForgetCredentials'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NumberCreate = lazy(() => import('./pages/NumberCreate'));
const Create = lazy(() => import('./pages/Create'));

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <Suspense fallback={<NoConnection />}>
        <Login />
      </Suspense>
  },
  {
    path: "/login",
    element:
      <Suspense fallback={<NoConnection />}>
        <Login />
      </Suspense>
  },
  {
    path: "/courts",
    element:
      <Suspense fallback={<NoConnection />}>
        <AppBase/>
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/create",
    element:
      <Suspense fallback={<NoConnection />}>
        <Create />
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/number",
    element:
      <Suspense fallback={<NoConnection />}>
        <NumberCreate />
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/forget",
    element:
      <Suspense fallback={<NoConnection />}>
        <ForgetCredentials />
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/privacy",
    element:
      <Suspense fallback={<NoConnection />}>
        <Privacy />
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "*",
    element:
      <Suspense fallback={<NoConnection />}>
        <Login />
      </Suspense>,
    errorElement: <NoConnection />
  }
]);

function AppBase() {
  const [page, setPage] = useState<PageType>('comunity');
  const navigate = useNavigate();
  const [token, id] = GetTokenId();
  if (token == "" || id == "") {
    navigate("/");
  }
  // Stats information when load app
  // SendStatsInfo();

  return (
    <>
      <HeaderRaad />
      {responsiveCtr.IsMobileDevice()
        ?
        <div className="App" >
          {page == "comunity" ? <Comunity /> : <></>}
          {page == "courts" ? <Courts /> : <></>}
          {page == "normative" ? <Normative /> : <></>}
          {page == "profile" ? <Profile /> : <></>}
        </div >
        : <div className="App" style={{ paddingLeft: "25%", paddingRight: "25%" }}>
          {page == "comunity" ? <Comunity /> : <></>}
          {page == "courts" ? <Courts /> : <></>}
          {page == "normative" ? <Normative /> : <></>}
          {page == "profile" ? <Profile /> : <></>}
        </div>
      }
      <Footer
        pageToShow={page}
        setPageToShow={(t: PageTypeNumber): void => setPage(convertNumberToType(t))} />
    </>
  )
}

function App() {

  // Check http or https
  let urlPath = window.location.href;
  if(!urlPath.includes("https") && !urlPath.includes("localhost") && APP_NAME.includes("Online"))
    window.location.href ='https://meapunto.online';

  // Control page name:
  document.title = APP_NAME;

  return <RouterProvider router={router} />
}
export default App

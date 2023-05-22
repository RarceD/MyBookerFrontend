import { lazy, Suspense, useState } from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { GetTokenId } from './api/auth'
import Footer from './components/Footer'
import HeaderRaad from './components/HeaderRaad'
import NoConnection from './pages/NoConnection'
import { convertNumberToType, PageType, PageTypeNumber } from './interfaces/pages'

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
        <Login />,
      </Suspense>
  },
  {
    path: "/login",
    element:
      <Suspense fallback={<NoConnection />}>
        <Login />,
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
        <Create />,
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/number",
    element:
      <Suspense fallback={<NoConnection />}>
        <NumberCreate />,
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/forget",
    element:
      <Suspense fallback={<NoConnection />}>
        <ForgetCredentials />,
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/privacy",
    element:
      <Suspense fallback={<NoConnection />}>
        <Privacy />,
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "*",
    element:
      <Suspense fallback={<NoConnection />}>
        <Login />,
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
  return (
    <>
      <HeaderRaad />
      <div className="App">
        {page == "comunity" ? <Comunity /> : <></>}
        {page == "courts" ? <Courts /> : <></>}
        {page == "normative" ? <Normative /> : <></>}
        {page == "profile" ? <Profile /> : <></>}
      </div>
      <Footer
        pageToShow={page}
        setPageToShow={(t: PageTypeNumber): void => setPage(convertNumberToType(t))} />
    </>
  )
}

function App() {

  // Check http or https
  //let urlPath = window.location.href;
  //if(!urlPath.includes("https") && !urlPath.includes("localhost") )
    //window.location.href ='https://meapunto.online';

  return <RouterProvider router={router} />
}
export default App

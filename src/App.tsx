import { lazy, Suspense, useState } from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { GetTokenId } from './api/auth'
import Footer from './components/Footer'
import HeaderRaad from './components/HeaderRaad'
import NoConnection from './pages/NoConnection'
import { convertNumberToType, PageType, PageTypeNumber } from './interfaces/pages'
import { APP_NAME, getCorrectLogo } from './api/request'
import ResponsiveHandler from './components/ResponsiveHandler'
import { initTranslationModule } from './util/translationService'

const Comunity = lazy(() => import('./pages/Comunity'));
const Courts = lazy(() => import('./pages/Courts'));
const Profile = lazy(() => import('./pages/Profile'));
const Normative = lazy(() => import('./pages/Normative'));

const Login = lazy(() => import('./pages/Login'));
const ForgetCredentials = lazy(() => import('./pages/ForgetCredentials'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NumberCreate = lazy(() => import('./pages/NumberCreate'));
const Create = lazy(() => import('./pages/Create'));
const Admin = lazy(() => import('./pages/Admin'));
const Stats = lazy(() => import('./pages/Stats'));

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
    path: "/stats",
    element:
      <Suspense fallback={<NoConnection />}>
        <Stats />
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/admin",
    element:
      <Suspense fallback={<NoConnection />}>
        <Admin />
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/courts",
    element:
      <Suspense fallback={<NoConnection />}>
        <AppBase />
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
      <ResponsiveHandler
        component={() => <>
          {page === "comunity" && <Comunity />}
          {page === "courts" && <Courts />}
          {page === "normative" && <Normative />}
          {page === "profile" && <Profile />}
        </>}
      />
      < Footer
        pageToShow={page}
        setPageToShow={(t: PageTypeNumber): void => setPage(convertNumberToType(t))} />
    </>
  )
}

function ChangeTitleIconFromPage() {
  document.title = APP_NAME;
  let link: any = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = getCorrectLogo(APP_NAME)
}

function App() {

  // Check http or https
  let urlPath = window.location.href;
  if (!urlPath.includes("https") && !urlPath.includes("localhost") && APP_NAME.includes("Online"))
    window.location.href = 'https://meapunto.online';

  // Control page name:
  ChangeTitleIconFromPage()
  
  // Set translations
  initTranslationModule();

  return <RouterProvider router={router} />
}
export default App

import { lazy, Suspense, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { GetTokenId } from './api/auth'
import Footer from './components/Footer'
import HeaderRaad from './components/HeaderRaad'
import NoConnection from './pages/NoConnection'
import { convertNumberToType, PageType, PageTypeNumber } from './interfaces/pages'
import { applyAppBranding } from './util/branding'
import ResponsiveHandler from './components/ResponsiveHandler'
import { initTranslationModule } from './util/translationService'
import { startBookingNotifications } from './util/notifications'

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
        <AppBase initialPage="courts" />
      </Suspense>,
    errorElement: <NoConnection />
  },
  {
    path: "/comunity",
    element:
      <Suspense fallback={<NoConnection />}>
        <AppBase initialPage="comunity" />
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

function AppBase({ initialPage = 'courts' }: { initialPage?: PageType }) {
  const [page, setPage] = useState<PageType>(initialPage);
  const navigate = useNavigate();
  const [token, id] = GetTokenId();
  if (token == "" || id == "") {
    navigate("/");
  }
  // Stats information when load app
  // SendStatsInfo();

  // The in-app tab is kept in sync with the route so that navigating to
  // /comunity (after booking or deleting) shows the right page and the
  // back/forward buttons keep working.
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Local (client-side) reminders 30 minutes before each of my bookings.
  // Started once the user is logged in and intentionally not stopped on
  // unmount: reminders must keep working while browsing /comunity, etc.
  // They are only cleared on logout (clearBookingNotifications).
  useEffect(() => {
    if (token == "" || id == "") return;
    startBookingNotifications();
  }, [token, id]);

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
        setPageToShow={(t: PageTypeNumber): void => {
          const next = convertNumberToType(t);
          setPage(next);
          // Keep the URL in sync with the visible tab so /comunity and
          // /courts survive a reload and the back button works. The remaining
          // tabs have no dedicated route and stay client-side.
          if (next === 'comunity' || next === 'courts') {
            navigate(`/${next}`);
          }
        }} />
    </>
  )
}

function App() {
  const [translationsLoaded, setTranslationsLoaded] = useState(false);

  useEffect(() => {
    // Only enforce HTTPS on MeApunto, preserving the host, route and query string.
    const { hostname, protocol, href } = window.location;
    const normalizedHostname = hostname.toLowerCase().replace(/\.$/, '');
    if (protocol === 'http:' && (normalizedHostname === 'meapunto.online' || normalizedHostname.endsWith('.meapunto.online'))) {
      const secureUrl = new URL(href);
      secureUrl.protocol = 'https:';
      window.location.replace(secureUrl.href);
      return;
    }

    applyAppBranding();

    // Synchronous now (translations are bundled), so they are ready before the
    // router renders and no raw translation keys can ever flash on screen.
    initTranslationModule();
    setTranslationsLoaded(true);
  }, []);

  return translationsLoaded
    ? <RouterProvider router={router} />
    : <NoConnection />;
}
export default App

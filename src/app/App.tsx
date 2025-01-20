import ErrorPage from '@/features/error/ErrorPage'
import ManualPage from '@/features/manual/Manual'
import PlatformSettingPage from '@/platform/pages/PlatformSettingPage'
import Header from '@/layout/Header'
import Main from '@/layout/Main'
import FloatingSettingButton from '@/shared/components/button/FloatingSettingButton'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './App.css'
const Layout = () => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <FloatingSettingButton />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <ManualPage />
      },
      {
        path: '/setting/platform',
        element: <PlatformSettingPage />
      }
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
})

function App() {
  return <RouterProvider router={router} />
}

export default App

import MenuManagementPage from '@/features/admin/pages/MenuManagementPage'
import ManualPage from '@/features/manual/Manual'
import SettingButton from '@/shared/components/common/button/SettingButton'
import ErrorPage from '@/shared/components/error/ErrorPage'
import Header from '@/shared/components/layout/Header'
import Main from '@/shared/components/layout/Main'
import { ToastProvider } from '@/contexts/ToastContext'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './App.css'

const Layout = () => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <SettingButton />
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
        path: '/admin/menu',
        element: <MenuManagementPage />
      },
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
})

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App

import ManualPage from '@/features/manual/Manual'
import ErrorPage from '@/shared/components/error/ErrorPage'
import Header from '@/shared/components/header/Header'
import MainLayout from '@/shared/components/mainLayout/MainLayout'
import SettingButton from '@/shared/components/button/SettingButton'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './App.css'

const Layout = () => {
  return (
    <>
      <Header />
      <MainLayout>
        <Outlet />
      </MainLayout>
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

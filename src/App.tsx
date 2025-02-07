import ManualPage from '@/features/manual/Manual'
import ErrorPage from '@/shared/components/error/ErrorPage'
import Header from '@/shared/components/layout/Header'
import Main from '@/shared/components/layout/Main'
import SettingButton from '@/shared/components/common/button/SettingButton'
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

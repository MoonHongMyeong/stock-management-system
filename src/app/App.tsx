import FloatingButton from '@/components/button/FloatingButton'
import Header from '@/layout/Header'
import Main from '@/layout/Main'
import Manual from '@/pages/manual/Manual'
import ErrorPage from '@/pages/error/ErrorPage'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './App.css'

const Layout = () => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <FloatingButton />
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
        element: <Manual />
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

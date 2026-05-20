import { createBrowserRouter } from 'react-router-dom'
import Root from '../pages/Root'
import Home from '../pages/Home'
import Activities from '../pages/Activities'
import ActivityDetailEnhanced from '../pages/ActivityDetailEnhanced'
import About from '../pages/About'
import FAQ from '../pages/FAQ'
import Contact from '../pages/Contact'
import BookNow from '../pages/BookNow'
import NotFound from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'activities', element: <Activities /> },
      { path: 'activities/:slug', element: <ActivityDetailEnhanced /> },
      { path: 'about', element: <About /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'contact', element: <Contact /> },
      { path: 'book', element: <BookNow /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

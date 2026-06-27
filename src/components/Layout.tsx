import { Outlet } from 'react-router-dom'
import FloatingNav from './FloatingNav'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <FloatingNav />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

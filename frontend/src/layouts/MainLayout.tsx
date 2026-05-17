import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { itemCount } = useCartStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              MLM Store
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
              <Link to="/products" className="text-gray-600 hover:text-indigo-600">Products</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600">
                <ShoppingCart className="w-6 h-6" />
                {itemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount()}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">
                    <User className="w-6 h-6" />
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-indigo-600">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Register
                  </Link>
                </div>
              )}

              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
            <Link to="/" className="block text-gray-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="block text-gray-600" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/cart" className="block text-gray-600" onClick={() => setMobileMenuOpen(false)}>Cart</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-gray-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="block text-gray-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">MLM Ecommerce Platform 2026</p>
        </div>
      </footer>
    </div>
  )
}

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import PublicRoute from './components/layout/PublicRoute'
import UserOnlyRoute from './components/layout/UserOnlyRoute'
import Landing from './pages/Landing'
import Collection from './pages/Collection'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderHistory from './pages/OrderHistory'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Admin/Dashboard'
import ManageProducts from './pages/Admin/ManageProducts'
import ManageOrders from './pages/Admin/ManageOrders'
import ManageUsers from './pages/Admin/ManageUsers'
import CartPopup from './components/ui/CartPopup'

// Component to handle home route redirect
function HomeRedirect() {
  const { user } = useAuth()
  
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  return <Landing />
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <HomeRedirect />
              </ProtectedRoute>
            } />
            <Route path="/collection" element={
              <UserOnlyRoute>
                <Collection />
              </UserOnlyRoute>
            } />
            <Route path="/product/:id" element={
              <UserOnlyRoute>
                <Product />
              </UserOnlyRoute>
            } />
            <Route path="/cart" element={
              <UserOnlyRoute>
                <Cart />
              </UserOnlyRoute>
            } />
            <Route path="/checkout" element={
              <UserOnlyRoute>
                <Checkout />
              </UserOnlyRoute>
            } />
            <Route path="/orders" element={
              <UserOnlyRoute>
                <OrderHistory />
              </UserOnlyRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute requiredRole="admin">
                <ManageProducts />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute requiredRole="admin">
                <ManageOrders />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="superadmin">
                <ManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation" element={
              <UserOnlyRoute>
                <OrderConfirmation />
              </UserOnlyRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <CartPopup />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
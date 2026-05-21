import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore, useIsAuthenticated, useToken } from '../../store/useAuthStore'

export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  const token = useToken()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const location = useLocation()

  if (!isAuthenticated || !token) {
    clearAuth()
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

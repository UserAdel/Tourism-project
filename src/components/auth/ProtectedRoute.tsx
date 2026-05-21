import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from '../../store/useAuthStore'

export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

import { type FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Phone } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../components/Button'
import { api } from '../lib/axios'
import { useAuthStore, useIsAuthenticated } from '../store/useAuthStore'

interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    phone: string
    role: string
  }
}

export default function AdminLogin() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/admin'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await api.post('/auth/admin/login', { phone, password })
      const data = response.data.data as LoginResponse

      setAuth(data.user, data.token)
      toast.success('Signed in')
      navigate(redirectTo, { replace: true })
    } catch {
      toast.error('Invalid phone number or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] bg-gray-50 dark:bg-[var(--dark-page)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[var(--dark-card)] rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--teal)] text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--navy)] dark:text-white">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}

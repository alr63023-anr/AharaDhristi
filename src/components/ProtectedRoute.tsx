import { Navigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import type { UserRole } from '../types'
import { useAuth, isRoleAllowed } from '../context/AuthContext'

export function ProtectedRoute({ allowedRoles, children }: PropsWithChildren<{ allowedRoles: UserRole[] }>) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (!isRoleAllowed(role, allowedRoles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

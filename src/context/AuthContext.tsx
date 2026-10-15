import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { UserRole } from '../types'

interface AuthState {
  role: UserRole
  setRole: (role: UserRole) => void
  isAuthenticated: boolean
  signOut: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [role, setRoleState] = useState<UserRole>('consumer')
  const [isAuthenticated, setAuthenticated] = useState(false)

  const value = useMemo(
    () => ({
      role,
      isAuthenticated,
      setRole: (nextRole: UserRole) => {
        setRoleState(nextRole)
        setAuthenticated(true)
      },
      signOut: () => {
        setRoleState('consumer')
        setAuthenticated(false)
      },
    }),
    [isAuthenticated, role],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function isRoleAllowed(current: UserRole, allowed: UserRole[]) {
  return allowed.includes(current)
}

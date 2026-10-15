import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/button'
import { Logo } from './Logo'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/scanner', label: 'Consumer Product Scanner' },
  { to: '/results', label: 'Product Results' },
  { to: '/company', label: 'Company Portal' },
  { to: '/submit', label: 'Submit a Product' },
  { to: '/tracking', label: 'Submission Tracking' },
  { to: '/reviewer', label: 'Reviewer Dashboard' },
  { to: '/registry', label: 'Verification Registry' },
  { to: '/about', label: 'About Nutrixon' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="shrink-0">
          <Logo />
        </NavLink>
        <button onClick={() => setOpen((prev) => !prev)} className="rounded p-2 md:hidden" aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-xs font-semibold ${isActive ? 'bg-[#10233F] text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/auth" className="rounded-md bg-[#13B8A6] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0f9a8b]">
            Sign In / Sign Up
          </NavLink>
          {isAuthenticated && (
            <Button variant="secondary" className="text-xs" onClick={signOut}>
              Sign out
            </Button>
          )}
        </nav>
      </div>
      {open && (
        <div className="space-y-1 border-t border-slate-200 p-3 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-[#10233F] text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/auth" onClick={() => setOpen(false)} className="block rounded-md bg-[#13B8A6] px-3 py-2 text-sm text-white">
            Sign In / Sign Up
          </NavLink>
        </div>
      )}
    </header>
  )
}

import { describe, expect, it } from 'vitest'
import { isRoleAllowed } from './AuthContext'

describe('isRoleAllowed', () => {
  it('allows role when included', () => {
    expect(isRoleAllowed('reviewer', ['reviewer', 'admin'])).toBe(true)
  })

  it('blocks role when not included', () => {
    expect(isRoleAllowed('consumer', ['reviewer', 'admin'])).toBe(false)
  })
})

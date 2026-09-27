import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  permissions: string[]
  avatarUrl?: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void

  // Permission helpers
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      hasRole: (role) => get().user?.roles.includes(role) ?? false,

      hasPermission: (permission) =>
        get().user?.permissions.includes(permission) ?? false,

      hasAnyRole: (roles) =>
        roles.some((r) => get().user?.roles.includes(r)) ?? false,
    }),
    {
      name: 'erp-auth',
      storage: createJSONStorage(() => sessionStorage), // sessionStorage: cleared on tab close
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

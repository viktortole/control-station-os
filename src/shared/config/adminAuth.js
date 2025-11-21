export const ADMIN_USERNAME = 'admin'
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin-control'
export const ADMIN_PROFILE = {
  avatar: 'tactical-1',
  rank: 'COMMANDER',
  clearanceLevel: 'ADMIN',
  specialization: 'intelligence',
  preferences: {
    theme: 'military',
    soundEnabled: true,
    punishmentEnabled: false,
    idleTrackingEnabled: false
  }
}

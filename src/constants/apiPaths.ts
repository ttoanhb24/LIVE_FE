const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },
  EMOTIONS: {
    BASE: "/emotions",
    BY_ID: (id: string) => `/emotions/${id}`,
    UPLOAD_IMAGE: "/emotions/upload-image",
  },
  BLOCK_GROUPS: {
    BASE: "/block-groups",
    BY_ID: (id: string) => `/block-groups/${id}`,
  },
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    UPLOAD_IMAGE: "/products/upload-image",
    TYPES: "/products/types",
  },
  SCRIPT_BLOCKS: {
    BASE: "/script-blocks",
    BY_ID: (id: string) => `/script-blocks/${id}`,
    GENERATE_MEANING_SUGGESTION: "/script-blocks/generate-meaning-suggestion",
  },
  LIVE_SESSIONS: {
    BASE: "/live-sessions",
    BY_ID: (id: string) => `/live-sessions/${id}`,
    REGENERATE: (id: string) => `/live-sessions/${id}/regenerate`,
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
  LIVE_LOOKUPS: {
    BASE: "/live-lookups",
    BY_ID: (id: string) => `/live-lookups/${id}`,
  },
  SESSION_REPORTS: {
    BASE: "/session-reports",
    DAILY_RANKINGS: "/session-reports/daily-rankings",
    STAFF_NAMES: "/session-reports/staff-names",
    UPLOAD_IMAGE: "/session-reports/upload-image",
  },
}

export default API_PATHS

export const paths = {
  // Blog
  home: "/",
  post: (slug: string) => `/${slug}` as const,

  // Dashboard
  dashboard: "/dashboard",

  // Auth
  auth: {
    root: "/auth",
    login: "/auth/login",
    register: "/auth/register",
  },

  // Legal
  terms: "/terms",
  privacy: "/privacy",

  // Admin / Backoffice
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    settings: "/admin/settings",
  },
} as const;

export type AppPath = typeof paths;

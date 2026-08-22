export const paths = {
  // Blog
  home: "/",
  post: (slug: string) => `/${slug}` as const,

  // Dashboard
  dashboard: "/dashboard",

  // Auth (preparado para o futuro)
  auth: {
    root: "/auth",
    login: "/auth/login",
    register: "/auth/register",
  },

  // Legal
  terms: "/terms",
  privacy: "/privacy",

  // Admin / Backoffice (preparado para o futuro)
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    settings: "/admin/settings",
  },
} as const;

// Tipo helper (opcional mas útil)
export type AppPath = typeof paths;

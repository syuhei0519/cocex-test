export const routes = {
  home: "/",
  auth: {
    login: "/login",
    register: "/register",
  },
  app: {
    root: "/app",
    dashboard: "/app",
    transactions: "/app/transactions",
    accounts: "/app/accounts",
    categories: "/app/categories",
    budgets: "/app/budgets",
    reports: "/app/reports",
    settings: "/app/settings",
  },
} as const;

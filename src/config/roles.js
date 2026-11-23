export const ROLE_CONFIG = {
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Management and reports',
    tabs: ['dashboard', 'orders', 'tables', 'reservations', 'inventory', 'staff', 'finance', 'reports', 'website'],
    defaultTab: 'dashboard',
  },
  cashier: {
    id: 'cashier',
    label: 'Cashier',
    description: 'POS and payments',
    tabs: ['pos', 'orders', 'finance'],
    defaultTab: 'pos',
  },
  kitchen: {
    id: 'kitchen',
    label: 'Kitchen',
    description: 'Preparation orders',
    tabs: ['kitchen', 'orders'],
    defaultTab: 'kitchen',
  },
  waiter: {
    id: 'waiter',
    label: 'Waiter',
    description: 'Tables and serving',
    tabs: ['tables', 'reservations', 'waiter', 'orders'],
    defaultTab: 'tables',
  },
};

export const ROLE_IDS = ['admin', 'cashier', 'kitchen', 'waiter'];

export function getRoleConfig(roleId) {
  return ROLE_CONFIG[roleId] || ROLE_CONFIG.admin;
}

export function canAccessTab(roleId, tabId) {
  return getRoleConfig(roleId).tabs.includes(tabId);
}

export function resolveTabForRole(roleId, requestedTabId) {
  const role = getRoleConfig(roleId);
  if (requestedTabId && role.tabs.includes(requestedTabId)) return requestedTabId;
  return role.defaultTab;
}
/**
 * Role and Permission Constants
 * Similar to vaccine-rsa-web-v2 packages/shared/auth/lib/role.ts
 */

// Role definitions
export const roles = {
  Admin: 'VAC_Admin',
  Receptionist: 'VAC_Receptionist',
  Doctor: 'VAC_Doctor',
  Cashier: 'VAC_Cashier',
  Nurse: 'VAC_Nursing',
  Support: 'VAC_Support',
  AccountingHO: 'VAC_Accounting_HO',
  KSNB: 'VAC_KSNB',
  CSKH: 'VAC_CSKH',
  KSNH: 'VAC_KSNH',
  SaleEcom: 'VAC_SaleEcom',
  CTKM: 'VAC_CTKM',
  VAC_QA: 'VAC_QA',
  VAC_GVYK: 'VAC_GVYK',
  VAC_ASM: 'VAC_ASM',
};

// Permission prefix (can be customized per project)
const getPermissionPrefix = () => {
  // For portal project, use 'VacPortal_Permission_'
  return 'VacPortal_Permission_';
};

// Helper to generate permission names
const getPermissionName = (functionName: string, action?: string) => {
  const prefix = getPermissionPrefix();
  if (!action) {
    return `${prefix}${functionName}`;
  }
  return `${prefix}${functionName}_${action}`;
};

/**
 * Permission definitions
 * Similar to portal project permissions
 */
export const permissions = {
  // Example permissions - customize based on your needs
  Record: {
    Menu: getPermissionName('Record', 'Menu'),
    Search: getPermissionName('Record', 'Search'),
    View: getPermissionName('Record', 'View'),
  },
  DataManagement: {
    Menu: getPermissionName('DataManagement', 'Menu'),
    Search: getPermissionName('DataManagement', 'Search'),
    View: getPermissionName('DataManagement', 'View'),
    Create: getPermissionName('DataManagement', 'Create'),
    Edit: getPermissionName('DataManagement', 'Edit'),
  },
  ConfigShop: {
    Menu: getPermissionName('ConfigShop', 'Menu'),
  },
  // Add more permissions as needed
};

// Functions (if needed)
export const functions = {};




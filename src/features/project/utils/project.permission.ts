const FINANCIAL_ROLES = ["SUPER_ADMIN", "ADMIN"];

export interface ProjectPermissions {
  canViewFinancials: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// Manager is read-only and cannot see any money data
export const getProjectPermissions = (role?: string): ProjectPermissions => {
  const isPrivileged = !!role && FINANCIAL_ROLES.includes(role);

  return {
    canViewFinancials: isPrivileged,
    canCreate: isPrivileged,
    canEdit: isPrivileged,
    canDelete: isPrivileged,
  };
};
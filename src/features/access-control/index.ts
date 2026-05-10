export * from './users/index';
export * from './roles/index';
export * from './permissions/index';
export * from './shared/components/index';
export * from './shared/utils/index';
export type { PermissionCategory, Role, User, PaginatedResponse, AssignPermissionRequest, RemovePermissionRequest, AssignRoleRequest, UserStatusUpdateRequest, UserQueryParams } from './types/access-control.types';
export type { Permission as SystemPermission } from './types/access-control.types';

// New Permission Control Utilities
export * from './permissions';
export * from './hooks/use-permissions';
export * from './components/PermissionGuard';


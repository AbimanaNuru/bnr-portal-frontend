/**
 * Central registry of all available permissions in the system.
 * These should match the strings returned by the backend in users/me.
 */
export const PERMISSIONS = {
  // Audit Logs
  AUDIT_READ: "audit:read",

  // Documents
  DOCUMENTS_READ: "documents:read",
  DOCUMENTS_MANAGE_TYPES: "documents:manage_types",
  DOCUMENT_READ: "document:read", // Duplicate or specific? Keeping both as they exist in the payload
  DOCUMENT_MANAGE_TYPES: "document:manage_types",

  // Applications
  APPLICATION_READ: "application:read",
  APPLICATION_CREATE: "application:create",
  APPLICATION_TRANSITION: "application:transition",
  APPLICATIONS_READ: "applications:read",
  APPLICATIONS_READ_OWN: "applications:read_own",
  APPLICATIONS_READ_ALL: "applications:read_all",
  APPLICATIONS_TRANSITION: "applications:transition",
  APPLICATIONS_SUBMIT: "applications:submit",
  APPLICATIONS_RESUBMIT: "applications:resubmit",
  APPLICATIONS_START_REVIEW: "applications:start_review",
  APPLICATIONS_COMPLETE_REVIEW: "applications:complete_review",
  APPLICATIONS_REQUEST_INFO: "applications:request_info",
  APPLICATIONS_APPROVE: "applications:approve",
  APPLICATIONS_REJECT: "applications:reject",

  // Users & Roles
  USERS_READ: "users:read",
  USERS_CREATE: "users:create",
  USERS_UPDATE: "users:update",
  USERS_MANAGE: "users:manage",
  USER_CREATE: "user:create",
  ROLES_MANAGE: "roles:manage",

  // Workflows
  WORKFLOW_READ: "workflow:read",
  WORKFLOW_MANAGE: "workflow:manage",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

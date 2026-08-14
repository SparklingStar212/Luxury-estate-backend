export const roles = Object.freeze({
  user: 'user',
  agent: 'agent',
  admin: 'admin',
  superAdmin: 'super_admin',
})

export const privilegedRoles = [roles.admin, roles.superAdmin]
const ROLES = ['user', 'manager', 'admin'];
const MANAGE_ROLES = ['manager', 'admin'];

const canManageWork = (user) => MANAGE_ROLES.includes(user.role);
const canSeeEverything = (user) => user.role === 'admin' || user.role === 'manager';

module.exports = { ROLES, MANAGE_ROLES, canManageWork, canSeeEverything };

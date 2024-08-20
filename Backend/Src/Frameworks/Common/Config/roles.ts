// Define the type for the roles and rights
type Role = 'user' | 'admin' | 'retailers' | 'customer';
type Right = 
  | 'getUsers'
  | 'manageUsers'
  | 'createTemplate'
  | 'getTracking'
  | 'config'
  | 'getStore'
  | 'assignPricingPlan'
  | 'getAssets'
  | 'retriveUserData'
  | 'sendEmail'
  | 'roles';

interface AllRoles {
  user: Right[];
  admin: Right[];
  retailers: Right[];
  customer: Right[];
}

const allRoles: AllRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'createTemplate', 'getTracking', 'config', 'getStore', 'assignPricingPlan', 'getAssets', 'retriveUserData', 'sendEmail', 'roles'],
  retailers: ['getTracking', 'getUsers'],
  customer: []
};

const roles: Role[] = Object.keys(allRoles) as Role[];
const roleRights = new Map<Role, Right[]>(Object.entries(allRoles) as [Role, Right[]][]);

export {
  roles,
  roleRights,
};


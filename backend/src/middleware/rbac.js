const { pool } = require('../config/database');

const normalizeRole = (role) => {
  const value = String(role || '').trim().toLowerCase();
  if (['super admin', 'superadmin', 'super-admin'].includes(value)) return 'Super Admin';
  if (['customer admin', 'customeradmin', 'customer-admin'].includes(value)) return 'Customer Admin';
  if (['admin', 'administrator'].includes(value)) return 'Admin';
  if (value === 'editor') return 'Editor';
  if (value === 'hr') return 'HR';
  if (value === 'viewer') return 'Viewer';
  return role || 'Viewer';
};

const normalizePermissions = (permissions) => {
  if (!permissions) return {};

  let parsedPermissions = permissions;
  if (typeof permissions === 'string') {
    try {
      parsedPermissions = JSON.parse(permissions);
    } catch {
      return {};
    }
  }

  const permissionMap = {
    dashboard: 'Dashboard',
    enquiries: 'Enquiries',
    enquiry: 'Enquiries',
    blogs: 'Blogs',
    careers: 'Careers',
    jobs: 'Careers',
    applicants: 'Applicants',
    gallery: 'Gallery',
    'case studies': 'Case Studies',
    'case_studies': 'Case Studies',
    users: 'User Management',
    'user management': 'User Management',
    settings: 'Settings',
    reports: 'Reports',
    notifications: 'Notifications',
  };

  const normalized = {};
  Object.entries(parsedPermissions).forEach(([key, value]) => {
    const mappedKey = permissionMap[key.toLowerCase()] || key;
    if (typeof value === 'object' && value !== null) {
      normalized[mappedKey] = Object.fromEntries(
        Object.entries(value).map(([subKey, subValue]) => [subKey, subValue === true || subValue === '1' || subValue === 1])
      );
    } else {
      normalized[mappedKey] = value;
    }
  });

  return normalized;
};

const checkPermission = (module, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const [adminUsers] = await pool.query('SELECT role, permissions FROM admin_users WHERE User_id = ?', [user.id]);
      let userData = adminUsers[0];

      if (!userData) {
        const [users] = await pool.query('SELECT role, permissions FROM users WHERE id = ?', [user.id]);
        userData = users[0];
      }

      if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const role = normalizeRole(userData.role);
      const permissions = normalizePermissions(userData.permissions);

      // Super Admin has all permissions
      if (role === 'Super Admin') {
        return next();
      }

      if (!permissions[module] || !permissions[module][action]) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. You do not have permission to ${action} ${module}.` 
        });
      }

      next();
    } catch (error) {
      console.error('RBAC Middleware error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};

module.exports = { checkPermission };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
require('dotenv').config();

const findUserByIdentifier = async (identifier) => {
  const [adminUsers] = await pool.query(
    'SELECT * FROM admin_users WHERE User_name = ?',
    [identifier]
  );
  if (adminUsers.length > 0) {
    return adminUsers[0];
  }

  // Some deployments have a simplified `users` table without an `email` column.
  // Query by username only to avoid SQL errors when `email` doesn't exist.
  const [users] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [identifier]
  );
  return users[0] || null;
};

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

const normalizeUser = (user) => {
  return {
    id: user.User_id ?? user.id,
    username: user.User_name ?? user.username,
    email: user.email ?? user.Email,
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
    full_name: user.full_name ?? [user.first_name, user.last_name].filter(Boolean).join(' '),
    mobile: user.mobile ?? user.phone ?? '',
    profile_image: user.profile_image ?? user.avatar ?? user.image ?? null,
    role: normalizeRole(user.role),
    Bu_id: user.Bu_id ?? user.website_id,
    permissions: normalizePermissions(user.permissions),
    created_at: user.created_at,
  };
};

const tableColumnCache = new Map();

const getTableColumns = async (tableName) => {
  if (!tableColumnCache.has(tableName)) {
    try {
      const [columns] = await pool.query(`DESCRIBE \`${tableName}\``);
      tableColumnCache.set(tableName, new Set(columns.map((column) => column.Field)));
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        tableColumnCache.set(tableName, new Set());
      } else {
        throw error;
      }
    }
  }

  return tableColumnCache.get(tableName);
};

const firstExistingColumn = (columns, candidates) => candidates.find((column) => columns.has(column));

const userTableConfigs = [
  {
    table: 'admin_users',
    idColumns: ['User_id', 'id'],
    usernameColumns: ['User_name', 'username'],
    emailColumns: ['email', 'Email'],
  },
  {
    table: 'users',
    idColumns: ['id', 'User_id'],
    usernameColumns: ['username', 'User_name'],
    emailColumns: ['email', 'Email'],
  },
];

const findAuthenticatedUser = async (userId) => {
  for (const config of userTableConfigs) {
    const columns = await getTableColumns(config.table);
    const idColumn = firstExistingColumn(columns, config.idColumns);

    if (!idColumn) continue;

    const [rows] = await pool.query(
      `SELECT * FROM \`${config.table}\` WHERE \`${idColumn}\` = ? LIMIT 1`,
      [userId]
    );

    if (rows.length > 0) {
      return { row: rows[0], table: config.table, idColumn, columns, config };
    }
  }

  return null;
};

const splitFullName = (fullName) => {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

const buildProfilePayload = (user) => {
  const normalized = normalizeUser(user);
  const fullName = normalized.full_name || [normalized.first_name, normalized.last_name].filter(Boolean).join(' ');
  const derivedName = splitFullName(fullName);

  return {
    id: normalized.id,
    full_name: fullName,
    first_name: normalized.first_name || derivedName.firstName,
    last_name: normalized.last_name || derivedName.lastName,
    username: normalized.username,
    email: normalized.email,
    mobile: normalized.mobile,
    profile_image: normalized.profile_image,
    role: normalized.role,
    Bu_id: normalized.Bu_id,
    permissions: normalized.permissions,
    created_at: normalized.created_at,
  };
};

// Login
const login = async (req, res) => {
  try {
    const { email, username, password, remember_me } = req.body;
    console.log('Login attempt body:', req.body);
    const identifier = username || email;

    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const plainPassword = user.User_password;
    const hashPassword = user.password_hash;
    let isPasswordValid = false;

    if (hashPassword) {
      isPasswordValid = await bcrypt.compare(password, hashPassword);
    } else if (plainPassword) {
      isPasswordValid = plainPassword === password;
    }

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const normalized = normalizeUser(user);
    const tokenExpiry = remember_me ? '7d' : process.env.JWT_EXPIRES_IN || '1h';

    const accessToken = jwt.sign(
      {
        id: normalized.id,
        username: normalized.username,
        role: normalized.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    const refreshToken = jwt.sign(
      { id: normalized.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [normalized.id, refreshToken, expiresAt]
    );

    successResponse(res, {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: remember_me ? 604800 : 3600,
      user: {
        id: normalized.id,
        username: normalized.username,
        email: normalized.email,
        role: normalized.role,
        Bu_id: normalized.Bu_id,
        permissions: normalized.permissions,
      },
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Login failed', 500, error);
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const [adminUsers] = await pool.query(
      'SELECT * FROM admin_users WHERE User_id = ?',
      [req.user.id]
    );

    let user = adminUsers[0];
    if (!user) {
      const [users] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [req.user.id]
      );
      user = users[0];
    }

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const normalized = normalizeUser(user);
    successResponse(res, {
      id: normalized.id,
      username: normalized.username,
      email: normalized.email,
      role: normalized.role,
      Bu_id: normalized.Bu_id,
      permissions: normalized.permissions,
      created_at: normalized.created_at,
    }, 'User retrieved successfully');
  } catch (error) {
    console.error('Get current user error:', error);
    errorResponse(res, 'Failed to retrieve user', 500, error);
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return errorResponse(res, 'Refresh token is required', 400);
    }

    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

    const [tokens] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND is_revoked = FALSE AND expires_at > NOW()',
      [refresh_token, decoded.id]
    );

    if (tokens.length === 0) {
      return errorResponse(res, 'Invalid or expired refresh token', 401);
    }

    const [adminUsers] = await pool.query(
      'SELECT * FROM admin_users WHERE User_id = ?',
      [decoded.id]
    );

    let user = adminUsers[0];
    if (!user) {
      const [users] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [decoded.id]
      );
      user = users[0];
    }

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const normalized = normalizeUser(user);
    const accessToken = jwt.sign(
      {
        id: normalized.id,
        username: normalized.username,
        role: normalized.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    successResponse(res, {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
    }, 'Token refreshed successfully');
  } catch (error) {
    console.error('Refresh token error:', error);
    errorResponse(res, 'Failed to refresh token', 401, error);
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      await pool.query(
        'UPDATE refresh_tokens SET is_revoked = TRUE, revoked_at = NOW() WHERE token = ?',
        [refresh_token]
      );
    }

    successResponse(res, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    errorResponse(res, 'Logout failed', 500, error);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    const [adminUsers] = await pool.query(
      'SELECT * FROM admin_users WHERE User_id = ?',
      [userId]
    );

    let user = adminUsers[0];
    if (!user) {
      const [users] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      user = users[0];
    }

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const plainPassword = user.User_password;
    const hashPassword = user.password_hash;
    let isPasswordValid = false;

    if (hashPassword) {
      isPasswordValid = await bcrypt.compare(current_password, hashPassword);
    } else if (plainPassword) {
      isPasswordValid = plainPassword === current_password;
    }

    if (!isPasswordValid) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    const [adminUpdate] = await pool.query(
      'UPDATE admin_users SET password_hash = ? WHERE User_id = ?',
      [hashedNewPassword, userId]
    );

    if (adminUpdate.affectedRows === 0) {
      await pool.query(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [hashedNewPassword, userId]
      );
    }

    successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    errorResponse(res, 'Failed to change password', 500, error);
  }
};

// Update own profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id ?? req.user?.userId ?? req.user?.User_id;

    if (!userId) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    const profileUser = await findAuthenticatedUser(userId);
    if (!profileUser) {
      return errorResponse(res, 'User not found', 404);
    }

    const body = req.body || {};
    const fullNameInput = String(body.full_name || '').trim();
    const firstNameInput = String(body.first_name || '').trim();
    const lastNameInput = String(body.last_name || '').trim();
    const username = String(body.username || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const mobile = String(body.mobile || '').trim();
    const fullName = fullNameInput || [firstNameInput, lastNameInput].filter(Boolean).join(' ').trim();

    if (!fullName) {
      return errorResponse(res, 'Full name is required', 400);
    }
    if (!username) {
      return errorResponse(res, 'Username is required', 400);
    }
    if (!email) {
      return errorResponse(res, 'Email is required', 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse(res, 'Valid email is required', 400);
    }
    if (!mobile) {
      return errorResponse(res, 'Mobile number is required', 400);
    }
    if (!/^\d{10}$/.test(mobile)) {
      return errorResponse(res, 'Mobile number must contain exactly 10 digits', 400);
    }

    const { table, idColumn, columns, config } = profileUser;
    const usernameColumn = firstExistingColumn(columns, config.usernameColumns);
    const emailColumn = firstExistingColumn(columns, config.emailColumns);

    for (const duplicateConfig of userTableConfigs) {
      const duplicateColumns = await getTableColumns(duplicateConfig.table);
      const duplicateIdColumn = firstExistingColumn(duplicateColumns, duplicateConfig.idColumns);
      const duplicateUsernameColumn = firstExistingColumn(duplicateColumns, duplicateConfig.usernameColumns);
      const duplicateEmailColumn = firstExistingColumn(duplicateColumns, duplicateConfig.emailColumns);

      if (duplicateIdColumn && duplicateUsernameColumn) {
        const [matches] = await pool.query(
          `SELECT \`${duplicateIdColumn}\` AS id FROM \`${duplicateConfig.table}\` WHERE \`${duplicateUsernameColumn}\` = ? AND NOT (\`${duplicateIdColumn}\` = ? AND ? = ?) LIMIT 1`,
          [username, userId, duplicateConfig.table, table]
        );
        if (matches.length > 0) {
          return errorResponse(res, 'Username already exists', 400);
        }
      }

      if (duplicateIdColumn && duplicateEmailColumn) {
        const [matches] = await pool.query(
          `SELECT \`${duplicateIdColumn}\` AS id FROM \`${duplicateConfig.table}\` WHERE LOWER(\`${duplicateEmailColumn}\`) = ? AND NOT (\`${duplicateIdColumn}\` = ? AND ? = ?) LIMIT 1`,
          [email, userId, duplicateConfig.table, table]
        );
        if (matches.length > 0) {
          return errorResponse(res, 'Email already exists', 400);
        }
      }
    }

    const { firstName, lastName } = splitFullName(fullName);
    const updates = [];
    const params = [];

    const addUpdate = (column, value) => {
      if (column && columns.has(column)) {
        updates.push(`\`${column}\` = ?`);
        params.push(value);
      }
    };

    addUpdate('full_name', fullName);
    addUpdate('first_name', firstNameInput || firstName);
    addUpdate('last_name', firstNameInput || lastNameInput ? lastNameInput : lastName);
    addUpdate(usernameColumn, username);
    addUpdate(emailColumn, email);
    addUpdate('mobile', mobile);
    addUpdate('phone', mobile);

    if (req.file) {
      const imagePath = `/uploads/profile/${req.file.filename}`;
      addUpdate('profile_image', imagePath);
      addUpdate('avatar', imagePath);
      addUpdate('image', imagePath);
    }

    if (columns.has('updated_at')) {
      updates.push('`updated_at` = NOW()');
    } else if (columns.has('last_updated')) {
      updates.push('`last_updated` = NOW()');
    }

    if (updates.length === 0) {
      return errorResponse(res, 'No supported profile fields found to update', 400);
    }

    params.push(userId);
    const [result] = await pool.query(
      `UPDATE \`${table}\` SET ${updates.join(', ')} WHERE \`${idColumn}\` = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    const [updatedRows] = await pool.query(
      `SELECT * FROM \`${table}\` WHERE \`${idColumn}\` = ? LIMIT 1`,
      [userId]
    );

    successResponse(res, buildProfilePayload(updatedRows[0]), 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'Username or email already exists', 400);
    }
    errorResponse(res, error.message || 'Failed to update profile', 500, error);
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id ?? req.user?.userId ?? req.user?.User_id;

    if (!userId) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    const profileUser = await findAuthenticatedUser(userId);
    if (!profileUser) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, buildProfilePayload(profileUser.row), 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    errorResponse(res, error.message || 'Failed to retrieve profile', 500, error);
  }
};

module.exports = {
  login,
  getCurrentUser,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
};

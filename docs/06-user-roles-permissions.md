# Aalto Engineers Admin Panel - User Roles and Permissions

## User Roles

### 1. Super Admin
**Description**: Full system access with all permissions.

**Access Level**: Complete access to all modules and settings.

**Capabilities**:
- Manage all users (create, edit, delete, activate/deactivate)
- Assign and modify user roles
- Access all website data (multi-tenancy)
- Full CRUD operations on all modules
- Manage system settings and configurations
- View all activity logs
- Export all data
- Manage permissions matrix

### 2. Customer Admin
**Description**: Admin for a specific website/customer.

**Access Level**: Full access to their website data only.

**Capabilities**:
- Manage users within their website (create, edit, delete, activate/deactivate)
- Assign roles (editor, hr, viewer) to their website users
- Full CRUD operations on their website's data
- View their website's activity logs
- Export their website's data
- Cannot access other websites' data
- Cannot modify system-wide settings

### 3. Editor
**Description**: Content manager for blogs, gallery, and case studies.

**Access Level**: Read and write access to content modules.

**Capabilities**:
- **Blogs**: Create, edit, delete, publish/unpublish
- **Gallery**: Create, edit, delete, upload images
- **Case Studies**: Create, edit, delete, publish/unpublish
- **Enquiries**: View only
- **Careers**: View only
- **Applicants**: View only
- **Settings**: View profile only

### 4. HR
**Description**: Human Resources manager for careers and applicants.

**Access Level**: Read and write access to HR modules.

**Capabilities**:
- **Careers**: Create, edit, delete, manage status
- **Applicants**: Create, edit, delete, manage status, view resumes
- **Enquiries**: View only
- **Blogs**: View only
- **Gallery**: View only
- **Case Studies**: View only
- **Settings**: View profile only

### 5. Viewer
**Description**: Read-only access to all modules.

**Access Level**: Read-only access to all modules.

**Capabilities**:
- **Enquiries**: View only
- **Blogs**: View only
- **Careers**: View only
- **Applicants**: View only (no resume download)
- **Gallery**: View only
- **Case Studies**: View only
- **Settings**: View profile only
- Cannot create, edit, or delete any data
- Cannot export data

---

## Permission Matrix

| Module/Action | Super Admin | Customer Admin | Editor | HR | Viewer |
|---------------|-------------|----------------|--------|----|--------|
| **Authentication** |
| Login | ✓ | ✓ | ✓ | ✓ | ✓ |
| Register | ✓ | ✓ | ✗ | ✗ | ✗ |
| Change Password | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Dashboard** |
| View Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Analytics | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Enquiries** |
| View Enquiries | ✓ | ✓ (own) | ✓ | ✓ | ✓ |
| Create Enquiry | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Enquiry | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Delete Enquiry | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Assign Enquiry | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Change Status | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Export Enquiries | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| **Blogs** |
| View Blogs | ✓ | ✓ (own) | ✓ | ✓ | ✓ |
| Create Blog | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Edit Blog | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Delete Blog | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Publish/Unpublish | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Set Featured | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Export Blogs | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| **Careers** |
| View Careers | ✓ | ✓ (own) | ✓ | ✓ | ✓ |
| Create Career | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Edit Career | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Delete Career | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Change Status | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Export Careers | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| **Applicants** |
| View Applicants | ✓ | ✓ (own) | ✓ | ✓ | ✓ |
| Create Applicant | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Edit Applicant | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Delete Applicant | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Change Status | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Download Resume | ✓ | ✓ (own) | ✗ | ✓ | ✗ |
| Export Applicants | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| **Gallery** |
| View Gallery | ✓ | ✓ (own) | ✓ | ✓ | ✓ |
| Create Gallery | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Edit Gallery | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Delete Gallery | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Upload Images | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Delete Images | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| **Case Studies** |
| View Case Studies | ✓ | ✓ (own) | ✓ | ✓ | ✓ |
| Create Case Study | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Edit Case Study | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Delete Case Study | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| Publish/Unpublish | ✓ | ✓ (own) | ✓ | ✗ | ✗ |
| **Settings - User Management** |
| View Users | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Create User | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Edit User | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Delete User | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Activate/Deactivate | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| Assign Role | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| **Settings - Profile** |
| View Profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit Profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| Upload Avatar | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Settings - System** |
| View Permissions | ✓ | ✗ | ✗ | ✗ | ✗ |
| Edit Permissions | ✓ | ✗ | ✗ | ✗ | ✗ |
| View Activity Logs | ✓ | ✓ (own) | ✗ | ✗ | ✗ |
| **Notifications** |
| View Notifications | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mark as Read | ✓ | ✓ | ✓ | ✓ | ✓ |
| Delete Notifications | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Global Search** |
| Search All | ✓ | ✓ (own) | ✓ | ✓ | ✓ |

---

## Permission Implementation

### Frontend Permission Checks

```typescript
// Permission hook
const usePermission = (permission: string) => {
  const { user } = useAuth();
  return user?.permissions?.includes(permission) || false;
};

// Usage in components
const canCreateBlog = usePermission('create:blog');
const canDeleteEnquiry = usePermission('delete:enquiry');
```

### Backend Permission Middleware

```python
# Permission decorator
@permission_required('create:blog')
def create_blog():
    # Only users with create:blog permission can access
    pass

# Role-based route protection
@role_required(['super_admin', 'customer_admin'])
def manage_users():
    # Only admins can access
    pass
```

### Permission Constants

```typescript
// Permission constants
export const PERMISSIONS = {
  // Enquiries
  'view:enquiries': 'view:enquiries',
  'create:enquiries': 'create:enquiries',
  'edit:enquiries': 'edit:enquiries',
  'delete:enquiries': 'delete:enquiries',
  'assign:enquiries': 'assign:enquiries',
  
  // Blogs
  'view:blogs': 'view:blogs',
  'create:blogs': 'create:blogs',
  'edit:blogs': 'edit:blogs',
  'delete:blogs': 'delete:blogs',
  'publish:blogs': 'publish:blogs',
  
  // Careers
  'view:careers': 'view:careers',
  'create:careers': 'create:careers',
  'edit:careers': 'edit:careers',
  'delete:careers': 'delete:careers',
  
  // Applicants
  'view:applicants': 'view:applicants',
  'create:applicants': 'create:applicants',
  'edit:applicants': 'edit:applicants',
  'delete:applicants': 'delete:applicants',
  'download:resume': 'download:resume',
  
  // Gallery
  'view:gallery': 'view:gallery',
  'create:gallery': 'create:gallery',
  'edit:gallery': 'edit:gallery',
  'delete:gallery': 'delete:gallery',
  
  // Case Studies
  'view:case_studies': 'view:case_studies',
  'create:case_studies': 'create:case_studies',
  'edit:case_studies': 'edit:case_studies',
  'delete:case_studies': 'delete:case_studies',
  
  // Users
  'view:users': 'view:users',
  'create:users': 'create:users',
  'edit:users': 'edit:users',
  'delete:users': 'delete:users',
  'assign:roles': 'assign:roles',
  
  // Settings
  'view:settings': 'view:settings',
  'edit:settings': 'edit:settings',
  'view:logs': 'view:logs',
};
```

### Role-Permission Mapping

```typescript
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  super_admin: [
    // All permissions
    ...Object.values(PERMISSIONS),
  ],
  customer_admin: [
    // All permissions except system-wide settings
    ...Object.values(PERMISSIONS).filter(p => !p.includes('settings')),
  ],
  editor: [
    PERMISSIONS.view_enquiries,
    PERMISSIONS.view_blogs,
    PERMISSIONS.create_blogs,
    PERMISSIONS.edit_blogs,
    PERMISSIONS.delete_blogs,
    PERMISSIONS.publish_blogs,
    PERMISSIONS.view_careers,
    PERMISSIONS.view_applicants,
    PERMISSIONS.view_gallery,
    PERMISSIONS.create_gallery,
    PERMISSIONS.edit_gallery,
    PERMISSIONS.delete_gallery,
    PERMISSIONS.view_case_studies,
    PERMISSIONS.create_case_studies,
    PERMISSIONS.edit_case_studies,
    PERMISSIONS.delete_case_studies,
  ],
  hr: [
    PERMISSIONS.view_enquiries,
    PERMISSIONS.view_blogs,
    PERMISSIONS.view_careers,
    PERMISSIONS.create_careers,
    PERMISSIONS.edit_careers,
    PERMISSIONS.delete_careers,
    PERMISSIONS.view_applicants,
    PERMISSIONS.create_applicants,
    PERMISSIONS.edit_applicants,
    PERMISSIONS.delete_applicants,
    PERMISSIONS.download_resume,
    PERMISSIONS.view_gallery,
    PERMISSIONS.view_case_studies,
  ],
  viewer: [
    // View permissions only
    PERMISSIONS.view_enquiries,
    PERMISSIONS.view_blogs,
    PERMISSIONS.view_careers,
    PERMISSIONS.view_applicants,
    PERMISSIONS.view_gallery,
    PERMISSIONS.view_case_studies,
  ],
};
```

---

## Route Protection

### Protected Routes

```typescript
// Route configuration
const protectedRoutes = [
  {
    path: '/dashboard',
    component: DashboardPage,
    permissions: ['view:dashboard'],
  },
  {
    path: '/enquiries',
    component: EnquiriesListPage,
    permissions: ['view:enquiries'],
  },
  {
    path: '/enquiries/create',
    component: EnquiryFormPage,
    permissions: ['create:enquiries'],
  },
  {
    path: '/blogs',
    component: BlogsListPage,
    permissions: ['view:blogs'],
  },
  {
    path: '/blogs/create',
    component: BlogFormPage,
    permissions: ['create:blogs'],
  },
  {
    path: '/settings/users',
    component: UsersPage,
    permissions: ['view:users'],
    roles: ['super_admin', 'customer_admin'],
  },
];
```

### Permission Guard Component

```typescript
const PermissionGuard = ({ 
  children, 
  permissions, 
  roles 
}: PermissionGuardProps) => {
  const { user } = useAuth();
  
  const hasPermission = permissions?.every(p => 
    user?.permissions?.includes(p)
  );
  
  const hasRole = roles?.includes(user?.role);
  
  if (!hasPermission || !hasRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
};
```

---

## Data-Level Access Control

### Multi-Tenancy Filtering

For Customer Admin role, all queries must filter by `website_id`:

```python
# Backend query filter
def get_enquiries(user):
    query = Enquiry.query
    if user.role == 'customer_admin':
        query = query.filter_by(website_id=user.website_id)
    return query.all()
```

```typescript
// Frontend query filter
const { data: enquiries } = useQuery({
  queryKey: ['enquiries'],
  queryFn: () => api.get('/enquiries'),
  // Backend automatically filters based on user role
});
```

---

## Audit Trail

All permission-related actions should be logged:

```python
# Log permission changes
log_activity(
  user_id=current_user.id,
  action='role_changed',
  entity_type='user',
  entity_id=target_user.id,
  old_values={'role': old_role},
  new_values={'role': new_role}
)
```

---

## Security Considerations

1. **Never trust client-side permission checks**: Always validate permissions on the backend
2. **Use least privilege principle**: Grant minimum required permissions
3. **Regular permission audits**: Review and update permissions regularly
4. **Permission caching**: Cache user permissions for performance
5. **Permission revocation**: Immediate revocation on role change or deactivation

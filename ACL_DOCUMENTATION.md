# ACL System Documentation

## Overview

This document describes the Role-Based Access Control (ACL) system implemented in the TemplateV3.1 application. The system provides fine-grained control over user permissions across the application.

## Roles

The application supports three primary roles, mapping to the Brazilian Portuguese names:

| Role Name (English) | Role Name (PT-BR) | Internal ID | Description |
|---------------------|-------------------|-------------|-------------|
| Client              | Cliente           | `client`    | Basic user with limited permissions |
| Owner               | Dono/Dona         | owner`      | Business owner with analytics and management access |
| Developer           | Desenvolvedor     | `dev`       | Full system access (superuser) |

### Role Hierarchy

The roles follow a hierarchical structure:
- **Dev** (highest) - Has access to everything
- **Owner** - Has access to all Client features plus business management
- **Client** (lowest) - Has access to basic features only

## Pages and Permissions

### Client Pages (`client` role)

| Path | Name | View | Edit |
|------|------|------|------|
| `/` | About | ✓ | ✗ |
| `/home` | Home | ✓ | ✗ |
| `/home/payment` | Payment | ✓ | ✗ |
| `/profile` | Profile | ✓ | ✓ |
| `/contactUs` | Contact Us | ✓ | ✓ |

### Owner Pages (`owner` role)

All Client pages, plus:

| Path | Name | View | Edit |
|------|------|------|------|
| `/profile/all` | All Profiles | ✓ | ✓ |
| `/analytics` | Analytics | ✓ | ✗ |
| `/analytics/users` | User Analytics | ✓ | ✗ |
| `/analytics/graphics` | Graphics | ✓ | ✗ |
| `/analytics/all-time` | All Time View | ✓ | ✗ |
| `/analytics/trends` | Trends | ✓ | ✗ |
| `/usersProblems` | User Problems | ✓ | ✓ |

### Developer Pages (`dev` role)

All Client and Owner pages, plus:

| Path | Name | View | Edit |
|------|------|------|------|
| `/about/edit` | Edit About | ✓ | ✓ |
| `/home/payment/test` | Payment Test | ✓ | ✓ |
| `/control/users` | User Monitoring | ✓ | ✓ |
| `/organization/roles` | Role Management | ✓ | ✓ |
| `/error/raw` | Technical Errors | ✓ | ✗ |

**Note**: Developers (superusers) have unrestricted access to ALL pages regardless of ACL settings.

## Backend Implementation

### Models

#### Role Model
```python
class Role(models.Model):
    name = models.CharField(max_length=20, choices=ROLE_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
```

#### Page Model
```python
class Page(models.Model):
    path = models.CharField(max_length=200, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
```

#### PagePermission Model
```python
class PagePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    can_view = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
```

### API Endpoints

#### GET `/api/acl/permissions/`
Get current user's permissions.

**Response**:
```json
{
  "role": "dev",
  "roleName": "Desenvolvedor (Dev)",
  "permissions": [
    {
      "path": "/home",
      "name": "Home",
      "canView": true,
      "canEdit": true
    }
  ],
  "isSuperuser": true
}
```

#### GET `/api/acl/roles/`
List all roles (Dev only).

**Response**:
```json
{
  "roles": [
    {
      "id": 1,
      "name": "client",
      "displayName": "Cliente (Client)",
      "description": "Basic client access",
      "isActive": true
    }
  ]
}
```

#### GET `/api/acl/pages/`
List all pages (Dev only).

#### GET `/api/acl/role-permissions/`
Get complete permission matrix (Dev only).

**Response**:
```json
{
  "roles": [...],
  "pages": [...],
  "permissions": {
    "client": {
      "/home": {"canView": true, "canEdit": false}
    }
  }
}
```

#### POST `/api/acl/role-permissions/`
Update role permissions (Dev only).

**Request**:
```json
{
  "updates": [
    {
      "role": "client",
      "page": "/home",
      "canView": true,
      "canEdit": false
    }
  ]
}
```

#### GET `/api/acl/check-permission/`
Check if user has permission for a specific page.

**Parameters**:
- `path`: Page path
- `action`: `view` or `edit` (default: `view`)

## Frontend Implementation

### TypeScript Types

```typescript
export enum UserRole {
  ADMIN = 'dev',
  MODERATOR = 'owner',
  USER = 'client',
  GUEST = 'guest',
}

export interface PagePermission {
  path: string;
  name: string;
  canView: boolean;
  canEdit: boolean;
}
```

### Components

#### RoleBasedRender
Conditional rendering based on user roles.

```tsx
<RoleBasedRender requiredRole={UserRole.MODERATOR}>
  <OwnerOnlyContent />
</RoleBasedRender>
```

#### ProtectedRoute
Route protection with role checking.

```tsx
<Route 
  path="/analytics" 
  element={
    <ProtectedRoute requiredRole={UserRole.MODERATOR}>
      <Analytics />
    </ProtectedRoute>
  } 
/>
```

### Permission Utilities

```typescript
// Check if user has specific role
hasRole(user, UserRole.ADMIN)

// Check if user has any of the specified roles
hasAnyRole(user, [UserRole.ADMIN, UserRole.MODERATOR])

// Check if user has at least the required role level
hasRoleLevel(user, UserRole.MODERATOR)
```

## Management Commands

### Initialize ACL System

```bash
python manage.py init_acl
```

This command:
1. Creates the three default roles
2. Creates all page entries
3. Sets up default permissions for each role

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | Dev (Superuser) |
| moderator@example.com | mod123 | Owner (Staff) |
| user@example.com | user123 | Client (Regular) |

## Security Considerations

1. **Superuser Bypass**: Developers (is_superuser=True) always have full access
2. **Token Authentication**: All ACL endpoints require authentication
3. **Role Inheritance**: Higher roles inherit permissions from lower roles
4. **Backend Enforcement**: Permissions are enforced at the API level, not just UI

## Error Handling

### 404 Error Page
User-friendly error page for missing resources (`/pages/NotFound.tsx`).

### Technical Error Page
Developer-only page with stack traces and debugging info (`/pages/TechnicalError.tsx`).

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Future Enhancements

1. **Dynamic Role Creation**: Allow creating custom roles via UI
2. **Permission Caching**: Implement Redis caching for permissions
3. **Audit Logging**: Track permission changes and access attempts
4. **Role Templates**: Pre-configured role templates for common scenarios
5. **Time-based Permissions**: Temporary access grants
6. **IP-based Restrictions**: Additional security layer

## Troubleshooting

### Permission not working
1. Check if user is authenticated
2. Verify role assignment in database
3. Check if page exists in `Page` model
4. Verify `PagePermission` exists for role and page
5. Clear browser cache and refresh token

### Role not appearing
1. Run `python manage.py init_acl` to initialize roles
2. Check database for role entries
3. Verify user profile has correct role assigned

## API Reference

See the full API documentation at `/api/docs/` (if Swagger/OpenAPI is configured).

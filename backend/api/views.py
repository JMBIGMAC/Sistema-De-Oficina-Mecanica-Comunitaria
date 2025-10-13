from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db import transaction, OperationalError
from .models import UserProfile, Message, MessageReply, MessageSettings, Role, Page, PagePermission
import json
import time
from functools import wraps


def retry_on_db_lock(max_retries=3, initial_delay=0.1):
    """
    Decorator to retry database operations on lock errors.
    Implements exponential backoff for better concurrency handling.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except OperationalError as e:
                    last_exception = e
                    if 'database is locked' in str(e).lower():
                        if attempt < max_retries - 1:
                            time.sleep(delay)
                            delay *= 2  # Exponential backoff
                        continue
                    raise  # Re-raise if it's not a lock error
            
            # If we've exhausted retries, raise the last exception
            raise last_exception
        return wrapper
    return decorator


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Simple health check endpoint"""
    return Response({
        'status': 'healthy',
        'message': 'Backend API is running successfully!'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login(request):
    """Login endpoint for authentication"""
    # Retry logic with exponential backoff for database locks
    max_retries = 7
    delay = 0.05
    last_error = None
    
    for attempt in range(max_retries):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not email or not password:
                return Response({
                    'error': 'Email and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # For demo purposes, handle the mock credentials
            with transaction.atomic():
                if email == 'admin@example.com' and password == 'admin123':
                    user, created = User.objects.get_or_create(
                        username='admin',
                        defaults={
                            'email': 'admin@example.com',
                            'first_name': 'Admin',
                            'last_name': 'User',
                            'is_staff': True,
                            'is_superuser': True
                        }
                    )
                    if created:
                        user.set_password('admin123')
                        user.save()
                elif email == 'user@example.com' and password == 'user123':
                    user, created = User.objects.get_or_create(
                        username='user',
                        defaults={
                            'email': 'user@example.com',
                            'first_name': 'Regular',
                            'last_name': 'User'
                        }
                    )
                    if created:
                        user.set_password('user123')
                        user.save()
                elif email == 'moderator@example.com' and password == 'mod123':
                    user, created = User.objects.get_or_create(
                        username='moderator',
                        defaults={
                            'email': 'moderator@example.com',
                            'first_name': 'Moderator',
                            'last_name': 'User',
                            'is_staff': True
                        }
                    )
                    if created:
                        user.set_password('mod123')
                        user.save()
                else:
                    # Try regular authentication
                    user = authenticate(username=email, password=password)
                    if not user:
                        return Response({
                            'error': 'Invalid credentials'
                        }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Delete old token and create a new one to support multiple concurrent sessions
                Token.objects.filter(user=user).delete()
                token = Token.objects.create(user=user)
                
                # Get or create user profile
                profile, created = UserProfile.objects.get_or_create(user=user)
            
            # Get role name using the new ACL system
            role_name = get_user_role_name(user)
            
            return Response({
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': role_name,
                    'isActive': user.is_active,
                    'avatar': profile.avatar.url if profile.avatar else None,
                    'createdAt': user.date_joined.isoformat(),
                    'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat(),
                },
                'token': token.key
            })
            
        except OperationalError as e:
            last_error = e
            if 'database is locked' in str(e).lower() and attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2  # Exponential backoff
                continue
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # If all retries failed
    return Response({
        'error': 'Database temporarily unavailable. Please try again.'
    }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def signup(request):
    """Signup endpoint for user registration"""
    # Retry logic with exponential backoff for database locks
    max_retries = 7
    delay = 0.05
    
    for attempt in range(max_retries):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            first_name = request.data.get('firstName', '')
            last_name = request.data.get('lastName', '')
            
            if not email or not password:
                return Response({
                    'error': 'Email and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                return Response({
                    'error': 'User with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create new user with atomic transaction
            with transaction.atomic():
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                
                # Create user profile
                profile = UserProfile.objects.create(user=user)
                
                # Create a new token for the new user
                token = Token.objects.create(user=user)
            
            # Get role name using the new ACL system
            role_name = get_user_role_name(user)
            
            return Response({
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': role_name,
                    'isActive': user.is_active,
                    'avatar': profile.avatar.url if profile.avatar else None,
                    'createdAt': user.date_joined.isoformat(),
                    'updatedAt': user.date_joined.isoformat(),
                },
                'token': token.key
            }, status=status.HTTP_201_CREATED)
            
        except OperationalError as e:
            if 'database is locked' in str(e).lower() and attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2
                continue
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'error': 'Database temporarily unavailable. Please try again.'
    }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get or update current user profile"""
    if request.method == 'GET':
        user = request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        return Response({
            'user': {
                'id': str(user.id),
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': 'admin' if user.is_superuser else ('moderator' if user.is_staff else 'user'),
                'isActive': user.is_active,
                'avatar': profile.avatar.url if profile.avatar else None,
                'createdAt': user.date_joined.isoformat(),
                'updatedAt': user.last_login.isoformat() if user.last_login else user.date_joined.isoformat(),
            }
        })
    
    elif request.method == 'PUT':
        try:
            user = request.user
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            # Update user fields
            user.first_name = request.data.get('firstName', user.first_name)
            user.last_name = request.data.get('lastName', user.last_name)
            user.email = request.data.get('email', user.email)
            user.save()
            
            # Update profile avatar if provided
            if 'avatar' in request.FILES:
                profile.avatar = request.FILES['avatar']
                profile.save()
            
            return Response({
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': 'admin' if user.is_superuser else ('moderator' if user.is_staff else 'user'),
                    'isActive': user.is_active,
                    'avatar': profile.avatar.url if profile.avatar else None,
                    'createdAt': user.date_joined.isoformat(),
                    'updatedAt': timezone.now().isoformat(),
                }
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_user_role(user):
    """Helper function to get user role"""
    if user.is_superuser:
        return 'admin'
    elif user.is_staff:
        return 'moderator'
    else:
        return 'user'


def can_user_perform_action(user, action_type):
    """Check if user can perform specific message actions based on settings"""
    try:
        settings_obj = MessageSettings.objects.first()
        if not settings_obj:
            # Default permissions if no settings exist
            return True
            
        permission_field = getattr(settings_obj, f'who_can_{action_type}', 'authenticated')
        
        if permission_field == 'all':
            return True
        elif permission_field == 'authenticated':
            return user.is_authenticated
        elif permission_field == 'staff':
            return user.is_staff or user.is_superuser
        elif permission_field == 'admin':
            return user.is_superuser
        
        return False
    except:
        return True  # Default to allowing if there's any error


# ACL System Views

def get_user_role_name(user):
    """Get the role name for a user based on their profile or Django flags"""
    if user.is_superuser:
        return 'dev'
    elif user.is_staff:
        return 'owner'
    
    try:
        profile = user.profile
        if profile.role:
            return profile.role.name
    except UserProfile.DoesNotExist:
        pass
    
    return 'client'


def has_permission(user, page_path, action='view'):
    """Check if user has permission to access a page"""
    # Dev (superuser) always has full access
    if user.is_superuser:
        return True
    
    role_name = get_user_role_name(user)
    
    try:
        role = Role.objects.get(name=role_name)
        page = Page.objects.get(path=page_path)
        permission = PagePermission.objects.get(role=role, page=page)
        
        if action == 'view':
            return permission.can_view
        elif action == 'edit':
            return permission.can_edit
        
        return False
    except (Role.DoesNotExist, Page.DoesNotExist, PagePermission.DoesNotExist):
        return False


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_permissions(request):
    """Get current user's permissions"""
    user = request.user
    role_name = get_user_role_name(user)
    
    try:
        role = Role.objects.get(name=role_name)
        permissions = PagePermission.objects.filter(role=role).select_related('page')
        
        permissions_list = []
        for perm in permissions:
            permissions_list.append({
                'path': perm.page.path,
                'name': perm.page.name,
                'canView': perm.can_view,
                'canEdit': perm.can_edit,
            })
        
        return Response({
            'role': role_name,
            'roleName': role.display_name,
            'permissions': permissions_list,
            'isSuperuser': user.is_superuser,
        })
    except Role.DoesNotExist:
        return Response({
            'role': 'client',
            'roleName': 'Cliente (Client)',
            'permissions': [],
            'isSuperuser': user.is_superuser,
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_roles(request):
    """List all roles (Dev only)"""
    if not request.user.is_superuser:
        return Response(
            {'error': 'Unauthorized. Dev access required.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    roles = Role.objects.all()
    roles_data = []
    
    for role in roles:
        roles_data.append({
            'id': role.id,
            'name': role.name,
            'displayName': role.display_name,
            'description': role.description,
            'isActive': role.is_active,
            'createdAt': role.created_at.isoformat(),
            'updatedAt': role.updated_at.isoformat(),
        })
    
    return Response({'roles': roles_data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_pages(request):
    """List all pages (Dev only)"""
    if not request.user.is_superuser:
        return Response(
            {'error': 'Unauthorized. Dev access required.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    pages = Page.objects.all()
    pages_data = []
    
    for page in pages:
        pages_data.append({
            'id': page.id,
            'path': page.path,
            'name': page.name,
            'description': page.description,
            'isActive': page.is_active,
            'createdAt': page.created_at.isoformat(),
            'updatedAt': page.updated_at.isoformat(),
        })
    
    return Response({'pages': pages_data})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def role_permissions(request):
    """Get or update role permissions (Dev only)"""
    if not request.user.is_superuser:
        return Response(
            {'error': 'Unauthorized. Dev access required.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        roles = Role.objects.all()
        pages = Page.objects.all()
        permissions = PagePermission.objects.all().select_related('role', 'page')
        
        # Build permission matrix
        permission_matrix = {}
        for perm in permissions:
            role_name = perm.role.name
            if role_name not in permission_matrix:
                permission_matrix[role_name] = {}
            
            permission_matrix[role_name][perm.page.path] = {
                'canView': perm.can_view,
                'canEdit': perm.can_edit,
            }
        
        return Response({
            'roles': [
                {
                    'id': role.id,
                    'name': role.name,
                    'displayName': role.display_name,
                }
                for role in roles
            ],
            'pages': [
                {
                    'id': page.id,
                    'path': page.path,
                    'name': page.name,
                    'description': page.description,
                }
                for page in pages
            ],
            'permissions': permission_matrix,
        })
    
    elif request.method == 'POST':
        # Update permissions
        try:
            updates = request.data.get('updates', [])
            
            for update in updates:
                role_name = update.get('role')
                page_path = update.get('page')
                can_view = update.get('canView', False)
                can_edit = update.get('canEdit', False)
                
                role = Role.objects.get(name=role_name)
                page = Page.objects.get(path=page_path)
                
                perm, created = PagePermission.objects.update_or_create(
                    role=role,
                    page=page,
                    defaults={
                        'can_view': can_view,
                        'can_edit': can_edit,
                    }
                )
            
            return Response({'message': 'Permissions updated successfully'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_page_permission(request):
    """Check if current user can access a specific page"""
    page_path = request.query_params.get('path')
    action = request.query_params.get('action', 'view')
    
    if not page_path:
        return Response(
            {'error': 'Page path is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    has_access = has_permission(request.user, page_path, action)
    
    return Response({
        'hasAccess': has_access,
        'path': page_path,
        'action': action,
    })



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@retry_on_db_lock(max_retries=3)
def messages_list(request):
    """List messages or create a new message"""
    
    if request.method == 'GET':
        # Check if user can view messages
        if not can_user_perform_action(request.user, 'view'):
            return Response({
                'error': 'You do not have permission to view messages'
            }, status=status.HTTP_403_FORBIDDEN)
        
        messages = Message.objects.filter(is_hidden=False).select_related(
            'from_user', 'resolved_by'
        ).prefetch_related('replies__from_user')
        
        messages_data = []
        for message in messages:
            from_profile, _ = UserProfile.objects.get_or_create(user=message.from_user)
            
            replies_data = []
            for reply in message.replies.all():
                reply_profile, _ = UserProfile.objects.get_or_create(user=reply.from_user)
                replies_data.append({
                    'id': str(reply.id),
                    'from': {
                        'name': f"{reply.from_user.first_name} {reply.from_user.last_name}".strip() or reply.from_user.username,
                        'role': get_user_role(reply.from_user),
                        'avatar': reply_profile.avatar.url if reply_profile.avatar else None,
                    },
                    'content': reply.content,
                    'timestamp': reply.created_at.isoformat(),
                })
            
            resolved_by_data = None
            if message.resolved_by:
                resolved_by_data = {
                    'name': f"{message.resolved_by.first_name} {message.resolved_by.last_name}".strip() or message.resolved_by.username,
                    'role': get_user_role(message.resolved_by),
                }
            
            messages_data.append({
                'id': str(message.id),
                'from': {
                    'name': f"{message.from_user.first_name} {message.from_user.last_name}".strip() or message.from_user.username,
                    'role': get_user_role(message.from_user),
                    'avatar': from_profile.avatar.url if from_profile.avatar else None,
                },
                'subject': message.subject,
                'content': message.content,
                'timestamp': message.created_at.isoformat(),
                'isResolved': message.is_resolved,
                'resolvedBy': resolved_by_data,
                'isHidden': message.is_hidden,
                'replies': replies_data,
            })
        
        return Response({'messages': messages_data})
    
    elif request.method == 'POST':
        # Check if user can create messages
        if not can_user_perform_action(request.user, 'create'):
            return Response({
                'error': 'You do not have permission to create messages'
            }, status=status.HTTP_403_FORBIDDEN)
        
        subject = request.data.get('subject')
        content = request.data.get('content')
        
        if not subject or not content:
            return Response({
                'error': 'Subject and content are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            message = Message.objects.create(
                from_user=request.user,
                subject=subject,
                content=content
            )
            
            from_profile, _ = UserProfile.objects.get_or_create(user=message.from_user)
        
        return Response({
            'message': {
                'id': str(message.id),
                'from': {
                    'name': f"{message.from_user.first_name} {message.from_user.last_name}".strip() or message.from_user.username,
                    'role': get_user_role(message.from_user),
                    'avatar': from_profile.avatar.url if from_profile.avatar else None,
                },
                'subject': message.subject,
                'content': message.content,
                'timestamp': message.created_at.isoformat(),
                'isResolved': message.is_resolved,
                'resolvedBy': None,
                'isHidden': message.is_hidden,
                'replies': [],
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@retry_on_db_lock(max_retries=3)
def message_reply(request, message_id):
    """Reply to a message"""
    if not can_user_perform_action(request.user, 'comment'):
        return Response({
            'error': 'You do not have permission to reply to messages'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        message = Message.objects.get(id=message_id, is_hidden=False)
    except Message.DoesNotExist:
        return Response({
            'error': 'Message not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    content = request.data.get('content')
    if not content:
        return Response({
            'error': 'Content is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    with transaction.atomic():
        reply = MessageReply.objects.create(
            message=message,
            from_user=request.user,
            content=content
        )
        
        from_profile, _ = UserProfile.objects.get_or_create(user=reply.from_user)
    
    return Response({
        'reply': {
            'id': str(reply.id),
            'from': {
                'name': f"{reply.from_user.first_name} {reply.from_user.last_name}".strip() or reply.from_user.username,
                'role': get_user_role(reply.from_user),
                'avatar': from_profile.avatar.url if from_profile.avatar else None,
            },
            'content': reply.content,
            'timestamp': reply.created_at.isoformat(),
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def message_resolve(request, message_id):
    """Mark a message as resolved"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({
            'error': 'Only moderators and admins can resolve messages'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        return Response({
            'error': 'Message not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    message.is_resolved = True
    message.resolved_by = request.user
    message.resolved_at = timezone.now()
    message.save()
    
    return Response({
        'message': 'Message marked as resolved',
        'resolvedBy': {
            'name': f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
            'role': get_user_role(request.user),
        }
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def message_hide(request, message_id):
    """Hide a message"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({
            'error': 'Only moderators and admins can hide messages'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        return Response({
            'error': 'Message not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    message.is_hidden = True
    message.hidden_by = request.user
    message.save()
    
    return Response({'message': 'Message hidden successfully'})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def message_settings(request):
    """Get or update message settings"""
    
    if request.method == 'GET':
        settings_obj, created = MessageSettings.objects.get_or_create(
            defaults={
                'who_can_view': 'authenticated',
                'who_can_comment': 'authenticated',
                'who_can_create': 'authenticated',
            }
        )
        
        return Response({
            'settings': {
                'whoCanView': settings_obj.who_can_view,
                'whoCanComment': settings_obj.who_can_comment,
                'whoCanCreate': settings_obj.who_can_create,
                'updatedBy': settings_obj.updated_by.username if settings_obj.updated_by else None,
                'updatedAt': settings_obj.updated_at.isoformat(),
            }
        })
    
    elif request.method == 'PUT':
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({
                'error': 'Only moderators and admins can update message settings'
            }, status=status.HTTP_403_FORBIDDEN)
        
        settings_obj, created = MessageSettings.objects.get_or_create(
            defaults={
                'who_can_view': 'authenticated',
                'who_can_comment': 'authenticated',
                'who_can_create': 'authenticated',
            }
        )
        
        # Update settings
        settings_obj.who_can_view = request.data.get('whoCanView', settings_obj.who_can_view)
        settings_obj.who_can_comment = request.data.get('whoCanComment', settings_obj.who_can_comment)
        settings_obj.who_can_create = request.data.get('whoCanCreate', settings_obj.who_can_create)
        settings_obj.updated_by = request.user
        settings_obj.save()
        
        return Response({
            'settings': {
                'whoCanView': settings_obj.who_can_view,
                'whoCanComment': settings_obj.who_can_comment,
                'whoCanCreate': settings_obj.who_can_create,
                'updatedBy': settings_obj.updated_by.username,
                'updatedAt': settings_obj.updated_at.isoformat(),
            }
        })

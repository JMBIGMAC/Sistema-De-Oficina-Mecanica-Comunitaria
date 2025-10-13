from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    """Custom role model for ACL system"""
    ROLE_CHOICES = [
        ('client', 'Cliente (Client)'),
        ('owner', 'Dono/Dona (Owner)'),
        ('dev', 'Desenvolvedor (Dev)'),
    ]
    
    name = models.CharField(max_length=20, choices=ROLE_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.display_name
    
    class Meta:
        ordering = ['name']

class Page(models.Model):
    """Represents a page/route in the application"""
    path = models.CharField(max_length=200, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.path})"
    
    class Meta:
        ordering = ['path']

class PagePermission(models.Model):
    """Maps which roles can access which pages"""
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='page_permissions')
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='role_permissions')
    can_view = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['role', 'page']
        ordering = ['role', 'page']
    
    def __str__(self):
        return f"{self.role.name} - {self.page.name}"

class UserProfile(models.Model):
    """Extended user profile with additional fields"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def get_role_name(self):
        """Get the role name, defaulting based on Django user flags"""
        if self.user.is_superuser:
            return 'dev'
        elif self.user.is_staff:
            return 'owner'
        elif self.role:
            return self.role.name
        else:
            return 'client'

class MessageSettings(models.Model):
    """Global settings for message system"""
    VISIBILITY_CHOICES = [
        ('all', 'All Users'),
        ('authenticated', 'Authenticated Users Only'),
        ('staff', 'Staff and Moderators Only'),
        ('admin', 'Admins Only'),
    ]
    
    COMMENT_PERMISSION_CHOICES = [
        ('all', 'All Users'),
        ('authenticated', 'Authenticated Users Only'),
        ('staff', 'Staff and Moderators Only'),
        ('admin', 'Admins Only'),
    ]
    
    who_can_view = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='authenticated')
    who_can_comment = models.CharField(max_length=20, choices=COMMENT_PERMISSION_CHOICES, default='authenticated')
    who_can_create = models.CharField(max_length=20, choices=COMMENT_PERMISSION_CHOICES, default='authenticated')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Message Settings"

    def __str__(self):
        return "Message System Settings"

class Message(models.Model):
    """Main message model"""
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    subject = models.CharField(max_length=200)
    content = models.TextField()
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_messages')
    resolved_at = models.DateTimeField(null=True, blank=True)
    is_hidden = models.BooleanField(default=False)
    hidden_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='hidden_messages')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} - {self.from_user.username}"

class MessageReply(models.Model):
    """Reply to a message"""
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='replies')
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Reply to {self.message.subject} by {self.from_user.username}"

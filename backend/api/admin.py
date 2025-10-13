from django.contrib import admin
from .models import UserProfile, Message, MessageReply, MessageSettings

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']

@admin.register(MessageSettings)
class MessageSettingsAdmin(admin.ModelAdmin):
    list_display = ['who_can_view', 'who_can_comment', 'who_can_create', 'updated_by', 'updated_at']
    list_filter = ['who_can_view', 'who_can_comment', 'who_can_create', 'updated_at']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['subject', 'from_user', 'is_resolved', 'is_hidden', 'created_at']
    list_filter = ['is_resolved', 'is_hidden', 'created_at', 'updated_at']
    search_fields = ['subject', 'content', 'from_user__username', 'from_user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('from_user', 'resolved_by', 'hidden_by')

@admin.register(MessageReply)
class MessageReplyAdmin(admin.ModelAdmin):
    list_display = ['message', 'from_user', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['content', 'from_user__username', 'message__subject']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('message', 'from_user')

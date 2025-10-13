from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('auth/login/', views.login, name='login'),
    path('auth/signup/', views.signup, name='signup'),
    path('auth/profile/', views.user_profile, name='user_profile'),
    # Message endpoints
    path('messages/', views.messages_list, name='messages_list'),
    path('messages/<int:message_id>/reply/', views.message_reply, name='message_reply'),
    path('messages/<int:message_id>/resolve/', views.message_resolve, name='message_resolve'),
    path('messages/<int:message_id>/hide/', views.message_hide, name='message_hide'),
    path('messages/settings/', views.message_settings, name='message_settings'),
    # ACL endpoints
    path('acl/permissions/', views.user_permissions, name='user_permissions'),
    path('acl/roles/', views.list_roles, name='list_roles'),
    path('acl/pages/', views.list_pages, name='list_pages'),
    path('acl/role-permissions/', views.role_permissions, name='role_permissions'),
    path('acl/check-permission/', views.check_page_permission, name='check_page_permission'),
    # Workshop endpoints
    path('clientes/', views.clientes_list, name='clientes_list'),
    path('clientes/<int:pk>/', views.clientes_detail, name='clientes_detail'),
    path('veiculos/', views.veiculos_list, name='veiculos_list'),
    path('veiculos/<str:placa>/', views.veiculos_detail, name='veiculos_detail'),
    path('servicos/', views.servicos_list, name='servicos_list'),
    path('servicos/<int:pk>/', views.servicos_detail, name='servicos_detail'),
]
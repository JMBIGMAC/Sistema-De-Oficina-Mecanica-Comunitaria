from django.core.management.base import BaseCommand
from api.models import Role, Page, PagePermission


class Command(BaseCommand):
    help = 'Initialize ACL system with default roles, pages, and permissions'

    def handle(self, *args, **options):
        self.stdout.write('Initializing ACL system...')
        
        # Create roles
        roles_data = [
            {
                'name': 'client',
                'display_name': 'Cliente (Client)',
                'description': 'Basic client access with limited permissions'
            },
            {
                'name': 'owner',
                'display_name': 'Dono/Dona (Owner)',
                'description': 'Business owner with analytics and management access'
            },
            {
                'name': 'dev',
                'display_name': 'Desenvolvedor (Dev)',
                'description': 'Developer with full system access'
            },
        ]
        
        roles = {}
        for role_data in roles_data:
            role, created = Role.objects.get_or_create(
                name=role_data['name'],
                defaults={
                    'display_name': role_data['display_name'],
                    'description': role_data['description']
                }
            )
            roles[role_data['name']] = role
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created role: {role.display_name}'))
            else:
                self.stdout.write(f'Role already exists: {role.display_name}')
        
        # Define all pages according to requirements
        pages_data = [
            # Public pages
            {'path': '/', 'name': 'About', 'description': 'About/Institutional page'},
            
            # Client pages
            {'path': '/home', 'name': 'Home', 'description': 'Home page with content'},
            {'path': '/home/payment', 'name': 'Payment', 'description': 'Payment gateway'},
            {'path': '/profile', 'name': 'Profile', 'description': 'User profile view/edit'},
            {'path': '/contactUs', 'name': 'Contact Us', 'description': 'Contact support'},
            
            # Owner pages
            {'path': '/profile/all', 'name': 'All Profiles', 'description': 'Manage all user profiles'},
            {'path': '/analytics', 'name': 'Analytics', 'description': 'Analytics dashboard'},
            {'path': '/analytics/users', 'name': 'User Analytics', 'description': 'User control and analytics'},
            {'path': '/analytics/graphics', 'name': 'Graphics', 'description': 'Visual analytics and charts'},
            {'path': '/analytics/all-time', 'name': 'All Time View', 'description': 'Historical analytics data'},
            {'path': '/analytics/trends', 'name': 'Trends', 'description': 'Trend analysis'},
            {'path': '/usersProblems', 'name': 'User Problems', 'description': 'Troubleshooting and ticket management'},
            
            # Dev pages
            {'path': '/about/edit', 'name': 'Edit About', 'description': 'Edit about page'},
            {'path': '/home/payment/test', 'name': 'Payment Test', 'description': 'Test payment integration'},
            {'path': '/control/users', 'name': 'User Monitoring', 'description': 'Monitor user activity and behavior'},
            {'path': '/organization/roles', 'name': 'Role Management', 'description': 'Manage roles and permissions'},
            {'path': '/error/raw', 'name': 'Technical Errors', 'description': 'View technical error details'},
        ]
        
        pages = {}
        for page_data in pages_data:
            page, created = Page.objects.get_or_create(
                path=page_data['path'],
                defaults={
                    'name': page_data['name'],
                    'description': page_data['description']
                }
            )
            pages[page_data['path']] = page
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created page: {page.name}'))
            else:
                self.stdout.write(f'Page already exists: {page.name}')
        
        # Define permissions according to ACL matrix
        permissions_matrix = {
            'client': [
                # Client has access to basic pages
                {'path': '/', 'can_view': True, 'can_edit': False},
                {'path': '/home', 'can_view': True, 'can_edit': False},
                {'path': '/home/payment', 'can_view': True, 'can_edit': False},
                {'path': '/profile', 'can_view': True, 'can_edit': True},
                {'path': '/contactUs', 'can_view': True, 'can_edit': True},
            ],
            'owner': [
                # Owner has all client access plus additional pages
                {'path': '/', 'can_view': True, 'can_edit': False},
                {'path': '/home', 'can_view': True, 'can_edit': False},
                {'path': '/home/payment', 'can_view': True, 'can_edit': False},
                {'path': '/profile', 'can_view': True, 'can_edit': True},
                {'path': '/contactUs', 'can_view': True, 'can_edit': True},
                {'path': '/profile/all', 'can_view': True, 'can_edit': True},
                {'path': '/analytics', 'can_view': True, 'can_edit': False},
                {'path': '/analytics/users', 'can_view': True, 'can_edit': False},
                {'path': '/analytics/graphics', 'can_view': True, 'can_edit': False},
                {'path': '/analytics/all-time', 'can_view': True, 'can_edit': False},
                {'path': '/analytics/trends', 'can_view': True, 'can_edit': False},
                {'path': '/usersProblems', 'can_view': True, 'can_edit': True},
            ],
            'dev': [
                # Dev has access to everything (superuser)
                {'path': '/', 'can_view': True, 'can_edit': True},
                {'path': '/home', 'can_view': True, 'can_edit': True},
                {'path': '/home/payment', 'can_view': True, 'can_edit': True},
                {'path': '/profile', 'can_view': True, 'can_edit': True},
                {'path': '/contactUs', 'can_view': True, 'can_edit': True},
                {'path': '/profile/all', 'can_view': True, 'can_edit': True},
                {'path': '/analytics', 'can_view': True, 'can_edit': True},
                {'path': '/analytics/users', 'can_view': True, 'can_edit': True},
                {'path': '/analytics/graphics', 'can_view': True, 'can_edit': True},
                {'path': '/analytics/all-time', 'can_view': True, 'can_edit': True},
                {'path': '/analytics/trends', 'can_view': True, 'can_edit': True},
                {'path': '/usersProblems', 'can_view': True, 'can_edit': True},
                {'path': '/about/edit', 'can_view': True, 'can_edit': True},
                {'path': '/home/payment/test', 'can_view': True, 'can_edit': True},
                {'path': '/control/users', 'can_view': True, 'can_edit': True},
                {'path': '/organization/roles', 'can_view': True, 'can_edit': True},
                {'path': '/error/raw', 'can_view': True, 'can_edit': False},
            ]
        }
        
        # Create permissions
        for role_name, permissions in permissions_matrix.items():
            role = roles[role_name]
            for perm in permissions:
                page = pages[perm['path']]
                permission, created = PagePermission.objects.get_or_create(
                    role=role,
                    page=page,
                    defaults={
                        'can_view': perm['can_view'],
                        'can_edit': perm['can_edit']
                    }
                )
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Created permission: {role.name} -> {page.name}'
                        )
                    )
        
        self.stdout.write(self.style.SUCCESS('ACL system initialization complete!'))

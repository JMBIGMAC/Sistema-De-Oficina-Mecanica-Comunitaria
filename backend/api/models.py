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

# Mechanical Workshop Models

class Cliente(models.Model):
    """Customer/Client model for the mechanical workshop"""
    nome = models.CharField(max_length=200, verbose_name='Nome')
    cpf_cnpj = models.CharField(max_length=18, unique=True, verbose_name='CPF/CNPJ')
    telefone = models.CharField(max_length=20, verbose_name='Telefone')
    email = models.EmailField(verbose_name='E-mail')
    endereco = models.TextField(verbose_name='Endereço')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nome']
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"{self.nome} - {self.cpf_cnpj}"

class Veiculo(models.Model):
    """Vehicle model"""
    TIPO_COMBUSTIVEL_CHOICES = [
        ('gasolina', 'Gasolina'),
        ('alcool', 'Álcool'),
        ('flex', 'Flex'),
        ('diesel', 'Diesel'),
        ('eletrico', 'Elétrico'),
        ('hibrido', 'Híbrido'),
    ]
    
    placa = models.CharField(max_length=10, primary_key=True, verbose_name='Placa')
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name='veiculos', verbose_name='Cliente')
    marca = models.CharField(max_length=50, verbose_name='Marca')
    modelo = models.CharField(max_length=100, verbose_name='Modelo')
    ano = models.IntegerField(verbose_name='Ano')
    cor = models.CharField(max_length=30, verbose_name='Cor')
    quilometragem = models.IntegerField(verbose_name='Quilometragem')
    chassi = models.CharField(max_length=17, unique=True, verbose_name='Chassi')
    tipo_combustivel = models.CharField(max_length=10, choices=TIPO_COMBUSTIVEL_CHOICES, verbose_name='Tipo de Combustível')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['placa']
        verbose_name = 'Veículo'
        verbose_name_plural = 'Veículos'

    def __str__(self):
        return f"{self.placa} - {self.marca} {self.modelo}"

class Servico(models.Model):
    """Service catalog model"""
    descricao = models.CharField(max_length=200, verbose_name='Descrição')
    preco_padrao = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Preço Padrão')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['descricao']
        verbose_name = 'Serviço'
        verbose_name_plural = 'Serviços'

    def __str__(self):
        return f"{self.descricao} - R$ {self.preco_padrao}"

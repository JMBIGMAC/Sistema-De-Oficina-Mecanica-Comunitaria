# Generated manually for OrdemServico model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0003_cliente_servico_veiculo'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrdemServico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao_problema', models.TextField(blank=True, verbose_name='Descrição do Problema')),
                ('observacoes', models.TextField(blank=True, verbose_name='Observações')),
                ('preco_final', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Preço Final')),
                ('status', models.CharField(choices=[('pendente', 'Pendente'), ('aprovado', 'Aprovado'), ('em_andamento', 'Em Andamento'), ('concluido', 'Concluído'), ('cancelado', 'Cancelado')], default='pendente', max_length=20, verbose_name='Status')),
                ('status_pagamento', models.CharField(choices=[('pendente', 'Pendente'), ('parcial', 'Parcial'), ('pago', 'Pago')], default='pendente', max_length=20, verbose_name='Status do Pagamento')),
                ('data_solicitacao', models.DateTimeField(auto_now_add=True, verbose_name='Data de Solicitação')),
                ('data_aprovacao', models.DateTimeField(blank=True, null=True, verbose_name='Data de Aprovação')),
                ('data_conclusao', models.DateTimeField(blank=True, null=True, verbose_name='Data de Conclusão')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ordens_servico', to='api.cliente', verbose_name='Cliente')),
                ('mecanico_responsavel', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ordens_mecanico', to=settings.AUTH_USER_MODEL, verbose_name='Mecânico Responsável')),
                ('servico', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ordens_servico', to='api.servico', verbose_name='Serviço')),
                ('veiculo', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ordens_servico', to='api.veiculo', verbose_name='Veículo')),
            ],
            options={
                'verbose_name': 'Ordem de Serviço',
                'verbose_name_plural': 'Ordens de Serviço',
                'ordering': ['-data_solicitacao'],
            },
        ),
    ]

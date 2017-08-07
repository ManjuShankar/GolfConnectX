# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SmtpConfigurations',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email_host', models.CharField(max_length=100)),
                ('email_port', models.CharField(max_length=100)),
                ('email_host_user', models.CharField(max_length=100)),
                ('email_host_password', models.CharField(max_length=120)),
                ('is_secure', models.BooleanField(default=True)),
                ('secure_type', models.CharField(max_length=5, choices=[(b'TLS', b'TLS'), (b'SSL', b'SSL'), (b'None', b'None')])),
                ('default_from_mail', models.CharField(max_length=100)),
                ('created_by', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

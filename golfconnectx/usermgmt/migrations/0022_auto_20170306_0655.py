# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0021_remove_conversation_created_by'),
    ]

    operations = [
        migrations.CreateModel(
            name='PasswordReset',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('otp', models.CharField(unique=True, max_length=10)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(related_name='reset_requests', to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='passwordresetticket',
            name='user',
        ),
        migrations.DeleteModel(
            name='PasswordResetTicket',
        ),
    ]

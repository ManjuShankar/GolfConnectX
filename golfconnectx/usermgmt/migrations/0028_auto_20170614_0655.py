# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0027_auto_20170316_1645'),
    ]

    operations = [
        migrations.RenameField(
            model_name='invite',
            old_name='user',
            new_name='invited_by',
        ),
        migrations.RemoveField(
            model_name='invite',
            name='email_sent',
        ),
        migrations.RemoveField(
            model_name='invite',
            name='expiration',
        ),
        migrations.RemoveField(
            model_name='invite',
            name='user_level',
        ),
        migrations.AddField(
            model_name='invite',
            name='object_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='invite',
            name='object_name',
            field=models.CharField(max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='invite',
            name='object_type',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='invite',
            name='name',
            field=models.CharField(max_length=150),
        ),
    ]

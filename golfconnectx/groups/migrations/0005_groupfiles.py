# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import groups.models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0004_auto_20170103_0907'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupFiles',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256, null=True)),
                ('file', models.FileField(null=True, upload_to=groups.models.get_group_file_path, blank=True)),
            ],
        ),
    ]

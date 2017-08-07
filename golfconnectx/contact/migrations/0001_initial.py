# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('message', models.TextField()),
                ('phone', models.CharField(max_length=20, null=True)),
                ('email', models.EmailField(max_length=75, null=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import posts.models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_auto_20161219_0940'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostFiles',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256, null=True)),
                ('image', models.ImageField(null=True, upload_to=posts.models.get_post_image_path, blank=True)),
                ('file', models.FileField(null=True, upload_to=posts.models.get_post_image_path, blank=True)),
                ('file_type', models.CharField(default=b'I', max_length=10)),
            ],
        ),
        migrations.RemoveField(
            model_name='post',
            name='files',
        ),
        migrations.RemoveField(
            model_name='post',
            name='post_images',
        ),
    ]

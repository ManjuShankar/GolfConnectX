# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_auto_20161229_1321'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='files',
            field=models.ManyToManyField(related_name='post_files', to='posts.PostFiles', blank=True),
        ),
        migrations.AddField(
            model_name='post',
            name='images',
            field=models.ManyToManyField(related_name='post_images', to='posts.PostFiles', blank=True),
        ),
    ]

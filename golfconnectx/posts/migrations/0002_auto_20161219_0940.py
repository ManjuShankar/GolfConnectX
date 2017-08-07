# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='videos',
            old_name='url',
            new_name='video_url',
        ),
        migrations.AlterField(
            model_name='post',
            name='post_images',
            field=models.ManyToManyField(to='common.File', blank=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(to='common.BubbleTag', blank=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='videos',
            field=models.ManyToManyField(to='posts.Videos', blank=True),
        ),
    ]

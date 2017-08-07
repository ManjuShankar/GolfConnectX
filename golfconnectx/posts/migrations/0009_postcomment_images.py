# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0008_auto_20170613_0940'),
    ]

    operations = [
        migrations.AddField(
            model_name='postcomment',
            name='images',
            field=models.ManyToManyField(related_name='comment_images', to='posts.PostFiles', blank=True),
        ),
    ]

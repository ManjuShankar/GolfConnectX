# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0030_auto_20170614_1026'),
    ]

    operations = [
        migrations.AddField(
            model_name='golfuser',
            name='fb_id',
            field=models.CharField(max_length=b'20', null=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='notify_accept_invitation',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='notify_comment_discussion',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='notify_comment_post',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='notify_event_join',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='notify_invite_event',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='notify_like_post',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='notify_share_post',
            field=models.BooleanField(default=True),
        ),
    ]

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0003_remove_golfuser_resume_file'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfileSettings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_private', models.BooleanField(default=False)),
                ('notify_like_post', models.BooleanField(default=False)),
                ('notify_comment_post', models.BooleanField(default=False)),
                ('notify_share_post', models.BooleanField(default=False)),
                ('notify_comment_discussion', models.BooleanField(default=False)),
                ('notify_invite_event', models.BooleanField(default=False)),
                ('notify_accept_invitation', models.BooleanField(default=False)),
                ('notify_event_join', models.BooleanField(default=False)),
                ('email_invitation', models.BooleanField(default=False)),
                ('email_messages', models.BooleanField(default=False)),
                ('email_notifications', models.BooleanField(default=False)),
                ('email_email_updates', models.BooleanField(default=False)),
                ('email_group_updates', models.BooleanField(default=False)),
                ('email_site_messages', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddField(
            model_name='golfuser',
            name='phone',
            field=models.CharField(default=b'123', max_length=100),
        ),
    ]

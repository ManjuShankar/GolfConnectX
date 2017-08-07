# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import usermgmt.models


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0005_profilesettings_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserImage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256, null=True)),
                ('image', models.ImageField(null=True, upload_to=usermgmt.models.get_user_image_path, blank=True)),
            ],
        ),
        migrations.RenameField(
            model_name='golfuser',
            old_name='force_password_change',
            new_name='email_email_updates',
        ),
        migrations.RenameField(
            model_name='golfuser',
            old_name='is_first_login',
            new_name='email_group_updates',
        ),
        migrations.RenameField(
            model_name='golfuser',
            old_name='active',
            new_name='is_active',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='image',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='profile_images',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='total_spend_time',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='user_level',
        ),
        migrations.AddField(
            model_name='golfuser',
            name='email_invitation',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='email_messages',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='email_notifications',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='email_site_messages',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='golfer_type',
            field=models.CharField(default=b'PU', max_length=b'10'),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='handicap',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='is_private',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='notify_accept_invitation',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='notify_comment_discussion',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='notify_comment_post',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='notify_event_join',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='notify_invite_event',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='notify_like_post',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='notify_share_post',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='profile_type',
            field=models.CharField(default=b'PU', max_length=b'10'),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='skill_level',
            field=models.CharField(default=b'B', max_length=b'10'),
        ),
        migrations.AlterField(
            model_name='golfuser',
            name='cover_image',
            field=models.ForeignKey(related_name='user_cover_image', to='usermgmt.UserImage', null=True),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='profile_image',
            field=models.ForeignKey(related_name='user_profile_image', to='usermgmt.UserImage', null=True),
        ),
    ]

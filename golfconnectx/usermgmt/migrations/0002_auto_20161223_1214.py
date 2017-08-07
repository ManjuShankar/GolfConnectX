# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='golfuser',
            name='admin_categories',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='attempt_count',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='bubble_count',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='campus',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='comment_count',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='enable_email',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='enable_push',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='enable_sound',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='engagement',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='enrollment_status',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='external',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='ferpa',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='group_leader',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='hide_in_search',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='last_attempt',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='last_news_read',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='messaging_enabled',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='onboarded',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='post_count',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='rewards',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='score',
        ),
        migrations.RemoveField(
            model_name='golfuser',
            name='student',
        ),
    ]

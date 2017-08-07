# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0007_auto_20170123_0709'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseUserDetails',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_premium', models.BooleanField(default=False)),
                ('is_following', models.BooleanField(default=False)),
                ('is_favorite', models.BooleanField(default=False)),
                ('distance', models.FloatField(default=0.0)),
                ('latest_score', models.IntegerField(null=True)),
                ('top_score', models.IntegerField(null=True)),
                ('course', models.ForeignKey(to='courses.Courses')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

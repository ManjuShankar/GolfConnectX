# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0003_remove_courses_groups'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseScores',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('played_on', models.DateTimeField()),
                ('score', models.IntegerField(default=0)),
                ('course', models.ForeignKey(to='courses.Courses')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

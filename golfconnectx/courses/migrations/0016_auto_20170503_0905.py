# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import courses.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0015_auto_20170331_0744'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseImages',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256, null=True)),
                ('image', models.ImageField(null=True, upload_to=courses.models.get_course_image_path, blank=True)),
                ('uploaded_on', models.DateTimeField(auto_now=True)),
                ('width', models.IntegerField(default=0)),
                ('height', models.IntegerField(default=0)),
                ('uploaded_by', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='courses',
            name='images',
            field=models.ManyToManyField(to='courses.CourseImages'),
        ),
    ]

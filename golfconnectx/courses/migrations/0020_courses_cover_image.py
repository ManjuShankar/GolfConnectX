# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0019_courses_admin'),
    ]

    operations = [
        migrations.AddField(
            model_name='courses',
            name='cover_image',
            field=models.ForeignKey(related_name='course_cover_image', to='courses.CourseImages', null=True),
        ),
    ]

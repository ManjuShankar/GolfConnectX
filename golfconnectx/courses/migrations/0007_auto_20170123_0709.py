# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0006_auto_20170111_1150'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courses',
            name='category',
            field=models.ForeignKey(to='courses.CourseCategory', null=True),
        ),
    ]

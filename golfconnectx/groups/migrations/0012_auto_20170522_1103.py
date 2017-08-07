# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0011_auto_20170316_1645'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groups',
            name='course',
            field=models.ForeignKey(related_name='home_course', to='courses.Courses', null=True),
        ),
    ]

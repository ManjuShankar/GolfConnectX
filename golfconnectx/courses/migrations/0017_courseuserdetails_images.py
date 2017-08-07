# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0016_auto_20170503_0905'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseuserdetails',
            name='images',
            field=models.ManyToManyField(to='courses.CourseImages'),
        ),
    ]

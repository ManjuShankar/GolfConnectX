# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0017_courseuserdetails_images'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursescores',
            name='images',
            field=models.ManyToManyField(to='courses.CourseImages'),
        ),
    ]

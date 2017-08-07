# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0010_courseuserdetails_is_played'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseuserdetails',
            name='latest_score_date',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='courseuserdetails',
            name='notes',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='courseuserdetails',
            name='top_score_date',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='courseuserdetails',
            name='is_following_date',
            field=models.DateTimeField(null=True),
        ),
    ]

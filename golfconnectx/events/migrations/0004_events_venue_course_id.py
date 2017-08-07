# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_eventrequestinvitation_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='venue_course_id',
            field=models.IntegerField(null=True),
        ),
    ]

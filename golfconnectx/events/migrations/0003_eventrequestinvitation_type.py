# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_eventrequestinvitation_eventsaccess'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventrequestinvitation',
            name='type',
            field=models.CharField(default=b'M', max_length=10),
        ),
    ]

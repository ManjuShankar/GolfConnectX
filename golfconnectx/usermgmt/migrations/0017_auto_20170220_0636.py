# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0016_auto_20170220_0636'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='modified_on',
            field=models.DateTimeField(auto_now=True),
        ),
    ]

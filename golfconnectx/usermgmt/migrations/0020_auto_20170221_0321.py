# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0019_auto_20170220_0958'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='created_by',
            field=models.ForeignKey(related_name='conversation_created_by', to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='conversation',
            name='ctype',
            field=models.CharField(default=b'P', max_length=10, choices=[(b'P', b'Personal'), (b'G', b'Group')]),
        ),
    ]

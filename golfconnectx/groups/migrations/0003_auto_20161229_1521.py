# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0002_groupsaccess_groupsrequestinvitation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groups',
            name='cover_image',
            field=models.ForeignKey(related_name='group_cover_image', to='groups.GroupImages', null=True),
        ),
    ]

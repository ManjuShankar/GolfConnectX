# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('usermgmt', '0007_golfuser_images'),
    ]

    operations = [
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('requested_on', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(default=b'P', max_length=10)),
            ],
        ),
        migrations.RemoveField(
            model_name='adminusercomment',
            name='author',
        ),
        migrations.RemoveField(
            model_name='adminusercomment',
            name='user',
        ),
        migrations.RemoveField(
            model_name='adminusercommentlike',
            name='comment',
        ),
        migrations.RemoveField(
            model_name='adminusercommentlike',
            name='user',
        ),
        migrations.RemoveField(
            model_name='featureduser',
            name='group',
        ),
        migrations.RemoveField(
            model_name='featureduser',
            name='user',
        ),
        migrations.RemoveField(
            model_name='featuredusergroup',
            name='segment',
        ),
        migrations.RemoveField(
            model_name='profilesettings',
            name='user',
        ),
        migrations.DeleteModel(
            name='RegistrationRequest',
        ),
        migrations.RemoveField(
            model_name='roster',
            name='from_user',
        ),
        migrations.RemoveField(
            model_name='roster',
            name='to_user',
        ),
        migrations.RemoveField(
            model_name='socialuser',
            name='social_media',
        ),
        migrations.RemoveField(
            model_name='socialuser',
            name='user',
        ),
        migrations.RemoveField(
            model_name='usercategoryadmin',
            name='category',
        ),
        migrations.RemoveField(
            model_name='usercategoryadmin',
            name='user',
        ),
        migrations.RemoveField(
            model_name='userfield',
            name='user_role',
        ),
        migrations.RemoveField(
            model_name='userfielddata',
            name='field',
        ),
        migrations.RemoveField(
            model_name='userfielddata',
            name='user',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='user',
        ),
        migrations.RemoveField(
            model_name='invite',
            name='student',
        ),
        migrations.AddField(
            model_name='golfuser',
            name='created_on',
            field=models.DateTimeField(default=datetime.datetime(2016, 12, 29, 11, 47, 4, 962649)),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='modified_on',
            field=models.DateTimeField(default=datetime.datetime(2016, 12, 29, 11, 47, 4, 962683)),
        ),
        migrations.DeleteModel(
            name='AdminUserComment',
        ),
        migrations.DeleteModel(
            name='AdminUserCommentLike',
        ),
        migrations.DeleteModel(
            name='FeaturedUser',
        ),
        migrations.DeleteModel(
            name='FeaturedUserGroup',
        ),
        migrations.DeleteModel(
            name='ProfileSettings',
        ),
        migrations.DeleteModel(
            name='Roster',
        ),
        migrations.DeleteModel(
            name='SocialUser',
        ),
        migrations.DeleteModel(
            name='UserCategoryAdmin',
        ),
        migrations.DeleteModel(
            name='UserField',
        ),
        migrations.DeleteModel(
            name='UserFieldData',
        ),
        migrations.DeleteModel(
            name='UserProfile',
        ),
        migrations.AddField(
            model_name='friendrequest',
            name='from_user',
            field=models.ForeignKey(related_name='from_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='friendrequest',
            name='to_user',
            field=models.ForeignKey(related_name='to_user', to=settings.AUTH_USER_MODEL),
        ),
    ]

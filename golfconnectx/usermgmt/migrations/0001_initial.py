# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('common', '__first__'),
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='GolfUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150, null=True)),
                ('email', models.EmailField(unique=True, max_length=254)),
                ('user_level', models.CharField(default=0, max_length=b'10')),
                ('student', models.BooleanField(default=True)),
                ('ferpa', models.BooleanField(default=False)),
                ('active', models.BooleanField(default=True)),
                ('attempt_count', models.IntegerField(default=0)),
                ('last_attempt', models.DateTimeField(null=True)),
                ('onboarded', models.BooleanField(default=False)),
                ('enrollment_status', models.IntegerField(default=1, null=True)),
                ('enable_email', models.BooleanField(default=True)),
                ('enable_push', models.BooleanField(default=True)),
                ('enable_sound', models.BooleanField(default=True)),
                ('last_news_read', models.DateField(null=True)),
                ('force_password_change', models.BooleanField(default=False)),
                ('is_first_login', models.BooleanField(default=False)),
                ('messaging_enabled', models.BooleanField(default=False)),
                ('hide_in_search', models.BooleanField(default=False)),
                ('external', models.BooleanField(default=False)),
                ('group_leader', models.BooleanField(default=False)),
                ('score', models.IntegerField(default=0)),
                ('engagement', models.IntegerField(default=0)),
                ('rewards', models.IntegerField(default=0)),
                ('post_count', models.IntegerField(default=0)),
                ('bubble_count', models.IntegerField(default=0)),
                ('comment_count', models.IntegerField(default=0)),
                ('total_spend_time', models.IntegerField(default=0)),
                ('is_staff', models.BooleanField(default=False)),
                ('admin_categories', models.ManyToManyField(to='common.BubbleCategory')),
                ('campus', models.ForeignKey(related_name='campus_user', to='common.Campus', null=b'True')),
                ('cover_image', models.ForeignKey(related_name='user_cover_image', to='common.File', null=True)),
                ('groups', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Group', blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', verbose_name='groups')),
                ('image', models.ForeignKey(related_name='user_image', to='common.File', null=True)),
                ('profile_images', models.ManyToManyField(to='common.File')),
                ('resume_file', models.ForeignKey(related_name='user_resume', to='common.File', null=True)),
                ('tags', models.ManyToManyField(to='common.BubbleTag')),
                ('user_permissions', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Permission', blank=True, help_text='Specific permissions for this user.', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AdminUserComment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('body', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(related_name='admin_user_comment_author', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(related_name='admin_user_comment_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AdminUserCommentLike',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('comment', models.ForeignKey(to='usermgmt.AdminUserComment')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FeaturedUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='FeaturedUserGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128)),
                ('post_highlight_enabled', models.BooleanField(default=True)),
                ('directory_search_enabled', models.BooleanField(default=True)),
                ('user_count', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Invite',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(unique=True, max_length=20)),
                ('name', models.CharField(unique=True, max_length=150)),
                ('email', models.EmailField(max_length=254, null=True)),
                ('user_level', models.CharField(default=1, unique=True, max_length=150)),
                ('student', models.BooleanField(default=True)),
                ('accepted', models.BooleanField(default=False)),
                ('email_sent', models.BooleanField(default=False)),
                ('expiration', models.DateField(auto_now_add=True)),
                ('user', models.ForeignKey(related_name='InviteUser', to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PasswordResetTicket',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email_sent', models.BooleanField(default=False)),
                ('expiration', models.DateField()),
                ('closed', models.BooleanField(default=False)),
                ('user', models.ForeignKey(related_name='reset_requests', to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='RegistrationRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(unique=True, max_length=20)),
                ('accepted', models.BooleanField(default=False)),
                ('email_sent', models.BooleanField(default=False)),
                ('expiration', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Roster',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(default=0)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('expiration', models.DateField()),
                ('from_user', models.ForeignKey(related_name='from_roster', to=settings.AUTH_USER_MODEL, null=True)),
                ('to_user', models.ForeignKey(related_name='to_roster', to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SocialUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('social_url', models.CharField(max_length=1024)),
                ('social_media', models.ForeignKey(to='common.SocialMedia')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserCategoryAdmin',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('access_announcement', models.BooleanField(default=True)),
                ('access_analytic', models.BooleanField(default=True)),
                ('access_report', models.BooleanField(default=True)),
                ('access_database', models.BooleanField(default=True)),
                ('access_application', models.BooleanField(default=True)),
                ('access_event', models.BooleanField(default=True)),
                ('access_flag', models.BooleanField(default=True)),
                ('category', models.ForeignKey(related_name='bubblecategory', to='common.BubbleCategory')),
                ('user', models.ForeignKey(related_name='CategoryUser', to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('position', models.IntegerField(default=0)),
                ('name', models.CharField(max_length=64)),
                ('field_type', models.IntegerField(default=0)),
                ('required', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='UserFieldData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.TextField()),
                ('field', models.ForeignKey(to='usermgmt.UserField')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=64)),
                ('rules', models.TextField()),
                ('users', models.IntegerField(default=0, null=True)),
                ('created', models.DateField(auto_now_add=True)),
                ('is_editable', models.BooleanField(default=True)),
                ('category', models.ForeignKey(to='common.BubbleCategory')),
            ],
        ),
        migrations.CreateModel(
            name='UserLog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateField(auto_now=True)),
                ('success', models.BooleanField(default=False)),
                ('user', models.ForeignKey(related_name='logs', to=settings.AUTH_USER_MODEL, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('skill_level', models.CharField(default=b'B', max_length=b'10')),
                ('profile_type', models.CharField(default=b'PU', max_length=b'10')),
                ('handicap', models.IntegerField(default=0)),
                ('golfer_type', models.CharField(default=b'PU', max_length=b'10')),
                ('user', models.ForeignKey(related_name='profileuser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=150)),
                ('is_student', models.BooleanField(default=False)),
                ('resume_enabled', models.BooleanField(default=True)),
            ],
        ),
        migrations.AddField(
            model_name='userfield',
            name='user_role',
            field=models.ForeignKey(related_name='user_fields', to='usermgmt.UserRole', null=True),
        ),
        migrations.AddField(
            model_name='featuredusergroup',
            name='segment',
            field=models.ForeignKey(related_name='featured_user_groups', to='usermgmt.UserGroup'),
        ),
        migrations.AddField(
            model_name='featureduser',
            name='group',
            field=models.ForeignKey(to='usermgmt.FeaturedUserGroup'),
        ),
        migrations.AddField(
            model_name='featureduser',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='golfuser',
            name='user_role',
            field=models.ForeignKey(related_name='user_role', to='usermgmt.UserRole', null=True),
        ),
    ]

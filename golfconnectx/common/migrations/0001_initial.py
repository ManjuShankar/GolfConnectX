# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BubbleCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=150)),
                ('verified', models.BooleanField(default=False)),
                ('color', models.CharField(default=b'orange', max_length=20)),
                ('membership', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='BubbleTag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=64)),
                ('bubble_count', models.IntegerField(default=0)),
                ('post_count', models.IntegerField(default=0)),
                ('view_count', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Campus',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=150)),
                ('google_key', models.CharField(max_length=150, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mode', models.IntegerField(default=0)),
                ('url', models.CharField(max_length=512)),
                ('name', models.CharField(max_length=256)),
                ('type', models.CharField(max_length=128)),
                ('size', models.IntegerField()),
                ('server', models.CharField(max_length=32)),
                ('uploaded', models.DateField(auto_now_add=True)),
                ('present', models.BooleanField(default=True)),
                ('aws_key', models.CharField(max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name='Settings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('invite_expiration', models.IntegerField(default=1)),
                ('invite_enabled', models.BooleanField(default=True)),
                ('password_expiration', models.IntegerField(default=1)),
                ('registration_enabled', models.BooleanField(default=True)),
                ('email_mask', models.CharField(max_length=500)),
                ('email_mask_text', models.CharField(max_length=500)),
                ('delete_orphoned_text', models.IntegerField(default=1)),
                ('is_deployed', models.BooleanField(default=False)),
                ('is_public_deployment', models.BooleanField(default=False)),
                ('brand_name', models.CharField(max_length=70)),
                ('school_name', models.CharField(max_length=70)),
                ('app_title', models.CharField(max_length=70)),
                ('app_description', models.CharField(max_length=160)),
                ('img_url', models.CharField(max_length=255, null=True)),
                ('bubble_notification', models.IntegerField(default=1)),
                ('timezone', models.CharField(max_length=100, null=True)),
                ('update_feed_url', models.CharField(max_length=255, null=True)),
                ('landing_header', models.CharField(max_length=250, null=True)),
                ('landing_subtitle', models.CharField(max_length=250, null=True)),
                ('onboard_usga', models.BooleanField(default=False)),
                ('onboard_disclaimer', models.CharField(max_length=500, null=True)),
                ('login_page_message', models.CharField(max_length=500, null=True)),
                ('login_page_link', models.CharField(max_length=255, null=True)),
                ('disable_secret_bubbles', models.BooleanField(default=False)),
                ('login_input_text', models.CharField(max_length=250, null=True)),
                ('login_instruction', models.TextField(null=True)),
                ('enable_rewards', models.BooleanField(default=False)),
                ('checkin_reward_points', models.IntegerField(default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SocialMedia',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128)),
                ('is_enabled', models.BooleanField(default=True)),
            ],
        ),
    ]

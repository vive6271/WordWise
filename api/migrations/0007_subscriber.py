# Generated by Django 5.0.4 on 2024-04-17 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_supportform'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subscriber',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
            ],
        ),
    ]

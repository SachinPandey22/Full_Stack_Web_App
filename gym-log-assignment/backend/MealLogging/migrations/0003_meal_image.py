from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MealLogging', '0002_waterintake'),
    ]

    operations = [
        migrations.AddField(
            model_name='meal',
            name='image',
            field=models.ImageField(upload_to='meal_images/', blank=True, null=True),
        ),
    ]

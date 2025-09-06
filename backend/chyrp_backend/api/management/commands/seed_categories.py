from django.core.management.base import BaseCommand
from api.models import Category

class Command(BaseCommand):
    help = 'Seed initial categories'

    def handle(self, *args, **kwargs):
        default_categories = [
            'Technology',
            'Health',
            'Education',
            'Finance',
            'Travel',
            'Lifestyle'
        ]

        for name in default_categories:
            obj, created = Category.objects.get_or_create(name=name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Category already exists: {name}'))

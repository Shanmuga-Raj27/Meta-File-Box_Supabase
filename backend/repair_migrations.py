import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def repair():
    with connection.cursor() as cursor:
        print("Cleaning up django_migrations table...")
        cursor.execute("DELETE FROM django_migrations WHERE app IN ('admin', 'auth', 'contenttypes', 'sessions', 'users', 'files');")
        print("Done. You can now run 'python manage.py migrate --fake-initial'")

if __name__ == '__main__':
    repair()

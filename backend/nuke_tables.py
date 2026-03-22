import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def nuke_core_tables():
    with connection.cursor() as cursor:
        print("Dropping core Django tables...")
        # Order matters due to foreign keys
        tables = [
            'django_admin_log',
            'auth_permission',
            'auth_group_permissions',
            'auth_group',
            'django_content_type',
            'django_migrations',
            'django_session',
            'users_user_groups',
            'users_user_user_permissions',
            'users_user',
            'files_file'
        ]
        for table in tables:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
                print(f"Dropped {table}")
            except Exception as e:
                print(f"Failed to drop {table}: {e}")
        print("Done. You can now run 'python manage.py migrate'")

if __name__ == '__main__':
    nuke_core_tables()

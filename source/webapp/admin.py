from django.contrib import admin

from webapp.models import File, PrivateAccess

admin.site.register(File)
admin.site.register(PrivateAccess)

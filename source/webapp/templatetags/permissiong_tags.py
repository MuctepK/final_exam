from django import template

from webapp.models import FILE_COMMON_CHOICE

register = template.Library()


@register.filter
def can_delete(user,file):
    return user.has_perm('webapp.delete_file') or file.author == user


@register.filter
def can_edit(user, file):
    return user.has_perm('webapp.change_file') or file.author == user


@register.filter
def check_access(file, user):
    if  file.type == FILE_COMMON_CHOICE:
        return True
    else:
        return file.author == user or user.has_perm('webapp.view_file')


from django import template

register = template.Library()


@register.filter
def can_delete(user,product):
    return user.has_perm('webapp.delete_file') or product.author == user


@register.filter
def can_edit(user, product):
    return user.has_perm('webapp.change_file') or product.author == user

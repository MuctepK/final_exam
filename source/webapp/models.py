from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User


def get_accessable_files(self):
    return File.objects.filter(accessed_to__user=self).order_by('-created_at')


def has_access(self, file):
    try:
        PrivateAccess.objects.get(user=self, file=file)
        return True
    except ObjectDoesNotExist:
        return False


User.add_to_class('get_accessable_files', get_accessable_files)
User.add_to_class('has_access', has_access)


FILE_ACCESS_CHOICES = [
    ('common', 'Общий'),
    ('hidden', 'Скрытый'),
    ('private', 'Приватный')
]

FILE_COMMON_CHOICE = FILE_ACCESS_CHOICES[0][0]
FILE_HIDDEN_CHOICE = FILE_ACCESS_CHOICES[1][0]
FILE_PRIVATE_CHOICE = FILE_ACCESS_CHOICES[2][0]


class File(models.Model):
    name = models.CharField(verbose_name='Название файла', max_length=128)
    author = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')
    file = models.FileField(verbose_name='Файл', upload_to='files')
    type = models.CharField(verbose_name='Доступ', max_length=128, choices=FILE_ACCESS_CHOICES,
                            default=FILE_COMMON_CHOICE)

    def get_users_have_access(self):
        return User.objects.filter(accessed_files__file=self)

    def __str__(self):
        return self.name


class PrivateAccess(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, verbose_name='Доступ к пользователю',
                                related_name='accessed_files')
    file = models.ForeignKey(File, on_delete=models.CASCADE, verbose_name='Доступ к файлу',
                                related_name='accessed_to')

    def __str__(self):
        return "Доступ {} к файлу {}".format(self.user, self.file)



from django.db import models

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

    def __str__(self):
        return self.name

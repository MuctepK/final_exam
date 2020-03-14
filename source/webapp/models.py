from django.db import models


class File(models.Model):
    name = models.CharField(verbose_name='Название файла', max_length=128)
    author = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')
    file = models.FileField(verbose_name='Файл', upload_to='files')

    def __str__(self):
        return self.name

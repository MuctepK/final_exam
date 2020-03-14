from django import forms

from webapp.models import File


class FileForm(forms.ModelForm):
    class Meta:
        model = File
        exclude = ['author']


class SimpleSearchForm(forms.Form):
    name = forms.CharField(max_length=128, required=False, label='Название файла')
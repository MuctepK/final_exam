from django.shortcuts import render
from django.views.generic import ListView

from webapp.models import File


class IndexView(ListView):
    model = File
    template_name = 'index.html'
    context_object_name = 'files'
    paginate_by = 10

    def get_queryset(self):
        return File.objects.all().order_by('-created_at')

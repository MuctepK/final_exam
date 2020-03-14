from django.urls import reverse, reverse_lazy
from django.utils.http import urlencode
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView

from webapp.forms import FileForm, SimpleSearchForm
from webapp.models import File


class IndexView(ListView):
    model = File
    template_name = 'index.html'
    context_object_name = 'files'
    paginate_by = 10

    def get_queryset(self):
        return File.objects.all().order_by('-created_at')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data()
        context['search_form'] = SimpleSearchForm()
        return context


class FileDetailView(DetailView):
    template_name = 'file_detail.html'
    model = File
    context_object_name = 'file'


class FileCreateView(CreateView):
    template_name = 'file_create.html'
    model = File
    form_class = FileForm

    def form_valid(self, form):
        if self.request.user.is_authenticated:
            form.instance.author = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("webapp:detail_file", kwargs={"pk": self.object.pk})


class FileUpdateView(UpdateView):
    template_name = 'file_update.html'
    model = File
    form_class = FileForm

    def get_success_url(self):
        return reverse("webapp:detail_file", kwargs={"pk": self.object.pk})


class FileDeleteView(DeleteView):
    template_name = 'file_delete.html'
    model = File
    success_url = reverse_lazy('webapp:index')


class FileSearchView(ListView):
    model = File
    template_name = 'search.html'
    context_object_name = 'files'
    paginate_by = 10

    def get_context_data(self, *, object_list=None, **kwargs):
        form = SimpleSearchForm(data=self.request.GET)
        query = self.get_query_string()
        return super().get_context_data(
            search_form=form, query=query, object_list=object_list, **kwargs
        )

    def get_queryset(self):
        queryset = super().get_queryset()
        form = SimpleSearchForm(self.request.GET)
        if form.is_valid():
            queryset = queryset.filter(name__icontains=form.cleaned_data['name']).order_by('-created_at')
        return queryset

    def get_query_string(self):
        data = {}
        for key in self.request.GET:
            if key != 'page':
                data[key] = self.request.GET.get(key)
        return urlencode(data)

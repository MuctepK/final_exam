from django.contrib.auth.models import User
from django.views.generic import ListView

from webapp.models import File


class ProfileView(ListView):
    model = File
    template_name = 'profile/profile.html'
    context_object_name = 'files'
    paginate_by = 10

    def get_queryset(self):
        return File.objects.filter(author=self.get_user()).order_by('-created_at')

    def get_user(self):
        return User.objects.get(pk=self.kwargs.get('pk'))

    def get_context_data(self, *, object_list=None, **kwargs):
        user = self.get_user()
        return super().get_context_data(
            user=user, object_list=object_list, **kwargs
        )

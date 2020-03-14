from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views import View

from webapp.models import File, PrivateAccess


class GrantAccessView(PermissionRequiredMixin, View):
    permission_required = 'webapp.change_file'

    def has_permission(self):
        return super().has_permission() or self.get_object().author == self.request.user

    def get_object(self):
        print(self.kwargs.get('pk'))
        return File.objects.get(pk=self.kwargs.get('pk'))

    def post(self, request, *args, **kwargs):
        username = request.POST.get('name')
        file = self.get_object()
        try:
            user = User.objects.get(username=username)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Does Not Exist'}, status=404)
        try:
            PrivateAccess.objects.get(user=user, file=file)
            return JsonResponse({'error': "Grant Exists"}, status=404)
        except ObjectDoesNotExist:
            PrivateAccess.objects.create(user=user, file=file)
            return JsonResponse({'username': user.username, 'id': user.pk})


class DeleteAccessView(PermissionRequiredMixin, View):
    permission_required = 'webapp.change_file'

    def has_permission(self):
        return super().has_permission() or self.get_object().author == self.request.user

    def get_object(self):
        print(self.kwargs.get('pk'))
        return File.objects.get(pk=self.kwargs.get('pk'))

    def post(self, request, *args, **kwargs):
        print(request.POST)
        user = User.objects.get(pk=request.POST.get('userId'))

        file = self.get_object()
        try:
            PrivateAccess.objects.get(user=user, file=file).delete()
            return JsonResponse({'message': 'ok',})
        except Exception as e:
            return JsonResponse({'message': "Не удалось удалить пользователя"}, status=404)


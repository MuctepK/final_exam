from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views import View

from webapp.models import File, PrivateAccess


class GrantAccessView(PermissionRequiredMixin, View):
    permission_required = 'webapp.change_file'

    def post(self, request, *args, **kwargs):
        username = request.POST.get('name')
        file = File.objects.get(pk =request.POST.get('id'))
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



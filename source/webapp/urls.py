from django.urls import path

from webapp.views import IndexView, FileDetailView

urlpatterns = [
   path('', IndexView.as_view(), name='index'),
   path('<int:pk>/file', FileDetailView.as_view(), name='detail_file')
]

app_name = 'webapp'

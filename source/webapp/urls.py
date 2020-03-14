from django.urls import path

from webapp.views import IndexView, FileDetailView, FileCreateView, FileUpdateView, FileDeleteView, FileSearchView

urlpatterns = [
   path('', IndexView.as_view(), name='index'),
   path('<int:pk>/file/', FileDetailView.as_view(), name='detail_file'),
   path('create/', FileCreateView.as_view(), name='create_file'),
   path('<int:pk>/update_file/', FileUpdateView.as_view(), name='change_file'),
   path('<int:pk>', FileDeleteView.as_view(), name='delete_file'),
   path('search/', FileSearchView.as_view(), name='search')
]

app_name = 'webapp'

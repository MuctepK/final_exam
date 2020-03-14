from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from webapp.views import IndexView, FileDetailView, FileCreateView, FileUpdateView, FileDeleteView, FileSearchView, \
   ProfileView, GrantAccessView, AccessableView

urlpatterns = [
   path('', IndexView.as_view(), name='index'),
   path('<int:pk>/file/', FileDetailView.as_view(), name='detail_file'),
   path('create/', FileCreateView.as_view(), name='create_file'),
   path('<int:pk>/update_file/', FileUpdateView.as_view(), name='change_file'),
   path('<int:pk>', FileDeleteView.as_view(), name='delete_file'),
   path('search/', FileSearchView.as_view(), name='search'),
   path('login/', LoginView.as_view(), name='login'),
   path('logout/', LogoutView.as_view(), name='logout'),
   path('<int:pk>/profile/', ProfileView.as_view(), name='profile'),
   path('<int:pk>/accessable/', AccessableView.as_view(), name='accessable'),
   path('grant_access/', GrantAccessView.as_view(), name='grant_access')
]

app_name = 'webapp'

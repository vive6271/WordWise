from django.views.generic import TemplateView
from django.urls import re_path

urlpatterns = [
    # Catch-all pattern to serve your React app for any other route
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]
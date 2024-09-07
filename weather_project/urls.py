from django.urls import path
from .views import index,  WeatherAPIView

urlpatterns = [
    path('', index, name='index'),
    path('api/weather/', WeatherAPIView.as_view(), name='weather-api'),
]
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .serializers import WeatherSerializer
from datetime import datetime

def index(request):
    return render(request, 'weather/index.html')

class WeatherAPIView(APIView):
    def get(self, request, format=None):
        api_key = '7e3d537e497ca75e7caafef828c47443'
        city = request.GET.get('city', 'Moscow')

        weather_url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'
        wiki_url = f'https://ru.wikipedia.org/api/rest_v1/page/summary/{city}?redirect=true'

        try:
            weather_response = requests.get(weather_url, timeout=10)
            wiki_response = requests.get(wiki_url, timeout=10)

            if weather_response.status_code == 200 and wiki_response.status_code == 200:
                try:
                    weather_data = weather_response.json()
                    wiki_data = wiki_response.json()
                except ValueError:
                    return Response({'error': 'Ошибка при разборе ответа от сервера'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                forecast_list = []
                for forecast in weather_data.get('list', [])[:5]:
                    dt_str = forecast.get('dt_txt')
                    dt_obj = datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
                    days_of_week = {
                        'Monday': 'Понедельник',
                        'Tuesday': 'Вторник',
                        'Wednesday': 'Среда',
                        'Thursday': 'Четверг',
                        'Friday': 'Пятница',
                        'Saturday': 'Суббота',
                        'Sunday': 'Воскресенье'
                    }
                    day_of_week_ru = days_of_week.get(dt_obj.strftime('%A'), 'Неизвестный день')
                    final_dt = f'{day_of_week_ru}, {dt_obj.strftime("%d.%m %H:%M")}'

                    forecast_data = {
                        'datetime': final_dt,
                        'temperature': forecast.get('main', {}).get('temp'),
                        'description': forecast.get('weather', [{}])[0].get('description'),
                        'icon': forecast.get('weather', [{}])[0].get('icon'),
                        'wind_speed': forecast.get('wind', {}).get('speed')
                    }
                    forecast_list.append(forecast_data)

                response_data = {
                    'city': weather_data.get('city', {}).get('name'),
                    'latitude': weather_data.get('city', {}).get('coord', {}).get('lat'),
                    'longitude': weather_data.get('city', {}).get('coord', {}).get('lon'),
                    'forecasts': forecast_list,
                    'wiki_summary': wiki_data.get('extract', 'Информация недоступна'),
                }

                serializer = WeatherSerializer(data=response_data)
                if serializer.is_valid():
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Город не найден или информация отсутствует'}, status=status.HTTP_404_NOT_FOUND)

        except requests.exceptions.Timeout:
            return Response({'error': 'Превышено время ожидания запроса'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
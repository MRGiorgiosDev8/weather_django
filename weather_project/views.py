import requests
from django.shortcuts import render
from django.http import JsonResponse
from datetime import datetime

def index(request):
    return render(request, 'weather/index.html')

def get_weather(request):
    api_key = '7e3d537e497ca75e7caafef828c47443'
    city = request.GET.get('city', 'Moscow')

    weather_url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'
    wiki_url = f'https://ru.wikipedia.org/api/rest_v1/page/summary/{city}'

    try:
        weather_response = requests.get(weather_url)
        weather_data = weather_response.json()

        wiki_response = requests.get(wiki_url)
        wiki_data = wiki_response.json()

        if weather_response.status_code == 200 and 'title' in wiki_data:
            forecast_list = []
            for forecast in weather_data.get('list', [])[:5]:
                dt_str = forecast.get('dt_txt')
                dt_obj = datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')

                formatted_dt = dt_obj.strftime('%A, %d.%m.%Y %H:%M')

                days_of_week = {
                    'Monday': 'Понедельник',
                    'Tuesday': 'Вторник',
                    'Wednesday': 'Среда',
                    'Thursday': 'Четверг',
                    'Friday': 'Пятница',
                    'Saturday': 'Суббота',
                    'Sunday': 'Воскресенье'
                }
                day_of_week_ru = days_of_week[dt_obj.strftime('%A')]
                final_dt = f'{day_of_week_ru}, {dt_obj.strftime("%d.%m.%Y %H:%M")}'

                forecast_data = {
                    'datetime': final_dt,
                    'temperature': forecast.get('main', {}).get('temp'),
                    'description': forecast.get('weather', [{}])[0].get('description'),
                    'icon': forecast.get('weather', [{}])[0].get('icon'),
                    'wind_speed': forecast.get('wind', {}).get('speed')
                }
                forecast_list.append(forecast_data)

            return JsonResponse({
                'city': weather_data.get('city', {}).get('name'),
                'latitude': weather_data.get('city', {}).get('coord', {}).get('lat'),
                'longitude': weather_data.get('city', {}).get('coord', {}).get('lon'),
                'forecasts': forecast_list,
                'wiki_summary': wiki_data.get('extract', 'Информация недоступна'),
            })
        else:
            return JsonResponse({'error': 'Город не найден или информация отсутствует'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
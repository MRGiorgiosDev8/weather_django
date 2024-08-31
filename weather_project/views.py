import requests
from django.shortcuts import render
from django.http import JsonResponse

def index(request):
    return render(request, 'weather/index.html')

def get_weather(request):
    api_key = '7e3d537e497ca75e7caafef828c47443'
    city = request.GET.get('city', 'Moscow')
    url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'

    try:
        response = requests.get(url)
        data = response.json()
        if response.status_code == 200:
            forecast_list = []
            for forecast in data.get('list', [])[:5]:
                forecast_data = {
                    'datetime': forecast.get('dt_txt'),
                    'temperature': forecast.get('main', {}).get('temp'),
                    'description': forecast.get('weather', [{}])[0].get('description'),
                    'icon': forecast.get('weather', [{}])[0].get('icon'),
                }
                forecast_list.append(forecast_data)

            return JsonResponse({
                'city': data.get('city', {}).get('name'),
                'latitude': data.get('city', {}).get('coord', {}).get('lat'),
                'longitude': data.get('city', {}).get('coord', {}).get('lon'),
                'forecasts': forecast_list
            })
        else:
            return JsonResponse({'error': 'Город не найден'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
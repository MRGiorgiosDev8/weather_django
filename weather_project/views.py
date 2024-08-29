import requests
from django.shortcuts import render
from django.http import JsonResponse

def index(request):
    return render(request, 'weather/index.html')

def get_weather(request):
    api_key = '7e3d537e497ca75e7caafef828c47443'
    city = request.GET.get('city', 'Moscow')
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'

    try:
        response = requests.get(url)
        data = response.json()
        if response.status_code == 200:
            weather_data = {
                'city': data.get('name'),
                'temperature': data.get('main', {}).get('temp'),
                'description': data.get('weather', [{}])[0].get('description'),
                'icon': data.get('weather', [{}])[0].get('icon'),
            }
            return JsonResponse(weather_data)
        else:
            return JsonResponse({'error': 'Город не найден'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
# WeatherSphereApp

WeatherSphereApp — это веб-приложение, которое предоставляет информацию о погоде в любом городе мира с помощью API OpenWeather и дополнительные сведения о городе через API Wikipedia. Приложение создано на основе Django и Django Rest Framework (DRF) на серверной части, а также JavaScript для динамического обновления интерфейса и взаимодействия с API OpenWeather и Wikipedia. Для анимации интерфейса используется GSAP.

## Функциональные возможности

1. **Поиск города**: Пользователи могут искать города по всему миру и получать текущие погодные данные.
2. **Прогноз погоды**: Прогноз погоды с разбивкой по времени.
3. **Информация о городе**: Дополнительная информация о городе предоставляется с помощью API Wikipedia.
4. **Отображение на карте**: Карта с прогнозом погоды интегрирована с помощью библиотеки Leaflet и API OpenWeather.
5. **Кеширование данных**: Результаты поиска городов и погодные данные кешируются с использованием `localStorage` для уменьшения количества API-запросов.

## Стек технологий

- **Backend**: Django с использованием Django Rest Framework (DRF) для создания API, Pillow для работы с изображениями.
- **Frontend**: JavaScript, GSAP для анимации, библиотека Leaflet для отображения карты, Bootstrap для стилизации и создания адаптивного дизайна, обеспечивающего корректное отображение на всех устройствах.
- **API**:
  - [OpenWeather API](https://openweathermap.org/) для получения данных о погоде.
  - [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page) для информации о городах.

## Использование проекта

Пользователь может воспользоваться одним из двух способов для получения данных о погоде:

1. **Поиск по названию города**: 
   - Введите название города на английском языке в текстовом поле формы.
   - Нажмите кнопку поиска, чтобы получить данные о погоде и информацию о городе.

2. **Выбор из списка городов**:
   - Перейдите в навигационное меню и выберите пункт "Список Городов".
   - Выберите нужный город из выпадающего списка, чтобы получить информацию о погоде и городе.

## OpenWeather API

OpenWeather — это популярный и надежный сервис, предоставляющий данные о погоде в режиме реального времени для городов по всему миру. 

Приложение использует бесплатный API-ключ OpenWeather, который позволяет выполнять до 60 запросов в минуту. Это ограничение подходит для большинства пользователей, но в случае увеличенной нагрузки можно обновить ключ до платного тарифа для большего числа запросов и возможностей.

### Добавление API-ключа OpenWeather

Чтобы добавить ваш API-ключ OpenWeather в проект WeatherSphereApp, внесите его в код. Ниже приведен пример, как это сделать в файле `views.py`:

### Пример кода

```python
class WeatherView(APIView):
    def get(self, request, format=None):
        # Замените  api_key = '7e3d537e497ca75e7caafef828c47443'на ваш API-ключ OpenWeather
        api_key = '7e3d537e497ca75e7caafef828c47443'
        city = request.GET.get('city', 'Moscow')
```

[Получите ваш API-ключ на OpenWeather](https://openweathermap.org/)


## Кеширование данных

Кеширование данных позволяет уменьшить количество запросов к API, сохраняя уже полученные данные на стороне клиента. В данном проекте результаты поиска городов и погодные данные кешируются с использованием `localStorage`. Это позволяет быстро получать данные без необходимости повторного запроса к API, если данные уже были получены недавно.

### Преимущества кеширования

- **Снижение нагрузки на сервер**: Уменьшается количество API-запросов, что может снизить затраты на использование API, особенно при использовании бесплатных тарифов.
- **Увеличение скорости работы приложения**: Пользователи получают данные быстрее, так как информация может быть загружена из локального хранилища, а не ожидать ответа от сервера.
- **Улучшенный пользовательский опыт**: Менее заметные задержки в интерфейсе, так как приложение может использовать кешированные данные для отображения информации.


#### Как это работает

1. **Получение данных о погоде**:
   - При взаимодействии с интерфейсом (например, нажатии кнопки или выборе города) вызывается функция `getWeatherData(city)`, которая сначала пытается найти информацию о погоде в локальном хранилище (`localStorage`).
```javascript
   const cachedData = localStorage.getItem(city);
```

2. **Удаление устаревших данных**:
   - Если данные старше 5 минут, они удаляются из кеша, чтобы избежать отображения устаревшей информации.
```javascript
localStorage.removeItem(city);
```

3. **Получение новых данных**:
   - Если в локальном хранилище нет актуальных данных, отправляется запрос к API для получения свежей информации о погоде.
```javascript
const response = await fetch(`/api/weather/?city=${encodeURIComponent(city)}`);
```

4. **Сохранение данных в кеш**:
   - Полученные данные, вместе с временной меткой, сохраняются в `localStorage`, что позволяет использовать их при следующих запросах без необходимости повторных запросов к API.
```javascript
const timestamp = new Date().getTime();
localStorage.setItem(city, JSON.stringify({ data, timestamp }));
```

### Использование API Wikipedia

При запросе данных о погоде (API OpenWeather) приложение отправляет параллельный запрос к Wikipedia API. На основе названия города API возвращает краткое описание города, которое затем отображается в интерфейсе вместе с погодными данными.

В коде `views.py` API для погоды используется следующий URL для запроса информации о городе:
```python
wiki_url = f'https://ru.wikipedia.org/api/rest_v1/page/summary/{city}?redirect=true'
```
- Этот запрос позволяет получить краткое описание страницы города на русском языке.

### Использование карты и библиотеки Leaflet

1. **Инициализация карты**:
   - Карта интегрирована с помощью библиотеки **Leaflet** через функцию `initializeMap(lat, lon)`, которая создает карту на основе координат города.
   - Карта загружается с помощью  **OpenStreetMap**, а погодные данные добавляются как дополнительный слой через **API OpenWeather**.

Обзор кода:
```python
function initializeMap(lat, lon) {
    if (map) {
        map.remove();
    }
    # Установка координат
    map = L.map('map').setView([lat, lon], 10);
    #  Добавляем слой OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    # API-ключ для OpenWeatherMap 
    const apiKey = '7e3d537e497ca75e7caafef828c47443';
    # Слой для отображения погодных данных на карте
    const weatherLayer = L.tileLayer(`http://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: '&copy; OpenWeatherMap'
    });
    # Добавляем слой с погодными данными на карту
    weatherLayer.addTo(map);
}
```
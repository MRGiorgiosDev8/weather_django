$(document).ready(function () {
    let map;

    function createForecastHtml(forecasts) {
        let forecastHtml = '';
        forecasts.forEach(forecast => {
            forecastHtml += `
                <div class="forecast">
                    <p><strong>Дата:</strong> ${forecast.datetime}</p>
                    <p><strong>Температура:</strong> ${forecast.temperature} °C</p>
                    <p><strong>Скорость ветра:</strong> ${forecast.wind_speed} m/s</p>
                    <img class="weather-icon" src="http://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.description}">
                    <p>${forecast.description}</p>
                </div>
                <hr>
            `;
        });
        return forecastHtml;
    }

    function createCityInfoHtml(summary) {
        return `
            <div class="city-info">
                <p>${summary}</p>
            </div>
        `;
    }

    function initializeMap(lat, lon) {
        if (map) {
            map.remove();
        }

        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const apiKey = '7e3d537e497ca75e7caafef828c47443';
        const weatherLayer = L.tileLayer(`http://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
        });
        weatherLayer.addTo(map);
    }

    function getWeatherData(city) {
        const cachedData = localStorage.getItem(city);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            const now = new Date().getTime();
            const cacheTime = parsedData.timestamp;
            const cacheDuration = 1000 * 60 * 5;
            if (now - cacheTime < cacheDuration) {
                return parsedData.data;
            } else {
                localStorage.removeItem(city);
            }
        }
        return null;
    }

    function setWeatherData(city, data) {
        const timestamp = new Date().getTime();
        localStorage.setItem(city, JSON.stringify({ data, timestamp }));
    }

    function showModal(message) {
        const modalHtml = `
            <div class="modal-window text-danger">
                <p>${message}</p>
                <button id="closeModal">Закрыть</button>
            </div>`;
        $('body').append(modalHtml);

        $('#closeModal').on('click', function () {
            closeModal();
        });

        $('.modal-window').css({
            'position': 'fixed',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'background-color': 'white',
            'padding': '20px',
            'border': '6px double #ecececb2',
            'opacity': '0.9',
            'border-radius': '10px',
            'z-index': '1000',
            'box-shadow': '0 5px 15px rgba(0, 0, 0, 0.3)'
        });

        gsap.fromTo('.modal-window', {
            scale: 0,
            opacity: 0
        }, {
            scale: 1,
            opacity: 0.9,
            duration: 0.3,
            ease: 'bounce.inOut'
        });

        setTimeout(function () {
            closeModal();
        }, 5000);
    }

    function closeModal() {
        gsap.to('.modal-window', {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: function () {
                $('.modal-window').remove();
            }
        });
    }

    $('#searchButton').on('click', async function () {
        let city = $('#cityInput').val();
        if (city) {
            const cachedData = getWeatherData(city);
            if (cachedData) {
                updateWeatherUI(cachedData);
            } else {
                try {
                    const response = await fetch(`/api/weather/?city=${encodeURIComponent(city)}`);
                    const data = await response.json();
                    if (data.error) {
                        showModal(`Ошибка: ${data.error}`);
                    } else {
                        setWeatherData(city, data);
                        updateWeatherUI(data);
                    }
                } catch (error) {
                    showModal(`Произошла ошибка: ${error.message}`);
                }
            }
        }
    });

    function updateWeatherUI(data) {
        $('#introContainer').remove();

        $('#map').remove();
        $('h1:contains("Map")').remove();

        if (!$('#map').length) {
            const mapContainer = `<div id="map" class="rounded-3 w-100"></div>`;
            $('.map-container').append(mapContainer);
        }

        const forecastHtml = `<h2>${data.city} <img src="/static/images/iconarrow.png" alt="arrow" class="symbol-arrow" /></h2>` + createForecastHtml(data.forecasts);

        const cityInfoHtml = createCityInfoHtml(data.wiki_summary);

        $('#weatherInfo').html(forecastHtml);
        $('.city-info').html(cityInfoHtml);

        $('#weatherInfo').css({
            'padding': '6px',
            'background-color': '#f8f9fa99',
            'border-radius': '11px',
            'border': '1px solid #ececec',
            'box-shadow': '0px 4px 10px rgba(180, 180, 180, 0.1)'
        });

        $('.city-info *').css({
            'background-color': 'transparent',
            'margin': '0',
            'padding': '0',
            'border': 'none'
        });

        $('.city-info').css({
            'background-color': '#f8f9fa99',
            'border-radius': '11px',
            'padding': '0',
            'text-align': 'center'
        });

        if ($('h1:contains("Map")').length === 0) {
            const mapTitle = '<h1 class="text-center mb-3">Map</h1>';
            $('#map').before(mapTitle);
        }

        initializeMap(data.latitude, data.longitude);

        $('#map').css({
            'border': '3px solid #ececec',
            'box-shadow': '0px 4px 10px rgba(7, 7, 7, 0.1)'
        });

        gsap.set("#weatherInfo", {
            y: 100,
            opacity: 0
        });

        gsap.to("#weatherInfo", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power1.inOut",
        });

        gsap.to(".symbol-arrow", {
            x: 7,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            duration: 0.8
        });
    }

    $('.navbar-brand').on('click', function (e) {
        e.preventDefault();
        location.reload();
    });
});
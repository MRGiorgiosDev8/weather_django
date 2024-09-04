$(document).ready(function () {
    $('#searchButton').on('click', function () {
        let city = $('#cityInput').val();
        if (city) {
            $.getJSON(`/weather/?city=${city}`, function (data) {
                if (data.error) {
                    $('#weatherInfo').html(`<p class="text-danger">${data.error}</p>`);
                } else {

                    $('#map').remove();
                    $('h1:contains("Map")').remove();

                    const mapContainer = `<div id="map" class="rounded-3 w-100"></div>`;
                    $('.map-container').append(mapContainer);

                    let forecastHtml = `<h2>${data.city} <span class="symbol-arrow">&#10144;</span></h2>`;
                    data.forecasts.forEach(function (forecast) {
                        forecastHtml += `
                            <div class="forecast">
                                <p><strong>Time:</strong> ${forecast.datetime}</p>
                                <p><strong>Temperature:</strong> ${forecast.temperature} °C</p>
                                <p><strong>Description:</strong> ${forecast.description}</p>
                                <p><strong>Wind Speed:</strong> ${forecast.wind_speed} m/s</p>
                                <img class="weather-icon" src="http://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.description}">
                            </div>
                            <hr>
                        `;
                    });
                    $('#weatherInfo').html(forecastHtml);

                    $('#weatherInfo').css({
                        'padding': '6px',
                        'background-color': '#f8f9fa99',
                        'border-radius': '11px',
                        'border': '1px solid #ececec',
                        'box-shadow': '0px 4px 10px rgba(180, 180, 180, 0.1)'
                    });

                    const mapTitle = '<h1 class="text-center mb-3">Map</h1>';
                    $('#map').before(mapTitle);

                    const map = L.map('map').setView([data.latitude, data.longitude], 10);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    const apiKey = '7e3d537e497ca75e7caafef828c47443';
                    const weatherLayer = L.tileLayer(`http://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
                        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    });
                    weatherLayer.addTo(map);

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
                }
            }).fail(function () {
                $('#weatherInfo').html(`<p class="text-danger">Request error.</p>`);
            });
        }
    });
});
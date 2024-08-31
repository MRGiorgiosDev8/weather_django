$(document).ready(function() {
    $('#searchButton').on('click', function() {
        let city = $('#cityInput').val();
        if (city) {
            $.getJSON(`/weather/?city=${city}`, function(data) {
                if (data.error) {
                    $('#weatherInfo').html(`<p class="text-danger">${data.error}</p>`);
                } else {

                    let forecastHtml = `<h2>${data.city}</h2>`;
                    data.forecasts.forEach(function(forecast) {
                        forecastHtml += `
                            <div class="forecast">
                                <p><strong>Time:</strong> ${forecast.datetime}</p>
                                <p><strong>Temperature:</strong> ${forecast.temperature} °C</p>
                                <p><strong>Description:</strong> ${forecast.description}</p>
                                <img src="http://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.description}">
                            </div>
                            <hr>
                        `;
                    });
                    $('#weatherInfo').html(forecastHtml);

                    const map = L.map('map').setView([data.latitude, data.longitude], 10);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    const apiKey = '7e3d537e497ca75e7caafef828c47443';
                    const weatherLayer = L.tileLayer(`http://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
                        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                    });
                    weatherLayer.addTo(map);
                }
            }).fail(function() {
                $('#weatherInfo').html(`<p class="text-danger">При получении данных погоды произошла ошибка.</p>`);
            });
        }
    });
});
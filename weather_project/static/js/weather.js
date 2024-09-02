$(document).ready(function() {
    $('#searchButton').on('click', function() {
        let city = $('#cityInput').val();
        if (city) {
            $.getJSON(`/weather/?city=${city}`, function(data) {
                if (data.error) {
                    $('#weatherInfo').html(`<p class="text-danger">${data.error}</p>`);
                } else {
                    let forecastHtml = `<h2>${data.city} &#10144;</h2>`;
                    data.forecasts.forEach(function(forecast) {
                        forecastHtml += `
                            <div class="forecast">
                                <p><strong>Time:</strong> ${forecast.datetime}</p>
                                <p><strong>Temperature:</strong> ${forecast.temperature} °C</p>
                                <p><strong>Description:</strong> ${forecast.description}</p>
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

                    let additionalInfoHtml = '';
                    data.forecasts.forEach(function(forecast) {
                        additionalInfoHtml += `
                           <div class="additional-forecast">
                                <div class="additional-info">
                                    <p class="datetime"><strong>Time:</strong> ${forecast.datetime}</p>
                                    <p class="humidity"><strong>Humidity:</strong> The humidity in this region is ${forecast.humidity}%</p>
                                    <p class="pressure"><strong>Pressure:</strong> The atmospheric pressure in this region is ${forecast.pressure} hPa</p>
                                    <p class="wind-speed"><strong>Wind Speed:</strong> The wind speed in this region is ${forecast.wind_speed} m/s</p>
                                    ${forecast.rain ? `<p class="rain"><strong>Rain:</strong> The amount of rainfall in the last 3 hours is ${forecast.rain} mm</p>` : ''}
                                    <p class="cloudiness"><strong>Cloudiness:</strong> The cloudiness in this region is ${forecast.clouds}%</p>
                                </div>
                                <hr>
                            </div>
                           `;
                    });
                    $('#additionalWeatherInfo').html(additionalInfoHtml);

                    $('#additionalWeatherInfo').css({
                        'padding': '6px',
                        'background-color': '#f8f9fa99',
                        'border-radius': '11px',
                        'border': '1px solid #ececec',
                        'box-shadow': '0px 4px 10px rgba(180, 180, 180, 0.1)'
                    });

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
                }
            }).fail(function() {
                $('#weatherInfo').html(`<p class="text-danger">Request error.</p>`);
            });
        }
    });
});
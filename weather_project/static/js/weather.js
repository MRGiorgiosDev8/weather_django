$(document).ready(function() {
    $('#searchButton').on('click', function() {
        let city = $('#cityInput').val();
        if (city) {
            $.getJSON(`/weather/?city=${city}`, function(data) {
                if (data.error) {
                    $('#weatherInfo').html(`<p class="text-danger">${data.error}</p>`);
                } else {
                    let forecastHtml = `<h2>Weather in ${data.city}</h2>`;
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
                }
            }).fail(function() {
                $('#weatherInfo').html(`<p class="text-danger">При получении данных погоды произошла ошибка.</p>`);
            });
        }
    });
});
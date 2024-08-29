$(document).ready(function() {
    $('#searchButton').on('click', function() {
        let city = $('#cityInput').val();
        if (city) {
            $.getJSON(`/weather/?city=${city}`, function(data) {
                if (data.error) {
                    $('#weatherInfo').html(`<p class="text-danger">${data.error}</p>`);
                } else {
                    $('#weatherInfo').html(`
                        <h2>Weather in ${data.city}</h2>
                        <p>Temperature: ${data.temperature} °C</p>
                        <p>Description: ${data.description}</p>
                        <img src="http://openweathermap.org/img/wn/${data.icon}.png" alt="${data.description}">
                    `);
                }
            }).fail(function() {
                $('#weatherInfo').html(`<p class="text-danger">При получение данных погоды while произошла ошибка.</p>`);
            });
        }
    });
});
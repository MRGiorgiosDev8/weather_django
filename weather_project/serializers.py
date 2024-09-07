from rest_framework import serializers

class ForecastSerializer(serializers.Serializer):
    datetime = serializers.CharField()
    temperature = serializers.FloatField()
    description = serializers.CharField()
    icon = serializers.CharField()
    wind_speed = serializers.FloatField()

class WeatherSerializer(serializers.Serializer):
    city = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    forecasts = ForecastSerializer(many=True)
    wiki_summary = serializers.CharField()
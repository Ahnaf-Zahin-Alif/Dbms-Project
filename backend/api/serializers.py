from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Theatre, Hall, Seat, Movie, Show, Booking, BookedSeat


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class TheatreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theatre
        fields = ["id", "name", "location"]


class HallSerializer(serializers.ModelSerializer):
    theatre_name = serializers.CharField(source="theatre.name", read_only=True)

    class Meta:
        model = Hall
        fields = ["id", "theatre", "theatre_name", "name"]


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ["id", "hall", "seat_number", "row", "seat_type"]


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "category",
            "actors",
            "genre",
            "release_date",
            "language",
            "duration_minutes",
            "poster_url",
            "backdrop_url",
            "status",
        ]


class ShowSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source="movie.title", read_only=True)
    movie_poster = serializers.CharField(source="movie.poster_url", read_only=True)
    theatre_name = serializers.CharField(source="hall.theatre.name", read_only=True)
    hall_name = serializers.CharField(source="hall.name", read_only=True)

    class Meta:
        model = Show
        fields = [
            "id",
            "movie",
            "movie_title",
            "movie_poster",
            "hall",
            "hall_name",
            "theatre_name",
            "show_date",
            "start_time",
            "end_time",
            "price",
        ]


class BookedSeatSerializer(serializers.ModelSerializer):
    seat_number = serializers.CharField(source="seat.seat_number", read_only=True)
    seat_type = serializers.CharField(source="seat.seat_type", read_only=True)

    class Meta:
        model = BookedSeat
        fields = ["id", "booking", "seat", "seat_number", "seat_type", "show"]


class BookingSerializer(serializers.ModelSerializer):
    booked_seats = BookedSeatSerializer(many=True, read_only=True)
    movie_title = serializers.CharField(source="show.movie.title", read_only=True)
    show_date = serializers.CharField(source="show.show_date", read_only=True)
    start_time = serializers.CharField(source="show.start_time", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "show",
            "movie_title",
            "show_date",
            "start_time",
            "customer_name",
            "customer_phone",
            "total_amount",
            "payment_method",
            "status",
            "created_at",
            "booked_seats",
        ]
        read_only_fields = ["user", "status", "created_at"]

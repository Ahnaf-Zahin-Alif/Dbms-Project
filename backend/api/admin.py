from django.contrib import admin
from .models import Theatre, Hall, Seat, Movie, Show, Booking, BookedSeat


@admin.register(Theatre)
class TheatreAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "location")
    search_fields = ("name", "location")


@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "theatre")
    list_filter = ("theatre",)
    search_fields = ("name", "theatre__name")


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ("id", "hall", "seat_number", "row", "seat_type")
    list_filter = ("hall__theatre", "hall", "seat_type")
    search_fields = ("seat_number", "hall__name")


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "status", "release_date", "duration_minutes")
    list_filter = ("status", "category", "language")
    search_fields = ("title", "actors", "genre")


@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = ("id", "movie", "hall", "show_date", "start_time", "price")
    list_filter = ("show_date", "movie", "hall__theatre")
    search_fields = ("movie__title", "hall__name")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "customer_phone",
        "show",
        "total_amount",
        "payment_method",
        "status",
        "created_at",
    )
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("customer_name", "customer_phone", "id")


@admin.register(BookedSeat)
class BookedSeatAdmin(admin.ModelAdmin):
    list_display = ("id", "booking", "seat", "show")
    list_filter = ("show__movie", "show__show_date")


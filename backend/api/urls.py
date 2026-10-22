from django.urls import path
from .views import (
    TheatreListView,
    MovieListView,
    MovieDetailView,
    ShowListView,
    ShowDetailView,
    ShowSeatAvailabilityView,
    CreateBookingView,
    UserBookingsListView,
)

urlpatterns = [
    # Theatres
    path("theatres/", TheatreListView.as_view(), name="theatre-list"),

    # Movies
    path("movies/", MovieListView.as_view(), name="movie-list"),
    path("movies/<int:pk>/", MovieDetailView.as_view(), name="movie-detail"),

    # Shows / Schedule
    path("shows/", ShowListView.as_view(), name="show-list"),
    path("shows/<int:pk>/", ShowDetailView.as_view(), name="show-detail"),
    path("shows/<int:show_id>/seats/", ShowSeatAvailabilityView.as_view(), name="show-seats"),

    # Bookings / Purchases
    path("bookings/", CreateBookingView.as_view(), name="create-booking"),
    path("user/bookings/", UserBookingsListView.as_view(), name="user-bookings"),
]


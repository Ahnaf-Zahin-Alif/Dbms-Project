from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Theatre, Hall, Seat, Movie, Show, Booking, BookedSeat
from .serializers import (
    UserSerializer,
    TheatreSerializer,
    HallSerializer,
    SeatSerializer,
    MovieSerializer,
    ShowSerializer,
    BookingSerializer,
)


# ---------------------------------------------------------
# 1. User Registration View
# ---------------------------------------------------------
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ---------------------------------------------------------
# 2. Theatre Views (Page 3 Location Selector)
# ---------------------------------------------------------
class TheatreListView(generics.ListAPIView):
    queryset = Theatre.objects.all()
    serializer_class = TheatreSerializer
    permission_classes = [AllowAny]


# ---------------------------------------------------------
# 3. Movie Views (Pages 2, 4, 5 Catalog & Details)
# ---------------------------------------------------------
class MovieListView(generics.ListAPIView):
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Movie.objects.all()
        # Optional filter: ?status=NOW_SHOWING or ?status=COMING_SOON
        movie_status = self.request.query_params.get("status")
        if movie_status:
            queryset = queryset.filter(status=movie_status.upper())
        return queryset


class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]


# ---------------------------------------------------------
# 4. Show / Schedule Views (Page 6 Showtime Picker)
# ---------------------------------------------------------
class ShowListView(generics.ListAPIView):
    serializer_class = ShowSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Show.objects.all().select_related("movie", "hall__theatre")

        movie_id = self.request.query_params.get("movie")
        theatre_id = self.request.query_params.get("theatre")
        show_date = self.request.query_params.get("date")

        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        if theatre_id:
            queryset = queryset.filter(hall__theatre_id=theatre_id)
        if show_date:
            queryset = queryset.filter(show_date=show_date)

        return queryset


class ShowDetailView(generics.RetrieveAPIView):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    permission_classes = [AllowAny]


# ---------------------------------------------------------
# 5. Seat Matrix & Availability View (Page 8 Grid)
# ---------------------------------------------------------
class ShowSeatAvailabilityView(APIView):
    """
    Returns all seats for a given show's hall with dynamic 'is_booked' status.
    Endpoint: GET /api/shows/<show_id>/seats/
    """
    permission_classes = [AllowAny]

    def get(self, request, show_id):
        show = get_object_or_404(Show, id=show_id)
        # All physical seats in this show's auditorium
        seats = Seat.objects.filter(hall=show.hall).order_by("row", "seat_number")

        # Set of seat IDs that are already purchased for this show
        booked_seat_ids = set(
            BookedSeat.objects.filter(show=show).values_list("seat_id", flat=True)
        )

        data = []
        for seat in seats:
            data.append({
                "id": seat.id,
                "seat_number": seat.seat_number,
                "row": seat.row,
                "seat_type": seat.seat_type,
                "is_booked": seat.id in booked_seat_ids,
            })

        return Response(data, status=status.HTTP_200_OK)


# ---------------------------------------------------------
# 6. Ticket Booking & Purchase View (Pages 6 & 8 Checkout)
# ---------------------------------------------------------
class CreateBookingView(APIView):
    """
    Creates a booking and reserves seats atomically.
    Endpoint: POST /api/bookings/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        show_id = request.data.get("show")
        seat_ids = request.data.get("seat_ids", [])
        customer_name = request.data.get("customer_name")
        customer_phone = request.data.get("customer_phone")
        payment_method = request.data.get("payment_method", "BKASH")
        total_amount = request.data.get("total_amount")

        if not show_id or not seat_ids or not customer_name or not customer_phone:
            return Response(
                {"error": "show, seat_ids, customer_name, and customer_phone are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        show = get_object_or_404(Show, id=show_id)
        seats = Seat.objects.filter(id__in=seat_ids, hall=show.hall)

        if seats.count() != len(seat_ids):
            return Response(
                {"error": "One or more selected seats are invalid for this hall."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Atomic transaction to guarantee zero double-booking race conditions
        try:
            with transaction.atomic():
                # Check if any seat is already booked for this show
                already_booked = BookedSeat.objects.filter(show=show, seat__in=seats).exists()
                if already_booked:
                    return Response(
                        {"error": "One or more selected seats have already been booked."},
                        status=status.HTTP_409_CONFLICT,
                    )

                # Create the booking master record
                booking = Booking.objects.create(
                    user=request.user,
                    show=show,
                    customer_name=customer_name,
                    customer_phone=customer_phone,
                    total_amount=total_amount or (show.price * len(seats)),
                    payment_method=payment_method,
                    status=Booking.BookingStatus.CONFIRMED,
                )

                # Reserve each seat
                booked_seats_to_create = [
                    BookedSeat(booking=booking, show=show, seat=seat) for seat in seats
                ]
                BookedSeat.objects.bulk_create(booked_seats_to_create)

                serializer = BookingSerializer(booking)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserBookingsListView(generics.ListAPIView):
    """
    Returns booking history for the currently logged-in user.
    Endpoint: GET /api/user/bookings/
    """
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by("-created_at")

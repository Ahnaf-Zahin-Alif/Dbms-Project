from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Theatre(models.Model):
    name = models.CharField(max_length= 200)
    location = models.CharField(max_length=255)
    
    def __str__(self):
        return f"{self.name} ({self.location})"
    
class Hall(models.Model):
        
    theatre = models.ForeignKey(Theatre , on_delete=models.CASCADE,related_name="halls")
        
    name = models.CharField(max_length=100)
        
    def __str__(self):
        return f"{self.theatre.name} - {self.name}"


class Seat(models.Model):
    
    hall = models.ForeignKey(Hall , on_delete=models.CASCADE , related_name="seats")    
    
    seat_number = models.CharField(max_length=10)
    row = models.CharField(max_length=2)
    
    class SeatType(models.TextChoices):
        REGULAR = "REGULAR" , "Regular"
        PREMIUM = "PREMIUM" , "Premium"
    
    seat_type = models.CharField(max_length=10 , choices=SeatType.choices , default=SeatType.REGULAR)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=[
                'hall' , 'seat_number' 
            ], name='unique_hall_seat')
        ]  
        
    def __str__(self):
        return f"{self.hall} - Seat {self.seat_number} ({self.seat_type})"              
    
    
class Movie(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20)
    actors = models.TextField()
    genre = models.CharField(max_length=100)    
    release_date = models.DateField()
    language = models.CharField(max_length=50)
    duration_minutes = models.PositiveBigIntegerField()
    poster_url = models.URLField(max_length=500)
    backdrop_url = models.URLField(max_length=500 , blank=True , null=True)
    
    
    class StatusChoice(models.TextChoices):
        NOW_SHOWING = "NOW_SHOWING" , "Now Showing"
        COMING_SOON = "COMING_SOON" , "Coming_soon"
    
    status = models.CharField(max_length=20 , choices=StatusChoice.choices , default=StatusChoice.NOW_SHOWING)
    
    
    def __str__(self):
        return self.title    
    
class Show(models.Model):
    
    movie = models.ForeignKey(Movie , on_delete=models.CASCADE , related_name="shows") 
    hall = models.ForeignKey(Hall , on_delete=models.CASCADE , related_name="shows")
 
    show_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(blank = True , null = True)
    
    price = models.DecimalField(max_digits=8 , decimal_places=2)
 
    def __str__(self):
        return f"{self.movie.title} - {self.hall} ({self.show_date} {self.start_time})"
    
    
class Booking(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name="bookings")
    show = models.ForeignKey(Show , on_delete=models.CASCADE, related_name="bookings")
    
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=150)
    
    total_amount = models.DecimalField(max_digits=10 , decimal_places=2)
    
    class PaymentMethod(models.TextChoices):
        BKASH = "BKASH" , "bKash"
        NAGAD = "NAGAD" , "Nagad"
        
    payment_method = models.CharField(max_length=20 , choices=PaymentMethod.choices , default=PaymentMethod.BKASH)


    class BookingStatus(models.TextChoices):
        
        CONFIRMED = "CONFIRMED" , "Confirmed"
        PENDING = "PENDING" , "Pending"
        CANCELLED = "CANCELLED" , "Cancelled"

    status = models.CharField(max_length=20 , choices=BookingStatus.choices , default=
    BookingStatus.CONFIRMED)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"Booking #{self.id} - {self.customer_name} ({self.show.movie.title})"    
    
    
class BookedSeat(models.Model):
    
    booking = models.ForeignKey(Booking , on_delete=models.CASCADE , related_name="booked_seat")    
    
    seat = models.ForeignKey(Seat , on_delete=models.CASCADE , related_name="booking_records")
    
    show = models.ForeignKey(Show , on_delete=models.CASCADE , related_name="booked_seats")
    
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['show' , 'seat'] , 
            name='unique_show_seat_booking')
        ]
    
    def __str__(self):
        return f"{self.show} - {self.seat.seat_number}"    
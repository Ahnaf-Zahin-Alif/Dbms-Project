from django.core.management.base import BaseCommand
from api.models import Theatre, Hall, Seat, Movie, Show
from datetime import date, time


class Command(BaseCommand):
    help = "Populate Cinefilm database with initial seed data matching the wireframes"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Cinefilm data...")

        # 1. Theatres (Wireframe Page 3)
        theatres_data = [
            ("Bashundhara Shopping Mall", "Panthapath, Dhaka"),
            ("Sony Square", "Mirpur, Dhaka"),
            ("Ball Arcade", "Chattagram"),
            ("Finlay Square", "Chattagram"),
        ]
        created_theatres = []
        for name, loc in theatres_data:
            t, _ = Theatre.objects.get_or_create(name=name, location=loc)
            created_theatres.append(t)
        self.stdout.write(f"Created {len(created_theatres)} theatres.")

        # 2. Halls for the primary theatre
        main_theatre = created_theatres[0]
        h1, _ = Hall.objects.get_or_create(theatre=main_theatre, name="Hall 1")
        h2, _ = Hall.objects.get_or_create(theatre=main_theatre, name="Hall 2")

        # 3. Seats (Rows A-G, cols 1-12) for Hall 1 & Hall 2 (Wireframe Page 8)
        for h in [h1, h2]:
            seat_count = 0
            for r in ["A", "B", "C", "D", "E", "F", "G"]:
                is_premium = r in ["A", "B"]
                for num in range(1, 13):
                    s_num = f"{r}{num:02d}"
                    Seat.objects.get_or_create(
                        hall=h,
                        seat_number=s_num,
                        row=r,
                        seat_type=Seat.SeatType.PREMIUM if is_premium else Seat.SeatType.REGULAR,
                    )
                    seat_count += 1
            self.stdout.write(f"Generated {seat_count} seats for {h.name}.")

        # 4. Movies (Wireframe Pages 2, 4, 5)
        m1, _ = Movie.objects.get_or_create(
            title="Spider-Man: Brand New Day (2D)",
            defaults={
                "category": "2D",
                "actors": "TOM HOLLAND, ZENDAYA, SADIE SINK, LIZA COLÓN, JACOB BA",
                "genre": "Action, Adventure, Sci-Fi",
                "release_date": date(2026, 7, 30),
                "language": "English",
                "duration_minutes": 180,
                "poster_url": "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
                "backdrop_url": "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1600&auto=format&fit=crop",
                "status": Movie.StatusChoice.NOW_SHOWING,
            },
        )

        m2, _ = Movie.objects.get_or_create(
            title="The Odyssey",
            defaults={
                "category": "IMAX",
                "actors": "DIRECTED BY CHRISTOPHER NOLAN",
                "genre": "Epic, Adventure, Drama",
                "release_date": date(2026, 7, 17),
                "language": "English",
                "duration_minutes": 165,
                "poster_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
                "backdrop_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
                "status": Movie.StatusChoice.NOW_SHOWING,
            },
        )

        m3, _ = Movie.objects.get_or_create(
            title="Minions & Monsters",
            defaults={
                "category": "3D",
                "actors": "STEVE CARELL, PIERRE COFFIN",
                "genre": "Animation, Comedy, Family",
                "release_date": date(2026, 6, 20),
                "language": "English",
                "duration_minutes": 105,
                "poster_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
                "backdrop_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop",
                "status": Movie.StatusChoice.NOW_SHOWING,
            },
        )

        # 5. Shows (Wireframe Page 6: 12:50 pm, 3:00 pm, 6:00 pm)
        today = date.today()
        Show.objects.get_or_create(
            movie=m1,
            hall=h1,
            show_date=today,
            start_time=time(12, 50),
            defaults={"price": 450.00},
        )
        Show.objects.get_or_create(
            movie=m1,
            hall=h1,
            show_date=today,
            start_time=time(15, 0),
            defaults={"price": 450.00},
        )
        Show.objects.get_or_create(
            movie=m1,
            hall=h1,
            show_date=today,
            start_time=time(18, 0),
            defaults={"price": 500.00},
        )
        Show.objects.get_or_create(
            movie=m1,
            hall=h2,
            show_date=today,
            start_time=time(12, 0),
            defaults={"price": 400.00},
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with wireframe data!"))


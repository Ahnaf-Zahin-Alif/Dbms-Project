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
            title="Spider-Man: No Way Home",
            defaults={
                "category": "2D",
                "actors": "TOM HOLLAND, ZENDAYA, BENEDICT CUMBERBATCH, JACOB BATALON",
                "genre": "Action, Adventure, Sci-Fi",
                "release_date": date(2026, 7, 30),
                "language": "English",
                "duration_minutes": 148,
                "poster_url": "/images/poster3-spiderman.png",
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
                "poster_url": "/images/poster4-odyssey.png",
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
                "poster_url": "/images/poster1-minions.png",
                "backdrop_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop",
                "status": Movie.StatusChoice.NOW_SHOWING,
            },
        )

        m4, _ = Movie.objects.get_or_create(
            title="Clayface",
            defaults={
                "category": "IMAX",
                "actors": "Bill Skarsgard, Max Minghella, Kate Mara",
                "genre": "Horror / Action / Mystery",
                "release_date": date(2026, 10, 30),
                "language": "English",
                "duration_minutes": 135,
                "poster_url": "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
                "backdrop_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
                "status": Movie.StatusChoice.NOW_SHOWING,
            },
        )

        m5, _ = Movie.objects.get_or_create(
            title="Supergirl",
            defaults={
                "category": "IMAX 3D",
                "actors": "Milly Alcock, Matthias Schoenaerts, Eve Ridley",
                "genre": "Sci-Fi / Adventure / Action",
                "release_date": date(2026, 6, 26),
                "language": "English",
                "duration_minutes": 148,
                "poster_url": "/images/poster-supergirl.png",
                "backdrop_url": "/images/slide-supergirl.jpg",
                "status": Movie.StatusChoice.NOW_SHOWING,
            },
        )

        m6, _ = Movie.objects.get_or_create(
            title="Moana 2",
            defaults={
                "category": "3D",
                "actors": "Auli'i Cravalho, Dwayne Johnson, Alan Tudyk",
                "genre": "Animation / Adventure / Family",
                "release_date": date(2026, 11, 27),
                "language": "English",
                "duration_minutes": 100,
                "poster_url": "/images/poster2-moana.png",
                "backdrop_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
                "status": Movie.StatusChoice.NOW_SHOWING,
            },
        )

        m7, _ = Movie.objects.get_or_create(
            title="Dune : Part three",
            defaults={
                "category": "IMAX",
                "actors": "TIMOTHÉE CHALAMET, ZENDAYA, FLORENCE PUGH, JAVIER BARDEM",
                "genre": "Sci-Fi, Adventure, Drama",
                "release_date": date(2026, 12, 18),
                "language": "English",
                "duration_minutes": 165,
                "poster_url": "/images/poster-dune3.png",
                "backdrop_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
                "status": Movie.StatusChoice.COMING_SOON,
            },
        )

        m8, _ = Movie.objects.get_or_create(
            title="Avengers: Doomsday",
            defaults={
                "category": "IMAX 3D",
                "actors": "ROBERT DOWNEY JR., PEDRO PASCAL, VANESSA KIRBY, JOSEPH QUINN",
                "genre": "Action, Adventure, Sci-Fi",
                "release_date": date(2026, 12, 18),
                "language": "English",
                "duration_minutes": 180,
                "poster_url": "/images/poster-avengers-doomsday.png",
                "backdrop_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
                "status": Movie.StatusChoice.COMING_SOON,
            },
        )

        m9, _ = Movie.objects.get_or_create(
            title="Bonolota Express",
            defaults={
                "category": "2D",
                "actors": "MOSHARRAF KARIM, ZIAUL FARUQ APURBA, SABILA NUR",
                "genre": "Mystery, Thriller, Drama",
                "release_date": date(2026, 10, 25),
                "language": "Bangla",
                "duration_minutes": 130,
                "poster_url": "/images/poster-bonolota-express.png",
                "backdrop_url": "/images/slide-bonolota-express.jpg",
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

        for movie_item in [m2, m4, m5, m9]:
            Show.objects.get_or_create(
                movie=movie_item,
                hall=h1,
                show_date=today,
                start_time=time(14, 0),
                defaults={"price": 550.00},
            )
            Show.objects.get_or_create(
                movie=movie_item,
                hall=h1,
                show_date=today,
                start_time=time(19, 30),
                defaults={"price": 600.00},
            )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with wireframe data!"))


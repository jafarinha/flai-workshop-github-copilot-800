from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')
        users_data = [
            {'name': 'Tony Stark',     'username': 'ironman',     'email': 'tony@avengers.com',    'password': 'pepper3000'},
            {'name': 'Peter Parker',   'username': 'spiderman',   'email': 'peter@avengers.com',   'password': 'mj4ever'},
            {'name': 'Natasha Romanoff','username': 'blackwidow', 'email': 'natasha@avengers.com', 'password': 'widow99'},
            {'name': 'Bruce Wayne',    'username': 'batman',      'email': 'bruce@justice.com',    'password': 'alfred2k'},
            {'name': 'Diana Prince',   'username': 'wonderwoman', 'email': 'diana@justice.com',    'password': 'themyscira'},
            {'name': 'Clark Kent',     'username': 'superman',    'email': 'clark@justice.com',    'password': 'krypto1938'},
        ]

        users = {}
        for u in users_data:
            user = User.objects.create(**u)
            users[u['username']] = user
            self.stdout.write(f"  Created user: {u['username']}")

        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.set([users['ironman'], users['spiderman'], users['blackwidow']])
        team_marvel.save()

        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.set([users['batman'], users['wonderwoman'], users['superman']])
        team_dc.save()
        self.stdout.write('  Created Team Marvel and Team DC')

        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': users['ironman'], 'activity_type': 'Flying', 'duration': 30.0, 'date': date(2024, 1, 10)},
            {'user': users['spiderman'], 'activity_type': 'Web Swinging', 'duration': 45.0, 'date': date(2024, 1, 11)},
            {'user': users['blackwidow'], 'activity_type': 'Martial Arts', 'duration': 60.0, 'date': date(2024, 1, 12)},
            {'user': users['batman'], 'activity_type': 'Grappling', 'duration': 50.0, 'date': date(2024, 1, 10)},
            {'user': users['wonderwoman'], 'activity_type': 'Sword Training', 'duration': 75.0, 'date': date(2024, 1, 11)},
            {'user': users['superman'], 'activity_type': 'Flight Patrol', 'duration': 90.0, 'date': date(2024, 1, 12)},
        ]

        for a in activities_data:
            Activity.objects.create(**a)
            self.stdout.write(f"  Created activity: {a['activity_type']} for {a['user'].username}")

        self.stdout.write('Creating leaderboard entries...')
        leaderboard_data = [
            {'user': users['superman'], 'score': 950},
            {'user': users['wonderwoman'], 'score': 900},
            {'user': users['ironman'], 'score': 850},
            {'user': users['blackwidow'], 'score': 800},
            {'user': users['batman'], 'score': 780},
            {'user': users['spiderman'], 'score': 750},
        ]

        for lb in leaderboard_data:
            Leaderboard.objects.create(**lb)
            self.stdout.write(f"  Created leaderboard entry: {lb['user'].username} - {lb['score']}")

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {'name': 'Arc Reactor Cardio', 'description': 'High-intensity cardio inspired by Iron Man suit training.', 'duration': 30.0},
            {'name': 'Web Shooter Strength', 'description': 'Upper body strength training like Spider-Man.', 'duration': 45.0},
            {'name': 'Black Widow Combat', 'description': 'Agility and combat drills from S.H.I.E.L.D. training.', 'duration': 60.0},
            {'name': 'Bat Cave Circuit', 'description': 'Full body circuit training from Batman\'s regimen.', 'duration': 50.0},
            {'name': 'Amazonian Warriors', 'description': 'Ancient Amazonian strength and endurance training.', 'duration': 75.0},
            {'name': 'Kryptonian Flight Prep', 'description': 'Core and stability training for superhero stamina.', 'duration': 90.0},
        ]

        for w in workouts_data:
            Workout.objects.create(**w)
            self.stdout.write(f"  Created workout: {w['name']}")

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))

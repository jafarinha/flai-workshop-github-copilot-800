import os
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import (
    UserSerializer, TeamSerializer, ActivitySerializer,
    LeaderboardSerializer, WorkoutSerializer,
)


codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    BASE_URL = f"https://{codespace_name}-8000.app.github.dev"
else:
    BASE_URL = "http://localhost:8000"


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': f"{BASE_URL}/api/users/",
        'teams': f"{BASE_URL}/api/teams/",
        'activities': f"{BASE_URL}/api/activities/",
        'leaderboard': f"{BASE_URL}/api/leaderboard/",
        'workouts': f"{BASE_URL}/api/workouts/",
    })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'password']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['_id', 'name', 'members']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['_id', 'user', 'activity_type', 'duration', 'date']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    def get_user(self, obj):
        try:
            return str(obj.user_id)
        except Exception:
            return None


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['_id', 'user', 'score']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    def get_user(self, obj):
        try:
            return str(obj.user_id)
        except Exception:
            return None


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'duration']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None
